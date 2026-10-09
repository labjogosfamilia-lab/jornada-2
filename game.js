// =============================================================
// JORNADA II: O GRANDE CONTINENTE & AS 8 CIDADES LENDÁRIAS
// Mundo Gigante (8000x8000) • Personagens Humanoides • Correção de Morte
// =============================================================

// Áudio Procedural com Web Audio API
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playShoot(color = '#00e5ff') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const startFreq = color === '#ff4757' ? 420 : (color === '#ffd32a' ? 700 : 540);
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playHit() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playDash() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playCoin() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playPotion() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playSlam() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playBeam() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playMeteor() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playShield() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playDefeat() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  playRespawn() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.63, this.ctx.currentTime);
    osc.frequency.setValueAtTime(329.63, this.ctx.currentTime + 0.12);
    osc.frequency.setValueAtTime(392.00, this.ctx.currentTime + 0.24);
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime + 0.36);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }
}

const sfx = new SoundFX();

// -------------------------------------------------------------
// Canvas e Estado
// -------------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimapCanvas');
const mCtx = minimapCanvas.getContext('2d');

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function resizeCanvas() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  canvas.width = screenWidth;
  canvas.height = screenHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Definições de Classes
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

// 8 CIDADES LENDÁRIAS (MAPA GIGANTE 8000x8000)
const CITIES = [
  { id: 'city_capital', name: 'Cidade Real da Capital', x: 4000, y: 4000, radius: 420, theme: 'royal' },
  { id: 'city_forest', name: 'Vila dos Bosques Sagrados', x: 1800, y: 1800, radius: 280, theme: 'forest' },
  { id: 'city_lake', name: 'Vila do Lago Glacial', x: 6200, y: 1800, radius: 280, theme: 'lake' },
  { id: 'city_oasis', name: 'Vila do Oásis das Areias', x: 1800, y: 6200, radius: 280, theme: 'desert' },
  { id: 'city_forge', name: 'Cidadela da Forja Vulcânica', x: 6200, y: 6200, radius: 280, theme: 'forge' },
  { id: 'city_port', name: 'Porto Real dos Navegadores', x: 4000, y: 1200, radius: 280, theme: 'port' },
  { id: 'city_astral', name: 'Santuário Astral do Cosmos', x: 6800, y: 4000, radius: 280, theme: 'astral' },
  { id: 'city_hunter', name: 'Aldeia dos Caçadores Selvagens', x: 1200, y: 4000, radius: 280, theme: 'hunter' }
];

// Prédios nas 8 Cidades
const BUILDINGS = [
  // Capital
  { id: 'b_castle', name: 'Castelo Real', x: 4000, y: 3820, w: 170, h: 100, roofColor: '#2f3542', wallColor: '#747d8c', type: 'castle' },
  { id: 'b_blacksmith', name: 'Ferraria de Brok', x: 3850, y: 3980, w: 95, h: 80, roofColor: '#e74c3c', wallColor: '#795548', type: 'shop' },
  { id: 'b_alchemy', name: 'Alquimia da Sylva', x: 4150, y: 3980, w: 95, h: 80, roofColor: '#27ae60', wallColor: '#5d4037', type: 'shop' },
  { id: 'b_mage', name: 'Torre Arcana Real', x: 4000, y: 4190, w: 90, h: 90, roofColor: '#8e44ad', wallColor: '#34495e', type: 'tower' },
  { id: 'b_tavern', name: 'Taverna Real', x: 3840, y: 3820, w: 85, h: 70, roofColor: '#d35400', wallColor: '#6d4c41', type: 'house' },
  { id: 'b_house1', name: 'Quartel dos Guardas', x: 4160, y: 3820, w: 85, h: 70, roofColor: '#c0392b', wallColor: '#6d4c41', type: 'house' },

  // Bosques
  { id: 'b_for_1', name: 'Cabana do Druida', x: 1800, y: 1700, w: 90, h: 75, roofColor: '#27ae60', wallColor: '#4e342e', type: 'house' },
  { id: 'b_for_2', name: 'Ferraria Élfica', x: 1700, y: 1840, w: 80, h: 70, roofColor: '#e67e22', wallColor: '#5d4037', type: 'shop' },
  { id: 'b_for_3', name: 'Herbário Místico', x: 1900, y: 1840, w: 80, h: 70, roofColor: '#16a085', wallColor: '#3e2723', type: 'shop' },

  // Lago Glacial
  { id: 'b_lake_1', name: 'Templo de Niflheim', x: 6200, y: 1700, w: 95, h: 80, roofColor: '#3498db', wallColor: '#57606f', type: 'tower' },
  { id: 'b_lake_2', name: 'Refúgio dos Pescadores', x: 6100, y: 1840, w: 80, h: 70, roofColor: '#2980b9', wallColor: '#4b6584', type: 'house' },
  { id: 'b_lake_3', name: 'Mercado de Gelo', x: 6300, y: 1840, w: 80, h: 70, roofColor: '#00d2d3', wallColor: '#4b6584', type: 'shop' },

  // Oásis
  { id: 'b_oas_1', name: 'Templo Solar', x: 1800, y: 6100, w: 95, h: 80, roofColor: '#f39c12', wallColor: '#a0522d', type: 'tower' },
  { id: 'b_oas_2', name: 'Bazar das Especiarias', x: 1700, y: 6240, w: 80, h: 70, roofColor: '#d35400', wallColor: '#8b4513', type: 'shop' },
  { id: 'b_oas_3', name: 'Tenda dos Nômades', x: 1900, y: 6240, w: 80, h: 70, roofColor: '#e67e22', wallColor: '#8b4513', type: 'house' },

  // Forja Vulcânica
  { id: 'b_forg_1', name: 'Grande Forja Vulcânica', x: 6200, y: 6100, w: 100, h: 85, roofColor: '#c0392b', wallColor: '#2c3e50', type: 'castle' },
  { id: 'b_forg_2', name: 'Armaria do Aço Negro', x: 6100, y: 6240, w: 80, h: 70, roofColor: '#d63031', wallColor: '#34495e', type: 'shop' },

  // Porto Real
  { id: 'b_port_1', name: 'Farol das Marés', x: 4000, y: 1100, w: 85, h: 85, roofColor: '#0984e3', wallColor: '#dfe6e9', type: 'tower' },
  { id: 'b_port_2', name: 'Taverna do Marinheiro', x: 4100, y: 1240, w: 80, h: 70, roofColor: '#00cec9', wallColor: '#2d3436', type: 'house' },

  // Santuário Astral
  { id: 'b_ast_1', name: 'Torre dos Arcontes', x: 6800, y: 3900, w: 90, h: 90, roofColor: '#6c5ce7', wallColor: '#2d3436', type: 'tower' },
  { id: 'b_ast_2', name: 'Empório Astral', x: 6700, y: 4040, w: 80, h: 70, roofColor: '#a29bfe', wallColor: '#34495e', type: 'shop' },

  // Aldeia dos Caçadores
  { id: 'b_hunt_1', name: 'Chalé do Mestre Caçador', x: 1200, y: 3900, w: 90, h: 75, roofColor: '#d35400', wallColor: '#4e342e', type: 'house' },
  { id: 'b_hunt_2', name: 'Armaria Selvagem', x: 1100, y: 4040, w: 80, h: 70, roofColor: '#b71540', wallColor: '#5d4037', type: 'shop' }
];

// NPCs nas 8 Cidades
const NPCS = [
  { id: 'npc_blacksmith', name: 'Brok, o Ferreiro', icon: '🔨', x: 3920, y: 3980, radius: 28, type: 'weapons' },
  { id: 'npc_alchemist', name: 'Sylva, a Alquimista', icon: '🧪', x: 4080, y: 3980, radius: 28, type: 'potions' },
  { id: 'npc_mage', name: 'Mago Elidor', icon: '🧙‍♂️', x: 4000, y: 4110, radius: 28, type: 'powers' },
  { id: 'npc_king', name: 'Mestre das Missões', icon: '📜', x: 4000, y: 3900, radius: 28, type: 'quests' },
  { id: 'npc_druid', name: 'Druida Rowan', icon: '🌿', x: 1800, y: 1800, radius: 26, type: 'potions' },
  { id: 'npc_frost', name: 'Ferreiro Glacial', icon: '❄️', x: 6200, y: 1800, radius: 26, type: 'weapons' },
  { id: 'npc_sun', name: 'Mago do Sol', icon: '☀️', x: 1800, y: 6200, radius: 26, type: 'powers' },
  { id: 'npc_forge', name: 'Mestre da Forja', icon: '🌋', x: 6200, y: 6200, radius: 26, type: 'weapons' },
  { id: 'npc_port', name: 'Capitão dos Mares', icon: '⚓', x: 4000, y: 1200, radius: 26, type: 'potions' },
  { id: 'npc_astral', name: 'Arquimago do Cosmos', icon: '🌌', x: 6800, y: 4000, radius: 26, type: 'powers' },
  { id: 'npc_hunter', name: 'Lorde dos Caçadores', icon: '🏹', x: 1200, y: 4000, radius: 26, type: 'weapons' }
];

// Missões para Ganhar Poderes
const POWER_QUESTS = [
  { id: 'q_slam', name: '⚡ Provação do Trovão', desc: 'Derrote 2 Inimigos no mapa', target: 2, type: 'kill', rewardPower: 'power_slam', powerName: 'Pisão Sísmico [R]' },
  { id: 'q_beam', name: '🏹 Harmonia Astral', desc: 'Minere 2 Cristais de Gemas', target: 2, type: 'mine', rewardPower: 'power_beam', powerName: 'Raio Astral [F]' },
  { id: 'q_fire', name: '🔥 Fogo Ancestral', desc: 'Derrote 3 Inimigos no mapa', target: 3, type: 'kill', rewardPower: 'power_fire', powerName: 'Meteoro Flamejante [C]' },
  { id: 'q_shield', name: '🛡️ Relíquia Sagrada', desc: 'Abra 3 Baús de Tesouro', target: 3, type: 'chest', rewardPower: 'power_shield', powerName: 'Escudo Divino [V]' }
];

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

