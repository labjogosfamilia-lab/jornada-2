const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = process.env.PORT || 3000;
const TICK_RATE = 30; // 30 ticks por segundo
const ARENA_WIDTH = 3600;
const ARENA_HEIGHT = 3600;
const TARGET_ENTITIES = 14;

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
// Definições de Classes de Personagem
// -------------------------------------------------------------
const CHARACTER_CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'Guerreiro da Forja',
    icon: '🗡️',
    baseHp: 135,
    speed: 6.2,
    baseWeapon: 'sword_starter',
    desc: 'Alta vida e resistência a golpes'
  },
  mage: {
    id: 'mage',
    name: 'Mago Astral',
    icon: '🧙‍♂️',
    baseHp: 95,
    speed: 6.6,
    baseWeapon: 'sword_starter',
    desc: 'Disparos mágicos velozes e alto poder'
  },
  ranger: {
    id: 'ranger',
    name: 'Arqueiro dos Bosques',
    icon: '🏹',
    baseHp: 105,
    speed: 7.2,
    baseWeapon: 'sword_starter',
    desc: 'Super veloz e com disparos de longo alcance'
  },
  shadow: {
    id: 'shadow',
    name: 'Assassino Noturno',
    icon: '🥷',
    baseHp: 100,
    speed: 6.8,
    baseWeapon: 'sword_starter',
    desc: 'Esquiva ágil e alto dano crítico'
  }
};

// -------------------------------------------------------------
// Cidade, Prédios, Casas e NPCs
// -------------------------------------------------------------
const CITY = {
  name: 'Cidade dos Guardiões',
  x: 1800,
  y: 1800,
  radius: 350
};

// Prédios e Casas construídos na cidade
const BUILDINGS = [
  // Castelo Real (Norte da Praça)
  { id: 'b_castle', name: 'Castelo do Rei', x: 1800, y: 1610, w: 160, h: 90, roofColor: '#2f3542', wallColor: '#57606f', type: 'castle' },
  // Ferraria de Brok (Oeste)
  { id: 'b_blacksmith', name: 'Ferraria de Brok', x: 1660, y: 1750, w: 90, h: 80, roofColor: '#e74c3c', wallColor: '#795548', type: 'shop' },
  // Alquimia de Sylva (Leste)
  { id: 'b_alchemy', name: 'Alquimia da Sylva', x: 1940, y: 1750, w: 90, h: 80, roofColor: '#27ae60', wallColor: '#5d4037', type: 'shop' },
  // Torre Arcana de Elidor (Sul)
  { id: 'b_mage', name: 'Torre Arcana', x: 1800, y: 1980, w: 85, h: 85, roofColor: '#8e44ad', wallColor: '#34495e', type: 'tower' },
  // Casas e Taverna
  { id: 'b_tavern', name: 'Taverna do Aventureiro', x: 1650, y: 1610, w: 75, h: 65, roofColor: '#d35400', wallColor: '#6d4c41', type: 'house' },
  { id: 'b_house1', name: 'Casa do Guarda', x: 1950, y: 1610, w: 75, h: 65, roofColor: '#c0392b', wallColor: '#6d4c41', type: 'house' },
  { id: 'b_house2', name: 'Casa do Explorador', x: 1660, y: 1890, w: 75, h: 65, roofColor: '#e67e22', wallColor: '#6d4c41', type: 'house' },
  { id: 'b_house3', name: 'Câmara dos Magos', x: 1940, y: 1890, w: 75, h: 65, roofColor: '#9b59b6', wallColor: '#4e342e', type: 'house' }
];

const NPCS = [
  { id: 'npc_blacksmith', name: 'Brok, o Ferreiro', icon: '🔨', x: 1720, y: 1760, radius: 28, type: 'weapons' },
  { id: 'npc_alchemist', name: 'Sylva, a Alquimista', icon: '🧪', x: 1880, y: 1760, radius: 28, type: 'potions' },
  { id: 'npc_mage', name: 'Mago Elidor', icon: '🧙‍♂️', x: 1800, y: 1910, radius: 28, type: 'powers' },
  { id: 'npc_king', name: 'Capitão das Missões', icon: '📜', x: 1800, y: 1680, radius: 28, type: 'quests' }
];

