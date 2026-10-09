const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = process.env.PORT || 3000;
const TICK_RATE = 30; // 30 ticks por segundo
const ARENA_WIDTH = 2600;
const ARENA_HEIGHT = 2600;
const TARGET_ENTITIES = 10; // Mantém sempre pelo menos 10 combatentes (players + bots)

// Tipos MIME
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

// -------------------------------------------------------------
// Servidor HTTP Estático
// -------------------------------------------------------------
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  const safePath = path.normalize(path.join(__dirname, reqPath));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Acesso Negado');
    return;
  }

  fs.readFile(safePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Arquivo não encontrado');
      } else {
        res.writeHead(500);
        res.end('Erro interno do servidor');
      }
      return;
    }
    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

// -------------------------------------------------------------
// Servidor WebSocket RFC 6455 Nativo (Zero dependências externas)
// -------------------------------------------------------------
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const clients = new Map(); // socket -> clientObject

server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade']?.toLowerCase() !== 'websocket') {
    socket.destroy();
    return;
  }

  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const acceptKey = crypto
    .createHash('sha1')
    .update(key + WS_GUID)
    .digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`
  ];

  socket.write(headers.join('\r\n') + '\r\n\r\n');

  const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
  const client = {
    id: playerId,
    socket: socket,
    buffer: Buffer.alloc(0),
    isAlive: true
  };

  clients.set(socket, client);
  onPlayerJoin(client);

  socket.on('data', (chunk) => {
    client.buffer = Buffer.concat([client.buffer, chunk]);
    parseFrames(client);
  });

  socket.on('close', () => {
    clients.delete(socket);
    onPlayerLeave(client.id);
  });

  socket.on('error', () => {
    socket.destroy();
    clients.delete(socket);
    onPlayerLeave(client.id);
  });
});

function parseFrames(client) {
  while (client.buffer.length >= 2) {
    const firstByte = client.buffer[0];
    const secondByte = client.buffer[1];

    const fin = (firstByte & 0x80) === 0x80;
    const opcode = firstByte & 0x0f;
    const masked = (secondByte & 0x80) === 0x80;
    let payloadLength = secondByte & 0x7f;

    let offset = 2;
    if (payloadLength === 126) {
      if (client.buffer.length < offset + 2) return;
      payloadLength = client.buffer.readUInt16BE(offset);
      offset += 2;
    } else if (payloadLength === 127) {
      if (client.buffer.length < offset + 8) return;
      const high = client.buffer.readUInt32BE(offset);
      const low = client.buffer.readUInt32BE(offset + 4);
      payloadLength = high * 4294967296 + low;
      offset += 8;
    }

    let maskKey = null;
    if (masked) {
      if (client.buffer.length < offset + 4) return;
      maskKey = client.buffer.slice(offset, offset + 4);
      offset += 4;
    }

    if (client.buffer.length < offset + payloadLength) return; // Espera chegar todo o pacote

    const payload = client.buffer.slice(offset, offset + payloadLength);
    client.buffer = client.buffer.slice(offset + payloadLength);

    if (masked && maskKey) {
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= maskKey[i % 4];
      }
    }

    // Processamento do Opcode
    if (opcode === 0x8) {
      // Conexão encerrada
      client.socket.end();
      return;
    } else if (opcode === 0x9) {
      // Ping -> Envia Pong
      sendRaw(client.socket, payload, 0xA);
    } else if (opcode === 0x1) {
      // Texto JSON
      try {
        const msgStr = payload.toString('utf8');
        const data = JSON.parse(msgStr);
        onClientMessage(client, data);
      } catch (err) {
        // Ignora JSON corrompido
      }
    }
  }
}

function sendRaw(socket, payloadBuffer, opcode = 0x1) {
  if (!socket.writable) return;
  const len = payloadBuffer.length;
  let header;

  if (len < 126) {
    header = Buffer.from([0x80 | opcode, len]);
  } else if (len <= 0xFFFF) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }

  socket.write(Buffer.concat([header, payloadBuffer]));
}

function broadcast(msgObj) {
  const jsonStr = JSON.stringify(msgObj);
  const buf = Buffer.from(jsonStr, 'utf8');
  for (const client of clients.values()) {
    sendRaw(client.socket, buf);
  }
}

function sendTo(client, msgObj) {
  const jsonStr = JSON.stringify(msgObj);
  sendRaw(client.socket, Buffer.from(jsonStr, 'utf8'));
}

// -------------------------------------------------------------
// Estado do Jogo e Lógica da Arena
// -------------------------------------------------------------
const players = new Map(); // id -> PlayerState
const bots = new Map();    // id -> BotState
let projectiles = [];      // array de Projéteis
let orbs = [];             // orbes de cura / energia
let killFeed = [];         // mensagens de kills recentes
let nextProjectileId = 1;

// Obstáculos sagrados / ruínas da arena
const obstacles = [
  { x: 700, y: 700, radius: 90, type: 'pillar', label: 'Ruína Solar' },
  { x: 1900, y: 700, radius: 90, type: 'pillar', label: 'Ruína Lunar' },
  { x: 700, y: 1900, radius: 90, type: 'pillar', label: 'Altar Cósmico' },
  { x: 1900, y: 1900, radius: 90, type: 'pillar', label: 'Templo dos Ventos' },
  { x: 1300, y: 1300, radius: 140, type: 'sanctuary', label: 'Árvore Astral' },
  { x: 1300, y: 600, radius: 60, type: 'rock' },
  { x: 1300, y: 2000, radius: 60, type: 'rock' },
  { x: 600, y: 1300, radius: 60, type: 'rock' },
  { x: 2000, y: 1300, radius: 60, type: 'rock' },
];

// Nomes temáticos de Bots inteligentes para preencher a partida
const BOT_NAMES = [
  'Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane', 
  'Mago Elidor', 'Sentinela Kael', 'Caçador Rex', 'Guardião Thorne',
  'Oráculo Zeph', 'Lorde Malakor', 'Druida Rowan', 'Lâmina Lyra'
];

// Inicialização dos Orbes no mapa
function spawnOrbs(count = 25) {
  while (orbs.length < count) {
    orbs.push({
      id: 'orb_' + Math.random().toString(36).substring(2, 9),
      x: 100 + Math.random() * (ARENA_WIDTH - 200),
      y: 100 + Math.random() * (ARENA_HEIGHT - 200),
      type: Math.random() > 0.4 ? 'heal' : 'energy',
      value: 25,
      radius: 14
    });
  }
}
spawnOrbs(25);

// Geração de posição segura (longe de obstáculos)
function getRandomSpawn() {
  for (let attempt = 0; attempt < 30; attempt++) {
    const x = 200 + Math.random() * (ARENA_WIDTH - 400);
    const y = 200 + Math.random() * (ARENA_HEIGHT - 400);
    let collides = false;
    for (const obs of obstacles) {
      const dist = Math.hypot(x - obs.x, y - obs.y);
      if (dist < obs.radius + 60) {
        collides = true;
        break;
      }
    }
    if (!collides) return { x, y };
  }
  return { x: 1300 + (Math.random() - 0.5) * 400, y: 1300 + (Math.random() - 0.5) * 400 };
}

// -------------------------------------------------------------
// Gerenciamento de Jogadores
// -------------------------------------------------------------
function onPlayerJoin(client) {
  const spawn = getRandomSpawn();
  const player = {
    id: client.id,
    isBot: false,
    name: 'Guerreiro #' + client.id.substring(2, 6),
    color: '#00e5ff',
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    speed: 6.5,
    angle: 0,
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    score: 0,
    kills: 0,
    deaths: 0,
    dashCooldown: 0,
    attackCooldown: 0,
    input: { up: false, down: false, left: false, right: false, attack: false, dash: false, angle: 0 },
    radius: 24,
    lastPing: Date.now()
  };

  players.set(client.id, player);

  // Envia pacote de boas-vindas com mapa, configurações e dados do player
  sendTo(client, {
    type: 'welcome',
    id: client.id,
    arena: { width: ARENA_WIDTH, height: ARENA_HEIGHT },
    obstacles: obstacles,
    player: player
  });

  broadcastKillFeed(`⚔️ ${player.name} entrou na arena!`);
}

function onPlayerLeave(id) {
  const p = players.get(id);
  if (p) {
    broadcastKillFeed(`🚪 ${p.name} saiu da arena.`);
    players.delete(id);
  }
}

function onClientMessage(client, msg) {
  const p = players.get(client.id);
  if (!p) return;

  if (msg.type === 'input') {
    p.input = msg.input || p.input;
  } else if (msg.type === 'set_profile') {
    if (typeof msg.name === 'string' && msg.name.trim().length > 0) {
      p.name = msg.name.trim().substring(0, 16);
    }
    if (typeof msg.color === 'string') {
      p.color = msg.color;
    }
  } else if (msg.type === 'chat') {
    if (typeof msg.text === 'string' && msg.text.trim().length > 0) {
      const cleanText = msg.text.trim().substring(0, 80);
      broadcast({
        type: 'chat',
        sender: p.name,
        color: p.color,
        text: cleanText,
        time: Date.now()
      });
    }
  }
}

function broadcastKillFeed(text) {
  const entry = { id: Math.random().toString(), text, time: Date.now() };
  killFeed.push(entry);
  if (killFeed.length > 8) killFeed.shift();
  broadcast({ type: 'killfeed', feed: killFeed });
}

// -------------------------------------------------------------
// Inteligência Artificial dos Bots (Behavior Tree / FSM)
// -------------------------------------------------------------
function adjustBotsPopulation() {
  const totalHumans = players.size;
  const desiredBots = Math.max(2, TARGET_ENTITIES - totalHumans);

  // Adiciona bots se faltarem
  while (bots.size < desiredBots) {
    const botId = 'bot_' + Math.random().toString(36).substring(2, 8);
    const spawn = getRandomSpawn();
    const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + ' (BOT)';
    
    // Cores temáticas para bots
    const botColors = ['#ff4757', '#ff6b81', '#ffa502', '#eccc68', '#70a1ff', '#2ed573'];
    const botColor = botColors[Math.floor(Math.random() * botColors.length)];

    const bot = {
      id: botId,
      isBot: true,
      name: botName,
      color: botColor,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      speed: 5.8,
      angle: Math.random() * Math.PI * 2,
      hp: 100,
      maxHp: 100,
      stamina: 100,
      score: 0,
      kills: 0,
      deaths: 0,
      radius: 24,
      dashCooldown: 0,
      attackCooldown: 0,
      state: 'patrol', // patrol, hunt, flee_heal, strafe
      targetId: null,
      targetOrbId: null,
      nextDecisionTime: 0,
      strafeDirection: 1,
      input: { up: false, down: false, left: false, right: false, attack: false, dash: false, angle: 0 }
    };

    bots.set(botId, bot);
  }

  // Remove bots excedentes se houver muitos jogadores humanos
  if (bots.size > desiredBots) {
    const firstBotKey = bots.keys().next().value;
    bots.delete(firstBotKey);
  }
}

function updateBotAI(bot, now) {
  // Combina lista de todos os inimigos possíveis (players e outros bots)
  const allEnemies = [];
  for (const p of players.values()) {
    if (p.hp > 0) allEnemies.push(p);
  }
  for (const otherBot of bots.values()) {
    if (otherBot.id !== bot.id && otherBot.hp > 0) {
      allEnemies.push(otherBot);
    }
  }

  // Se o bot estiver com pouca vida, procura o orbe de cura mais próximo
  if (bot.hp <= 45 && orbs.length > 0) {
    let nearestHealOrb = null;
    let minOrbDist = Infinity;
    for (const orb of orbs) {
      if (orb.type === 'heal') {
        const d = Math.hypot(orb.x - bot.x, orb.y - bot.y);
        if (d < minOrbDist) {
          minOrbDist = d;
          nearestHealOrb = orb;
        }
      }
    }
    if (nearestHealOrb && minOrbDist < 800) {
      bot.state = 'flee_heal';
      bot.targetOrbId = nearestHealOrb.id;
      const angleToOrb = Math.atan2(nearestHealOrb.y - bot.y, nearestHealOrb.x - bot.x);
      bot.angle = angleToOrb;
      bot.input.up = true;
      bot.input.down = false;
      bot.input.left = false;
      bot.input.right = false;
      bot.input.attack = false;
      return;
    }
  }

  // Encontra o inimigo mais próximo
  let closestEnemy = null;
  let minDist = Infinity;
  for (const enemy of allEnemies) {
    const dist = Math.hypot(enemy.x - bot.x, enemy.y - bot.y);
    if (dist < minDist) {
      minDist = dist;
      closestEnemy = enemy;
    }
  }

  // Mudança periódica de decisões táticas
  if (now > bot.nextDecisionTime) {
    bot.nextDecisionTime = now + 400 + Math.random() * 600;
    bot.strafeDirection = Math.random() > 0.5 ? 1 : -1;
  }

  if (closestEnemy && minDist < 900) {
    // Modo Combate: mira com leve dispersão humana e ataca
    const angleToTarget = Math.atan2(closestEnemy.y - bot.y, closestEnemy.x - bot.x);
    // Predição de mira básica baseada na velocidade do alvo
    const leadX = closestEnemy.x + (closestEnemy.vx || 0) * 10;
    const leadY = closestEnemy.y + (closestEnemy.vy || 0) * 10;
    bot.angle = Math.atan2(leadY - bot.y, leadX - bot.x);

    // Se estiver a média distância, circula/estirpa
    if (minDist > 300) {
      // Aproximação
      bot.input.up = true;
      bot.input.down = false;
    } else if (minDist < 160) {
      // Muito perto: recua atirando
      bot.input.up = false;
      bot.input.down = true;
    } else {
      // Flanqueia (strafe lateral circular)
      bot.angle += (Math.PI / 2) * bot.strafeDirection;
      bot.input.up = true;
      bot.input.down = false;
    }

    // Dispara projétil se tiver ângulo
    bot.input.attack = minDist < 700 && Math.random() < 0.65;

    // Esquiva com Dash se detectar projétil vindo em sua direção
    if (bot.dashCooldown <= 0) {
      for (const proj of projectiles) {
        if (proj.ownerId !== bot.id) {
          const projDist = Math.hypot(proj.x - bot.x, proj.y - bot.y);
          if (projDist < 140) {
            bot.input.dash = true;
            break;
          }
        }
      }
    }
  } else {
    // Patrulha exploratória pela arena
    bot.state = 'patrol';
    bot.input.attack = false;
    if (now > bot.nextDecisionTime) {
      bot.angle += (Math.random() - 0.5) * 1.5;
    }
    bot.input.up = true;
    bot.input.down = false;
  }
}

// -------------------------------------------------------------
// Loop Principal da Simulação de Física e Tiroteio (Tick)
// -------------------------------------------------------------
function gameTick() {
  const now = Date.now();
  adjustBotsPopulation();

  // Junta entidades para processamento unificado
  const entities = [...players.values(), ...bots.values()];

  // 1. Atualizar IAs dos Bots
  for (const bot of bots.values()) {
    if (bot.hp > 0) {
      updateBotAI(bot, now);
    }
  }

  // 2. Movimentação e Ações das Entidades
  for (const ent of entities) {
    if (ent.hp <= 0) continue;

    // Resfriamento de recarga de habilidades
    if (ent.dashCooldown > 0) ent.dashCooldown -= 1 / TICK_RATE;
    if (ent.attackCooldown > 0) ent.attackCooldown -= 1 / TICK_RATE;
    if (ent.stamina < ent.maxStamina) ent.stamina = Math.min(ent.maxStamina, ent.stamina + 20 / TICK_RATE);

    // Cálculo da direção de movimento
    let dx = 0;
    let dy = 0;

    if (ent.isBot) {
      // Movimentação por ângulo para bots
      if (ent.input.up) {
        dx += Math.cos(ent.angle);
        dy += Math.sin(ent.angle);
      }
      if (ent.input.down) {
        dx -= Math.cos(ent.angle);
        dy -= Math.sin(ent.angle);
      }
    } else {
      // Movimentação por teclado WASD para humanos
      if (ent.input.up) dy -= 1;
      if (ent.input.down) dy += 1;
      if (ent.input.left) dx -= 1;
      if (ent.input.right) dx += 1;
      ent.angle = ent.input.angle || ent.angle;
    }

    // Normalização do vetor
    const len = Math.hypot(dx, dy);
    let currentSpeed = ent.speed;

    // Execução do Dash / Esquiva rápida
    if (ent.input.dash && ent.dashCooldown <= 0 && ent.stamina >= 25) {
      ent.stamina -= 25;
      ent.dashCooldown = 1.4; // 1.4s de cooldown
      currentSpeed *= 3.5;   // Impulso potente
      broadcast({
        type: 'effect',
        name: 'dash',
        x: ent.x,
        y: ent.y,
        color: ent.color
      });
      ent.input.dash = false;
    }

    if (len > 0) {
      ent.vx = (dx / len) * currentSpeed;
      ent.vy = (dy / len) * currentSpeed;
    } else {
      ent.vx = 0;
      ent.vy = 0;
    }

    // Aplicação da nova posição com colisão no mapa
    const nextX = Math.max(ent.radius, Math.min(ARENA_WIDTH - ent.radius, ent.x + ent.vx));
    const nextY = Math.max(ent.radius, Math.min(ARENA_HEIGHT - ent.radius, ent.y + ent.vy));

    // Colisão com obstáculos circulares
    let blocked = false;
    for (const obs of obstacles) {
      const d = Math.hypot(nextX - obs.x, nextY - obs.y);
      if (d < obs.radius + ent.radius) {
        // Empurra para fora suavemente
        const angle = Math.atan2(nextY - obs.y, nextX - obs.x);
        ent.x = obs.x + Math.cos(angle) * (obs.radius + ent.radius);
        ent.y = obs.y + Math.sin(angle) * (obs.radius + ent.radius);
        blocked = true;
        break;
      }
    }

    if (!blocked) {
      ent.x = nextX;
      ent.y = nextY;
    }

    // Coleta de Orbes pelo mapa
    for (let i = orbs.length - 1; i >= 0; i--) {
      const orb = orbs[i];
      const dist = Math.hypot(ent.x - orb.x, ent.y - orb.y);
      if (dist < ent.radius + orb.radius) {
        if (orb.type === 'heal') {
          ent.hp = Math.min(ent.maxHp, ent.hp + orb.value);
        } else {
          ent.score += 15;
          ent.stamina = Math.min(ent.maxStamina, ent.stamina + orb.value);
        }
        orbs.splice(i, 1);
        spawnOrbs(25); // Mantém sempre o mapa abastecido
        break;
      }
    }

    // Disparo de Ataque / Projétil Astral
    if (ent.input.attack && ent.attackCooldown <= 0) {
      ent.attackCooldown = 0.28; // Taxa de disparo rápida e fluida (~3.5 tiros por segundo)
      const projSpeed = 16;
      projectiles.push({
        id: nextProjectileId++,
        ownerId: ent.id,
        ownerName: ent.name,
        color: ent.color,
        x: ent.x + Math.cos(ent.angle) * (ent.radius + 6),
        y: ent.y + Math.sin(ent.angle) * (ent.radius + 6),
        vx: Math.cos(ent.angle) * projSpeed,
        vy: Math.sin(ent.angle) * projSpeed,
        radius: 6,
        damage: 22,
        lifetime: 55 // Duração em ticks (~1.8s de alcance)
      });
    }
  }

  // 3. Atualizar Projéteis e Colisões
  for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
    const proj = projectiles[pIdx];
    proj.x += proj.vx;
    proj.y += proj.vy;
    proj.lifetime--;

    let destroyed = false;

    // Fora dos limites da arena
    if (proj.x < 0 || proj.x > ARENA_WIDTH || proj.y < 0 || proj.y > ARENA_HEIGHT || proj.lifetime <= 0) {
      destroyed = true;
    }

    // Colisão do projétil com obstáculos
    if (!destroyed) {
      for (const obs of obstacles) {
        if (Math.hypot(proj.x - obs.x, proj.y - obs.y) < obs.radius) {
          destroyed = true;
          break;
        }
      }
    }

    // Colisão do projétil com combatentes
    if (!destroyed) {
      for (const ent of entities) {
        if (ent.id !== proj.ownerId && ent.hp > 0) {
          const hitDist = Math.hypot(proj.x - ent.x, proj.y - ent.y);
          if (hitDist < ent.radius + proj.radius) {
            destroyed = true;
            ent.hp -= proj.damage;

            // Efeito de impacto
            broadcast({
              type: 'hit',
              x: proj.x,
              y: proj.y,
              color: proj.color
            });

            // Se o alvo for derrotado
            if (ent.hp <= 0) {
              ent.hp = 0;
              ent.deaths++;
              
              // Pontuação do atacante
              const killer = players.get(proj.ownerId) || bots.get(proj.ownerId);
              if (killer) {
                killer.kills++;
                killer.score += 100;
              }

              broadcastKillFeed(`⚡ ${proj.ownerName} eliminou ${ent.name}!`);

              // Respawn após breve intervalo
              setTimeout(() => {
                const respawn = getRandomSpawn();
                ent.x = respawn.x;
                ent.y = respawn.y;
                ent.hp = ent.maxHp;
                ent.stamina = ent.maxStamina;
              }, 2500);
            }
            break;
          }
        }
      }
    }

    if (destroyed) {
      projectiles.splice(pIdx, 1);
    }
  }

  // 4. Envio do Snapshot de Estado para todos os jogadores conectados
  const snapshot = {
    type: 'state',
    time: now,
    players: Array.from(players.values()).map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      x: Math.round(p.x),
      y: Math.round(p.y),
      angle: Number(p.angle.toFixed(2)),
      hp: p.hp,
      maxHp: p.maxHp,
      stamina: Math.round(p.stamina),
      score: p.score,
      kills: p.kills,
      deaths: p.deaths,
      isBot: false
    })),
    bots: Array.from(bots.values()).map(b => ({
      id: b.id,
      name: b.name,
      color: b.color,
      x: Math.round(b.x),
      y: Math.round(b.y),
      angle: Number(b.angle.toFixed(2)),
      hp: b.hp,
      maxHp: b.maxHp,
      score: b.score,
      kills: b.kills,
      isBot: true
    })),
    projectiles: projectiles.map(pr => ({
      id: pr.id,
      x: Math.round(pr.x),
      y: Math.round(pr.y),
      color: pr.color
    })),
    orbs: orbs
  };

  broadcast(snapshot);
}

// Inicia o loop de física e lógica a 30 FPS
setInterval(gameTick, 1000 / TICK_RATE);

// -------------------------------------------------------------
// Inicialização do Servidor e Exibição de IPs
// -------------------------------------------------------------
server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  console.log('\n===============================================================');
  console.log('       ⚔️  JORNADA II: ARENA MULTIPLAYER ONLINE  ⚔️            ');
  console.log('===============================================================');
  console.log(` ✅ Servidor Ativo e Escutando na porta: ${PORT}`);
  console.log('\n 🔗 Endereços para Conexão:');
  console.log(`    - Neste PC (Localhost): http://localhost:${PORT}`);
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`    - Na sua Rede / Wi-Fi / Radmin (${name}): http://${net.address}:${PORT}`);
      }
    }
  }
  
  console.log('\n 🤖 Bots Inteligentes: Ativados automaticamente para preencher vagas!');
  console.log(' 🌐 Suporte Conexões: Ilimitadas (Alta eficiência WebSocket nativo)');
  console.log('===============================================================\n');
});