// Dados de Rede e Mundo
let socket = null;
let myId = null;
let arena = { width: 8000, height: 8000 };
let cities = CITIES;
let buildings = BUILDINGS;
let npcs = NPCS;
let shopCatalog = SHOP_CATALOG;
let selectedClass = 'warrior';
let selectedColor = '#00e5ff';
let obstacles = [];
let localPlayer = null;

// Snapshots de Entidades
let serverPlayers = new Map();
let serverBots = new Map();
let serverProjectiles = [];
let serverMineCrystals = [];
let serverBreakables = [];
let serverChests = [];
let serverOrbs = [];
let serverWorldBoss = null;
let serverSecondBoss = null;
let particles = [];
let activeSpecialEffects = [];

const camera = { x: 4000, y: 4000 };

const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
  Space: false, Shift: false,
  r: false, f: false, c: false, v: false, e: false, '1': false, '2': false
};
const mouse = { x: screenWidth / 2, y: screenHeight / 2, down: false };
let nearbyNpc = null;
let currentShopTab = 'weapons';
let respawnTimerInterval = null;

function addParticle(x, y, color, count = 6, speed = 4) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = (0.5 + Math.random()) * speed;
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      color,
      radius: 2 + Math.random() * 3,
      alpha: 1,
      decay: 0.03 + Math.random() * 0.04
    });
  }
}

// -------------------------------------------------------------
// Conexão WebSocket e Modo Offline
// -------------------------------------------------------------
let isOfflineMode = false;
let offlineSimulationInterval = null;

