const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = process.env.PORT || 3000;
const TICK_RATE = 30;
const ARENA_WIDTH = 8000;  // Mundo Gigante Expandido!
const ARENA_HEIGHT = 8000;
const TARGET_ENTITIES = 24;

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
    name: 'Guerreiro da Forja',
    icon: '🗡️',
    baseHp: 140,
    speed: 6.3,
    color: '#ff4757',
    hairColor: '#e67e22',
    skinColor: '#ffdcb4'
  },
  mage: {
    id: 'mage',
    name: 'Mago Astral',
    icon: '🧙‍♂️',
    baseHp: 95,
    speed: 6.7,
    color: '#00e5ff',
    hairColor: '#ffffff',
    skinColor: '#ffeaa7'
  },
  ranger: {
    id: 'ranger',
    name: 'Arqueiro dos Bosques',
    icon: '🏹',
    baseHp: 105,
    speed: 7.3,
    color: '#2ed573',
    hairColor: '#2c3e50',
    skinColor: '#ffdcb4'
  },
  shadow: {
    id: 'shadow',
    name: 'Assassino Noturno',
    icon: '🥷',
    baseHp: 100,
    speed: 6.9,
    color: '#a29bfe',
    hairColor: '#1e272e',
    skinColor: '#f5cd79'
  }
};

// -------------------------------------------------------------
// 8 CIDADES LENDÁRIAS DO GRANDE MUNDO (MUITO MAIS CIDADES!)
// -------------------------------------------------------------
const CITIES = [
  // 1. Cidade Real da Capital (Centro do Mundo)
  { id: 'city_capital', name: 'Cidade Real da Capital', x: 4000, y: 4000, radius: 420, theme: 'royal' },
  // 2. Vila dos Bosques Sagrados (Noroeste)
  { id: 'city_forest', name: 'Vila dos Bosques Sagrados', x: 1800, y: 1800, radius: 280, theme: 'forest' },
  // 3. Vila do Lago Glacial (Nordeste)
  { id: 'city_lake', name: 'Vila do Lago Glacial', x: 6200, y: 1800, radius: 280, theme: 'lake' },
  // 4. Vila do Oásis das Areias (Sudoeste)
  { id: 'city_oasis', name: 'Vila do Oásis das Areias', x: 1800, y: 6200, radius: 280, theme: 'desert' },
  // 5. Cidadela da Forja Vulcânica (Sudeste)
  { id: 'city_forge', name: 'Cidadela da Forja Vulcânica', x: 6200, y: 6200, radius: 280, theme: 'forge' },
  // 6. Porto Real dos Navegadores (Norte)
  { id: 'city_port', name: 'Porto Real dos Navegadores', x: 4000, y: 1200, radius: 280, theme: 'port' },
  // 7. Santuário Astral do Cosmos (Leste)
  { id: 'city_astral', name: 'Santuário Astral do Cosmos', x: 6800, y: 4000, radius: 280, theme: 'astral' },
  // 8. Aldeia dos Caçadores Selvagens (Oeste)
  { id: 'city_hunter', name: 'Aldeia dos Caçadores Selvagens', x: 1200, y: 4000, radius: 280, theme: 'hunter' }
];

