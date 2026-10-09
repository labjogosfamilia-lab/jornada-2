const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = process.env.PORT || 3000;
const TICK_RATE = 30;
const ARENA_WIDTH = 24000;  // O Colossal Continente da Floresta Ancestral (24000x24000)
const ARENA_HEIGHT = 24000;
const TARGET_ENTITIES = 50;

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
        res.end('Erro interno');
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
    name: 'Guardião da Forja',
    icon: '🗡️',
    baseHp: 140,
    speed: 6.3,
    color: '#ff4757',
    hairColor: '#e67e22',
    skinColor: '#ffdcb4'
  },
  mage: {
    id: 'mage',
    name: 'Druida Astral',
    icon: '🧙‍♂️',
    baseHp: 95,
    speed: 6.7,
    color: '#00e5ff',
    hairColor: '#ffffff',
    skinColor: '#ffeaa7'
  },
  ranger: {
    id: 'ranger',
    name: 'Arqueiro da Floresta',
    icon: '🏹',
    baseHp: 105,
    speed: 7.3,
    color: '#2ed573',
    hairColor: '#2c3e50',
    skinColor: '#ffdcb4'
  },
  shadow: {
    id: 'shadow',
    name: 'Rastreador Noturno',
    icon: '🥷',
    baseHp: 100,
    speed: 6.9,
    color: '#a29bfe',
    hairColor: '#1e272e',
    skinColor: '#f5cd79'
  }
};

// -------------------------------------------------------------
// SANTUÁRIOS E BOSQUES DA FLORESTA (NÃO É CIDADE, É FLORESTA!)
// -------------------------------------------------------------
const FOREST_SANCTUARIES = [
  // 1. Santuário Central da Grande Árvore-Mãe (Centro 24000x24000)
  { id: 'sanc_mother_tree', name: '🌳 Santuário da Grande Árvore-Mãe', x: 12000, y: 12000, radius: 650, theme: 'ancient_tree' },
  // 2. Bosque Sagrado dos Druidas (Noroeste)
  { id: 'sanc_druids', name: '🌿 Bosque Sagrado dos Druidas', x: 4500, y: 4500, radius: 450, theme: 'druid_grove' },
  // 3. Lago Esmeralda dos Salgueiros (Nordeste)
  { id: 'sanc_lake', name: '💧 Lago Esmeralda dos Salgueiros', x: 19500, y: 4500, radius: 480, theme: 'emerald_lake' },
  // 4. Clareira dos Cogumelos Luminosos (Sudoeste)
  { id: 'sanc_mushrooms', name: '🍄 Clareira dos Cogumelos Luminosos', x: 4500, y: 19500, radius: 450, theme: 'mushrooms' },
  // 5. Refúgio dos Forjadores da Madeira (Sudeste)
  { id: 'sanc_forgers', name: '🪵 Refúgio dos Forjadores da Madeira', x: 19500, y: 19500, radius: 450, theme: 'wood_forge' },
  // 6. Mirante dos Ventos das Copas (Norte)
  { id: 'sanc_winds', name: '🌾 Mirante dos Ventos das Copas', x: 12000, y: 3000, radius: 450, theme: 'treetop_winds' },
  // 7. Bosque Encantado dos Cristais (Leste)
  { id: 'sanc_fae', name: '🌸 Bosque Encantado dos Cristais', x: 21000, y: 12000, radius: 450, theme: 'fae_crystals' },
  // 8. Aldeia dos Guardiões da Mata (Oeste)
  { id: 'sanc_hunters', name: '🏹 Aldeia dos Guardiões da Mata', x: 3000, y: 12000, radius: 450, theme: 'hunters_camp' }
];

const FOREST_STRUCTURES = [
  // 1. Árvore-Mãe Central
  { id: 'b_mother_tree', name: 'Grande Árvore-Mãe Ancestral', x: 12000, y: 11800, w: 260, h: 160, roofColor: '#1b4332', wallColor: '#3e2723', type: 'ancient_tree' },
  { id: 'b_wood_smithy', name: 'Armaria da Árvore', x: 11820, y: 11980, w: 100, h: 85, roofColor: '#2d6a4f', wallColor: '#4e342e', type: 'shop' },
  { id: 'b_herbal_hut', name: 'Cabana das Ervas Místicas', x: 12180, y: 11980, w: 100, h: 85, roofColor: '#40916c', wallColor: '#4e342e', type: 'shop' },
  { id: 'b_elder_lodge', name: 'Tenda dos Anciãos', x: 12000, y: 12220, w: 110, h: 90, roofColor: '#52b788', wallColor: '#3e2723', type: 'house' },

  // 2. Bosque dos Druidas
  { id: 'b_druid_hut', name: 'Cabana do Grande Druida', x: 4500, y: 4400, w: 95, h: 85, roofColor: '#2d6a4f', wallColor: '#4e342e', type: 'house' },
  { id: 'b_druid_altar', name: 'Altar de Menires', x: 4400, y: 4540, w: 90, h: 80, roofColor: '#1b4332', wallColor: '#5d4037', type: 'shop' },
  { id: 'b_druid_herbs', name: 'Cultivo dos Bosques', x: 4600, y: 4540, w: 90, h: 80, roofColor: '#52b788', wallColor: '#3e2723', type: 'shop' },

  // 3. Lago Esmeralda
  { id: 'b_lake_shrine', name: 'Santuário da Água', x: 19500, y: 4400, w: 100, h: 90, roofColor: '#1b4332', wallColor: '#4e342e', type: 'house' },
  { id: 'b_lake_pier', name: 'Cabana dos Pescadores', x: 19400, y: 4540, w: 90, h: 80, roofColor: '#2d6a4f', wallColor: '#5d4037', type: 'house' },

  // 4. Clareira dos Cogumelos
  { id: 'b_shroom_hut', name: 'Tenda do Xamã', x: 4500, y: 19400, w: 100, h: 90, roofColor: '#8e44ad', wallColor: '#4e342e', type: 'house' },
  { id: 'b_shroom_bazaar', name: 'Bazar dos Fungos', x: 4400, y: 19540, w: 90, h: 80, roofColor: '#9b59b6', wallColor: '#3e2723', type: 'shop' },

  // 5. Forjadores da Madeira
  { id: 'b_forg_hut', name: 'Forja da Madeira e Pedra', x: 19500, y: 19400, w: 105, h: 90, roofColor: '#c0392b', wallColor: '#4e342e', type: 'shop' },

  // 6. Mirante dos Ventos
  { id: 'b_wind_lodge', name: 'Torre de Vigia de Madeira', x: 12000, y: 2900, w: 95, h: 95, roofColor: '#2d6a4f', wallColor: '#3e2723', type: 'house' },

  // 7. Bosque dos Cristais
  { id: 'b_crystal_shrine', name: 'Santuário do Oráculo', x: 21000, y: 11900, w: 100, h: 95, roofColor: '#6c5ce7', wallColor: '#3e2723', type: 'house' },

  // 8. Aldeia dos Guardiões
  { id: 'b_hunter_cabin', name: 'Cabana dos Caçadores', x: 3000, y: 11900, w: 100, h: 85, roofColor: '#d35400', wallColor: '#4e342e', type: 'house' }
];