function connectWebSocket(customHost = null) {
  if (offlineSimulationInterval) {
    clearInterval(offlineSimulationInterval);
    offlineSimulationInterval = null;
  }

  const dot = document.getElementById('server-status-dot');
  const pingInd = document.getElementById('ping-indicator');

  let host = customHost;
  if (!host) {
    const inputVal = document.getElementById('server-address')?.value?.trim();
    if (inputVal) host = inputVal;
    else host = window.location.host;
  }

  if (!customHost && !document.getElementById('server-address')?.value?.trim() && 
      (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'))) {
    startOfflineSimulation();
    return;
  }

  if (socket) socket.close();
  if (dot) dot.innerText = '🟡 Conectando...';

  try {
    const cleanHost = host.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${cleanHost}`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      isOfflineMode = false;
      if (dot) dot.innerText = '🟢 Servidor Conectado';
      if (pingInd) pingInd.innerText = 'Ping: 1 ms (Online)';
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch (err) {}
    };

    socket.onclose = () => {
      if (!isOfflineMode) {
        if (dot) dot.innerText = '🤖 Modo Treino (Bots)';
        if (pingInd) pingInd.innerText = 'Local (Offline)';
        startOfflineSimulation();
      }
    };

    socket.onerror = () => {
      if (!isOfflineMode) startOfflineSimulation();
    };
  } catch (e) {
    startOfflineSimulation();
  }
}

// -------------------------------------------------------------
// Simulação Offline com Mundo Gigante (8000 x 8000)
// -------------------------------------------------------------
function startOfflineSimulation() {
  if (isOfflineMode) return;
  isOfflineMode = true;

  const dot = document.getElementById('server-status-dot');
  const pingInd = document.getElementById('ping-indicator');
  if (dot) dot.innerText = '🌿 8 Cidades (Offline)';
  if (pingInd) pingInd.innerText = '60 FPS (Local)';

  arena = { width: 8000, height: 8000 };
  cities = CITIES;
  buildings = BUILDINGS;
  npcs = NPCS;

  obstacles = [
    { x: 3000, y: 3000, radius: 95, type: 'rock', label: 'Pedra Ancestral' },
    { x: 5000, y: 5000, radius: 105, type: 'pillar', label: 'Ruínas Antigas' },
    { x: 3000, y: 5000, radius: 95, type: 'rock', label: 'Pico Escarpado' },
    { x: 5000, y: 3000, radius: 95, type: 'pillar', label: 'Obelisco Cósmico' }
  ];

  myId = 'local_hero';
  const cData = CHARACTER_CLASSES[selectedClass] || CHARACTER_CLASSES.warrior;

  localPlayer = {
    id: myId,
    name: document.getElementById('player-name')?.value?.trim() || 'Guilherme',
    charClass: selectedClass,
    color: cData.color,
    hairColor: cData.hairColor,
    skinColor: cData.skinColor,
    x: 4000,
    y: 4000,
    vx: 0,
    vy: 0,
    walkStep: 0,
    speed: cData.speed,
    angle: 0,
    hp: cData.baseHp,
    maxHp: cData.baseHp,
    stamina: 100,
    maxStamina: 100,
    shieldTimer: 3,
    isDead: false,
    gold: 150,
    score: 0,
    kills: 0,
    minedCount: 0,
    weapon: 'sword_starter',
    potions: { heal: 2, speed: 1 },
    powers: { slam: false, beam: false, fire: false, shield: false },
    powerCooldowns: { slam: 0, beam: 0, fire: 0, shield: 0 },
    dashCooldown: 0,
    attackCooldown: 0,
    speedBoostTimer: 0,
    inSafeZone: true,
    radius: 24,
    activeQuests: POWER_QUESTS.map(q => ({ ...q, current: 0, completed: false }))
  };
  serverPlayers.set(myId, localPlayer);

  // Spawna 45 Cristais
  serverMineCrystals = [];
  const cryColors = ['#00e5ff', '#ff4757', '#a29bfe', '#2ed573'];
  for (let i = 0; i < 45; i++) {
    const sp = getOfflineSpawnPoint();
    serverMineCrystals.push({
      id: 'cry_' + i,
      x: sp.x,
      y: sp.y,
      hp: 3,
      maxHp: 3,
      radius: 20,
      name: 'Gema Mística',
      color: cryColors[i % cryColors.length],
      gold: 70
    });
  }

  // Spawna 50 Barris
  serverBreakables = [];
  for (let i = 0; i < 50; i++) {
    const sp = getOfflineSpawnPoint();
    serverBreakables.push({
      id: 'brk_' + i,
      x: sp.x,
      y: sp.y,
      radius: 16,
      gold: 25
    });
  }

  // Spawna 40 Baús
  serverChests = [];
  for (let i = 0; i < 40; i++) {
    const sp = getOfflineSpawnPoint();
    serverChests.push({
      id: 'ch_' + i,
      x: sp.x,
      y: sp.y,
      radius: 18,
      gold: 50
    });
  }

  // Spawna 65 Orbes
  serverOrbs = [];
  for (let i = 0; i < 65; i++) {
    const sp = getOfflineSpawnPoint();
    serverOrbs.push({
      id: 'orb_' + i,
      x: sp.x,
      y: sp.y,
      type: Math.random() > 0.5 ? 'heal' : 'energy',
      value: 30,
      radius: 14
    });
  }

  // 2 Chefes do Mundo
  serverWorldBoss = {
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

  serverSecondBoss = {
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

  // 20 Bots Humanoides Espalhados pelo Mundo
  const BOT_NAMES = [
    'Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane',
    'Sentinela Kael', 'Caçador Rex', 'Guardião Thorne', 'Oráculo Zeph',
    'Lorde Malakor', 'Druida Rowan', 'Lâmina Lyra', 'Paladino Uther',
    'Cavaleiro Galahad', 'Arqueira Diana', 'Mestre Roland', 'Cavaleiro Kaelen',
    'Feiticeira Morgana', 'Lorde Alistair', 'Ranger Varis', 'Guarda Gareth'
  ];
  const clList = ['warrior', 'mage', 'ranger', 'shadow'];
  serverBots.clear();
  BOT_NAMES.forEach((bName, idx) => {
    const sp = getOfflineSpawnPoint();
    const bClass = clList[idx % clList.length];
    const bData = CHARACTER_CLASSES[bClass];

    serverBots.set('bot_' + idx, {
      id: 'bot_' + idx,
      isBot: true,
      isDead: false,
      name: bName + ' (BOT)',
      charClass: bClass,
      color: bData.color,
      hairColor: bData.hairColor,
      skinColor: bData.skinColor,
      x: sp.x,
      y: sp.y,
      vx: 0,
      vy: 0,
      walkStep: 0,
      speed: 5.5,
      angle: Math.random() * Math.PI * 2,
      hp: 110,
      maxHp: 110,
      gold: 50,
      score: 0,
      shieldTimer: 0,
      weapon: idx % 2 === 0 ? 'sword_rune' : 'sword_starter',
      radius: 24,
      dashCooldown: 0,
      attackCooldown: 0
    });
  });

  // Loop de Simulação Offline (30 FPS)
  offlineSimulationInterval = setInterval(() => {
    if (!isOfflineMode || !localPlayer) return;

    let inCity = false;
    for (const c of cities) {
      if (Math.hypot(localPlayer.x - c.x, localPlayer.y - c.y) < c.radius) {
        inCity = true; break;
      }
    }
    localPlayer.inSafeZone = inCity;
    if (localPlayer.inSafeZone && localPlayer.hp < localPlayer.maxHp && !localPlayer.isDead) {
      localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 6 / 30);
    }

    if (localPlayer.shieldTimer > 0) localPlayer.shieldTimer -= 1 / 30;
    if (localPlayer.dashCooldown > 0) localPlayer.dashCooldown -= 1 / 30;
    if (localPlayer.attackCooldown > 0) localPlayer.attackCooldown -= 1 / 30;
    if (localPlayer.stamina < 100) localPlayer.stamina = Math.min(100, localPlayer.stamina + 20 / 30);
    if (localPlayer.speedBoostTimer > 0) localPlayer.speedBoostTimer -= 1 / 30;
    if (localPlayer.powerCooldowns.slam > 0) localPlayer.powerCooldowns.slam -= 1 / 30;
    if (localPlayer.powerCooldowns.beam > 0) localPlayer.powerCooldowns.beam -= 1 / 30;
    if (localPlayer.powerCooldowns.fire > 0) localPlayer.powerCooldowns.fire -= 1 / 30;
    if (localPlayer.powerCooldowns.shield > 0) localPlayer.powerCooldowns.shield -= 1 / 30;

    // Movimentação só se não estiver morto
    if (!localPlayer.isDead) {
      let dx = 0, dy = 0;
      if (keys.w || keys.ArrowUp) dy -= 1;
      if (keys.s || keys.ArrowDown) dy += 1;
      if (keys.a || keys.ArrowLeft) dx -= 1;
      if (keys.d || keys.ArrowRight) dx += 1;

      localPlayer.angle = Math.atan2(mouse.y - screenHeight / 2, mouse.x - screenWidth / 2);

      let spd = localPlayer.speed;
      if (localPlayer.speedBoostTimer > 0) spd *= 1.45;

      if (keys.Space && localPlayer.dashCooldown <= 0 && localPlayer.stamina >= 25) {
        localPlayer.stamina -= 25;
        localPlayer.dashCooldown = 1.3;
        spd *= 3.4;
        sfx.playDash();
        addParticle(localPlayer.x, localPlayer.y, localPlayer.color, 12, 6);
        keys.Space = false;
      }

      const len = Math.hypot(dx, dy);
      if (len > 0) {
        localPlayer.walkStep += 0.28;
        const nextX = Math.max(localPlayer.radius, Math.min(arena.width - localPlayer.radius, localPlayer.x + (dx / len) * spd));
        const nextY = Math.max(localPlayer.radius, Math.min(arena.height - localPlayer.radius, localPlayer.y + (dy / len) * spd));

        let blocked = false;
        for (const b of buildings) {
          if (nextX > b.x - b.w / 2 && nextX < b.x + b.w / 2 &&
              nextY > b.y - b.h / 2 && nextY < b.y + b.h / 2) {
            blocked = true; break;
          }
        }
        if (!blocked) {
          localPlayer.x = nextX;
          localPlayer.y = nextY;
        }
      }

      // Mineração de Cristais de Gema Offline
      if (mouse.down && localPlayer.attackCooldown <= 0 && !localPlayer.inSafeZone) {
        for (let i = serverMineCrystals.length - 1; i >= 0; i--) {
          const cr = serverMineCrystals[i];
          if (Math.hypot(localPlayer.x - cr.x, localPlayer.y - cr.y) < localPlayer.radius + cr.radius + 15) {
            cr.hp--;
            localPlayer.gold += 20;
            sfx.playHit();
            addParticle(cr.x, cr.y, cr.color, 10, 5);
            if (cr.hp <= 0) {
              localPlayer.gold += cr.gold;
              localPlayer.score += 40;
              localPlayer.minedCount++;
              sfx.playCoin();
              addParticle(cr.x, cr.y, '#ffd32a', 20, 7);
              updateKillfeed([{ text: `💎 ${localPlayer.name} minerou uma Gema (+${cr.gold} 🪙)!` }]);
              checkOfflineQuestProgress('mine');
              serverMineCrystals.splice(i, 1);
            }
            break;
          }
        }
      }

      // Quebra de Barris
      for (let i = serverBreakables.length - 1; i >= 0; i--) {
        const br = serverBreakables[i];
        if (Math.hypot(localPlayer.x - br.x, localPlayer.y - br.y) < localPlayer.radius + br.radius) {
          localPlayer.gold += br.gold;
          sfx.playCoin();
          addParticle(br.x, br.y, '#e67e22', 12, 5);
          serverBreakables.splice(i, 1);
          break;
        }
      }

      // Baús
      for (let i = serverChests.length - 1; i >= 0; i--) {
        const ch = serverChests[i];
        if (Math.hypot(localPlayer.x - ch.x, localPlayer.y - ch.y) < localPlayer.radius + ch.radius) {
          localPlayer.gold += ch.gold;
          localPlayer.score += 25;
          sfx.playCoin();
          addParticle(ch.x, ch.y, '#ffd32a', 15, 6);
          updateKillfeed([{ text: `🪙 ${localPlayer.name} abriu um baú (+${ch.gold} Ouro)!` }]);
          checkOfflineQuestProgress('chest');
          serverChests.splice(i, 1);
          break;
        }
      }

      // Orbes
      for (let i = serverOrbs.length - 1; i >= 0; i--) {
        const o = serverOrbs[i];
        if (Math.hypot(localPlayer.x - o.x, localPlayer.y - o.y) < localPlayer.radius + o.radius) {
          if (o.type === 'heal') localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 30);
          else localPlayer.stamina = Math.min(100, localPlayer.stamina + 30);
          sfx.playPotion();
          serverOrbs.splice(i, 1);
          break;
        }
      }

      // Ataque
      if (mouse.down && localPlayer.attackCooldown <= 0 && !localPlayer.inSafeZone) {
        localPlayer.attackCooldown = 0.28;
        const wData = shopCatalog.weapons.find(w => w.id === localPlayer.weapon) || shopCatalog.weapons[0];
        sfx.playShoot(wData.color);

        if (wData.triple) {
          [-0.2, 0, 0.2].forEach(spr => {
            serverProjectiles.push({
              id: Math.random(),
              ownerId: localPlayer.id,
              color: wData.color,
              damage: wData.damage,
              x: localPlayer.x + Math.cos(localPlayer.angle + spr) * 30,
              y: localPlayer.y + Math.sin(localPlayer.angle + spr) * 30,
              vx: Math.cos(localPlayer.angle + spr) * 16,
              vy: Math.sin(localPlayer.angle + spr) * 16,
              lifetime: 65
            });
          });
        } else {
          serverProjectiles.push({
            id: Math.random(),
            ownerId: localPlayer.id,
            color: wData.color,
            damage: wData.damage,
            x: localPlayer.x + Math.cos(localPlayer.angle) * 30,
            y: localPlayer.y + Math.sin(localPlayer.angle) * 30,
            vx: Math.cos(localPlayer.angle) * 16,
            vy: Math.sin(localPlayer.angle) * 16,
            lifetime: 65
          });
        }
      }
    }

    // Chefes do Mundo
    const bosses = [serverWorldBoss, serverSecondBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0) {
        const dToBoss = Math.hypot(localPlayer.x - boss.x, localPlayer.y - boss.y);
        if (dToBoss < 850 && !localPlayer.inSafeZone && !localPlayer.isDead) {
          boss.angle = Math.atan2(localPlayer.y - boss.y, localPlayer.x - boss.x);
          boss.x += Math.cos(boss.angle) * boss.speed;
          boss.y += Math.sin(boss.angle) * boss.speed;

          if (dToBoss < 140 && localPlayer.shieldTimer <= 0) {
            localPlayer.hp = Math.max(0, localPlayer.hp - 35);
            sfx.playSlam();
            addParticle(boss.x, boss.y, boss.color, 15, 6);
            if (localPlayer.hp <= 0) triggerOfflineDeath();
          }
        }
      }
    }

    // Bots IA Humanoides
    for (const b of serverBots.values()) {
      if (b.hp <= 0 || b.isDead) continue;
      b.walkStep = (b.walkStep || 0) + 0.22;

      let bInCity = false;
      for (const c of cities) {
        if (Math.hypot(b.x - c.x, b.y - c.y) < c.radius) { bInCity = true; break; }
      }
      b.inSafeZone = bInCity;

      const dToPlayer = Math.hypot(localPlayer.x - b.x, localPlayer.y - b.y);
      if (dToPlayer < 850 && !localPlayer.inSafeZone && !localPlayer.isDead && !b.inSafeZone) {
        b.angle = Math.atan2(localPlayer.y - b.y, localPlayer.x - b.x);
        if (dToPlayer > 260) {
          b.x += Math.cos(b.angle) * b.speed;
          b.y += Math.sin(b.angle) * b.speed;
        } else {
          b.x += Math.cos(b.angle + Math.PI / 2) * b.speed;
          b.y += Math.sin(b.angle + Math.PI / 2) * b.speed;
        }

        if (Math.random() < 0.05 && (!b.attackCooldown || b.attackCooldown <= 0)) {
          b.attackCooldown = 0.5;
          serverProjectiles.push({
            id: Math.random(),
            ownerId: b.id,
            color: b.color,
            damage: 22,
            x: b.x + Math.cos(b.angle) * 30,
            y: b.y + Math.sin(b.angle) * 30,
            vx: Math.cos(b.angle) * 15,
            vy: Math.sin(b.angle) * 15,
            lifetime: 65
          });
        }
      } else {
        b.x += Math.cos(b.angle) * (b.speed * 0.4);
        b.y += Math.sin(b.angle) * (b.speed * 0.4);
        if (Math.random() < 0.02) b.angle += (Math.random() - 0.5) * 1.5;
      }
      if (b.attackCooldown > 0) b.attackCooldown -= 1 / 30;
    }

    // Projéteis Offline
    for (let i = serverProjectiles.length - 1; i >= 0; i--) {
      const pr = serverProjectiles[i];
      pr.x += pr.vx; pr.y += pr.vy; pr.lifetime--;

      let hit = false;
      if (pr.x < 0 || pr.x > arena.width || pr.y < 0 || pr.y > arena.height || pr.lifetime <= 0) hit = true;

      for (const c of cities) {
        if (Math.hypot(pr.x - c.x, pr.y - c.y) < c.radius) { hit = true; break; }
      }

      if (!hit) {
        for (const boss of bosses) {
          if (boss && boss.hp > 0 && Math.hypot(pr.x - boss.x, pr.y - boss.y) < boss.radius + 6) {
            hit = true;
            boss.hp -= pr.damage;
            sfx.playHit();
            addParticle(pr.x, pr.y, boss.color, 10, 5);
            if (boss.hp <= 0) {
              localPlayer.gold += 300;
              localPlayer.score += 600;
              localPlayer.powers.slam = true;
              localPlayer.powers.beam = true;
              sfx.playCoin();
              updateKillfeed([{ text: `👑 ${localPlayer.name} derrotou o ${boss.name.toUpperCase()} (+300 🪙)!` }]);
              boss.hp = 0;
            }
            break;
          }
        }
      }

      if (!hit) {
        if (pr.ownerId !== localPlayer.id && !localPlayer.inSafeZone && !localPlayer.isDead && localPlayer.shieldTimer <= 0 &&
            Math.hypot(pr.x - localPlayer.x, pr.y - localPlayer.y) < localPlayer.radius + 6) {
          hit = true;
          localPlayer.hp = Math.max(0, localPlayer.hp - pr.damage);
          sfx.playHit();
          addParticle(pr.x, pr.y, pr.color, 8, 5);
          if (localPlayer.hp <= 0) {
            triggerOfflineDeath();
          }
        }

        for (const b of serverBots.values()) {
          if (pr.ownerId !== b.id && b.hp > 0 && !b.isDead && !b.inSafeZone && Math.hypot(pr.x - b.x, pr.y - b.y) < b.radius + 6) {
            hit = true;
            b.hp -= pr.damage;
            sfx.playHit();
            addParticle(pr.x, pr.y, pr.color, 8, 5);
            if (b.hp <= 0) {
              b.hp = 0;
              b.isDead = true;
              localPlayer.score += 100;
              localPlayer.gold += 70;
              sfx.playCoin();
              updateKillfeed([{ text: `⚡ ${localPlayer.name} derrotou ${b.name} (+70 🪙)!` }]);
              checkOfflineQuestProgress('kill');
              setTimeout(() => {
                const sp = getOfflineSpawnPoint();
                b.hp = b.maxHp;
                b.isDead = false;
                b.shieldTimer = 3;
                b.x = sp.x;
                b.y = sp.y;
              }, 3000);
            }
            break;
          }
        }
      }
      if (hit) serverProjectiles.splice(i, 1);
    }

    updateHUD(localPlayer);
    updateLeaderboard();
  }, 1000 / 30);
}

// -------------------------------------------------------------
// Sistema de Morte e Renascimento (SEM FICAR INVISÍVEL!)
// -------------------------------------------------------------
function triggerOfflineDeath() {
  if (localPlayer.isDead) return;
  localPlayer.isDead = true;
  localPlayer.hp = 0;
  sfx.playDefeat();

  // Exibe a tela de Morte com contagem regressiva
  const overlay = document.getElementById('death-overlay');
  const countEl = document.getElementById('death-countdown');
  let timeLeft = 3;
  if (overlay) overlay.style.display = 'flex';
  if (countEl) countEl.innerText = timeLeft;

  if (respawnTimerInterval) clearInterval(respawnTimerInterval);
  respawnTimerInterval = setInterval(() => {
    timeLeft--;
    if (countEl) countEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(respawnTimerInterval);
      respawnTimerInterval = null;
      respawnOfflinePlayer();
    }
  }, 1000);
}

function respawnOfflinePlayer() {
  const overlay = document.getElementById('death-overlay');
  if (overlay) overlay.style.display = 'none';

  // Renasce na Capital Central (4000, 4000)
  localPlayer.x = 4000 + (Math.random() - 0.5) * 80;
  localPlayer.y = 4000 + (Math.random() - 0.5) * 80;
  localPlayer.hp = localPlayer.maxHp;
  localPlayer.stamina = localPlayer.maxStamina;
  localPlayer.isDead = false;
  localPlayer.shieldTimer = 3; // 3 segundos de invulnerabilidade

  sfx.playRespawn();
  addParticle(localPlayer.x, localPlayer.y, '#ffd32a', 30, 8);
  updateKillfeed([{ text: `✨ ${localPlayer.name} renasceu na Cidade Real!` }]);
}

function getOfflineSpawnPoint() {
  for (let attempt = 0; attempt < 40; attempt++) {
    const x = 500 + Math.random() * (arena.width - 1000);
    const y = 500 + Math.random() * (arena.height - 1000);
    let inCity = false;
    for (const c of cities) {
      if (Math.hypot(x - c.x, y - c.y) < c.radius + 120) { inCity = true; break; }
    }
    if (!inCity) return { x, y };
  }
  return { x: 4000 + (Math.random() - 0.5) * 1000, y: 4000 + (Math.random() - 0.5) * 1000 };
}

function checkOfflineQuestProgress(actionType) {
  if (!localPlayer || !localPlayer.activeQuests) return;
  for (const q of localPlayer.activeQuests) {
    if (!q.completed && q.type === actionType) {
      q.current++;
      if (q.current >= q.target) {
        q.completed = true;
        const pKey = q.rewardPower.replace('power_', '');
        localPlayer.powers[pKey] = true;
        sfx.playCoin();
        updateKillfeed([{ text: `✨ MISSÃO CONCLUÍDA: ${q.name}! Desbloqueado: ${q.powerName}!` }]);
      }
    }
  }
  renderQuestsList();
}

function handleServerMessage(msg) {
  if (msg.type === 'welcome') {
    myId = msg.id;
    arena = msg.arena || arena;
    cities = msg.cities || cities;
    buildings = msg.buildings || buildings;
    npcs = msg.npcs || npcs;
    shopCatalog = msg.catalog || shopCatalog;
    obstacles = msg.obstacles || obstacles;
    localPlayer = msg.player;
    renderQuestsList();
  } else if (msg.type === 'state') {
    serverPlayers.clear();
    for (const p of msg.players) {
      serverPlayers.set(p.id, p);
      if (p.id === myId) {
        localPlayer = p;
        updateHUD(p);
      }
    }

    serverBots.clear();
    for (const b of msg.bots) serverBots.set(b.id, b);

    serverProjectiles = msg.projectiles;
    serverMineCrystals = msg.mineCrystals || [];
    serverBreakables = msg.breakables || [];
    serverChests = msg.chests || [];
    serverOrbs = msg.orbs || [];
    serverWorldBoss = msg.worldBoss || null;
    serverSecondBoss = msg.secondBoss || null;

    updateLeaderboard();
  } else if (msg.type === 'you_died') {
    sfx.playDefeat();
    const overlay = document.getElementById('death-overlay');
    const countEl = document.getElementById('death-countdown');
    if (overlay) overlay.style.display = 'flex';
    let tl = msg.countdown || 3;
    if (countEl) countEl.innerText = tl;

    if (respawnTimerInterval) clearInterval(respawnTimerInterval);
    respawnTimerInterval = setInterval(() => {
      tl--;
      if (countEl) countEl.innerText = tl;
      if (tl <= 0) clearInterval(respawnTimerInterval);
    }, 1000);
  } else if (msg.type === 'you_respawned') {
    const overlay = document.getElementById('death-overlay');
    if (overlay) overlay.style.display = 'none';
    sfx.playRespawn();
  } else if (msg.type === 'killfeed') {
    updateKillfeed(msg.feed);
  } else if (msg.type === 'power_unlocked') {
    sfx.playCoin();
    updateKillfeed([{ text: msg.text }]);
    renderQuestsList();
  } else if (msg.type === 'chat') {
    addChatMessage(msg.sender, msg.color, msg.text);
  } else if (msg.type === 'hit') {
    sfx.playHit();
    addParticle(msg.x, msg.y, msg.color || '#ff4757', 8, 5);
  } else if (msg.type === 'effect') {
    if (msg.name === 'dash') {
      sfx.playDash();
      addParticle(msg.x, msg.y, msg.color || '#00e5ff', 12, 6);
    } else if (msg.name === 'heal') {
      sfx.playPotion();
      addParticle(msg.x, msg.y, '#2ed573', 15, 6);
    } else if (msg.name === 'speed_boost') {
      sfx.playPotion();
      addParticle(msg.x, msg.y, '#ffd32a', 15, 7);
    } else if (msg.name === 'shield_up' || msg.name === 'resurrection') {
      sfx.playShield();
      addParticle(msg.x, msg.y, '#00e5ff', 24, 7);
    } else if (msg.name === 'seismic_slam') {
      sfx.playSlam();
      activeSpecialEffects.push({
        type: 'slam_wave',
        x: msg.x,
        y: msg.y,
        radius: 10,
        maxRadius: msg.radius || 210,
        color: msg.color || '#ffd32a',
        alpha: 1
      });
    } else if (msg.name === 'astral_beam') {
      sfx.playBeam();
      activeSpecialEffects.push({
        type: 'laser_beam',
        x1: msg.x1,
        y1: msg.y1,
        x2: msg.x2,
        y2: msg.y2,
        color: msg.color || '#00e5ff',
        alpha: 1
      });
    }
  } else if (msg.type === 'inventory_update') {
    if (localPlayer) {
      localPlayer.gold = msg.gold;
      localPlayer.weapon = msg.weapon;
      localPlayer.potions = msg.potions;
      localPlayer.powers = msg.powers;
      updateHUD(localPlayer);
      renderShopItems();
      renderQuestsList();
    }
  }
}

// -------------------------------------------------------------
// Envio Periódico de Entrada
// -------------------------------------------------------------
function sendInput() {
  if (!socket || socket.readyState !== WebSocket.OPEN || !localPlayer) return;

  const angle = Math.atan2(mouse.y - screenHeight / 2, mouse.x - screenWidth / 2);
  socket.send(JSON.stringify({
    type: 'input',
    input: {
      up: keys.w || keys.ArrowUp,
      down: keys.s || keys.ArrowDown,
      left: keys.a || keys.ArrowLeft,
      right: keys.d || keys.ArrowRight,
      attack: mouse.down && !localPlayer.isDead,
      dash: (keys.Space || keys.Shift) && !localPlayer.isDead,
      powerSlam: keys.r,
      powerBeam: keys.f,
      powerFire: keys.c,
      powerShield: keys.v,
      useHeal: keys['1'],
      useSpeed: keys['2'],
      angle: angle
    }
  }));

  if (keys.Space) keys.Space = false;
  if (keys.r) keys.r = false;
  if (keys.f) keys.f = false;
  if (keys.c) keys.c = false;
  if (keys.v) keys.v = false;
  if (keys['1']) keys['1'] = false;
  if (keys['2']) keys['2'] = false;
}
setInterval(sendInput, 1000 / 30);

// -------------------------------------------------------------
// Atualização de HUD
// -------------------------------------------------------------
function updateHUD(player) {
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const staminaPercent = Math.max(0, Math.min(100, (player.stamina / 100) * 100));

  document.getElementById('hp-bar').style.width = `${hpPercent}%`;
  document.getElementById('hp-val').innerText = `${Math.round(player.hp)} / ${player.maxHp}`;
  document.getElementById('stamina-bar').style.width = `${staminaPercent}%`;
  document.getElementById('stamina-val').innerText = `${Math.round(player.stamina)} / 100`;

  document.getElementById('gold-val').innerText = player.gold || 0;

  const banner = document.getElementById('safe-zone-banner');
  if (banner) banner.style.display = player.inSafeZone ? 'block' : 'none';

  // Barra do Chefe
  const bossBar = document.getElementById('boss-hud-bar');
  const bossFill = document.getElementById('boss-hp-fill');
  const bossVal = document.getElementById('boss-hp-val');
  const activeBoss = (serverWorldBoss && serverWorldBoss.hp > 0) ? serverWorldBoss : ((serverSecondBoss && serverSecondBoss.hp > 0) ? serverSecondBoss : null);
  if (activeBoss) {
    bossBar.style.display = 'block';
    const bRatio = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
    bossFill.style.width = `${bRatio}%`;
    bossVal.innerText = `${Math.round(activeBoss.hp)} / ${activeBoss.maxHp}`;
    document.getElementById('boss-name').innerText = activeBoss.name;
  } else {
    bossBar.style.display = 'none';
  }

  // Rastreador da Missão Atual
  const curQuest = (player.activeQuests || POWER_QUESTS).find(q => !q.completed) || (player.activeQuests || POWER_QUESTS)[0];
  if (curQuest) {
    document.getElementById('quest-desc').innerText = `${curQuest.name} (${curQuest.current || 0}/${curQuest.target})`;
    document.querySelector('.quest-reward').innerText = `Recompensa: ✨ ${curQuest.powerName || 'Super Poder'}`;
  }

  document.getElementById('count-heal-pot').innerText = player.potions?.heal || 0;
  document.getElementById('count-speed-pot').innerText = player.potions?.speed || 0;

  // Slots de Poderes
  updatePowerSlot('slot-power-slam', 'cd-slam', player.powers?.slam, player.powerCooldowns?.slam);
  updatePowerSlot('slot-power-beam', 'cd-beam', player.powers?.beam, player.powerCooldowns?.beam);
  updatePowerSlot('slot-power-fire', 'cd-fire', player.powers?.fire, player.powerCooldowns?.fire);
  updatePowerSlot('slot-power-shield', 'cd-shield', player.powers?.shield, player.powerCooldowns?.shield);

  checkNpcProximity(player);
}

function updatePowerSlot(slotId, cdId, isUnlocked, cdTime) {
  const slot = document.getElementById(slotId);
  const cdEl = document.getElementById(cdId);
  if (!slot || !cdEl) return;

  if (isUnlocked) {
    slot.classList.remove('locked');
    if (cdTime > 0) {
      cdEl.style.display = 'flex';
      cdEl.innerText = Math.ceil(cdTime) + 's';
    } else {
      cdEl.style.display = 'none';
    }
  } else {
    slot.classList.add('locked');
    cdEl.style.display = 'none';
  }
}

function checkNpcProximity(player) {
  let found = null;
  for (const npc of npcs) {
    if (Math.hypot(player.x - npc.x, player.y - npc.y) < 85) {
      found = npc;
      break;
    }
  }
  nearbyNpc = found;
  const promptEl = document.getElementById('npc-interact-prompt');
  if (found) {
    promptEl.style.display = 'block';
    promptEl.innerHTML = `💬 [E] Falar com <b>${found.name}</b>`;
  } else {
    promptEl.style.display = 'none';
  }
}

// -------------------------------------------------------------
// Modal de Missões de Poderes
// -------------------------------------------------------------
function openQuestsModal() {
  renderQuestsList();
  document.getElementById('quests-modal').style.display = 'flex';
}

function closeQuestsModal() {
  document.getElementById('quests-modal').style.display = 'none';
}

function renderQuestsList() {
  const container = document.getElementById('quests-list-container');
  if (!container) return;
  container.innerHTML = '';

  const quests = localPlayer?.activeQuests || POWER_QUESTS;

  quests.forEach(q => {
    const card = document.createElement('div');
    const isCompleted = q.completed || (localPlayer?.powers && localPlayer.powers[q.rewardPower.replace('power_', '')]);
    card.className = 'quest-card' + (isCompleted ? ' completed' : '');

    const current = Math.min(q.target, q.current || (isCompleted ? q.target : 0));
    const percent = Math.min(100, Math.round((current / q.target) * 100));

    card.innerHTML = `
      <div class="quest-card-info">
        <h4>${q.name}</h4>
        <p>${q.desc}</p>
        <span class="quest-card-reward">Recompensa: ✨ Desbloqueia ${q.powerName}</span>
      </div>
      <div class="quest-card-status">
        ${isCompleted ? `
          <span class="quest-badge-done">✨ PODER DESBLOQUEADO</span>
        ` : `
          <div class="quest-progress-bar-bg">
            <div class="quest-progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="quest-status-text">${current} / ${q.target} (${percent}%)</span>
        `}
      </div>
    `;
    container.appendChild(card);
  });
}

// -------------------------------------------------------------
// Loja
// -------------------------------------------------------------
function openShop(npc = null) {
  const modal = document.getElementById('shop-modal');
  const title = document.getElementById('shop-npc-title');
  if (npc) {
    title.innerHTML = `${npc.icon} ${npc.name}`;
    if (npc.type === 'quests') {
      openQuestsModal();
      return;
    }
    currentShopTab = npc.type;
  }
  document.querySelectorAll('.shop-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === currentShopTab);
  });
  renderShopItems();
  modal.style.display = 'flex';
}

function closeShop() {
  document.getElementById('shop-modal').style.display = 'none';
}

function renderShopItems() {
  const container = document.getElementById('shop-items-container');
  container.innerHTML = '';
  const items = shopCatalog[currentShopTab] || [];

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-item-card';

    let isOwned = false;
    if (currentShopTab === 'weapons' && localPlayer?.weapon === item.id) isOwned = true;
    if (currentShopTab === 'powers' && localPlayer?.powers && localPlayer.powers[item.id.replace('power_', '')]) isOwned = true;

    card.innerHTML = `
      <div class="shop-item-info">
        <h4>${item.icon || '⚔️'} ${item.name}</h4>
        <p>${item.desc}</p>
      </div>
      <button class="btn-buy-item ${isOwned ? 'owned' : ''}" data-id="${item.id}" data-category="${currentShopTab}">
        ${isOwned ? 'DOMINADO' : `🪙 ${item.cost} Ouro`}
      </button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.btn-buy-item:not(.owned)').forEach(btn => {
    btn.addEventListener('click', () => buyItem(btn.dataset.category, btn.dataset.id));
  });
}

