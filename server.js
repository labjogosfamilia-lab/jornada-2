const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = process.env.PORT || 3000;
const TICK_RATE = 30; // 30 ticks por segundo
const ARENA_WIDTH = 3600;
const ARENA_HEIGHT = 3600;
const TARGET_ENTITIES = 14; // Combatentes espalhados pela jornada (players + bots)

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
// Servidor WebSocket RFC 6455 Nativo
// -------------------------------------------------------------
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const clients = new Map();

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

    if (client.buffer.length < offset + payloadLength) return;

    const payload = client.buffer.slice(offset, offset + payloadLength);
    client.buffer = client.buffer.slice(offset + payloadLength);

    if (masked && maskKey) {
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= maskKey[i % 4];
      }
    }

    if (opcode === 0x8) {
      client.socket.end();
      return;
    } else if (opcode === 0x9) {
      sendRaw(client.socket, payload, 0xA);
    } else if (opcode === 0x1) {
      try {
        const msg = JSON.parse(payload.toString('utf8'));
        onClientMessage(client, msg);
      } catch (err) {}
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
  sendRaw(client.socket, Buffer.from(JSON.stringify(msgObj), 'utf8'));
}

// -------------------------------------------------------------
// Definições de Mundo, Cidade e Itens da Jornada
// -------------------------------------------------------------
// Cidade Central (Safe Zone)
const CITY = {
  name: 'Cidade dos Guardiões',
  x: 1800,
  y: 1800,
  radius: 320
};

// NPCs da Cidade (Lojas de Espadas, Poções e Poderes)
const NPCS = [
  { id: 'npc_blacksmith', name: 'Brok, o Ferreiro', icon: '🔨', x: 1720, y: 1760, radius: 28, type: 'weapons' },
  { id: 'npc_alchemist', name: 'Sylva, a Alquimista', icon: '🧪', x: 1880, y: 1760, radius: 28, type: 'potions' },
  { id: 'npc_mage', name: 'Mago Elidor', icon: '🧙‍♂️', x: 1800, y: 1880, radius: 28, type: 'powers' }
];

// Catálogo da Loja da Cidade
const SHOP_CATALOG = {
  weapons: [
    { id: 'sword_starter', name: 'Lâmina do Noviço', cost: 0, damage: 22, color: '#00e5ff', desc: 'Espada inicial balanceada' },
    { id: 'sword_rune', name: 'Espada de Prata Rúnica', cost: 120, damage: 34, color: '#a29bfe', desc: '+50% Dano & disparo veloz' },
    { id: 'sword_fire', name: 'Lâmina do Fogo Estelar', cost: 280, damage: 52, color: '#ff4757', desc: 'Lança chamas ardentes de alto impacto' },
    { id: 'staff_astral', name: 'Cajado Arcano dos Arcontes', cost: 450, damage: 32, triple: true, color: '#ffd32a', desc: 'Disparo Triplo em leque!' }
  ],
  potions: [
    { id: 'potion_heal', name: 'Poção de Vida Maior', cost: 40, heal: 50, icon: '🧪', desc: 'Recupera +50 de HP imediatamente' },
    { id: 'potion_speed', name: 'Poção de Vigor & Fúria', cost: 55, speedBoost: 1.5, icon: '⚡', desc: 'Vigor máximo e corrida acelerada por 10s' }
  ],
  powers: [
    { id: 'power_slam', name: '⚡ Pisão Sísmico [R]', cost: 150, cooldown: 5, icon: '⚡', desc: 'Explosão sísmica 360° que repele e fere inimigos' },
    { id: 'power_beam', name: '🏹 Raio Astral Cósmico [F]', cost: 300, cooldown: 8, icon: '🏹', desc: 'Feixe concentrado perfurante de longo alcance' }
  ]
};