// NPCs da Floresta
const NPCS = [
  { id: 'npc_blacksmith', name: 'Brok, o Forjador da Floresta', icon: '🔨', x: 11900, y: 11980, radius: 28, type: 'weapons' },
  { id: 'npc_alchemist', name: 'Sylva, a Herbalista', icon: '🧪', x: 12100, y: 11980, radius: 28, type: 'potions' },
  { id: 'npc_elder', name: 'Ancião da Floresta', icon: '📜', x: 12000, y: 11900, radius: 28, type: 'quests' },
  { id: 'npc_druid', name: 'Druida Rowan', icon: '🌿', x: 4500, y: 4500, radius: 26, type: 'potions' },
  { id: 'npc_frost_druid', name: 'Pescador do Lago', icon: '🎣', x: 19500, y: 4500, radius: 26, type: 'weapons' },
  { id: 'npc_xama', name: 'Xamã dos Cogumelos', icon: '🍄', x: 4500, y: 19500, radius: 26, type: 'potions' },
  { id: 'npc_wood_smith', name: 'Ferreiro dos Troncos', icon: '🪵', x: 19500, y: 19500, radius: 26, type: 'weapons' },
  { id: 'npc_hunter', name: 'Lorde dos Caçadores', icon: '🏹', x: 3000, y: 12000, radius: 26, type: 'weapons' }
];

const SHOP_CATALOG = {
  weapons: [
    { id: 'fist', name: 'Punhos do Sobrevivente', cost: 0, damage: 14, color: '#ffdcb4', desc: 'Desarmado: socos velozes corpo a corpo' },
    { id: 'sword_starter', name: 'Lâmina de Carvalho Rústica', cost: 60, damage: 24, color: '#00e5ff', desc: 'Espada de madeira: corte corpo a corpo balanceado' },
    { id: 'sword_rune', name: 'Lâmina Rúnica da Floresta', cost: 150, damage: 36, color: '#2ed573', desc: '+50% Dano & corte rúnico veloz corpo a corpo' },
    { id: 'sword_fire', name: 'Lâmina do Fogo da Mata', cost: 320, damage: 54, color: '#ff4757', desc: 'Lâmina flamejante: corte incandescente devastador' },
    { id: 'staff_astral', name: 'Cajado Ancião dos Druidas', cost: 500, damage: 34, triple: true, color: '#ffd32a', desc: 'Cajado druídico: disparo triplo mágico à distância' }
  ],
  potions: [
    { id: 'potion_heal', name: 'Néctar Curativo da Floresta', cost: 40, heal: 50, icon: '🧪', desc: 'Restaura +50 de HP imediatamente' },
    { id: 'potion_speed', name: 'Extrato de Fúria do Vento', cost: 55, speedBoost: 1.5, icon: '⚡', desc: 'Velocidade e vigor máximo por 10s' }
  ]
};

// Missões da Floresta para Ganhar Poderes (ÚNICO JEITO DE GANHAR PODER!)
const POWER_QUESTS = [
  { id: 'q_slam', name: '⚡ Provação do Trovão', desc: 'Derrote 2 Inimigos na Floresta', target: 2, type: 'kill', rewardPower: 'power_slam', powerName: 'Pisão Sísmico [R]' },
  { id: 'q_beam', name: '🏹 Harmonia Astral', desc: 'Minere 2 Cristais de Gemas', target: 2, type: 'mine', rewardPower: 'power_beam', powerName: 'Raio Astral [F]' },
  { id: 'q_fire', name: '🔥 Fogo Ancestral', desc: 'Derrote 3 Inimigos na Floresta', target: 3, type: 'kill', rewardPower: 'power_fire', powerName: 'Meteoro Flamejante [C]' },
  { id: 'q_shield', name: '🛡️ Relíquia Sagrada', desc: 'Abra 3 Baús de Tesouro', target: 3, type: 'chest', rewardPower: 'power_shield', powerName: 'Escudo Divino [V]' },
  { id: 'q_nature', name: '🌪️ Fúria da Floresta', desc: 'Derrote 1 Chefe Ancião da Mata', target: 1, type: 'boss', rewardPower: 'power_nature', powerName: 'Ciclone de Folhas [T]' }
];

// Elementos do Mundo da Floresta
let mineCrystals = [];
let breakables = [];
let chests = [];
let orbs = [];
let worldBoss = null;
let secondBoss = null;
let thirdBoss = null;
let fourthBoss = null;