function buyItem(category, itemId) {
  const item = shopCatalog[category]?.find(it => it.id === itemId);
  if (!item || !localPlayer) return;

  if (localPlayer.gold < item.cost) {
    alert('Ouro insuficiente! Explore o grande mundo, derrote inimigos, abra baús e minere gemas para enriquecer!');
    return;
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'buy_item', category, itemId }));
  } else {
    localPlayer.gold -= item.cost;
    sfx.playCoin();
    if (category === 'weapons') localPlayer.weapon = item.id;
    if (category === 'potions') {
      if (itemId === 'potion_heal') localPlayer.potions.heal++;
      if (itemId === 'potion_speed') localPlayer.potions.speed++;
    }
    if (category === 'powers') {
      const pKey = itemId.replace('power_', '');
      localPlayer.powers[pKey] = true;
    }
    updateHUD(localPlayer);
    renderShopItems();
    renderQuestsList();
  }
}

// -------------------------------------------------------------
// Renderização do Jogo
// -------------------------------------------------------------
function render() {
  requestAnimationFrame(render);

  if (localPlayer) {
    camera.x += (localPlayer.x - camera.x) * 0.12;
    camera.y += (localPlayer.y - camera.y) * 0.12;
  }

  ctx.clearRect(0, 0, screenWidth, screenHeight);

  ctx.save();
  ctx.translate(screenWidth / 2 - camera.x, screenHeight / 2 - camera.y);

  // 1. Cenário de Grama Verde & Estradas
  drawWorldBackground();

  // 2. As 8 Cidades e seus Prédios
  drawCitiesAndBuildings();

  // 3. Orbes Sagrados
  for (const orb of serverOrbs) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fillStyle = orb.type === 'heal' ? '#2ed573' : '#00e5ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }

  // 4. Cristais de Gemas Mineráveis
  for (const cr of serverMineCrystals) {
    drawCrystal(cr);
  }

  // 5. Barris e Caixas Destrutíveis
  for (const br of serverBreakables) {
    drawBreakable(br);
  }

  // 6. Baús de Tesouro
  for (const ch of serverChests) {
    drawChest(ch);
  }

  // 7. Obstáculos do Mundo
  for (const obs of obstacles) {
    drawObstacle(obs);
  }

  // 8. Chefes Titânicos
  if (serverWorldBoss && serverWorldBoss.hp > 0) drawBoss(serverWorldBoss);
  if (serverSecondBoss && serverSecondBoss.hp > 0) drawBoss(serverSecondBoss);

  // 9. NPCs das 8 Cidades
  for (const npc of npcs) {
    drawNpc(npc);
  }

  // 10. Efeitos Especiais de Poderes
  drawSpecialEffects();

  // 11. Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
    if (p.alpha <= 0) { particles.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  // 12. Projéteis Mágicos
  for (const pr of serverProjectiles) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = pr.color || '#00e5ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  // 13. Jogador e Bots desenhados como PESSOAS (Com pose de derrotado se morrer!)
  for (const bot of serverBots.values()) drawCharacter(bot);
  for (const player of serverPlayers.values()) drawCharacter(player);

  ctx.restore();

  drawMinimap();
}

// -------------------------------------------------------------
// Desenho do Cenário de Grama Viva (Vasta Natureza 8000x8000)
// -------------------------------------------------------------
function drawWorldBackground() {
  const tileSize = 200;
  const startX = Math.max(0, Math.floor((camera.x - screenWidth / 2) / tileSize) * tileSize);
  const endX = Math.min(arena.width, Math.ceil((camera.x + screenWidth / 2) / tileSize) * tileSize);
  const startY = Math.max(0, Math.floor((camera.y - screenHeight / 2) / tileSize) * tileSize);
  const endY = Math.min(arena.height, Math.ceil((camera.y + screenHeight / 2) / tileSize) * tileSize);

  // Fundo Verde Grama Base
  for (let x = startX; x <= endX; x += tileSize) {
    for (let y = startY; y <= endY; y += tileSize) {
      const tileHash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const shade = Math.floor(Math.abs(tileHash) % 3);

      if (shade === 0) ctx.fillStyle = '#2e7d32';
      else if (shade === 1) ctx.fillStyle = '#388e3c';
      else ctx.fillStyle = '#43a047';

      ctx.fillRect(x, y, tileSize, tileSize);

      // Decorações de grama e florzinhas
      const decoType = Math.floor(Math.abs(tileHash * 10) % 5);
      if (decoType === 1) {
        ctx.fillStyle = '#1b5e20';
        ctx.fillRect(x + 50, y + 40, 4, 10);
        ctx.fillRect(x + 56, y + 36, 4, 14);
        ctx.fillRect(x + 62, y + 42, 4, 8);
      } else if (decoType === 2) {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(x + 120, y + 80, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(x + 120, y + 80, 2, 0, Math.PI * 2); ctx.fill();
      } else if (decoType === 3) {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(x + 70, y + 140, 3.5, 0, Math.PI * 2); ctx.fill();
      } else if (decoType === 4) {
        ctx.fillStyle = '#00d2d3';
        ctx.beginPath(); ctx.arc(x + 150, y + 130, 3.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // Rede de Rodovias / Caminhos de Terra Conectando as 8 Cidades
  ctx.save();
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 44;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  // Da Capital (4000, 4000) para cada uma das outras 7 cidades
  const roads = [
    [4000, 4000, 1800, 1800], // Para Bosques
    [4000, 4000, 6200, 1800], // Para Lago
    [4000, 4000, 1800, 6200], // Para Oásis
    [4000, 4000, 6200, 6200], // Para Forja
    [4000, 4000, 4000, 1200], // Para Porto
    [4000, 4000, 6800, 4000], // Para Santuário
    [4000, 4000, 1200, 4000], // Para Caçadores
    // Rodovia Perimetral entre as vilas
    [1800, 1800, 4000, 1200],
    [4000, 1200, 6200, 1800],
    [6200, 1800, 6800, 4000],
    [6800, 4000, 6200, 6200],
    [1800, 1800, 1200, 4000],
    [1200, 4000, 1800, 6200]
  ];
  roads.forEach(r => {
    ctx.moveTo(r[0], r[1]);
    ctx.lineTo(r[2], r[3]);
  });
  ctx.stroke();

  ctx.strokeStyle = '#a1887f';
  ctx.lineWidth = 26;
  ctx.stroke();
  ctx.restore();

  // Grande Lago Glacial perto da Vila do Lago (6200, 2200)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(6200, 2200, 320, 220, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#2980b9';
  ctx.fill();
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();

  // Borda do Grande Mundo
  ctx.strokeStyle = '#34495e';
  ctx.lineWidth = 20;
  ctx.strokeRect(0, 0, arena.width, arena.height);
}

// -------------------------------------------------------------
// Desenho das 8 Cidades e seus Edifícios
// -------------------------------------------------------------
function drawCitiesAndBuildings() {
  for (const c of cities) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    if (c.theme === 'forest') ctx.fillStyle = 'rgba(46, 125, 50, 0.65)';
    else if (c.theme === 'lake') ctx.fillStyle = 'rgba(41, 128, 185, 0.55)';
    else if (c.theme === 'desert') ctx.fillStyle = 'rgba(211, 84, 0, 0.5)';
    else if (c.theme === 'forge') ctx.fillStyle = 'rgba(192, 57, 43, 0.55)';
    else if (c.theme === 'port') ctx.fillStyle = 'rgba(9, 132, 227, 0.55)';
    else if (c.theme === 'astral') ctx.fillStyle = 'rgba(108, 92, 231, 0.55)';
    else if (c.theme === 'hunter') ctx.fillStyle = 'rgba(211, 84, 0, 0.55)';
    else ctx.fillStyle = 'rgba(52, 73, 94, 0.7)'; // Capital
    ctx.fill();

    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#2ed573';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(c.x, c.y, 44, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 13px Segoe UI, sans-serif';
    ctx.fillStyle = '#2ed573';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️ ' + c.name, c.x, c.y - c.radius + 28);
    ctx.restore();
  }

  // Prédios
  for (const b of buildings) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(b.x - b.w / 2 + 6, b.y - b.h / 2 + 6, b.w, b.h);

    ctx.fillStyle = b.wallColor;
    ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);

    ctx.fillStyle = b.roofColor;
    ctx.fillRect(b.x - b.w / 2 - 4, b.y - b.h / 2 - 4, b.w + 8, b.h * 0.45);

    ctx.fillStyle = '#ffd32a';
    ctx.fillRect(b.x - b.w / 4 - 6, b.y - b.h / 4, 12, 12);
    ctx.fillRect(b.x + b.w / 4 - 6, b.y - b.h / 4, 12, 12);

    ctx.fillStyle = '#1e272e';
    ctx.fillRect(b.x - 10, b.y + b.h / 2 - 18, 20, 18);

    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(b.name, b.x, b.y - b.h / 2 - 8);
    ctx.restore();
  }
}

// -------------------------------------------------------------
// Desenho de Personagens Humanoides (SEM FICAR INVISÍVEL!)
// -------------------------------------------------------------
function drawCharacter(ent) {
  ctx.save();
  ctx.translate(ent.x, ent.y);

  // SE ESTIVER MORTO: NUNCA FICAR INVISÍVEL!
  // Desenha o guerreiro caído com lápide e alma etérea
  if (ent.isDead || ent.hp <= 0) {
    ctx.save();
    // Pose caída no chão (inclinado)
    ctx.rotate(Math.PI * 0.45);
    ctx.globalAlpha = 0.75;

    // Sombra do guerreiro caído
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Corpo caído
    ctx.fillStyle = ent.color || '#ff4757';
    ctx.roundRect(-12, -8, 18, 16, 4);
    ctx.fill();

    // Cabeça com olhos fechados (descansando)
    ctx.beginPath();
    ctx.arc(10, 0, 9, 0, Math.PI * 2);
    ctx.fillStyle = ent.skinColor || '#ffdcb4';
    ctx.fill();
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(11, -3, 3, 1);
    ctx.fillRect(11, 2, 3, 1);
    ctx.restore();

    // Lápide sagrada e alma flutuando
    ctx.font = '24px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪦', 0, -10);

    // Efeito de alma/espírito
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.fillStyle = '#ffd32a';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText('💀 [Descansando...]', 0, -32);
    ctx.fillText(ent.name, 0, -44);

    ctx.restore();
    return;
  }

  // --- PERSONAGEM VIVO ---
  // 1. Sombra nos Pés
  ctx.beginPath();
  ctx.ellipse(0, 14, 16, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();

  // Escudo Divino ou Proteção de Renascimento
  if (ent.shieldTimer > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();
  }

  // 2. Pernas Animadas Andando
  const walkStep = ent.walkStep || 0;
  const legCycle = Math.sin(walkStep) * 8;

  ctx.save();
  ctx.rotate(ent.angle);

  // Perna Esquerda e Bota
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(-10, -12 + legCycle, 6, 12);
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(-11, -2 + legCycle, 8, 5);

  // Perna Direita e Bota
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(-10, 2 - legCycle, 6, 12);
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(-11, 10 - legCycle, 8, 5);

  // 3. Tronco e Túnica
  ctx.fillStyle = ent.color || '#ff4757';
  ctx.beginPath();
  ctx.roundRect(-12, -10, 18, 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cinto
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(-6, -10, 4, 20);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(-6, -3, 4, 6);

  // 4. Braços e Mãos
  const skin = ent.skinColor || '#ffdcb4';
  ctx.fillStyle = ent.color || '#ff4757';
  ctx.fillRect(0, -14, 8, 6);
  ctx.fillStyle = skin;
  ctx.fillRect(6, -14, 5, 5);

  ctx.fillStyle = ent.color || '#ff4757';
  ctx.fillRect(0, 8, 12, 6);
  ctx.fillStyle = skin;
  ctx.fillRect(10, 8, 5, 5);

  // 5. Arma Equipada
  drawWeaponSprite(ent.weapon || 'sword_starter', ent.charClass);

  // 6. Cabeça e Rosto
  ctx.beginPath();
  ctx.arc(-2, 0, 11, 0, Math.PI * 2);
  ctx.fillStyle = skin;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-4, 0, 11, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fillStyle = ent.hairColor || '#2c3e50';
  ctx.fill();

  // Olhos Olhando na Direção do Alvo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(3, -5, 4, 3);
  ctx.fillRect(3, 2, 4, 3);
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(5, -4, 2, 2);
  ctx.fillRect(5, 3, 2, 2);

  ctx.restore();

  // 7. Barra de Vida e Nome
  const barWidth = 46;
  const barHeight = 5;
  const hpRatio = Math.max(0, ent.hp / ent.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(-barWidth / 2, -32, barWidth, barHeight);
  ctx.fillStyle = ent.isBot ? '#ffa502' : '#2ed573';
  ctx.fillRect(-barWidth / 2, -32, barWidth * hpRatio, barHeight);

  ctx.font = 'bold 11px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = ent.id === myId ? '#ffd32a' : '#ffffff';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 4;
  const clIcons = { warrior: '🗡️', mage: '🧙‍♂️', ranger: '🏹', shadow: '🥷' };
  const icon = clIcons[ent.charClass] || '⚔️';
  ctx.fillText(`${icon} ${ent.name}`, 0, -38);

  ctx.restore();
}

function drawWeaponSprite(weaponId, charClass) {
  if (weaponId === 'sword_fire') {
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(14, 8, 22, 5);
    ctx.fillStyle = '#ffd32a';
    ctx.fillRect(14, 7, 6, 7);
  } else if (weaponId === 'staff_astral') {
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(10, 8, 24, 4);
    ctx.beginPath();
    ctx.arc(36, 10, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd32a';
    ctx.shadowColor = '#ffd32a';
    ctx.shadowBlur = 10;
    ctx.fill();
  } else if (weaponId === 'sword_rune') {
    ctx.fillStyle = '#ced6e0';
    ctx.fillRect(14, 9, 20, 4);
    ctx.fillStyle = '#a29bfe';
    ctx.fillRect(14, 8, 4, 6);
  } else {
    ctx.fillStyle = '#747d8c';
    ctx.fillRect(14, 9, 18, 4);
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(14, 8, 3, 6);
  }
}

// -------------------------------------------------------------
// Desenho de Elementos do Mundo
// -------------------------------------------------------------
function drawCrystal(cr) {
  ctx.save();
  ctx.translate(cr.x, cr.y);
  ctx.beginPath();
  ctx.arc(0, 0, cr.radius, 0, Math.PI * 2);
  ctx.fillStyle = cr.color;
  ctx.shadowColor = cr.color;
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.font = '18px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💎', 0, 0);
  ctx.font = 'bold 9px Segoe UI, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`[${cr.hp}/${cr.maxHp}]`, 0, -22);
  ctx.restore();
}

function drawBreakable(br) {
  ctx.save();
  ctx.translate(br.x, br.y);
  ctx.font = '20px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📦', 0, 0);
  ctx.restore();
}

function drawChest(ch) {
  ctx.save();
  ctx.translate(ch.x, ch.y);
  ctx.font = '22px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🪙', 0, 0);
  ctx.font = 'bold 10px Segoe UI, sans-serif';
  ctx.fillStyle = '#ffd32a';
  ctx.fillText('Baú', 0, -20);
  ctx.restore();
}

function drawBoss(boss) {
  ctx.save();
  ctx.translate(boss.x, boss.y);
  ctx.beginPath();
  ctx.arc(0, 8, boss.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, boss.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#3e2723';
  ctx.strokeStyle = boss.color || '#e67e22';
  ctx.lineWidth = 5;
  ctx.shadowColor = boss.color || '#e67e22';
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = '#ffd32a';
  ctx.fillRect(-16, -12, 10, 8);
  ctx.fillRect(6, -12, 10, 8);
  ctx.font = 'bold 14px Segoe UI, sans-serif';
  ctx.fillStyle = boss.color || '#e67e22';
  ctx.textAlign = 'center';
  ctx.fillText(boss.name, 0, -70);
  ctx.restore();
}

function drawNpc(npc) {
  ctx.save();
  ctx.translate(npc.x, npc.y);
  ctx.beginPath();
  ctx.arc(0, 0, npc.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#1e272e';
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fill();
  ctx.font = '18px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(npc.icon, 0, -2);
  ctx.font = 'bold 11px Segoe UI, sans-serif';
  ctx.fillStyle = '#ffd32a';
  ctx.fillText(npc.name, 0, -32);
  ctx.restore();
}

function drawSpecialEffects() {
  for (let i = activeSpecialEffects.length - 1; i >= 0; i--) {
    const fx = activeSpecialEffects[i];
    if (fx.type === 'slam_wave') {
      fx.radius += 12;
      fx.alpha -= 0.05;
      if (fx.alpha <= 0) { activeSpecialEffects.splice(i, 1); continue; }
      ctx.save();
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
      ctx.strokeStyle = fx.color;
      ctx.globalAlpha = fx.alpha;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    } else if (fx.type === 'laser_beam') {
      fx.alpha -= 0.08;
      if (fx.alpha <= 0) { activeSpecialEffects.splice(i, 1); continue; }
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(fx.x1, fx.y1);
      ctx.lineTo(fx.x2, fx.y2);
      ctx.strokeStyle = fx.color;
      ctx.globalAlpha = fx.alpha;
      ctx.lineWidth = 10;
      ctx.shadowColor = fx.color;
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawObstacle(obs) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#2d3436';
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 3;
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawMinimap() {
  mCtx.clearRect(0, 0, 160, 160);
  const sx = 160 / arena.width;
  const sy = 160 / arena.height;

  // Fundo Verde do Minimapa
  mCtx.fillStyle = '#2e7d32';
  mCtx.fillRect(0, 0, 160, 160);

  // Lago Glacial no Minimapa
  mCtx.fillStyle = '#2980b9';
  mCtx.beginPath();
  mCtx.arc(6200 * sx, 2200 * sy, 7, 0, Math.PI * 2);
  mCtx.fill();

  // As 8 Cidades no Minimapa
  for (const c of cities) {
    mCtx.fillStyle = 'rgba(46, 213, 115, 0.4)';
    mCtx.beginPath();
    mCtx.arc(c.x * sx, c.y * sy, c.radius * sx, 0, Math.PI * 2);
    mCtx.fill();
    mCtx.strokeStyle = '#2ed573';
    mCtx.lineWidth = 1;
    mCtx.stroke();
  }

  // Gemas
  mCtx.fillStyle = '#00e5ff';
  for (const cr of serverMineCrystals) mCtx.fillRect(cr.x * sx - 1, cr.y * sy - 1, 2, 2);

  // Baús
  mCtx.fillStyle = '#ffd32a';
  for (const ch of serverChests) mCtx.fillRect(ch.x * sx - 1, ch.y * sy - 1, 2.5, 2.5);

  // Chefes Titânicos
  if (serverWorldBoss && serverWorldBoss.hp > 0) {
    mCtx.fillStyle = '#e67e22';
    mCtx.beginPath();
    mCtx.arc(serverWorldBoss.x * sx, serverWorldBoss.y * sy, 4, 0, Math.PI * 2);
    mCtx.fill();
  }
  if (serverSecondBoss && serverSecondBoss.hp > 0) {
    mCtx.fillStyle = '#d63031';
    mCtx.beginPath();
    mCtx.arc(serverSecondBoss.x * sx, serverSecondBoss.y * sy, 4, 0, Math.PI * 2);
    mCtx.fill();
  }

  // Bots
  mCtx.fillStyle = '#ffa502';
  for (const b of serverBots.values()) {
    if (b.hp > 0 && !b.isDead) {
      mCtx.beginPath();
      mCtx.arc(b.x * sx, b.y * sy, 2, 0, Math.PI * 2);
      mCtx.fill();
    }
  }

  // Jogadores
  for (const p of serverPlayers.values()) {
    if (p.hp > 0 && !p.isDead) {
      mCtx.fillStyle = p.id === myId ? '#ffffff' : '#00e5ff';
      mCtx.beginPath();
      mCtx.arc(p.x * sx, p.y * sy, p.id === myId ? 4 : 2.5, 0, Math.PI * 2);
      mCtx.fill();
    }
  }
}

function updateLeaderboard() {
  const all = [...serverPlayers.values(), ...serverBots.values()];
  all.sort((a, b) => (b.score || 0) - (a.score || 0));
  const container = document.getElementById('lb-entries');
  container.innerHTML = '';
  all.slice(0, 5).forEach((ent, idx) => {
    const row = document.createElement('div');
    row.className = 'lb-row' + (ent.id === myId ? ' me' : '');
    row.innerHTML = `<span>#${idx + 1} ${ent.name}</span><span>${ent.score} pts</span>`;
    container.appendChild(row);
  });
}

function updateKillfeed(feed) {
  const container = document.getElementById('killfeed');
  container.innerHTML = '';
  feed.slice(-4).forEach(item => {
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    entry.innerText = item.text;
    container.appendChild(entry);
  });
}

function addChatMessage(sender, color, text) {
  const container = document.getElementById('chat-messages');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg';
  msgEl.innerHTML = `<b style="color: ${color}">${sender}:</b> <span>${escapeHtml(text)}</span>`;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
  if (container.children.length > 5) container.removeChild(container.firstChild);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

// -------------------------------------------------------------
// Controles de Entrada (Teclado, Mouse e Poderes)
// -------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  const chatInput = document.getElementById('chat-input');
  if (document.activeElement === chatInput) {
    if (e.key === 'Enter') {
      const msg = chatInput.value.trim();
      if (msg.length > 0 && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'chat', text: msg }));
      }
      chatInput.value = '';
      chatInput.blur();
    }
    return;
  }

  if (e.key === 'Enter') {
    chatInput.focus();
    e.preventDefault();
    return;
  }

  if (e.key === 'e' || e.key === 'E') {
    if (nearbyNpc) openShop(nearbyNpc);
  }

  if (e.key === 'Escape') {
    closeShop();
    closeQuestsModal();
  }

  if (localPlayer && !localPlayer.isDead) {
    if (e.key === '1') { keys['1'] = true; useHealPotion(); }
    if (e.key === '2') { keys['2'] = true; useSpeedPotion(); }
    if (e.key === 'r' || e.key === 'R') { keys.r = true; castPowerSlam(); }
    if (e.key === 'f' || e.key === 'F') { keys.f = true; castPowerBeam(); }
    if (e.key === 'c' || e.key === 'C') { keys.c = true; castPowerFire(); }
    if (e.key === 'v' || e.key === 'V') { keys.v = true; castPowerShield(); }
  }

  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
  if (e.code === 'Space') keys.Space = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.Shift = true;
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  if (e.code === 'Space') keys.Space = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.Shift = false;
  if (e.key === 'r' || e.key === 'R') keys.r = false;
  if (e.key === 'f' || e.key === 'F') keys.f = false;
  if (e.key === 'c' || e.key === 'C') keys.c = false;
  if (e.key === 'v' || e.key === 'V') keys.v = false;
  if (e.key === '1') keys['1'] = false;
  if (e.key === '2') keys['2'] = false;
});

function useHealPotion() {
  if (!localPlayer || localPlayer.isDead) return;
  if (localPlayer.potions?.heal > 0 && localPlayer.hp < localPlayer.maxHp) {
    if (isOfflineMode) {
      localPlayer.potions.heal--;
      localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 50);
      sfx.playPotion();
      addParticle(localPlayer.x, localPlayer.y, '#2ed573', 15, 6);
      updateHUD(localPlayer);
    }
  }
}

function useSpeedPotion() {
  if (!localPlayer || localPlayer.isDead) return;
  if (localPlayer.potions?.speed > 0) {
    if (isOfflineMode) {
      localPlayer.potions.speed--;
      localPlayer.speedBoostTimer = 10;
      localPlayer.stamina = 100;
      sfx.playPotion();
      addParticle(localPlayer.x, localPlayer.y, '#ffd32a', 15, 6);
      updateHUD(localPlayer);
    }
  }
}

function castPowerSlam() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.slam || localPlayer.inSafeZone) return;
  if (localPlayer.powerCooldowns?.slam > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.slam = 6;
    sfx.playSlam();
    activeSpecialEffects.push({
      type: 'slam_wave',
      x: localPlayer.x,
      y: localPlayer.y,
      radius: 10,
      maxRadius: 210,
      color: '#ffd32a',
      alpha: 1
    });

    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead && !b.inSafeZone && Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y) < 210) {
        b.hp -= 42;
        const pa = Math.atan2(b.y - localPlayer.y, b.x - localPlayer.x);
        b.x += Math.cos(pa) * 60;
        b.y += Math.sin(pa) * 60;
        if (b.hp <= 0) {
          b.hp = 0;
          b.isDead = true;
          localPlayer.score += 100;
          localPlayer.gold += 70;
          sfx.playCoin();
          updateKillfeed([{ text: `💥 ${localPlayer.name} aniquilou ${b.name} (+70 🪙)!` }]);
          checkOfflineQuestProgress('kill');
          setTimeout(() => {
            const sp = getOfflineSpawnPoint();
            b.hp = b.maxHp;
            b.isDead = false;
            b.x = sp.x;
            b.y = sp.y;
          }, 3000);
        }
      }
    }
    updateHUD(localPlayer);
  }
}