// Prédios, Casas e Lojas nas 8 Cidades
const BUILDINGS = [
  // 1. Capital Central
  { id: 'b_castle', name: 'Castelo Real', x: 4000, y: 3820, w: 170, h: 100, roofColor: '#2f3542', wallColor: '#747d8c', type: 'castle' },
  { id: 'b_blacksmith', name: 'Ferraria de Brok', x: 3850, y: 3980, w: 95, h: 80, roofColor: '#e74c3c', wallColor: '#795548', type: 'shop' },
  { id: 'b_alchemy', name: 'Alquimia da Sylva', x: 4150, y: 3980, w: 95, h: 80, roofColor: '#27ae60', wallColor: '#5d4037', type: 'shop' },
  { id: 'b_mage', name: 'Torre Arcana Real', x: 4000, y: 4190, w: 90, h: 90, roofColor: '#8e44ad', wallColor: '#34495e', type: 'tower' },
  { id: 'b_tavern', name: 'Taverna do Leão de Ouro', x: 3840, y: 3820, w: 85, h: 70, roofColor: '#d35400', wallColor: '#6d4c41', type: 'house' },
  { id: 'b_house1', name: 'Quartel dos Cavaleiros', x: 4160, y: 3820, w: 85, h: 70, roofColor: '#c0392b', wallColor: '#6d4c41', type: 'house' },

  // 2. Vila dos Bosques Sagrados
  { id: 'b_for_1', name: 'Cabana do Grande Druida', x: 1800, y: 1700, w: 90, h: 75, roofColor: '#27ae60', wallColor: '#4e342e', type: 'house' },
  { id: 'b_for_2', name: 'Ferraria Élfica', x: 1700, y: 1840, w: 80, h: 70, roofColor: '#e67e22', wallColor: '#5d4037', type: 'shop' },
  { id: 'b_for_3', name: 'Herbário Místico', x: 1900, y: 1840, w: 80, h: 70, roofColor: '#16a085', wallColor: '#3e2723', type: 'shop' },

  // 3. Vila do Lago Glacial
  { id: 'b_lake_1', name: 'Templo de Niflheim', x: 6200, y: 1700, w: 95, h: 80, roofColor: '#3498db', wallColor: '#57606f', type: 'tower' },
  { id: 'b_lake_2', name: 'Refúgio dos Pescadores', x: 6100, y: 1840, w: 80, h: 70, roofColor: '#2980b9', wallColor: '#4b6584', type: 'house' },
  { id: 'b_lake_3', name: 'Bazar do Gelo Eterno', x: 6300, y: 1840, w: 80, h: 70, roofColor: '#00d2d3', wallColor: '#4b6584', type: 'shop' },

  // 4. Vila do Oásis das Areias
  { id: 'b_oas_1', name: 'Templo Solar do Deserto', x: 1800, y: 6100, w: 95, h: 80, roofColor: '#f39c12', wallColor: '#a0522d', type: 'tower' },
  { id: 'b_oas_2', name: 'Bazar das Mil Especiarias', x: 1700, y: 6240, w: 80, h: 70, roofColor: '#d35400', wallColor: '#8b4513', type: 'shop' },
  { id: 'b_oas_3', name: 'Tenda dos Nômades', x: 1900, y: 6240, w: 80, h: 70, roofColor: '#e67e22', wallColor: '#8b4513', type: 'house' },

  // 5. Cidadela da Forja Vulcânica
  { id: 'b_forg_1', name: 'Grande Forja Vulcânica', x: 6200, y: 6100, w: 100, h: 85, roofColor: '#c0392b', wallColor: '#2c3e50', type: 'castle' },
  { id: 'b_forg_2', name: 'Armaria do Aço Negro', x: 6100, y: 6240, w: 80, h: 70, roofColor: '#d63031', wallColor: '#34495e', type: 'shop' },
  { id: 'b_forg_3', name: 'Alquimia Ígnea', x: 6300, y: 6240, w: 80, h: 70, roofColor: '#e17055', wallColor: '#2d3436', type: 'shop' },

  // 6. Porto Real dos Navegadores
  { id: 'b_port_1', name: 'Farol das Marés', x: 4000, y: 1100, w: 85, h: 85, roofColor: '#0984e3', wallColor: '#dfe6e9', type: 'tower' },
  { id: 'b_port_2', name: 'Entreposto dos Pescadores', x: 3900, y: 1240, w: 80, h: 70, roofColor: '#74b9ff', wallColor: '#636e72', type: 'shop' },
  { id: 'b_port_3', name: 'Taverna do Marinheiro', x: 4100, y: 1240, w: 80, h: 70, roofColor: '#00cec9', wallColor: '#2d3436', type: 'house' },

  // 7. Santuário Astral do Cosmos
  { id: 'b_ast_1', name: 'Torre dos Arcontes', x: 6800, y: 3900, w: 90, h: 90, roofColor: '#6c5ce7', wallColor: '#2d3436', type: 'tower' },
  { id: 'b_ast_2', name: 'Empório Astral', x: 6700, y: 4040, w: 80, h: 70, roofColor: '#a29bfe', wallColor: '#34495e', type: 'shop' },
  { id: 'b_ast_3', name: 'Câmara do Oráculo', x: 6900, y: 4040, w: 80, h: 70, roofColor: '#fd79a8', wallColor: '#2d3436', type: 'house' },

  // 8. Aldeia dos Caçadores Selvagens
  { id: 'b_hunt_1', name: 'Chalé do Mestre Caçador', x: 1200, y: 3900, w: 90, h: 75, roofColor: '#d35400', wallColor: '#4e342e', type: 'house' },
  { id: 'b_hunt_2', name: 'Armaria da Floresta Selvagem', x: 1100, y: 4040, w: 80, h: 70, roofColor: '#b71540', wallColor: '#5d4037', type: 'shop' },
  { id: 'b_hunt_3', name: 'Tenda dos Rastreadores', x: 1300, y: 4040, w: 80, h: 70, roofColor: '#0a3d62', wallColor: '#3e2723', type: 'house' }
];