// Catálogo das Lojas
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

// -------------------------------------------------------------
// Elementos Interativos do Mundo (Gemas, Caixas e Chefe)
// -------------------------------------------------------------
let mineCrystals = []; // Cristais de mineração
let breakables = [];   // Barris e caixas destrutíveis
let chests = [];       // Baús de tesouro
let orbs = [];         // Orbes de regeneração
let worldBoss = null;  // Colosso Errante

function spawnMineCrystals(count = 18) {
  while (mineCrystals.length < count) {
    const sp = getSpreadSpawn(false);
    const types = [
      { name: 'Safira Cósmica', color: '#00e5ff', gold: 60 },
      { name: 'Rubi do Fogo', color: '#ff4757', gold: 75 },
      { name: 'Ametista Mística', color: '#a29bfe', gold: 80 },
      { name: 'Esmeralda Vital', color: '#2ed573', gold: 70 }
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];
    mineCrystals.push({
      id: 'cry_' + Math.random().toString(36).substring(2, 9),
      x: sp.x,
      y: sp.y,
      hp: 3,
      maxHp: 3,
      radius: 20,
      name: chosen.name,
      color: chosen.color,
      gold: chosen.gold
    });
  }
}

function spawnBreakables(count = 22) {
  while (breakables.length < count) {
    const sp = getSpreadSpawn(false);
    breakables.push({
      id: 'brk_' + Math.random().toString(36).substring(2, 9),
      x: sp.x,
      y: sp.y,
      radius: 16,
      type: Math.random() > 0.5 ? 'crate' : 'barrel',
      gold: 20 + Math.floor(Math.random() * 25)
    });
  }
}

function spawnChests(count = 16) {
  while (chests.length < count) {
    const sp = getSpreadSpawn(false);
    chests.push({
      id: 'chest_' + Math.random().toString(36).substring(2, 9),
      x: sp.x,
      y: sp.y,
      radius: 18,
      gold: 40 + Math.floor(Math.random() * 40)
    });
  }
}

function spawnOrbs(count = 30) {
  while (orbs.length < count) {
    const sp = getSpreadSpawn(false);
    orbs.push({
      id: 'orb_' + Math.random().toString(36).substring(2, 9),
      x: sp.x,
      y: sp.y,
      type: Math.random() > 0.5 ? 'heal' : 'energy',
      value: 30,
      radius: 14
    });
  }
}

function initWorldBoss() {
  worldBoss = {
    id: 'world_colossus',
    name: '👑 Colosso Titânico Ancestral',
    x: 2800,
    y: 1200,
    radius: 55,
    hp: 450,
    maxHp: 450,
    color: '#e67e22',
    speed: 3.2,
    angle: 0,
    attackCooldown: 0,
    slamCooldown: 0
  };
}

spawnMineCrystals(18);
spawnBreakables(22);
spawnChests(16);
spawnOrbs(30);
initWorldBoss();

// Obstáculos dos Biomas
const obstacles = [
  { x: 1800, y: 1450, radius: 40, type: 'city_gate', label: 'Portão Norte' },
  { x: 1800, y: 2150, radius: 40, type: 'city_gate', label: 'Portão Sul' },
  { x: 1450, y: 1800, radius: 40, type: 'city_gate', label: 'Portão Oeste' },
  { x: 2150, y: 1800, radius: 40, type: 'city_gate', label: 'Portão Leste' },

  { x: 800, y: 800, radius: 95, type: 'sanctuary', label: 'Carvalho Ancestral' },
  { x: 600, y: 1100, radius: 65, type: 'rock', label: 'Monólito da Floresta' },
  { x: 2800, y: 800, radius: 95, type: 'pillar', label: 'Templo Glacial' },
  { x: 800, y: 2800, radius: 95, type: 'pillar', label: 'Labirinto das Sombras' },
  { x: 2800, y: 2800, radius: 100, type: 'pillar', label: 'Forja Vulcânica' }
];