function castPowerBeam() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.beam || localPlayer.inSafeZone) return;
  if (localPlayer.powerCooldowns?.beam > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.beam = 8;
    sfx.playBeam();
    const beamEnd = {
      x: localPlayer.x + Math.cos(localPlayer.angle) * 1100,
      y: localPlayer.y + Math.sin(localPlayer.angle) * 1100
    };
    activeSpecialEffects.push({
      type: 'laser_beam',
      x1: localPlayer.x,
      y1: localPlayer.y,
      x2: beamEnd.x,
      y2: beamEnd.y,
      color: '#00e5ff',
      alpha: 1
    });

    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead && !b.inSafeZone) {
        if (distanceToSegment(b.x, b.y, localPlayer.x, localPlayer.y, beamEnd.x, beamEnd.y) < b.radius + 25) {
          b.hp -= 60;
          addParticle(b.x, b.y, '#00e5ff', 10, 6);
          if (b.hp <= 0) {
            b.hp = 0;
            b.isDead = true;
            localPlayer.score += 100;
            localPlayer.gold += 70;
            sfx.playCoin();
            updateKillfeed([{ text: `🏹 ${localPlayer.name} perfurou ${b.name} (+70 🪙)!` }]);
            checkOfflineQuestProgress('kill');
            setTimeout(() => {
              const sp = getOfflineSpawnPoint();
              b.hp = b.maxHp;
              b.isDead = false;
              b.x = sp.x;
              b.y = sp.y;
            }, 3000);
          }
        }
      }
    }
    updateHUD(localPlayer);
  }
}