// NPCs nas Cidades
const NPCS = [
  // Capital
  { id: 'npc_blacksmith', name: 'Brok, o Ferreiro', icon: '🔨', x: 3920, y: 3980, radius: 28, type: 'weapons' },
  { id: 'npc_alchemist', name: 'Sylva, a Alquimista', icon: '🧪', x: 4080, y: 3980, radius: 28, type: 'potions' },
  { id: 'npc_mage', name: 'Mago Elidor', icon: '🧙‍♂️', x: 4000, y: 4110, radius: 28, type: 'powers' },
  { id: 'npc_king', name: 'Mestre das Missões', icon: '📜', x: 4000, y: 3900, radius: 28, type: 'quests' },

  // Vila dos Bosques
  { id: 'npc_druid', name: 'Druida Rowan', icon: '🌿', x: 1800, y: 1800, radius: 26, type: 'potions' },
  // Vila do Lago
  { id: 'npc_frost', name: 'Ferreiro Glacial', icon: '❄️', x: 6200, y: 1800, radius: 26, type: 'weapons' },
  // Vila do Oásis
  { id: 'npc_sun', name: 'Mago do Sol', icon: '☀️', x: 1800, y: 6200, radius: 26, type: 'powers' },
  // Forja Vulcânica
  { id: 'npc_forge', name: 'Mestre da Forja Vulcânica', icon: '🌋', x: 6200, y: 6200, radius: 26, type: 'weapons' },
  // Porto Real
  { id: 'npc_port', name: 'Capitão dos Mares', icon: '⚓', x: 4000, y: 1200, radius: 26, type: 'potions' },
  // Santuário Astral
  { id: 'npc_astral', name: 'Arquimago do Cosmos', icon: '🌌', x: 6800, y: 4000, radius: 26, type: 'powers' },
  // Aldeia dos Caçadores
  { id: 'npc_hunter', name: 'Lorde dos Caçadores', icon: '🏹', x: 1200, y: 4000, radius: 26, type: 'weapons' }
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
    { id: 'power_beam', name: '🏹 Raio Astral Cósmico [F]', cost: 300, cooldown: 8, icon: '🏹', desc: 'Feixe concentrado perfurante de longo alcance' },
    { id: 'power_fire', name: '🔥 Meteoro Flamejante [C]', cost: 350, cooldown: 7, icon: '🔥', desc: 'Chuva de meteoros incandescentes em área' },
    { id: 'power_shield', name: '🛡️ Escudo Divino [V]', cost: 250, cooldown: 12, icon: '🛡️', desc: 'Barreira protetora que bloqueia dano por 6s' }
  ]
};

// Missões para Ganhar Poderes
const POWER_QUESTS = [
  { id: 'q_slam', name: '⚡ Provação do Trovão', desc: 'Derrote 2 Inimigos para dominar o Pisão Sísmico', target: 2, type: 'kill', rewardPower: 'power_slam', powerName: 'Pisão Sísmico [R]' },
  { id: 'q_beam', name: '🏹 Harmonia Astral', desc: 'Minere 2 Cristais de Gemas para dominar o Raio Astral', target: 2, type: 'mine', rewardPower: 'power_beam', powerName: 'Raio Astral [F]' },
  { id: 'q_fire', name: '🔥 Fogo Ancestral', desc: 'Derrote 3 Inimigos no mapa para dominar o Meteoro Flamejante', target: 3, type: 'kill', rewardPower: 'power_fire', powerName: 'Meteoro Flamejante [C]' },
  { id: 'q_shield', name: '🛡️ Relíquia Sagrada', desc: 'Abra 3 Baús de Tesouro para dominar o Escudo Divino', target: 3, type: 'chest', rewardPower: 'power_shield', powerName: 'Escudo Divino [V]' }
];

// Elementos do Mundo Gigante (8000x8000)
let mineCrystals = [];
let breakables = [];
let chests = [];
let orbs = [];
let worldBoss = null;
let secondBoss = null;

function spawnMineCrystals(count = 45) {
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
    name: '👑 Colosso Titânico Ancestral',
    x: 5800,
    y: 4000,
    radius: 65,
    hp: 500,
    maxHp: 500,
    color: '#e67e22',
    speed: 3.2,
    angle: 0
  };

  secondBoss = {
    id: 'world_dragon',
    name: '🐉 Dragão dos Vulcões Antigos',
    x: 6200,
    y: 5200,
    radius: 70,
    hp: 600,
    maxHp: 600,
    color: '#d63031',
    speed: 3.5,
    angle: 0
  };
}