// Obstáculos e Ruínas nos 4 Biomas da Jornada
const obstacles = [
  // Muralhas externas da Cidade
  { x: 1800, y: 1480, radius: 45, type: 'city_gate', label: 'Portão Norte' },
  { x: 1800, y: 2120, radius: 45, type: 'city_gate', label: 'Portão Sul' },
  { x: 1480, y: 1800, radius: 45, type: 'city_gate', label: 'Portão Oeste' },
  { x: 2120, y: 1800, radius: 45, type: 'city_gate', label: 'Portão Leste' },

  // Bioma 1: Bosque dos Ecos (Noroeste)
  { x: 800, y: 800, radius: 95, type: 'sanctuary', label: 'Carvalho Ancestral' },
  { x: 600, y: 1100, radius: 65, type: 'rock', label: 'Monólito da Floresta' },
  { x: 1100, y: 600, radius: 60, type: 'rock' },

  // Bioma 2: Ruínas Glaciais (Nordeste)
  { x: 2800, y: 800, radius: 95, type: 'pillar', label: 'Templo Glacial de Niflheim' },
  { x: 2500, y: 600, radius: 65, type: 'rock' },
  { x: 3000, y: 1100, radius: 60, type: 'rock' },

  // Bioma 3: Pântano das Sombras (Sudoeste)
  { x: 800, y: 2800, radius: 95, type: 'pillar', label: 'Labirinto das Sombras' },
  { x: 1100, y: 3000, radius: 65, type: 'rock' },
  { x: 600, y: 2500, radius: 60, type: 'rock' },

  // Bioma 4: Abismo de Magma (Sudeste)
  { x: 2800, y: 2800, radius: 100, type: 'pillar', label: 'Núcleo da Forja Ardente' },
  { x: 2500, y: 3000, radius: 65, type: 'rock' },
  { x: 3000, y: 2500, radius: 60, type: 'rock' }
];

// Nomes temáticos de Bots inteligentes
const BOT_NAMES = [
  'Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane', 
  'Sentinela Kael', 'Caçador Rex', 'Guardião Thorne', 'Oráculo Zeph', 
  'Lorde Malakor', 'Druida Rowan', 'Lâmina Lyra', 'Paladino Uther',
  'Andarilho Jarek', 'Místico Fenrir'
];

// Estado Geral do Jogo
const players = new Map();
const bots = new Map();
let projectiles = [];
let orbs = [];
let chests = []; // Baús de Ouro espalhados
let killFeed = [];
let nextProjectileId = 1;

// Gerar Baús de Ouro pelo mapa
function spawnChests(targetCount = 18) {
  while (chests.length < targetCount) {
    const spawn = getSpreadSpawn(false);
    chests.push({
      id: 'chest_' + Math.random().toString(36).substring(2, 9),
      x: spawn.x,
      y: spawn.y,
      radius: 18,
      gold: 35 + Math.floor(Math.random() * 30)
    });
  }
}

// Inicializar Orbes de Cura e Energia
function spawnOrbs(count = 35) {
  while (orbs.length < count) {
    const spawn = getSpreadSpawn(false);
    orbs.push({
      id: 'orb_' + Math.random().toString(36).substring(2, 9),
      x: spawn.x,
      y: spawn.y,
      type: Math.random() > 0.45 ? 'heal' : 'energy',
      value: 30,
      radius: 14
    });
  }
}
spawnOrbs(35);
spawnChests(18);

// Posição ESPALHADA pelo mapa (fora da cidade para explorar a jornada)
function getSpreadSpawn(allowCity = false) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const x = 200 + Math.random() * (ARENA_WIDTH - 400);
    const y = 200 + Math.random() * (ARENA_HEIGHT - 400);

    // Evita nascer dentro da cidade a menos que solicitado
    const distToCity = Math.hypot(x - CITY.x, y - CITY.y);
    if (!allowCity && distToCity < CITY.radius + 150) continue;

    // Evita colisão com obstáculos
    let collides = false;
    for (const obs of obstacles) {
      if (Math.hypot(x - obs.x, y - obs.y) < obs.radius + 50) {
        collides = true;
        break;
      }
    }
    if (!collides) return { x, y };
  }
  return { x: 800 + Math.random() * 800, y: 800 + Math.random() * 800 };
}