function castPowerFire() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.fire || localPlayer.inSafeZone) return;
  if (localPlayer.powerCooldowns?.fire > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.fire = 7;
    sfx.playMeteor();
    for (let i = 0; i < 5; i++) {
      const spread = (i - 2) * 0.25;
      serverProjectiles.push({
        id: Math.random(),
        ownerId: localPlayer.id,
        color: '#ff4757',
        damage: 38,
        x: localPlayer.x + Math.cos(localPlayer.angle + spread) * 32,
        y: localPlayer.y + Math.sin(localPlayer.angle + spread) * 32,
        vx: Math.cos(localPlayer.angle + spread) * 16,
        vy: Math.sin(localPlayer.angle + spread) * 16,
        lifetime: 65
      });
    }
    activeSpecialEffects.push({
      type: 'slam_wave',
      x: localPlayer.x,
      y: localPlayer.y,
      radius: 10,
      maxRadius: 150,
      color: '#ff4757',
      alpha: 1
    });
    updateHUD(localPlayer);
  }
}

function castPowerShield() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.shield) return;
  if (localPlayer.powerCooldowns?.shield > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.shield = 12;
    localPlayer.shieldTimer = 6;
    sfx.playShield();
    addParticle(localPlayer.x, localPlayer.y, '#00e5ff', 24, 7);
    updateHUD(localPlayer);
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1; const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY;
});
window.addEventListener('mousedown', (e) => {
  if (e.target.id === 'gameCanvas' && localPlayer && !localPlayer.isDead) {
    mouse.down = true; sfx.init();
  }
});
window.addEventListener('mouseup', () => { mouse.down = false; });