function spawnMineCrystals(count = 45) {
  while (mineCrystals.length < count) {
    const sp = getSpreadSpawn(false);
    const types = [
      { name: 'Esmeralda da Floresta', color: '#2ed573', gold: 70 },
      { name: 'Safira das Águas', color: '#00e5ff', gold: 65 },
      { name: 'Rubi do Fogo Antigo', color: '#ff4757', gold: 75 },
      { name: 'Ametista Mística', color: '#a29bfe', gold: 80 }
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

function spawnBreakables(count = 55) {
  while (breakables.length < count) {
    const sp = getSpreadSpawn(false);
    breakables.push({
      id: 'brk_' + Math.random().toString(36).substring(2, 9),
      x: sp.x,
      y: sp.y,
      radius: 16,
      gold: 25
    });
  }
}

function spawnChests(count = 40) {
  while (chests.length < count) {
    const sp = getSpreadSpawn(false);
    chests.push({
      id: 'chest_' + Math.random().toString(36).substring(2, 9),
      x: sp.x,
      y: sp.y,
      radius: 18,
      gold: 45 + Math.floor(Math.random() * 45)
    });
  }
}

function spawnOrbs(count = 65) {
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

function initWorldBosses() {
  worldBoss = {
    id: 'world_colossus',
    name: '👑 Rei Titã da Floresta Ancestral',
    x: 16500,
    y: 12000,
    radius: 65,
    hp: 850,
    maxHp: 850,
    color: '#ffd32a',
    speed: 3.2,
    angle: 0
  };

  secondBoss = {
    id: 'world_ignis',
    name: '🔥 Lorde Ignis, O Cavaleiro do Fogo',
    x: 12000,
    y: 17500,
    radius: 65,
    hp: 800,
    maxHp: 800,
    color: '#ff4757',
    speed: 3.5,
    angle: 0
  };

  thirdBoss = {
    id: 'world_druid',
    name: '⚡ Arquidruida das Tempestades',
    x: 7000,
    y: 7000,
    radius: 60,
    hp: 750,
    maxHp: 750,
    color: '#00e5ff',
    speed: 3.4,
    angle: 0
  };

  fourthBoss = {
    id: 'world_shadow',
    name: '💀 General Espectral da Noite',
    x: 7000,
    y: 17500,
    radius: 65,
    hp: 800,
    maxHp: 800,
    color: '#a29bfe',
    speed: 3.6,
    angle: 0
  };
}

spawnMineCrystals(160);
spawnBreakables(180);
spawnChests(150);
spawnOrbs(200);
initWorldBosses();

// Obstáculos de Pedras e Menires Antigos
const obstacles = [
  { x: 3000, y: 3000, radius: 95, type: 'rock', label: 'Pedra de Musgo' },
  { x: 5000, y: 5000, radius: 105, type: 'pillar', label: 'Menir dos Druidas' },
  { x: 3000, y: 5000, radius: 95, type: 'rock', label: 'Rocha da Mata' },
  { x: 5000, y: 3000, radius: 95, type: 'pillar', label: 'Obelisco da Floresta' }
];

const BOT_NAMES = [
  'Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane', 
  'Sentinela Kael', 'Caçador Rex', 'Guardião Thorne', 'Oráculo Zeph', 
  'Lorde Malakor', 'Druida Rowan', 'Lâmina Lyra', 'Paladino Uther',
  'Cavaleiro Galahad', 'Mago Merlim', 'Arqueira Diana', 'Lâmina Sombra',
  'Campeão Alistair', 'Ranger Varis', 'Cavaleiro Roland', 'Bárbaro Conan'
];

const players = new Map();
const bots = new Map();
let projectiles = [];
let killFeed = [];
let nextProjectileId = 1;

function getSpreadSpawn(allowSanctuary = false) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const x = 500 + Math.random() * (ARENA_WIDTH - 1000);
    const y = 500 + Math.random() * (ARENA_HEIGHT - 1000);

    let inAnySanc = false;
    for (const s of FOREST_SANCTUARIES) {
      if (Math.hypot(x - s.x, y - s.y) < s.radius + 120) {
        inAnySanc = true; break;
      }
    }
    if (!allowSanctuary && inAnySanc) continue;

    let collides = false;
    for (const obs of obstacles) {
      if (Math.hypot(x - obs.x, y - obs.y) < obs.radius + 60) {
        collides = true; break;
      }
    }
    if (!collides) return { x, y };
  }
  return { x: 4000 + (Math.random() - 0.5) * 600, y: 4000 + (Math.random() - 0.5) * 600 };
}

function isInsideAnySanctuary(x, y) {
  for (const s of FOREST_SANCTUARIES) {
    if (Math.hypot(x - s.x, y - s.y) < s.radius) return true;
  }
  return false;
}

// -------------------------------------------------------------
// Gerenciamento de Jogadores
// -------------------------------------------------------------
function onPlayerJoin(client) {
  const defClass = CHARACTER_CLASSES.warrior;

  const player = {
    id: client.id,
    socket: client.socket,
    isBot: false,
    isDead: false,
    name: 'Viajante #' + client.id.substring(2, 6),
    charClass: 'warrior',
    color: defClass.color,
    hairColor: defClass.hairColor,
    skinColor: defClass.skinColor,
    x: 4000,
    y: 4000,
    vx: 0,
    vy: 0,
    walkStep: 0,
    speed: defClass.speed,
    angle: 0,
    hp: defClass.baseHp,
    maxHp: defClass.baseHp,
    stamina: 100,
    maxStamina: 100,
    shieldTimer: 3,
    gold: 80,
    score: 0,
    kills: 0,
    deaths: 0,
    level: 1,
    xp: 0,
    weapon: 'sword_starter',
    potions: { heal: 2, speed: 0 },
    powers: { slam: false, beam: false, fire: false, shield: false, nature: false },
    powerCooldowns: { slam: 0, beam: 0, fire: 0, shield: 0, nature: 0 },
    speedBoostTimer: 0,
    dashCooldown: 0,
    attackCooldown: 0,
    radius: 24,
    inSafeZone: true,
    activeQuests: POWER_QUESTS.map(q => ({ ...q, current: 0, completed: false })),
    input: { up: false, down: false, left: false, right: false, attack: false, dash: false, powerSlam: false, powerBeam: false, powerFire: false, powerShield: false, powerNature: false, useHeal: false, useSpeed: false, angle: 0 }
  };

  players.set(client.id, player);

  sendTo(client, {
    type: 'welcome',
    id: client.id,
    arena: { width: ARENA_WIDTH, height: ARENA_HEIGHT },
    sanctuaries: FOREST_SANCTUARIES,
    structures: FOREST_STRUCTURES,
    npcs: NPCS,
    catalog: SHOP_CATALOG,
    classes: CHARACTER_CLASSES,
    powerQuests: POWER_QUESTS,
    obstacles: obstacles,
    player: player
  });

  broadcastKillFeed(`🌲 ${player.name} (${defClass.name}) adentrou a Grande Floresta Ancestral!`);
}

function onPlayerLeave(id) {
  const p = players.get(id);
  if (p) {
    broadcastKillFeed(`🚪 ${p.name} descansou nas sombras da mata.`);
    players.delete(id);
  }
}

function onClientMessage(client, msg) {
  const p = players.get(client.id);
  if (!p || p.isDead) return;

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

    // Super Poderes (DESBLOQUEADOS APENAS POR MISSÃO!)
    if (msg.input?.powerSlam && p.powers.slam && p.powerCooldowns.slam <= 0 ) {
      p.powerCooldowns.slam = 6;
      executeSeismicSlam(p);
    }

    if (msg.input?.powerBeam && p.powers.beam && p.powerCooldowns.beam <= 0 ) {
      p.powerCooldowns.beam = 8;
      executeAstralBeam(p);
    }

    if (msg.input?.powerFire && p.powers.fire && p.powerCooldowns.fire <= 0 ) {
      p.powerCooldowns.fire = 7;
      executeFireMeteor(p);
    }

    if (msg.input?.powerShield && p.powers.shield && p.powerCooldowns.shield <= 0) {
      p.powerCooldowns.shield = 12;
      p.shieldTimer = 6;
      broadcast({ type: 'effect', name: 'shield_up', x: p.x, y: p.y, color: '#00e5ff' });
    }

    if (msg.input?.powerNature && p.powers.nature && p.powerCooldowns.nature <= 0 ) {
      p.powerCooldowns.nature = 9;
      executeNatureCyclone(p);
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
      p.hairColor = cData.hairColor;
      p.skinColor = cData.skinColor;
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

// COMPRA NA LOJA (PODERES NUNCA PODEM SER COMPRADOS!)
function handleShopPurchase(player, category, itemId) {
  if (!isInsideAnySanctuary(player.x, player.y)) return;

  if (category === 'powers') {
    broadcastKillFeed(`🔒 ${player.name}, Super Poderes são sagrados! O único jeito de conquistá-los é fazendo Missões!`);
    return;
  }

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

// -------------------------------------------------------------
// Execução dos Super Poderes Conquistados por Missão
// -------------------------------------------------------------
function executeSeismicSlam(caster) {
  broadcast({ type: 'effect', name: 'seismic_slam', x: caster.x, y: caster.y, radius: 220, color: '#ffd32a' });

  const targets = [...players.values(), ...bots.values()];
  for (const t of targets) {
    if (t.id === caster.id || t.hp <= 0 || t.isDead || t.inSafeZone || t.shieldTimer > 0) continue;
    if (Math.hypot(t.x - caster.x, t.y - caster.y) < 220) {
      t.hp -= 42;
      const pa = Math.atan2(t.y - caster.y, t.x - caster.x);
      t.x += Math.cos(pa) * 60;
      t.y += Math.sin(pa) * 60;
      checkEntityDeath(t, caster);
    }
  }

  if (worldBoss && worldBoss.hp > 0 && Math.hypot(worldBoss.x - caster.x, worldBoss.y - caster.y) < 240) {
    worldBoss.hp -= 50;
    checkBossDeath(caster, worldBoss);
  }
  if (secondBoss && secondBoss.hp > 0 && Math.hypot(secondBoss.x - caster.x, secondBoss.y - caster.y) < 240) {
    secondBoss.hp -= 50;
    checkBossDeath(caster, secondBoss);
  }
}

function executeAstralBeam(caster) {
  const beamAngle = caster.angle;
  const beamEnd = {
    x: caster.x + Math.cos(beamAngle) * 1100,
    y: caster.y + Math.sin(beamAngle) * 1100
  };

  broadcast({ type: 'effect', name: 'astral_beam', x1: caster.x, y1: caster.y, x2: beamEnd.x, y2: beamEnd.y, color: '#00e5ff' });

  const targets = [...players.values(), ...bots.values()];
  for (const t of targets) {
    if (t.id === caster.id || t.hp <= 0 || t.isDead || t.inSafeZone || t.shieldTimer > 0) continue;
    if (distanceToSegment(t.x, t.y, caster.x, caster.y, beamEnd.x, beamEnd.y) < t.radius + 25) {
      t.hp -= 60;
      checkEntityDeath(t, caster);
    }
  }

  if (worldBoss && worldBoss.hp > 0) {
    if (distanceToSegment(worldBoss.x, worldBoss.y, caster.x, caster.y, beamEnd.x, beamEnd.y) < worldBoss.radius + 30) {
      worldBoss.hp -= 70;
      checkBossDeath(caster, worldBoss);
    }
  }
  if (secondBoss && secondBoss.hp > 0) {
    if (distanceToSegment(secondBoss.x, secondBoss.y, caster.x, caster.y, beamEnd.x, beamEnd.y) < secondBoss.radius + 30) {
      secondBoss.hp -= 70;
      checkBossDeath(caster, secondBoss);
    }
  }
}

function executeFireMeteor(caster) {
  for (let i = 0; i < 5; i++) {
    const spread = (i - 2) * 0.25;
    createProjectile(caster, { color: '#ff4757', damage: 38 }, caster.angle + spread);
  }
  broadcast({ type: 'effect', name: 'seismic_slam', x: caster.x, y: caster.y, radius: 150, color: '#ff4757' });
}

function executeNatureCyclone(caster) {
  broadcast({ type: 'effect', name: 'nature_cyclone', x: caster.x, y: caster.y, radius: 260, color: '#2ed573' });

  const targets = [...players.values(), ...bots.values()];
  for (const t of targets) {
    if (t.id === caster.id || t.hp <= 0 || t.isDead || t.inSafeZone || t.shieldTimer > 0) continue;
    if (Math.hypot(t.x - caster.x, t.y - caster.y) < 260) {
      t.hp -= 48;
      const pa = Math.atan2(t.y - caster.y, t.x - caster.x);
      t.x += Math.cos(pa) * 80;
      t.y += Math.sin(pa) * 80;
      checkEntityDeath(t, caster);
    }
  }

  if (worldBoss && worldBoss.hp > 0 && Math.hypot(worldBoss.x - caster.x, worldBoss.y - caster.y) < 260) {
    worldBoss.hp -= 60;
    checkBossDeath(caster, worldBoss);
  }
  if (secondBoss && secondBoss.hp > 0 && Math.hypot(secondBoss.x - caster.x, secondBoss.y - caster.y) < 260) {
    secondBoss.hp -= 60;
    checkBossDeath(caster, secondBoss);
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1; const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function executeMeleeAttack(attacker, weapon) {
  const reach = (attacker.weapon === 'fist' ? 52 : 78) + 20;
  const maxCone = 1.25;

  broadcast({
    type: 'effect',
    name: 'melee_slash',
    ownerId: attacker.id,
    x: attacker.x,
    y: attacker.y,
    angle: attacker.angle,
    radius: attacker.weapon === 'fist' ? 52 : 78,
    color: weapon.color,
    weaponId: attacker.weapon
  });

  const targets = [...players.values(), ...bots.values()];
  for (const t of targets) {
    if (t.id === attacker.id || t.hp <= 0 || t.isDead || t.shieldTimer > 0) continue;
    const dist = Math.hypot(t.x - attacker.x, t.y - attacker.y);
    if (dist <= reach + t.radius) {
      const dir = Math.atan2(t.y - attacker.y, t.x - attacker.x);
      let diff = dir - attacker.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      if (Math.abs(diff) < maxCone) {
        t.hp = Math.max(0, t.hp - weapon.damage);
        // Knockback da lâmina
        t.x += Math.cos(attacker.angle) * 20;
        t.y += Math.sin(attacker.angle) * 20;
        broadcast({ type: 'hit', x: t.x, y: t.y, color: weapon.color });
        checkEntityDeath(t, attacker);
      }
    }
  }

  // Chefes Titânicos
  const bosses = [worldBoss, secondBoss, thirdBoss, fourthBoss].filter(Boolean);
  for (const boss of bosses) {
    if (boss.hp <= 0) continue;
    const dist = Math.hypot(boss.x - attacker.x, boss.y - attacker.y);
    if (dist <= reach + boss.radius) {
      const dir = Math.atan2(boss.y - attacker.y, boss.x - attacker.x);
      let diff = dir - attacker.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      if (Math.abs(diff) < maxCone) {
        boss.hp = Math.max(0, boss.hp - weapon.damage);
        broadcast({ type: 'hit', x: boss.x, y: boss.y, color: weapon.color });
        checkBossDeath(attacker, boss);
      }
    }
  }

  // Cristais de Mineração
  for (let i = mineCrystals.length - 1; i >= 0; i--) {
    const cr = mineCrystals[i];
    const dist = Math.hypot(cr.x - attacker.x, cr.y - attacker.y);
    if (dist <= reach + cr.radius) {
      const dir = Math.atan2(cr.y - attacker.y, cr.x - attacker.x);
      let diff = dir - attacker.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      if (Math.abs(diff) < maxCone) {
        cr.hp--;
        attacker.gold += 15;
        broadcast({ type: 'hit', x: cr.x, y: cr.y, color: cr.color });
        if (cr.hp <= 0) {
          attacker.gold += cr.gold;
          attacker.score += 40;
          broadcast({ type: 'effect', name: 'chest_opened', x: cr.x, y: cr.y, color: '#ffd32a' });
          mineCrystals.splice(i, 1);
          setTimeout(() => spawnMineCrystals(1), 20000);
        }
      }
    }
  }

  // Barris e Caixas Quebráveis
  for (let i = breakables.length - 1; i >= 0; i--) {
    const br = breakables[i];
    const dist = Math.hypot(br.x - attacker.x, br.y - attacker.y);
    if (dist <= reach + br.radius) {
      const dir = Math.atan2(br.y - attacker.y, br.x - attacker.x);
      let diff = dir - attacker.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      if (Math.abs(diff) < maxCone) {
        attacker.gold += br.gold;
        attacker.score += 15;
        broadcast({ type: 'effect', name: 'chest_opened', x: br.x, y: br.y, color: '#e67e22' });
        breakables.splice(i, 1);
        setTimeout(() => spawnBreakables(1), 22000);
      }
    }
  }
}

// -------------------------------------------------------------
// Bots Inteligentes da Floresta
// -------------------------------------------------------------
function adjustBotsPopulation() {
  const totalHumans = players.size;
  const desiredBots = Math.max(14, TARGET_ENTITIES - totalHumans);

  while (bots.size < desiredBots) {
    const botId = 'bot_' + Math.random().toString(36).substring(2, 8);
    const spawn = getSpreadSpawn(false);
    const bName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + ' (BOT)';
    const classesKeys = Object.keys(CHARACTER_CLASSES);
    const bClass = classesKeys[Math.floor(Math.random() * classesKeys.length)];
    const cData = CHARACTER_CLASSES[bClass];

    const bot = {
      id: botId,
      isBot: true,
      isDead: false,
      name: bName,
      charClass: bClass,
      color: cData.color,
      hairColor: cData.hairColor,
      skinColor: cData.skinColor,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      speed: 5.5,
      angle: Math.random() * Math.PI * 2,
      hp: 110,
      maxHp: 110,
      stamina: 100,
      shieldTimer: 0,
      walkStep: 0,
      gold: 50,
      score: 0,
      kills: 0,
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
  if (bot.inSafeZone || bot.isDead) {
    bot.input.attack = false;
    bot.input.up = true;
    return;
  }

  if (bot.hp <= 40 && orbs.length > 0) {
    let nearestHeal = null;
    let minD = Infinity;
    for (const o of orbs) {
      if (o.type === 'heal') {
        const d = Math.hypot(o.x - bot.x, o.y - bot.y);
        if (d < minD) { minD = d; nearestHeal = o; }
      }
    }
    if (nearestHeal && minD < 1000) {
      bot.angle = Math.atan2(nearestHeal.y - bot.y, nearestHeal.x - bot.x);
      bot.input.up = true;
      bot.input.attack = false;
      return;
    }
  }

  const enemies = [];
  for (const p of players.values()) if (p.hp > 0 && !p.isDead ) enemies.push(p);
  for (const b of bots.values()) if (b.id !== bot.id && b.hp > 0 && !b.isDead && !b.inSafeZone) enemies.push(b);

  let closestEnemy = null;
  let minDist = Infinity;
  for (const en of enemies) {
    const d = Math.hypot(en.x - bot.x, en.y - bot.y);
    if (d < minDist) { minDist = d; closestEnemy = en; }
  }

  if (now > bot.nextDecisionTime) {
    bot.nextDecisionTime = now + 400 + Math.random() * 500;
  }

  if (closestEnemy && minDist < 850) {
    bot.angle = Math.atan2(closestEnemy.y - bot.y, closestEnemy.x - bot.x);
    if (bot.weapon === 'staff_astral') {
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
      // Espada ou Soco: Avança diretamente para combate corpo a corpo
      if (minDist > 55) {
        bot.input.up = true;
        bot.input.down = false;
      } else {
        bot.input.up = false;
        bot.input.down = false;
      }
      bot.input.attack = minDist <= 85;
    }
  } else {
    bot.input.up = true;
    bot.input.attack = false;
    if (Math.random() < 0.03) bot.angle += (Math.random() - 0.5) * 1.5;
  }
}

// -------------------------------------------------------------
// Chefes Titânicos da Floresta
// -------------------------------------------------------------
function updateWorldBosses() {
  const bosses = [worldBoss, secondBoss, thirdBoss, fourthBoss];
  for (const boss of bosses) {
    if (!boss || boss.hp <= 0) continue;

    const targets = [...players.values(), ...bots.values()].filter(t => t.hp > 0 && !t.isDead );
    let closest = null;
    let minD = Infinity;
    for (const t of targets) {
      const d = Math.hypot(t.x - boss.x, t.y - boss.y);
      if (d < minD) { minD = d; closest = t; }
    }

    if (closest && minD < 1100) {
      boss.angle = Math.atan2(closest.y - boss.y, closest.x - boss.x);
      boss.x += Math.cos(boss.angle) * boss.speed;
      boss.y += Math.sin(boss.angle) * boss.speed;

      if (minD < boss.radius + closest.radius + 10 && closest.shieldTimer <= 0) {
        closest.hp -= 40;
        broadcast({ type: 'effect', name: 'seismic_slam', x: boss.x, y: boss.y, radius: 120, color: boss.color });
        checkEntityDeath(closest, null);
      }
    }
  }
}

function checkBossDeath(killer, boss) {
  if (boss.hp <= 0) {
    boss.hp = 0;
    broadcastKillFeed(`👑 ${killer ? killer.name : 'Um Guardião'} DERRUBOU O ${boss.name.toUpperCase()}!`);
    if (killer) {
      killer.gold += 300;
      killer.score += 600;
      progressPlayerQuest(killer, 'boss');
    }
    setTimeout(() => {
      boss.hp = boss.maxHp;
      broadcastKillFeed(`⚠️ O ${boss.name} ressurgiu nas profundezas da mata!`);
    }, 45000);
  }
}

// -------------------------------------------------------------
// Loop Principal da Simulação de Física (TICK_RATE = 30 FPS)
// -------------------------------------------------------------
function gameTick() {
  const now = Date.now();
  adjustBotsPopulation();
  updateWorldBosses();

  const entities = [...players.values(), ...bots.values()];

  for (const bot of bots.values()) {
    if (bot.hp > 0 && !bot.isDead) updateBotAI(bot, now);
  }

  for (const ent of entities) {
    if (ent.hp <= 0 || ent.isDead) continue;

    ent.inSafeZone = isInsideAnySanctuary(ent.x, ent.y);

    if (ent.inSafeZone && ent.hp < ent.maxHp) {
      ent.hp = Math.min(ent.maxHp, ent.hp + 6 / TICK_RATE);
    }

    if (ent.dashCooldown > 0) ent.dashCooldown -= 1 / TICK_RATE;
    if (ent.attackCooldown > 0) ent.attackCooldown -= 1 / TICK_RATE;
    if (ent.stamina < ent.maxStamina) ent.stamina = Math.min(ent.maxStamina, ent.stamina + 20 / TICK_RATE);
    if (ent.speedBoostTimer > 0) ent.speedBoostTimer -= 1 / TICK_RATE;
    if (ent.shieldTimer > 0) ent.shieldTimer -= 1 / TICK_RATE;

    if (ent.powerCooldowns) {
      if (ent.powerCooldowns.slam > 0) ent.powerCooldowns.slam -= 1 / TICK_RATE;
      if (ent.powerCooldowns.beam > 0) ent.powerCooldowns.beam -= 1 / TICK_RATE;
      if (ent.powerCooldowns.fire > 0) ent.powerCooldowns.fire -= 1 / TICK_RATE;
      if (ent.powerCooldowns.shield > 0) ent.powerCooldowns.shield -= 1 / TICK_RATE;
      if (ent.powerCooldowns.nature > 0) ent.powerCooldowns.nature -= 1 / TICK_RATE;
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

    if (len > 0) {
      ent.walkStep = (ent.walkStep || 0) + 0.25;
    }

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

    let blocked = false;
    for (const b of FOREST_STRUCTURES) {
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

    if (!blocked) {
      ent.x = nextX;
      ent.y = nextY;
    }

    // Ataque / Combate Corpo a Corpo (Espada ou Soco) ou Cajado Mágico
    if (ent.input.attack && ent.attackCooldown <= 0) {
      ent.attackCooldown = ent.weapon === 'fist' ? 0.22 : 0.3;
      const wCatalog = SHOP_CATALOG.weapons.find(w => w.id === ent.weapon) || SHOP_CATALOG.weapons[0];
      if (wCatalog.id === 'staff_astral') {
        [-0.22, 0, 0.22].forEach(spr => createProjectile(ent, wCatalog, ent.angle + spr));
      } else {
        executeMeleeAttack(ent, wCatalog);
      }
    }

    // Coleta de Orbes
    for (let i = orbs.length - 1; i >= 0; i--) {
      const o = orbs[i];
      if (Math.hypot(ent.x - o.x, ent.y - o.y) < ent.radius + o.radius) {
        if (o.type === 'heal') ent.hp = Math.min(ent.maxHp, ent.hp + o.value);
        else ent.stamina = Math.min(ent.maxStamina, ent.stamina + o.value);
        broadcast({ type: 'effect', name: 'heal', x: o.x, y: o.y, color: o.type === 'heal' ? '#2ed573' : '#00e5ff' });
        orbs.splice(i, 1);
        setTimeout(() => spawnOrbs(1), 10000);
        break;
      }
    }

    // Coleta de Baús
    for (let i = chests.length - 1; i >= 0; i--) {
      const ch = chests[i];
      if (Math.hypot(ent.x - ch.x, ent.y - ch.y) < ent.radius + ch.radius) {
        ent.gold += ch.gold;
        ent.score += 25;
        broadcastKillFeed(`🪙 ${ent.name} abriu um baú na floresta (+${ch.gold} Ouro)!`);
        broadcast({ type: 'effect', name: 'chest_opened', x: ch.x, y: ch.y, color: '#ffd32a' });
        progressPlayerQuest(ent, 'chest');
        chests.splice(i, 1);
        setTimeout(() => spawnChests(1), 18000);
        break;
      }
    }
  }

  // Atualização dos Projéteis
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const pr = projectiles[i];
    pr.x += pr.vx;
    pr.y += pr.vy;
    pr.lifetime--;

    let hit = false;
    if (pr.x < 0 || pr.x > ARENA_WIDTH || pr.y < 0 || pr.y > ARENA_HEIGHT || pr.lifetime <= 0) hit = true;

    // Combat allowed everywhere in forest

    // Colisão com Cristais
    if (!hit) {
      for (let cIdx = mineCrystals.length - 1; cIdx >= 0; cIdx--) {
        const cr = mineCrystals[cIdx];
        if (Math.hypot(pr.x - cr.x, pr.y - cr.y) < cr.radius + pr.radius) {
          hit = true;
          cr.hp--;
          broadcast({ type: 'hit', x: cr.x, y: cr.y, color: cr.color });
          if (cr.hp <= 0) {
            const owner = players.get(pr.ownerId) || bots.get(pr.ownerId);
            if (owner) {
              owner.gold += cr.gold;
              owner.score += 50;
              broadcastKillFeed(`💎 ${owner.name} minerou uma ${cr.name} (+${cr.gold} 🪙)!`);
              progressPlayerQuest(owner, 'mine');
            }
            mineCrystals.splice(cIdx, 1);
            setTimeout(() => spawnMineCrystals(1), 15000);
          }
          break;
        }
      }
    }

    // Colisão com Barris
    if (!hit) {
      for (let bIdx = breakables.length - 1; bIdx >= 0; bIdx--) {
        const br = breakables[bIdx];
        if (Math.hypot(pr.x - br.x, pr.y - br.y) < br.radius + pr.radius) {
          hit = true;
          const owner = players.get(pr.ownerId) || bots.get(pr.ownerId);
          if (owner) {
            owner.gold += br.gold;
            owner.score += 15;
          }
          broadcast({ type: 'effect', name: 'chest_opened', x: br.x, y: br.y, color: '#e67e22' });
          breakables.splice(bIdx, 1);
          setTimeout(() => spawnBreakables(1), 12000);
          break;
        }
      }
    }

    // Colisão com Entidades
    if (!hit) {
      for (const ent of entities) {
        if (ent.id === pr.ownerId || ent.hp <= 0 || ent.isDead || ent.inSafeZone) continue;
        if (Math.hypot(pr.x - ent.x, pr.y - ent.y) < ent.radius + pr.radius) {
          hit = true;
          if (ent.shieldTimer <= 0) {
            ent.hp -= pr.damage;
            broadcast({ type: 'hit', x: ent.x, y: ent.y, color: pr.color, damage: pr.damage });
            const shooter = players.get(pr.ownerId) || bots.get(pr.ownerId);
            checkEntityDeath(ent, shooter);
          }
          break;
        }
      }
    }

    if (hit) projectiles.splice(i, 1);
  }

  // Envia snapshot
  const snapshot = {
    type: 'state',
    players: Array.from(players.values()).map(p => ({
      id: p.id,
      name: p.name,
      charClass: p.charClass,
      color: p.color,
      hairColor: p.hairColor,
      skinColor: p.skinColor,
      x: Math.round(p.x),
      y: Math.round(p.y),
      walkStep: p.walkStep || 0,
      angle: Number(p.angle.toFixed(2)),
      hp: Math.round(p.hp),
      maxHp: p.maxHp,
      stamina: Math.round(p.stamina),
      gold: p.gold,
      weapon: p.weapon,
      shieldTimer: Number((p.shieldTimer || 0).toFixed(1)),
      isDead: p.isDead || false,
      potions: p.potions,
      powers: p.powers,
      powerCooldowns: {
        slam: Number((p.powerCooldowns?.slam || 0).toFixed(1)),
        beam: Number((p.powerCooldowns?.beam || 0).toFixed(1)),
        fire: Number((p.powerCooldowns?.fire || 0).toFixed(1)),
        shield: Number((p.powerCooldowns?.shield || 0).toFixed(1)),
        nature: Number((p.powerCooldowns?.nature || 0).toFixed(1))
      },
      score: p.score,
      kills: p.kills,
      inSafeZone: p.inSafeZone,
      activeQuests: p.activeQuests,
      isBot: false
    })),
    bots: Array.from(bots.values()).map(b => ({
      id: b.id,
      name: b.name,
      charClass: b.charClass,
      color: b.color,
      hairColor: b.hairColor,
      skinColor: b.skinColor,
      x: Math.round(b.x),
      y: Math.round(b.y),
      walkStep: b.walkStep || 0,
      angle: Number(b.angle.toFixed(2)),
      hp: Math.round(b.hp),
      maxHp: b.maxHp,
      shieldTimer: Number((b.shieldTimer || 0).toFixed(1)),
      isDead: b.isDead || false,
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
    worldBoss: worldBoss,
    secondBoss: secondBoss,
    thirdBoss: thirdBoss,
    fourthBoss: fourthBoss
  };

  broadcast(snapshot);
}

function progressPlayerQuest(player, actionType) {
  if (!player.activeQuests) return;
  for (const q of player.activeQuests) {
    if (!q.completed && q.type === actionType) {
      q.current++;
      if (q.current >= q.target) {
        q.completed = true;
        const pKey = q.rewardPower.replace('power_', '');
        player.powers[pKey] = true;
        broadcastKillFeed(`✨ ${player.name} completou a Provação [${q.name}] e despertou o poder ${q.powerName}!`);
        if (player.socket) {
          sendTo(clients.get(player.socket), {
            type: 'power_unlocked',
            powerId: q.rewardPower,
            text: `🌿 Você completou [${q.name}] e dominou o poder ${q.powerName}!`
          });
        }
      }
    }
  }
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
    lifetime: 65
  });
}

function checkEntityDeath(victim, killer) {
  if (victim.hp <= 0 && !victim.isDead) {
    victim.hp = 0;
    victim.isDead = true;
    victim.deaths = (victim.deaths || 0) + 1;

    if (killer) {
      killer.kills++;
      killer.score += 100;
      killer.gold += 70;
      broadcastKillFeed(`⚡ ${killer.name} derrotou ${victim.name} (+70 🪙)!`);
      progressPlayerQuest(killer, 'kill');
    } else {
      broadcastKillFeed(`💀 ${victim.name} tombou na floresta!`);
    }

    broadcast({ type: 'entity_death', id: victim.id, x: victim.x, y: victim.y });

    if (victim.socket) {
      sendTo(clients.get(victim.socket), { type: 'you_died', countdown: 3 });
    }

    setTimeout(() => {
      // Renasce no Santuário Central da Árvore-Mãe (4000, 4000)
      victim.x = 4000 + (Math.random() - 0.5) * 80;
      victim.y = 4000 + (Math.random() - 0.5) * 80;
      victim.hp = victim.maxHp;
      victim.stamina = victim.maxStamina;
      victim.isDead = false;
      victim.shieldTimer = 3;

      broadcast({ type: 'effect', name: 'resurrection', x: victim.x, y: victim.y, color: '#2ed573' });

      if (victim.socket) {
        sendTo(clients.get(victim.socket), { type: 'you_respawned' });
      }
    }, 3000);
  }
}

setInterval(gameTick, 1000 / TICK_RATE);

// -------------------------------------------------------------
// Inicialização do Servidor
// -------------------------------------------------------------
server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  console.log('\n===============================================================');
  console.log('       🌲  JORNADA II: A GRANDE FLORESTA ANCESTRAL 🌲         ');
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
  
  console.log('\n 🌲 O Mundo é uma Vasta Floresta Encantada (8000 x 8000)!');
  console.log(' 🔒 Super Poderes NÃO PODEM ser comprados! Exclusivos por Missão!');
  console.log(' 🌿 8 Santuários Sagrados com a Árvore-Mãe, Bosques e Lagos!');
  console.log(' 💀 Morte Realista sem Invisibilidade: Lápide, Alma e Renascimento!');
  console.log('===============================================================\n');
});