// -------------------------------------------------------------
// Gerenciamento de Jogadores
// -------------------------------------------------------------
function onPlayerJoin(client) {
  const spawn = getSpreadSpawn(false);
  const player = {
    id: client.id,
    isBot: false,
    name: 'Viajante #' + client.id.substring(2, 6),
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
    gold: 50, // Ouro inicial para comprar primeiros itens
    score: 0,
    kills: 0,
    deaths: 0,
    weapon: 'sword_starter',
    potions: { heal: 1, speed: 0 },
    powers: { slam: false, beam: false },
    powerCooldowns: { slam: 0, beam: 0 },
    speedBoostTimer: 0,
    dashCooldown: 0,
    attackCooldown: 0,
    radius: 24,
    inSafeZone: false,
    input: { up: false, down: false, left: false, right: false, attack: false, dash: false, powerSlam: false, powerBeam: false, useHeal: false, useSpeed: false, angle: 0 }
  };

  players.set(client.id, player);

  sendTo(client, {
    type: 'welcome',
    id: client.id,
    arena: { width: ARENA_WIDTH, height: ARENA_HEIGHT },
    city: CITY,
    npcs: NPCS,
    catalog: SHOP_CATALOG,
    obstacles: obstacles,
    player: player
  });

  broadcastKillFeed(`🌿 ${player.name} iniciou sua Jornada!`);
}

function onPlayerLeave(id) {
  const p = players.get(id);
  if (p) {
    broadcastKillFeed(`🚪 ${p.name} descansou da jornada.`);
    players.delete(id);
  }
}

function onClientMessage(client, msg) {
  const p = players.get(client.id);
  if (!p) return;

  if (msg.type === 'input') {
    p.input = msg.input || p.input;

    // Uso de Poção de Vida
    if (msg.input?.useHeal && p.potions.heal > 0 && p.hp < p.maxHp) {
      p.potions.heal--;
      p.hp = Math.min(p.maxHp, p.hp + 50);
      broadcast({ type: 'effect', name: 'heal', x: p.x, y: p.y, color: '#2ed573' });
    }

    // Uso de Poção de Vigor/Velocidade
    if (msg.input?.useSpeed && p.potions.speed > 0) {
      p.potions.speed--;
      p.speedBoostTimer = 10; // 10 segundos de boost
      p.stamina = p.maxStamina;
      broadcast({ type: 'effect', name: 'speed_boost', x: p.x, y: p.y, color: '#ffd32a' });
    }

    // Super Poder Sísmico [R]
    if (msg.input?.powerSlam && p.powers.slam && p.powerCooldowns.slam <= 0 && !p.inSafeZone) {
      p.powerCooldowns.slam = 6;
      executeSeismicSlam(p);
    }

    // Super Poder Raio Astral [F]
    if (msg.input?.powerBeam && p.powers.beam && p.powerCooldowns.beam <= 0 && !p.inSafeZone) {
      p.powerCooldowns.beam = 8;
      executeAstralBeam(p);
    }
  } else if (msg.type === 'set_profile') {
    if (typeof msg.name === 'string' && msg.name.trim().length > 0) {
      p.name = msg.name.trim().substring(0, 16);
    }
    if (typeof msg.color === 'string') {
      p.color = msg.color;
    }
  } else if (msg.type === 'buy_item') {
    handleShopPurchase(p, msg.category, msg.itemId);
  } else if (msg.type === 'chat') {
    if (typeof msg.text === 'string' && msg.text.trim().length > 0) {
      broadcast({
        type: 'chat',
        sender: p.name,
        color: p.color,
        text: msg.text.trim().substring(0, 80),
        time: Date.now()
      });
    }
  }
}