document.getElementById('slot-potion-heal').addEventListener('click', useHealPotion);
document.getElementById('slot-potion-speed').addEventListener('click', useSpeedPotion);
document.getElementById('slot-power-slam').addEventListener('click', castPowerSlam);
document.getElementById('slot-power-beam').addEventListener('click', castPowerBeam);
document.getElementById('slot-power-fire').addEventListener('click', castPowerFire);
document.getElementById('slot-power-shield').addEventListener('click', castPowerShield);

document.getElementById('btn-open-quests').addEventListener('click', openQuestsModal);
document.getElementById('btn-close-quests').addEventListener('click', closeQuestsModal);

document.getElementById('npc-interact-prompt').addEventListener('click', () => {
  if (nearbyNpc) openShop(nearbyNpc);
});
document.getElementById('btn-close-shop').addEventListener('click', closeShop);

document.querySelectorAll('.shop-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shop-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentShopTab = btn.dataset.tab;
    renderShopItems();
  });
});

document.querySelectorAll('.class-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedClass = card.dataset.class;
  });
});

document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedColor = btn.dataset.color;
  });
});

document.getElementById('btn-start').addEventListener('click', () => {
  sfx.init();
  const nameInput = document.getElementById('player-name').value.trim() || 'Guilherme';
  const customServer = document.getElementById('server-address')?.value?.trim();

  if (customServer && (!socket || socket.readyState !== WebSocket.OPEN)) {
    connectWebSocket(customServer);
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'set_profile',
      name: nameInput,
      charClass: selectedClass,
      color: selectedColor
    }));
  } else if (localPlayer) {
    localPlayer.name = nameInput;
    localPlayer.charClass = selectedClass;
    const cData = CHARACTER_CLASSES[selectedClass];
    if (cData) {
      localPlayer.color = selectedColor || cData.color;
      localPlayer.hairColor = cData.hairColor;
      localPlayer.skinColor = cData.skinColor;
      localPlayer.maxHp = cData.baseHp;
      localPlayer.hp = cData.baseHp;
      localPlayer.speed = cData.speed;
    }
  }

  document.getElementById('lobby-screen').style.display = 'none';
  document.getElementById('hud-overlay').style.display = 'block';
});

connectWebSocket();
render();