const BOT_NAMES = [
  'Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane', 
  'Sentinela Kael', 'Caçador Rex', 'Guardião Thorne', 'Oráculo Zeph', 
  'Lorde Malakor', 'Druida Rowan', 'Lâmina Lyra', 'Paladino Uther'
];

const players = new Map();
const bots = new Map();
let projectiles = [];
let killFeed = [];
let nextProjectileId = 1;

function getSpreadSpawn(allowCity = false) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const x = 200 + Math.random() * (ARENA_WIDTH - 400);
    const y = 200 + Math.random() * (ARENA_HEIGHT - 400);

    const distToCity = Math.hypot(x - CITY.x, y - CITY.y);
    if (!allowCity && distToCity < CITY.radius + 150) continue;

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
  const defClass = CHARACTER_CLASSES.warrior;

  const player = {
    id: client.id,
    isBot: false,
    name: 'Viajante #' + client.id.substring(2, 6),
    charClass: 'warrior',
    color: '#00e5ff',
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    speed: defClass.speed,
    angle: 0,
    hp: defClass.baseHp,
    maxHp: defClass.baseHp,
    stamina: 100,
    maxStamina: 100,
    gold: 80, // Ouro inicial para explorar
    score: 0,
    kills: 0,
    deaths: 0,
    minedCount: 0,
    weapon: 'sword_starter',
    potions: { heal: 1, speed: 0 },
    powers: { slam: false, beam: false },
    powerCooldowns: { slam: 0, beam: 0 },
    speedBoostTimer: 0,
    dashCooldown: 0,
    attackCooldown: 0,
    radius: 24,
    inSafeZone: false,
    activeQuest: { id: 'q_bots', title: 'Caçar Inimigos', target: 2, current: 0, reward: 150 },
    input: { up: false, down: false, left: false, right: false, attack: false, dash: false, powerSlam: false, powerBeam: false, useHeal: false, useSpeed: false, angle: 0 }
  };

  players.set(client.id, player);

  sendTo(client, {
    type: 'welcome',
    id: client.id,
    arena: { width: ARENA_WIDTH, height: ARENA_HEIGHT },
    city: CITY,
    buildings: BUILDINGS,
    npcs: NPCS,
    catalog: SHOP_CATALOG,
    classes: CHARACTER_CLASSES,
    obstacles: obstacles,
    player: player
  });

  broadcastKillFeed(`🌿 ${player.name} (${defClass.name}) iniciou a Jornada!`);
}

function onPlayerLeave(id) {
  const p = players.get(id);
  if (p) {
    broadcastKillFeed(`🚪 ${p.name} saiu do mundo.`);
    players.delete(id);
  }
}