// Processa compra na Loja da Cidade
function handleShopPurchase(player, category, itemId) {
  // Verifica se o jogador está na Cidade (Safe Zone)
  const dist = Math.hypot(player.x - CITY.x, player.y - CITY.y);
  if (dist > CITY.radius + 60) {
    sendTo(clients.get(player.socket), { type: 'shop_error', text: 'Você precisa estar na Cidade para comprar itens!' });
    return;
  }

  const items = SHOP_CATALOG[category];
  if (!items) return;
  const item = items.find(it => it.id === itemId);
  if (!item) return;

  if (player.gold < item.cost) {
    sendTo(clients.get(player.socket), { type: 'shop_error', text: 'Ouro insuficiente!' });
    return;
  }

  player.gold -= item.cost;

  if (category === 'weapons') {
    player.weapon = item.id;
    broadcastKillFeed(`⚔️ ${player.name} forjou: ${item.name}!`);
  } else if (category === 'potions') {
    if (itemId === 'potion_heal') player.potions.heal = (player.potions.heal || 0) + 1;
    if (itemId === 'potion_speed') player.potions.speed = (player.potions.speed || 0) + 1;
  } else if (category === 'powers') {
    if (itemId === 'power_slam') player.powers.slam = true;
    if (itemId === 'power_beam') player.powers.beam = true;
    broadcastKillFeed(`✨ ${player.name} dominou o poder: ${item.name}!`);
  }

  // Envia confirmação de compra
  sendTo(clients.get(player.socket), {
    type: 'inventory_update',
    gold: player.gold,
    weapon: player.weapon,
    potions: player.potions,
    powers: player.powers
  });
}

function broadcastKillFeed(text) {
  const entry = { id: Math.random().toString(), text, time: Date.now() };
  killFeed.push(entry);
  if (killFeed.length > 8) killFeed.shift();
  broadcast({ type: 'killfeed', feed: killFeed });
}

// -------------------------------------------------------------
// Habilidades & Super Poderes
// -------------------------------------------------------------
function executeSeismicSlam(caster) {
  broadcast({
    type: 'effect',
    name: 'seismic_slam',
    x: caster.x,
    y: caster.y,
    radius: 200,
    color: '#ffd32a'
  });

  const targets = [...players.values(), ...bots.values()];
  for (const t of targets) {
    if (t.id === caster.id || t.hp <= 0 || t.inSafeZone) continue;
    const d = Math.hypot(t.x - caster.x, t.y - caster.y);
    if (d < 200) {
      t.hp -= 40;
      // Empurrão sísmico (Knockback)
      const pushAngle = Math.atan2(t.y - caster.y, t.x - caster.x);
      t.x += Math.cos(pushAngle) * 50;
      t.y += Math.sin(pushAngle) * 50;
      checkEntityDeath(t, caster);
    }
  }
}