spawnMineCrystals(45);
spawnBreakables(55);
spawnChests(40);
spawnOrbs(65);
initWorldBosses();

// Obstáculos do Mundo
const obstacles = [
  { x: 3000, y: 3000, radius: 95, type: 'rock', label: 'Pedra Ancestral' },
  { x: 5000, y: 5000, radius: 105, type: 'pillar', label: 'Ruínas Antigas' },
  { x: 3000, y: 5000, radius: 95, type: 'rock', label: 'Pico Escarpado' },
  { x: 5000, y: 3000, radius: 95, type: 'pillar', label: 'Obelisco Cósmico' },
  { x: 2800, y: 4000, radius: 90, type: 'rock', label: 'Monólito da Floresta' },
  { x: 5200, y: 4000, radius: 90, type: 'pillar', label: 'Templo Astral' }
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

function getSpreadSpawn(allowCity = false) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const x = 400 + Math.random() * (ARENA_WIDTH - 800);
    const y = 400 + Math.random() * (ARENA_HEIGHT - 800);

    let inAnyCity = false;
    for (const c of CITIES) {
      if (Math.hypot(x - c.x, y - c.y) < c.radius + 120) {
        inAnyCity = true; break;
      }
    }
    if (!allowCity && inAnyCity) continue;

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

function isInsideAnyCity(x, y) {
  for (const c of CITIES) {
    if (Math.hypot(x - c.x, y - c.y) < c.radius) return true;
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
    shieldTimer: 3, // 3s de invulnerabilidade ao entrar
    gold: 80,
    score: 0,
    kills: 0,
    deaths: 0,
    weapon: 'sword_starter',
    potions: { heal: 1, speed: 0 },
    powers: { slam: false, beam: false, fire: false, shield: false },
    powerCooldowns: { slam: 0, beam: 0, fire: 0, shield: 0 },
    speedBoostTimer: 0,
    dashCooldown: 0,
    attackCooldown: 0,
    radius: 24,
    inSafeZone: true,
    activeQuests: POWER_QUESTS.map(q => ({ ...q, current: 0, completed: false })),
    input: { up: false, down: false, left: false, right: false, attack: false, dash: false, powerSlam: false, powerBeam: false, powerFire: false, powerShield: false, useHeal: false, useSpeed: false, angle: 0 }
  };

  players.set(client.id, player);

  sendTo(client, {
    type: 'welcome',
    id: client.id,
    arena: { width: ARENA_WIDTH, height: ARENA_HEIGHT },
    cities: CITIES,
    buildings: BUILDINGS,
    npcs: NPCS,
    catalog: SHOP_CATALOG,
    classes: CHARACTER_CLASSES,
    powerQuests: POWER_QUESTS,
    obstacles: obstacles,
    player: player
  });

  broadcastKillFeed(`🌿 ${player.name} (${defClass.name}) entrou no grande mundo de 8 Cidades!`);
}

function onPlayerLeave(id) {
  const p = players.get(id);
  if (p) {
    broadcastKillFeed(`🚪 ${p.name} descansou.`);
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

    // Super Poderes
    if (msg.input?.powerSlam && p.powers.slam && p.powerCooldowns.slam <= 0 && !p.inSafeZone) {
      p.powerCooldowns.slam = 6;
      executeSeismicSlam(p);
    }

    if (msg.input?.powerBeam && p.powers.beam && p.powerCooldowns.beam <= 0 && !p.inSafeZone) {
      p.powerCooldowns.beam = 8;
      executeAstralBeam(p);
    }

    if (msg.input?.powerFire && p.powers.fire && p.powerCooldowns.fire <= 0 && !p.inSafeZone) {
      p.powerCooldowns.fire = 7;
      executeFireMeteor(p);
    }

    if (msg.input?.powerShield && p.powers.shield && p.powerCooldowns.shield <= 0) {
      p.powerCooldowns.shield = 12;
      p.shieldTimer = 6;
      broadcast({ type: 'effect', name: 'shield_up', x: p.x, y: p.y, color: '#00e5ff' });
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

function handleShopPurchase(player, category, itemId) {
  if (!isInsideAnyCity(player.x, player.y)) return;

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
    const pKey = itemId.replace('power_', '');
    player.powers[pKey] = true;
    broadcastKillFeed(`✨ ${player.name} dominou o poder: ${item.name}!`);
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
// Execução de Super Poderes
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

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1; const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// -------------------------------------------------------------
// Bots Inteligentes (Pessoas Humanoides)
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
  for (const p of players.values()) if (p.hp > 0 && !p.isDead && !p.inSafeZone) enemies.push(p);
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
// Chefes do Mundo
// -------------------------------------------------------------
function updateWorldBosses() {
  const bosses = [worldBoss, secondBoss];
  for (const boss of bosses) {
    if (!boss || boss.hp <= 0) continue;

    const targets = [...players.values(), ...bots.values()].filter(t => t.hp > 0 && !t.isDead && !t.inSafeZone);
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
    broadcastKillFeed(`👑 ${killer ? killer.name : 'Um Herói'} DESTRUIU O ${boss.name.toUpperCase()}!`);
    if (killer) {
      killer.gold += 300;
      killer.score += 600;
      killer.powers.slam = true;
      killer.powers.beam = true;
    }
    setTimeout(() => {
      boss.hp = boss.maxHp;
      broadcastKillFeed(`⚠️ O ${boss.name} despertou furioso novamente!`);
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

    ent.inSafeZone = isInsideAnyCity(ent.x, ent.y);

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

    if (!blocked) {
      ent.x = nextX;
      ent.y = nextY;
    }

    // Ataque Básico
    if (ent.input.attack && ent.attackCooldown <= 0 && !ent.inSafeZone) {
      ent.attackCooldown = 0.3;
      const wCatalog = SHOP_CATALOG.weapons.find(w => w.id === ent.weapon) || SHOP_CATALOG.weapons[0];
      if (wCatalog.triple) {
        [-0.22, 0, 0.22].forEach(spr => createProjectile(ent, wCatalog, ent.angle + spr));
      } else {
        createProjectile(ent, wCatalog, ent.angle);
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
        broadcastKillFeed(`🪙 ${ent.name} abriu um baú de tesouro (+${ch.gold} Ouro)!`);
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

    if (!hit && isInsideAnyCity(pr.x, pr.y)) hit = true;

    // Colisão com Cristais Mineráveis
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
            broadcast({ type: 'hit', x: ent.x, y: ent.y, color: pr.color });
            const shooter = players.get(pr.ownerId) || bots.get(pr.ownerId);
            checkEntityDeath(ent, shooter);
          }
          break;
        }
      }
    }

    if (hit) projectiles.splice(i, 1);
  }

  // Envia snapshot para todos os clientes
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
        shield: Number((p.powerCooldowns?.shield || 0).toFixed(1))
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
    secondBoss: secondBoss
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
        broadcastKillFeed(`✨ ${player.name} completou [${q.name}] e desbloqueou ${q.powerName}!`);
        if (player.socket) {
          sendTo(clients.get(player.socket), {
            type: 'power_unlocked',
            powerId: q.rewardPower,
            text: `Você completou [${q.name}] e dominou o poder ${q.powerName}!`
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
      broadcastKillFeed(`💀 ${victim.name} foi derrotado!`);
    }

    broadcast({ type: 'entity_death', id: victim.id, x: victim.x, y: victim.y });

    if (victim.socket) {
      sendTo(clients.get(victim.socket), { type: 'you_died', countdown: 3 });
    }

    setTimeout(() => {
      // Renasce na Capital Central (4000, 4000) com escudo de 3s
      victim.x = 4000 + (Math.random() - 0.5) * 80;
      victim.y = 4000 + (Math.random() - 0.5) * 80;
      victim.hp = victim.maxHp;
      victim.stamina = victim.maxStamina;
      victim.isDead = false;
      victim.shieldTimer = 3;

      broadcast({ type: 'effect', name: 'resurrection', x: victim.x, y: victim.y, color: '#ffd32a' });

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
  console.log('       ⚔️  JORNADA II: O GRANDE CONTINENTE & AS 8 CIDADES ⚔️   ');
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
  
  console.log('\n 🗺️  Mundo Expandido Gigante: 8000 x 8000 pixels!');
  console.log(' 🏰 8 Grandes Cidades e Vilas Interligadas com Zonas Seguras!');
  console.log(' 🚶 Sistema Humanoide Real: Pernas animadas, braços e armas!');
  console.log(' 💀 Correção de Morte: Efeito de lápide, alma e renascimento com escudo!');
  console.log(' 👑 2 Chefes Titânicos: Colosso Ancestral e Dragão dos Vulcões!');
  console.log('===============================================================\n');
});