function onClientMessage(client, msg) {
  const p = players.get(client.id);
  if (!p) return;

  if (msg.type === 'input') {
    p.input = msg.input || p.input;

    if (msg.input?.useHeal && p.potions.heal > 0 && p.hp < p.maxHp) {
      p.potions.heal--;
      p.hp = Math.min(p.maxHp, p.hp + 50);
      broadcast({ type: 'effect', name: 'heal', x: p.x, y: p.y, color: '#2ed573' });
    }

    if (msg.input?.useSpeed && p.potions.speed > 0) {
      p.potions.speed--;
      p.speedBoostTimer = 10;
      p.stamina = p.maxStamina;
      broadcast({ type: 'effect', name: 'speed_boost', x: p.x, y: p.y, color: '#ffd32a' });
    }

    if (msg.input?.powerSlam && p.powers.slam && p.powerCooldowns.slam <= 0 && !p.inSafeZone) {
      p.powerCooldowns.slam = 6;
      executeSeismicSlam(p);
    }

    if (msg.input?.powerBeam && p.powers.beam && p.powerCooldowns.beam <= 0 && !p.inSafeZone) {
      p.powerCooldowns.beam = 8;
      executeAstralBeam(p);
    }
  } else if (msg.type === 'set_profile') {
    if (typeof msg.name === 'string' && msg.name.trim().length > 0) {
      p.name = msg.name.trim().substring(0, 16);
    }
    if (typeof msg.color === 'string') p.color = msg.color;
    if (msg.charClass && CHARACTER_CLASSES[msg.charClass]) {
      p.charClass = msg.charClass;
      const cData = CHARACTER_CLASSES[msg.charClass];
      p.maxHp = cData.baseHp;
      p.hp = cData.baseHp;
      p.speed = cData.speed;
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

function handleShopPurchase(player, category, itemId) {
  const dist = Math.hypot(player.x - CITY.x, player.y - CITY.y);
  if (dist > CITY.radius + 60) return;

  const items = SHOP_CATALOG[category];
  if (!items) return;
  const item = items.find(it => it.id === itemId);
  if (!item || player.gold < item.cost) return;

  player.gold -= item.cost;

  if (category === 'weapons') {
    player.weapon = item.id;
    broadcastKillFeed(`⚔️ ${player.name} comprou: ${item.name}!`);
  } else if (category === 'potions') {
    if (itemId === 'potion_heal') player.potions.heal = (player.potions.heal || 0) + 1;
    if (itemId === 'potion_speed') player.potions.speed = (player.potions.speed || 0) + 1;
  } else if (category === 'powers') {
    if (itemId === 'power_slam') player.powers.slam = true;
    if (itemId === 'power_beam') player.powers.beam = true;
    broadcastKillFeed(`✨ ${player.name} despertou o poder: ${item.name}!`);
  }

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
    if (Math.hypot(t.x - caster.x, t.y - caster.y) < 200) {
      t.hp -= 42;
      const pa = Math.atan2(t.y - caster.y, t.x - caster.x);
      t.x += Math.cos(pa) * 55;
      t.y += Math.sin(pa) * 55;
      checkEntityDeath(t, caster);
    }
  }

  // Atinge o Chefe se perto
  if (worldBoss && worldBoss.hp > 0 && Math.hypot(worldBoss.x - caster.x, worldBoss.y - caster.y) < 220) {
    worldBoss.hp -= 50;
    checkBossDeath(caster);
  }
}

function executeAstralBeam(caster) {
  const beamAngle = caster.angle;
  const beamEnd = {
    x: caster.x + Math.cos(beamAngle) * 950,
    y: caster.y + Math.sin(beamAngle) * 950
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
    if (distanceToSegment(t.x, t.y, caster.x, caster.y, beamEnd.x, beamEnd.y) < t.radius + 25) {
      t.hp -= 60;
      checkEntityDeath(t, caster);
    }
  }

  if (worldBoss && worldBoss.hp > 0) {
    if (distanceToSegment(worldBoss.x, worldBoss.y, caster.x, caster.y, beamEnd.x, beamEnd.y) < worldBoss.radius + 30) {
      worldBoss.hp -= 70;
      checkBossDeath(caster);
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
// Bots Inteligentes Espalhados
// -------------------------------------------------------------
function adjustBotsPopulation() {
  const totalHumans = players.size;
  const desiredBots = Math.max(8, TARGET_ENTITIES - totalHumans);

  while (bots.size < desiredBots) {
    const botId = 'bot_' + Math.random().toString(36).substring(2, 8);
    const spawn = getSpreadSpawn(false);
    const bName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + ' (BOT)';
    const classesKeys = Object.keys(CHARACTER_CLASSES);
    const bClass = classesKeys[Math.floor(Math.random() * classesKeys.length)];

    const bot = {
      id: botId,
      isBot: true,
      name: bName,
      charClass: bClass,
      color: ['#ff4757', '#ffa502', '#70a1ff', '#2ed573', '#a29bfe'][Math.floor(Math.random() * 5)],
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      speed: 5.6,
      angle: Math.random() * Math.PI * 2,
      hp: 110,
      maxHp: 110,
      stamina: 100,
      gold: 50,
      score: 0,
      kills: 0,
      deaths: 0,
      weapon: Math.random() > 0.5 ? 'sword_rune' : 'sword_starter',
      radius: 24,
      dashCooldown: 0,
      attackCooldown: 0,
      inSafeZone: false,
      nextDecisionTime: 0,
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
  if (bot.inSafeZone) {
    bot.input.attack = false;
    bot.input.up = true;
    return;
  }

  // Fuga para curar
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

  // Procura de inimigos
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
  }

  if (closestEnemy && minDist < 800) {
    bot.angle = Math.atan2(closestEnemy.y - bot.y, closestEnemy.x - bot.x);
    if (minDist > 280) {
      bot.input.up = true;
      bot.input.down = false;
    } else {
      bot.angle += Math.PI / 2;
      bot.input.up = true;
      bot.input.down = false;
    }
    bot.input.attack = minDist < 650 && Math.random() < 0.6;
  } else {
    bot.input.up = true;
    bot.input.attack = false;
    if (Math.random() < 0.03) bot.angle += (Math.random() - 0.5) * 1.5;
  }
}

// -------------------------------------------------------------
// Chefe do Mundo (Colosso Titânico)
// -------------------------------------------------------------
function updateWorldBoss() {
  if (!worldBoss || worldBoss.hp <= 0) return;

  // Procura alvo humano ou bot mais próximo
  const allTargets = [...players.values(), ...bots.values()].filter(t => t.hp > 0 && !t.inSafeZone);
  let closest = null;
  let minD = Infinity;
  for (const t of allTargets) {
    const d = Math.hypot(t.x - worldBoss.x, t.y - worldBoss.y);
    if (d < minD) { minD = d; closest = t; }
  }

  if (closest && minD < 800) {
    worldBoss.angle = Math.atan2(closest.y - worldBoss.y, closest.x - worldBoss.x);
    worldBoss.x += Math.cos(worldBoss.angle) * worldBoss.speed;
    worldBoss.y += Math.sin(worldBoss.angle) * worldBoss.speed;

    // Pisão Titânico
    if (minD < 160 && (!worldBoss.slamCooldown || worldBoss.slamCooldown <= 0)) {
      worldBoss.slamCooldown = 4;
      broadcast({
        type: 'effect',
        name: 'seismic_slam',
        x: worldBoss.x,
        y: worldBoss.y,
        radius: 220,
        color: '#e67e22'
      });
      for (const t of allTargets) {
        if (Math.hypot(t.x - worldBoss.x, t.y - worldBoss.y) < 220) {
          t.hp -= 35;
          checkEntityDeath(t, null);
        }
      }
    }
  } else {
    // Patrulha lenta
    worldBoss.x += Math.cos(worldBoss.angle) * (worldBoss.speed * 0.5);
    worldBoss.y += Math.sin(worldBoss.angle) * (worldBoss.speed * 0.5);
    if (Math.random() < 0.02) worldBoss.angle += (Math.random() - 0.5) * 1.2;
  }

  if (worldBoss.slamCooldown > 0) worldBoss.slamCooldown -= 1 / TICK_RATE;
}

function checkBossDeath(killer) {
  if (worldBoss && worldBoss.hp <= 0) {
    worldBoss.hp = 0;
    broadcastKillFeed(`👑 O COLOSSO TITÂNICO FOI DERROTADO POR ${killer.name.toUpperCase()}! (+250 🪙)!`);
    killer.gold += 250;
    killer.score += 500;
    killer.powers.slam = true;
    killer.powers.beam = true;

    // Chuva de moedas e baús
    for (let i = 0; i < 6; i++) {
      chests.push({
        id: 'boss_chest_' + Math.random(),
        x: worldBoss.x + (Math.random() - 0.5) * 160,
        y: worldBoss.y + (Math.random() - 0.5) * 160,
        radius: 18,
        gold: 60
      });
    }

    setTimeout(() => {
      initWorldBoss();
      broadcastKillFeed(`⚠️ Um novo Colosso Ancestral despertou no horizonte!`);
    }, 25000);
  }
}

// -------------------------------------------------------------
// Loop Principal da Simulação de Física (Tick)
// -------------------------------------------------------------
function gameTick() {
  const now = Date.now();
  adjustBotsPopulation();
  updateWorldBoss();

  const entities = [...players.values(), ...bots.values()];

  for (const bot of bots.values()) {
    if (bot.hp > 0) updateBotAI(bot, now);
  }

  for (const ent of entities) {
    if (ent.hp <= 0) continue;

    const distToCity = Math.hypot(ent.x - CITY.x, ent.y - CITY.y);
    ent.inSafeZone = distToCity < CITY.radius;

    if (ent.inSafeZone && ent.hp < ent.maxHp) {
      ent.hp = Math.min(ent.maxHp, ent.hp + 6 / TICK_RATE);
    }

    if (ent.dashCooldown > 0) ent.dashCooldown -= 1 / TICK_RATE;
    if (ent.attackCooldown > 0) ent.attackCooldown -= 1 / TICK_RATE;
    if (ent.stamina < ent.maxStamina) ent.stamina = Math.min(ent.maxStamina, ent.stamina + 20 / TICK_RATE);
    if (ent.speedBoostTimer > 0) ent.speedBoostTimer -= 1 / TICK_RATE;
    if (ent.powerCooldowns) {
      if (ent.powerCooldowns.slam > 0) ent.powerCooldowns.slam -= 1 / TICK_RATE;
      if (ent.powerCooldowns.beam > 0) ent.powerCooldowns.beam -= 1 / TICK_RATE;
    }

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
      ent.vx = 0; ent.vy = 0;
    }

    const nextX = Math.max(ent.radius, Math.min(ARENA_WIDTH - ent.radius, ent.x + ent.vx));
    const nextY = Math.max(ent.radius, Math.min(ARENA_HEIGHT - ent.radius, ent.y + ent.vy));

    // Colisão com Prédios e Obstáculos
    let blocked = false;
    for (const b of BUILDINGS) {
      if (nextX > b.x - b.w / 2 && nextX < b.x + b.w / 2 &&
          nextY > b.y - b.h / 2 && nextY < b.y + b.h / 2) {
        blocked = true; break;
      }
    }
    if (!blocked) {
      for (const obs of obstacles) {
        if (Math.hypot(nextX - obs.x, nextY - obs.y) < obs.radius + ent.radius) {
          const a = Math.atan2(nextY - obs.y, nextX - obs.x);
          ent.x = obs.x + Math.cos(a) * (obs.radius + ent.radius);
          ent.y = obs.y + Math.sin(a) * (obs.radius + ent.radius);
          blocked = true;
          break;
        }
      }
    }
    if (!blocked) { ent.x = nextX; ent.y = nextY; }

    // Mineração de Cristais de Gema
    for (let cIdx = mineCrystals.length - 1; cIdx >= 0; cIdx--) {
      const cr = mineCrystals[cIdx];
      if (Math.hypot(ent.x - cr.x, ent.y - cr.y) < ent.radius + cr.radius + 10 && ent.input.attack) {
        cr.hp--;
        ent.gold += 20;
        broadcast({ type: 'effect', name: 'chest_opened', x: cr.x, y: cr.y, color: cr.color });
        if (cr.hp <= 0) {
          ent.gold += cr.gold;
          ent.score += 40;
          ent.minedCount = (ent.minedCount || 0) + 1;
          broadcastKillFeed(`💎 ${ent.name} minerou uma ${cr.name} (+${cr.gold} 🪙)!`);
          mineCrystals.splice(cIdx, 1);
          spawnMineCrystals(18);
        }
        break;
      }
    }

    // Quebra de Barris e Caixas
    for (let bIdx = breakables.length - 1; bIdx >= 0; bIdx--) {
      const br = breakables[bIdx];
      if (Math.hypot(ent.x - br.x, ent.y - br.y) < ent.radius + br.radius) {
        ent.gold += br.gold;
        ent.score += 15;
        broadcast({ type: 'effect', name: 'chest_opened', x: br.x, y: br.y, color: '#e67e22' });
        breakables.splice(bIdx, 1);
        spawnBreakables(22);
        break;
      }
    }

    // Baús de Tesouro
    for (let cIdx = chests.length - 1; cIdx >= 0; cIdx--) {
      const ch = chests[cIdx];
      if (Math.hypot(ent.x - ch.x, ent.y - ch.y) < ent.radius + ch.radius) {
        ent.gold += ch.gold;
        ent.score += 25;
        broadcast({ type: 'effect', name: 'chest_opened', x: ch.x, y: ch.y, color: '#ffd32a' });
        chests.splice(cIdx, 1);
        spawnChests(16);
        break;
      }
    }

    // Orbes
    for (let oIdx = orbs.length - 1; oIdx >= 0; oIdx--) {
      const orb = orbs[oIdx];
      if (Math.hypot(ent.x - orb.x, ent.y - orb.y) < ent.radius + orb.radius) {
        if (orb.type === 'heal') ent.hp = Math.min(ent.maxHp, ent.hp + orb.value);
        else { ent.score += 15; ent.stamina = Math.min(ent.maxStamina, ent.stamina + orb.value); }
        orbs.splice(oIdx, 1);
        spawnOrbs(30);
        break;
      }
    }

    // Ataque
    if (ent.input.attack && ent.attackCooldown <= 0 && !ent.inSafeZone) {
      ent.attackCooldown = 0.28;
      const wData = SHOP_CATALOG.weapons.find(w => w.id === ent.weapon) || SHOP_CATALOG.weapons[0];
      if (wData.triple) {
        [-0.2, 0, 0.2].forEach(spr => createProjectile(ent, wData, ent.angle + spr));
      } else {
        createProjectile(ent, wData, ent.angle);
      }
    }
  }

  // Atualizar Projéteis
  for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
    const pr = projectiles[pIdx];
    pr.x += pr.vx; pr.y += pr.vy; pr.lifetime--;

    let destroyed = false;
    if (pr.x < 0 || pr.x > ARENA_WIDTH || pr.y < 0 || pr.y > ARENA_HEIGHT || pr.lifetime <= 0) destroyed = true;
    if (!destroyed && Math.hypot(pr.x - CITY.x, pr.y - CITY.y) < CITY.radius) destroyed = true;

    if (!destroyed && worldBoss && worldBoss.hp > 0) {
      if (Math.hypot(pr.x - worldBoss.x, pr.y - worldBoss.y) < worldBoss.radius + pr.radius) {
        destroyed = true;
        worldBoss.hp -= pr.damage;
        broadcast({ type: 'hit', x: pr.x, y: pr.y, color: pr.color });
        const killer = players.get(pr.ownerId) || bots.get(pr.ownerId);
        checkBossDeath(killer);
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
      charClass: p.charClass,
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
      charClass: b.charClass,
      color: b.color,
      x: Math.round(b.x),
      y: Math.round(b.y),
      angle: Number(b.angle.toFixed(2)),
      hp: Math.round(b.hp),
      maxHp: b.maxHp,
      weapon: b.weapon,
      score: b.score,
      inSafeZone: b.inSafeZone,
      isBot: true
    })),
    projectiles: projectiles.map(pr => ({
      id: pr.id,
      x: Math.round(pr.x),
      y: Math.round(pr.y),
      color: pr.color
    })),
    mineCrystals: mineCrystals,
    breakables: breakables,
    chests: chests,
    orbs: orbs,
    worldBoss: worldBoss
  };

  broadcast(snapshot);
}

function createProjectile(owner, weapon, angle) {
  const projSpeed = 16.5;
  projectiles.push({
    id: nextProjectileId++,
    ownerId: owner.id,
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
      killer.gold += 70;
      broadcastKillFeed(`⚡ ${killer.name} derrotou ${victim.name} (+70 🪙)!`);
    } else {
      broadcastKillFeed(`💀 ${victim.name} foi eliminado!`);
    }

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
  console.log('       ⚔️  JORNADA II: CIDADE, CASAS & GEMAS MÍSTICAS ⚔️        ');
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
  
  console.log('\n 🏰 Casas, Lojas e Prédios da Cidade no centro do mapa!');
  console.log(' 💎 Mineração de Gemas, Barris de Ouro e Colosso Errante!');
  console.log(' 🧙‍♂️ 4 Classes de Personagem personalizáveis!');
  console.log('===============================================================\n');
});