function executeAstralBeam(caster) {
  const beamAngle = caster.angle;
  const beamRange = 900;
  const beamEnd = {
    x: caster.x + Math.cos(beamAngle) * beamRange,
    y: caster.y + Math.sin(beamAngle) * beamRange
  };

  broadcast({
    type: 'effect',
    name: 'astral_beam',
    x1: caster.x,
    y1: caster.y,
    x2: beamEnd.x,
    y2: beamEnd.y,
    color: '#00e5ff'
  });

  const targets = [...players.values(), ...bots.values()];
  for (const t of targets) {
    if (t.id === caster.id || t.hp <= 0 || t.inSafeZone) continue;
    // Distância ponto-reta simples para acerto do feixe
    const distToBeam = distanceToSegment(t.x, t.y, caster.x, caster.y, beamEnd.x, beamEnd.y);
    if (distToBeam < t.radius + 20) {
      t.hp -= 55;
      checkEntityDeath(t, caster);
    }
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// -------------------------------------------------------------
// Inteligência Artificial dos Bots (Espalhados pela Jornada)
// -------------------------------------------------------------
function adjustBotsPopulation() {
  const totalHumans = players.size;
  const desiredBots = Math.max(8, TARGET_ENTITIES - totalHumans);

  while (bots.size < desiredBots) {
    const botId = 'bot_' + Math.random().toString(36).substring(2, 8);
    const spawn = getSpreadSpawn(false);
    const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + ' (BOT)';
    const botColors = ['#ff4757', '#ffa502', '#70a1ff', '#2ed573', '#a29bfe', '#eccc68'];

    const bot = {
      id: botId,
      isBot: true,
      name: botName,
      color: botColors[Math.floor(Math.random() * botColors.length)],
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      speed: 5.6,
      angle: Math.random() * Math.PI * 2,
      hp: 100,
      maxHp: 100,
      stamina: 100,
      gold: 40 + Math.floor(Math.random() * 60),
      score: 0,
      kills: 0,
      deaths: 0,
      weapon: Math.random() > 0.6 ? 'sword_rune' : 'sword_starter',
      radius: 24,
      dashCooldown: 0,
      attackCooldown: 0,
      speedBoostTimer: 0,
      inSafeZone: false,
      nextDecisionTime: 0,
      strafeDirection: Math.random() > 0.5 ? 1 : -1,
      input: { up: false, down: false, left: false, right: false, attack: false, dash: false, angle: 0 }
    };

    bots.set(botId, bot);
  }

  if (bots.size > desiredBots) {
    const firstBotKey = bots.keys().next().value;
    bots.delete(firstBotKey);
  }
}

function updateBotAI(bot, now) {
  // Se estiver na Safe Zone da Cidade, apenas passeia pacificamente
  if (bot.inSafeZone) {
    bot.input.attack = false;
    if (now > bot.nextDecisionTime) {
      bot.nextDecisionTime = now + 1500;
      bot.angle = Math.random() * Math.PI * 2;
    }
    bot.input.up = true;
    return;
  }

  // Fuga para curar caso vida baixa
  if (bot.hp <= 40 && orbs.length > 0) {
    let nearestHeal = null;
    let minD = Infinity;
    for (const o of orbs) {
      if (o.type === 'heal') {
        const d = Math.hypot(o.x - bot.x, o.y - bot.y);
        if (d < minD) { minD = d; nearestHeal = o; }
      }
    }
    if (nearestHeal && minD < 900) {
      bot.angle = Math.atan2(nearestHeal.y - bot.y, nearestHeal.x - bot.x);
      bot.input.up = true;
      bot.input.attack = false;
      return;
    }
  }

  // Procura baú de ouro por perto para coletar
  if (chests.length > 0) {
    for (const ch of chests) {
      const d = Math.hypot(ch.x - bot.x, ch.y - bot.y);
      if (d < 350) {
        bot.angle = Math.atan2(ch.y - bot.y, ch.x - bot.x);
        bot.input.up = true;
        bot.input.attack = false;
        return;
      }
    }
  }

  // Encontra o inimigo mais próximo fora da Safe Zone
  const enemies = [];
  for (const p of players.values()) if (p.hp > 0 && !p.inSafeZone) enemies.push(p);
  for (const b of bots.values()) if (b.id !== bot.id && b.hp > 0 && !b.inSafeZone) enemies.push(b);

  let closestEnemy = null;
  let minDist = Infinity;
  for (const en of enemies) {
    const d = Math.hypot(en.x - bot.x, en.y - bot.y);
    if (d < minDist) { minDist = d; closestEnemy = en; }
  }

  if (now > bot.nextDecisionTime) {
    bot.nextDecisionTime = now + 400 + Math.random() * 500;
    bot.strafeDirection = Math.random() > 0.5 ? 1 : -1;
  }

  if (closestEnemy && minDist < 850) {
    const leadX = closestEnemy.x + (closestEnemy.vx || 0) * 8;
    const leadY = closestEnemy.y + (closestEnemy.vy || 0) * 8;
    bot.angle = Math.atan2(leadY - bot.y, leadX - bot.x);

    if (minDist > 300) {
      bot.input.up = true;
      bot.input.down = false;
    } else if (minDist < 160) {
      bot.input.up = false;
      bot.input.down = true;
    } else {
      bot.angle += (Math.PI / 2) * bot.strafeDirection;
      bot.input.up = true;
      bot.input.down = false;
    }

    bot.input.attack = minDist < 650 && Math.random() < 0.6;

    if (bot.dashCooldown <= 0) {
      for (const pr of projectiles) {
        if (pr.ownerId !== bot.id && Math.hypot(pr.x - bot.x, pr.y - bot.y) < 130) {
          bot.input.dash = true;
          break;
        }
      }
    }
  } else {
    // Patrulha explorando os biomas da jornada
    if (now > bot.nextDecisionTime) {
      bot.angle += (Math.random() - 0.5) * 1.6;
    }
    bot.input.up = true;
    bot.input.down = false;
    bot.input.attack = false;
  }
}

// -------------------------------------------------------------
// Loop Principal da Simulação de Física e Jogo (Tick)
// -------------------------------------------------------------
function gameTick() {
  const now = Date.now();
  adjustBotsPopulation();

  const entities = [...players.values(), ...bots.values()];

  // Atualizar IA dos Bots
  for (const bot of bots.values()) {
    if (bot.hp > 0) updateBotAI(bot, now);
  }

  // Atualizar Entidades
  for (const ent of entities) {
    if (ent.hp <= 0) continue;

    // Checa se está na Cidade (Safe Zone)
    const distToCity = Math.hypot(ent.x - CITY.x, ent.y - CITY.y);
    ent.inSafeZone = distToCity < CITY.radius;

    // Regeneração gradual de HP na Cidade
    if (ent.inSafeZone && ent.hp < ent.maxHp) {
      ent.hp = Math.min(ent.maxHp, ent.hp + 6 / TICK_RATE);
    }

    // Cooldowns
    if (ent.dashCooldown > 0) ent.dashCooldown -= 1 / TICK_RATE;
    if (ent.attackCooldown > 0) ent.attackCooldown -= 1 / TICK_RATE;
    if (ent.stamina < ent.maxStamina) ent.stamina = Math.min(ent.maxStamina, ent.stamina + 20 / TICK_RATE);
    if (ent.speedBoostTimer > 0) ent.speedBoostTimer -= 1 / TICK_RATE;
    if (ent.powerCooldowns) {
      if (ent.powerCooldowns.slam > 0) ent.powerCooldowns.slam -= 1 / TICK_RATE;
      if (ent.powerCooldowns.beam > 0) ent.powerCooldowns.beam -= 1 / TICK_RATE;
    }

    // Direção
    let dx = 0, dy = 0;
    if (ent.isBot) {
      if (ent.input.up) { dx += Math.cos(ent.angle); dy += Math.sin(ent.angle); }
      if (ent.input.down) { dx -= Math.cos(ent.angle); dy -= Math.sin(ent.angle); }
    } else {
      if (ent.input.up) dy -= 1;
      if (ent.input.down) dy += 1;
      if (ent.input.left) dx -= 1;
      if (ent.input.right) dx += 1;
      ent.angle = ent.input.angle || ent.angle;
    }

    const len = Math.hypot(dx, dy);
    let curSpeed = ent.speed;
    if (ent.speedBoostTimer > 0) curSpeed *= 1.45;

    // Dash
    if (ent.input.dash && ent.dashCooldown <= 0 && ent.stamina >= 25) {
      ent.stamina -= 25;
      ent.dashCooldown = 1.3;
      curSpeed *= 3.4;
      broadcast({ type: 'effect', name: 'dash', x: ent.x, y: ent.y, color: ent.color });
      ent.input.dash = false;
    }

    if (len > 0) {
      ent.vx = (dx / len) * curSpeed;
      ent.vy = (dy / len) * curSpeed;
    } else {
      ent.vx = 0;
      ent.vy = 0;
    }

    const nextX = Math.max(ent.radius, Math.min(ARENA_WIDTH - ent.radius, ent.x + ent.vx));
    const nextY = Math.max(ent.radius, Math.min(ARENA_HEIGHT - ent.radius, ent.y + ent.vy));

    // Colisão com obstáculos
    let blocked = false;
    for (const obs of obstacles) {
      if (Math.hypot(nextX - obs.x, nextY - obs.y) < obs.radius + ent.radius) {
        const a = Math.atan2(nextY - obs.y, nextX - obs.x);
        ent.x = obs.x + Math.cos(a) * (obs.radius + ent.radius);
        ent.y = obs.y + Math.sin(a) * (obs.radius + ent.radius);
        blocked = true;
        break;
      }
    }
    if (!blocked) {
      ent.x = nextX;
      ent.y = nextY;
    }

    // Coleta de Baús de Ouro
    for (let cIdx = chests.length - 1; cIdx >= 0; cIdx--) {
      const ch = chests[cIdx];
      if (Math.hypot(ent.x - ch.x, ent.y - ch.y) < ent.radius + ch.radius) {
        ent.gold += ch.gold;
        ent.score += 25;
        broadcast({ type: 'effect', name: 'chest_opened', x: ch.x, y: ch.y, color: '#ffd32a' });
        chests.splice(cIdx, 1);
        spawnChests(18);
        break;
      }
    }

    // Coleta de Orbes
    for (let oIdx = orbs.length - 1; oIdx >= 0; oIdx--) {
      const orb = orbs[oIdx];
      if (Math.hypot(ent.x - orb.x, ent.y - orb.y) < ent.radius + orb.radius) {
        if (orb.type === 'heal') ent.hp = Math.min(ent.maxHp, ent.hp + orb.value);
        else { ent.score += 15; ent.stamina = Math.min(ent.maxStamina, ent.stamina + orb.value); }
        orbs.splice(oIdx, 1);
        spawnOrbs(35);
        break;
      }
    }

    // Disparo de Arma (Apenas fora da Cidade)
    if (ent.input.attack && ent.attackCooldown <= 0 && !ent.inSafeZone) {
      ent.attackCooldown = 0.28;
      const weaponData = SHOP_CATALOG.weapons.find(w => w.id === ent.weapon) || SHOP_CATALOG.weapons[0];

      if (weaponData.triple) {
        // Disparo Triplo em Leque do Cajado
        [-0.2, 0, 0.2].forEach(spread => {
          createProjectile(ent, weaponData, ent.angle + spread);
        });
      } else {
        createProjectile(ent, weaponData, ent.angle);
      }
    }
  }

  // Atualizar Projéteis
  for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
    const pr = projectiles[pIdx];
    pr.x += pr.vx;
    pr.y += pr.vy;
    pr.lifetime--;

    let destroyed = false;
    if (pr.x < 0 || pr.x > ARENA_WIDTH || pr.y < 0 || pr.y > ARENA_HEIGHT || pr.lifetime <= 0) {
      destroyed = true;
    }

    // Destrói projéteis que tentam entrar na Cidade (Barreira Rúnica Sagrada)
    if (!destroyed && Math.hypot(pr.x - CITY.x, pr.y - CITY.y) < CITY.radius) {
      destroyed = true;
      broadcast({ type: 'hit', x: pr.x, y: pr.y, color: '#00e5ff' });
    }

    if (!destroyed) {
      for (const obs of obstacles) {
        if (Math.hypot(pr.x - obs.x, pr.y - obs.y) < obs.radius) {
          destroyed = true;
          break;
        }
      }
    }

    if (!destroyed) {
      for (const ent of entities) {
        if (ent.id !== pr.ownerId && ent.hp > 0 && !ent.inSafeZone) {
          if (Math.hypot(pr.x - ent.x, pr.y - ent.y) < ent.radius + pr.radius) {
            destroyed = true;
            ent.hp -= pr.damage;
            broadcast({ type: 'hit', x: pr.x, y: pr.y, color: pr.color });
            const killer = players.get(pr.ownerId) || bots.get(pr.ownerId);
            checkEntityDeath(ent, killer);
            break;
          }
        }
      }
    }

    if (destroyed) projectiles.splice(pIdx, 1);
  }

  // Snapshot de Rede
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
      hp: Math.round(p.hp),
      maxHp: p.maxHp,
      stamina: Math.round(p.stamina),
      gold: p.gold,
      weapon: p.weapon,
      potions: p.potions,
      powers: p.powers,
      powerCooldowns: {
        slam: Math.max(0, Number(p.powerCooldowns.slam.toFixed(1))),
        beam: Math.max(0, Number(p.powerCooldowns.beam.toFixed(1)))
      },
      score: p.score,
      kills: p.kills,
      inSafeZone: p.inSafeZone,
      isBot: false
    })),
    bots: Array.from(bots.values()).map(b => ({
      id: b.id,
      name: b.name,
      color: b.color,
      x: Math.round(b.x),
      y: Math.round(b.y),
      angle: Number(b.angle.toFixed(2)),
      hp: Math.round(b.hp),
      maxHp: b.maxHp,
      weapon: b.weapon,
      score: b.score,
      kills: b.kills,
      inSafeZone: b.inSafeZone,
      isBot: true
    })),
    projectiles: projectiles.map(pr => ({
      id: pr.id,
      x: Math.round(pr.x),
      y: Math.round(pr.y),
      color: pr.color
    })),
    chests: chests,
    orbs: orbs
  };

  broadcast(snapshot);
}

function createProjectile(owner, weapon, angle) {
  const projSpeed = 16.5;
  projectiles.push({
    id: nextProjectileId++,
    ownerId: owner.id,
    ownerName: owner.name,
    color: weapon.color || owner.color,
    damage: weapon.damage || 24,
    x: owner.x + Math.cos(angle) * (owner.radius + 8),
    y: owner.y + Math.sin(angle) * (owner.radius + 8),
    vx: Math.cos(angle) * projSpeed,
    vy: Math.sin(angle) * projSpeed,
    radius: 6,
    lifetime: 60
  });
}

function checkEntityDeath(victim, killer) {
  if (victim.hp <= 0) {
    victim.hp = 0;
    victim.deaths++;

    if (killer) {
      killer.kills++;
      killer.score += 100;
      killer.gold += 65; // Recompensa em ouro pelo abate!
      broadcastKillFeed(`⚡ ${killer.name} derrotou ${victim.name} (+65 🪙)!`);
    } else {
      broadcastKillFeed(`💀 ${victim.name} foi eliminado!`);
    }

    // Renascimento em ponto aleatório da jornada
    setTimeout(() => {
      const respawn = getSpreadSpawn(false);
      victim.x = respawn.x;
      victim.y = respawn.y;
      victim.hp = victim.maxHp;
      victim.stamina = victim.maxStamina;
    }, 2800);
  }
}

setInterval(gameTick, 1000 / TICK_RATE);

// -------------------------------------------------------------
// Inicialização do Servidor
// -------------------------------------------------------------
server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  console.log('\n===============================================================');
  console.log('       ⚔️  JORNADA II: CIDADE & ARENA DOS CAMPEÕES ⚔️           ');
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
  
  console.log('\n 🏰 Cidade Central: Com lojas de Espadas, Poções e Super Poderes!');
  console.log(' 🗺️ Mapa Expandido: Biomas, Baús de Ouro e Inimigos Espalhados!');
  console.log('===============================================================\n');
});
