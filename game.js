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

  playNatureCyclone() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
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

// =============================================================
// A GRANDE FLORESTA DOS CAMPEÕES (8 SANTUÁRIOS SAGRADOS)
// =============================================================
const FOREST_SANCTUARIES = [
  // 1. Grande Árvore-Mãe Ancestral (Centro 24000x24000)
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
    { id: 'fist', name: 'Punhos do Sobrevivente', cost: 0, damage: 12, color: '#ffdcb4', desc: 'Desarmado: golpes com as próprias mãos' },
    { id: 'sword_starter', name: 'Lâmina de Carvalho Rústica', cost: 60, damage: 22, color: '#00e5ff', desc: 'Espada de madeira balanceada' },
    { id: 'sword_starter', name: 'Lâmina dos Bosques', cost: 0, damage: 22, color: '#00e5ff', desc: 'Espada de carvalho balanceada' },
    { id: 'sword_rune', name: 'Lâmina Rúnica da Floresta', cost: 120, damage: 34, color: '#2ed573', desc: '+50% Dano & corte veloz' },
    { id: 'sword_fire', name: 'Lâmina do Fogo da Mata', cost: 280, damage: 52, color: '#ff4757', desc: 'Lança brasas incandescentes' },
    { id: 'staff_astral', name: 'Cajado Ancião dos Druidas', cost: 450, damage: 32, triple: true, color: '#ffd32a', desc: 'Disparo Triplo em leque!' }
  ],
  potions: [
    { id: 'potion_heal', name: 'Néctar Curativo da Floresta', cost: 40, heal: 50, icon: '🧪', desc: 'Recupera +50 de HP imediatamente' },
    { id: 'potion_speed', name: 'Extrato de Fúria do Vento', cost: 55, speedBoost: 1.5, icon: '⚡', desc: 'Vigor máximo e corrida acelerada por 10s' }
  ]
};

// -------------------------------------------------------------
// Árvores Procedurais da Floresta (2,200 Árvores no Mundo Colossal 24000x24000)
// -------------------------------------------------------------
const FOREST_TREES = [];
(function generateForestTrees() {
  let seed = 54321;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  for (let i = 0; i < 2200; i++) {
    const x = 300 + rnd() * 23400;
    const y = 300 + rnd() * 23400;
    let insideSanc = false;
    for (const s of FOREST_SANCTUARIES) {
      if (Math.hypot(x - s.x, y - s.y) < s.radius + 90) {
        insideSanc = true;
        break;
      }
    }
    if (!insideSanc) {
      const size = 38 + rnd() * 34;
      const shade = rnd();
      const foliageColor = shade > 0.65 ? '#1b4332' : (shade > 0.35 ? '#2d6a4f' : '#40916c');
      const hasFruit = rnd() > 0.55;
      FOREST_TREES.push({ x, y, size, foliageColor, hasFruit });
    }
  }
})();

// Vaga-lumes Luminosos da Floresta (Fireflies)
const FIREFLIES = [];
for (let i = 0; i < 60; i++) {
  FIREFLIES.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    size: 2 + Math.random() * 2.5,
    glowPhase: Math.random() * Math.PI * 2
  });
}

// -------------------------------------------------------------
// Efeito de Folhas Flutuantes Levadas pelo Vento
// -------------------------------------------------------------
const WIND_LEAVES = [];
for (let i = 0; i < 50; i++) {
  WIND_LEAVES.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: 1.4 + Math.random() * 2.2,
    vy: 0.7 + Math.random() * 1.5,
    rot: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.05,
    size: 4 + Math.random() * 5,
    color: ['#52b788', '#2d6a4f', '#74c69d', '#e67e22', '#d4a373'][Math.floor(Math.random() * 5)]
  });
}


// =============================================================
// SISTEMA DE SALVAMENTO DE PROGRESSO (LOCALSTORAGE)
// =============================================================
const SAVE_KEY = 'jornada2_savegame_v2';

function showSaveToast(text = '💾 Progresso Salvo com Sucesso!') {
  const toast = document.getElementById('save-toast');
  if (!toast) return;
  toast.innerText = text;
  toast.style.display = 'block';
  toast.style.animation = 'none';
  toast.offsetHeight; // trigger reflow
  toast.style.animation = 'fadeInOut 2.5s ease forwards';
  setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

function saveGame(showToast = true) {
  if (!localPlayer) return;
  const saveData = {
    name: localPlayer.name,
    charClass: localPlayer.charClass,
    color: localPlayer.color,
    gold: localPlayer.gold || 0,
    level: localPlayer.level || 1,
    xp: localPlayer.xp || 0,
    maxXp: localPlayer.maxXp || 100,
    weapon: localPlayer.weapon || 'fist',
    potions: localPlayer.potions || { heal: 0, speed: 0 },
    powers: localPlayer.powers || { slam: false, beam: false, fire: false, shield: false, nature: false },
    activeQuests: localPlayer.activeQuests || POWER_QUESTS,
    kills: localPlayer.kills || 0,
    score: localPlayer.score || 0,
    minedCount: localPlayer.minedCount || 0,
    savedAt: Date.now()
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    if (showToast) {
      showSaveToast('💾 Progresso Salvo com Sucesso!');
      sfx.playCoin();
    }
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

function loadSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function checkAndDisplayContinueButton() {
  const saved = loadSavedGame();
  const cCont = document.getElementById('continue-save-container');
  const cInfo = document.getElementById('continue-save-info');
  if (saved && cCont && cInfo) {
    cInfo.innerText = `Nv. ${saved.level || 1} • 🪙 ${saved.gold || 0}`;
    cCont.style.display = 'block';
  }
}
setTimeout(checkAndDisplayContinueButton, 200);

// Auto-Save periódico a cada 15 segundos
setInterval(() => {
  if (localPlayer && !localPlayer.isDead) {
    saveGame(false);
  }
}, 15000);

// Rating de Poder do Jogador para Escalar os Bots Dinamicamente
function getPlayerPowerRating() {
  if (!localPlayer) return 1;
  let rating = localPlayer.level || 1;
  if (localPlayer.weapon === 'staff_astral') rating += 4;
  else if (localPlayer.weapon === 'sword_fire') rating += 3;
  else if (localPlayer.weapon === 'sword_rune') rating += 2;
  else if (localPlayer.weapon === 'sword_starter') rating += 1;
  const pCount = Object.values(localPlayer.powers || {}).filter(Boolean).length;
  rating += pCount * 1.5;
  return rating;
}

const floatingTexts = [];
function addFloatingText(x, y, text, color = '#ffd32a', size = 16, isCrit = false) {
  floatingTexts.push({
    x,
    y,
    text: isCrit ? '🔥 ' + text + '!' : text,
    color,
    size: isCrit ? size * 1.3 : size,
    alpha: 1,
    vy: -1.8,
    lifetime: 45
  });
}

function addPlayerXp(amount) {
  if (!localPlayer) return;
  localPlayer.xp = (localPlayer.xp || 0) + amount;
  if (!localPlayer.level) localPlayer.level = 1;
  if (!localPlayer.maxXp) localPlayer.maxXp = 100;

  addFloatingText(localPlayer.x, localPlayer.y - 25, '+' + amount + ' XP', '#2ed573', 14);

  while (localPlayer.xp >= localPlayer.maxXp) {
    localPlayer.xp -= localPlayer.maxXp;
    localPlayer.level++;
    localPlayer.maxXp = Math.round(localPlayer.maxXp * 1.5);
    localPlayer.hp = localPlayer.maxHp;
    localPlayer.stamina = localPlayer.maxStamina;

    sfx.playRespawn();
    addFloatingText(localPlayer.x, localPlayer.y - 50, '⭐ SUBIU PARA O NÍVEL ' + localPlayer.level + '! ⭐', '#ffd32a', 22, true);
    addParticle(localPlayer.x, localPlayer.y, '#ffd32a', 30, 8);
    updateKillfeed([{ text: '👑 ' + localPlayer.name + ' alcançou o NÍVEL ' + localPlayer.level + ' da Floresta!' }]);
  }
  updateHUD(localPlayer);
}

// Dados de Rede e Mundo
let socket = null;
let myId = null;
let arena = { width: 24000, height: 24000 };
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
let serverThirdBoss = null;
let particles = [];
let activeSpecialEffects = [];
let screenShake = 0;
function triggerScreenShake(amount = 8) { screenShake = Math.max(screenShake, amount); }

const camera = { x: 12000, y: 12000 };

const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
  Space: false, Shift: false,
  r: false, f: false, c: false, v: false, t: false, e: false, '1': false, '2': false
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
  if (dot) dot.innerText = '🌿 Floresta Colossal (Offline)';
  if (pingInd) pingInd.innerText = '60 FPS (Local)';

  arena = { width: 24000, height: 24000 };
  cities = FOREST_SANCTUARIES;
  buildings = FOREST_STRUCTURES;
  npcs = NPCS;

  obstacles = [
    { x: 8000, y: 8000, radius: 120, type: 'rock', label: 'Pedra de Musgo Ancestral' },
    { x: 16000, y: 16000, radius: 130, type: 'pillar', label: 'Menir dos Druidas' },
    { x: 8000, y: 16000, radius: 120, type: 'rock', label: 'Pico das Corujas' },
    { x: 16000, y: 8000, radius: 120, type: 'pillar', label: 'Monólito Cósmico' }
  ];

  myId = 'local_hero';
  const cData = CHARACTER_CLASSES[selectedClass] || CHARACTER_CLASSES.warrior;

  // JOGADOR COMEÇA SEM NADA (0 OURO, 0 POÇÕES, PUNHOS NUS!)
  localPlayer = {
    id: myId,
    name: document.getElementById('player-name')?.value?.trim() || 'Guilherme',
    charClass: selectedClass,
    color: cData.color,
    hairColor: cData.hairColor,
    skinColor: cData.skinColor,
    x: 12000,
    y: 12000,
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
    gold: 0,
    score: 0,
    kills: 0,
    minedCount: 0,
    weapon: 'fist',
    potions: { heal: 0, speed: 0 },
    powers: { slam: false, beam: false, fire: false, shield: false, nature: false },
    powerCooldowns: { slam: 0, beam: 0, fire: 0, shield: 0, nature: 0 },
    level: 1,
    xp: 0,
    maxXp: 100,
    dashCooldown: 0,
    attackCooldown: 0,
    speedBoostTimer: 0,
    inSafeZone: false,
    radius: 24,
    activeQuests: POWER_QUESTS.map(q => ({ ...q, current: 0, completed: false }))
  };
  serverPlayers.set(myId, localPlayer);

  // Spawna 160 Cristais de Gemas
  serverMineCrystals = [];
  const cryColors = ['#00e5ff', '#ff4757', '#a29bfe', '#2ed573'];
  for (let i = 0; i < 160; i++) {
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

  // Spawna 180 Barris Destrutíveis
  serverBreakables = [];
  for (let i = 0; i < 180; i++) {
    const sp = getOfflineSpawnPoint();
    serverBreakables.push({
      id: 'brk_' + i,
      x: sp.x,
      y: sp.y,
      radius: 16,
      gold: 25
    });
  }

  // Spawna 150 Baús de Tesouro
  serverChests = [];
  for (let i = 0; i < 150; i++) {
    const sp = getOfflineSpawnPoint();
    serverChests.push({
      id: 'ch_' + i,
      x: sp.x,
      y: sp.y,
      radius: 18,
      gold: 50
    });
  }

  // Spawna 200 Orbes de Vida e Energia
  serverOrbs = [];
  for (let i = 0; i < 200; i++) {
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

  // 4 CHEFES TITÂNICOS HUMANOS (PESSOAS TITÃS GIGANTES!)
  serverWorldBoss = {
    id: 'world_colossus',
    name: '👑 Rei Titã da Floresta Ancestral',
    x: 16500,
    y: 12000,
    radius: 65,
    hp: 850,
    maxHp: 850,
    color: '#ffd32a',
    speed: 3.2,
    angle: 0,
    walkStep: 0
  };

  serverSecondBoss = {
    id: 'world_ignis',
    name: '🔥 Lorde Ignis, O Cavaleiro do Fogo',
    x: 12000,
    y: 17500,
    radius: 65,
    hp: 800,
    maxHp: 800,
    color: '#ff4757',
    speed: 3.5,
    angle: 0,
    walkStep: 0
  };

  serverThirdBoss = {
    id: 'world_druid',
    name: '⚡ Arquidruida das Tempestades',
    x: 7000,
    y: 7000,
    radius: 60,
    hp: 750,
    maxHp: 750,
    color: '#00e5ff',
    speed: 3.4,
    angle: 0,
    walkStep: 0
  };

  serverFourthBoss = {
    id: 'world_shadow',
    name: '💀 General Espectral da Noite',
    x: 7000,
    y: 17500,
    radius: 65,
    hp: 800,
    maxHp: 800,
    color: '#a29bfe',
    speed: 3.6,
    angle: 0,
    walkStep: 0
  };

  // 50 BOTS DE ELITE CUJO PODER DEPENDE DO PODER DO JOGADOR
  const BOT_NAMES = [
    'Sir Galahad', 'Mestre Eldon', 'Valquíria Freya', 'Lorde Alistair', 'Ranger Sylas',
    'Assassino Kael', 'Arconte Zephyr', 'Guardião Thorne', 'Druida Rowan', 'Feiticeira Morgana',
    'Paladino Uther', 'Caçador Rex', 'Lorde Malakor', 'Cavaleiro Kaelen', 'Arqueira Diana',
    'Mestre Roland', 'Sentinela Orin', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane',
    'Guerreiro Ragnar', 'Maga Lunafreya', 'Ranger Varis', 'Lâmina Lyra', 'Druida Tarsus',
    'Xamã Volkan', 'Bárbaro Conan', 'Caçadora Astrid', 'Lorde Fenris', 'Cavaleiro Arthur',
    'Feiticeiro Morpheus', 'Arqueiro Robin', 'Guardiã Elanor', 'Assassina Viper', 'Arquimago Merlin',
    'Lorde Dracon', 'Sentinela Sylph', 'Valquíria Sigrid', 'Cavaleiro Lancelot', 'Mago Gandor',
    'Guerreira Sonya', 'Arqueiro Legol', 'Paladina Joan', 'Assassino Ezio', 'Druida Malfur',
    'Titã Brutus', 'Xamã Thrall', 'Ranger Drizzt', 'Guardião Leon', 'Feiticeira Circe'
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
      speed: 4.6,
      angle: Math.random() * Math.PI * 2,
      hp: 55,
      maxHp: 55,
      gold: 20,
      score: 50,
      shieldTimer: 0,
      weapon: 'fist',
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
    localPlayer.inSafeZone = false; // Não há zona safe, combate livre em toda parte!
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
    if (localPlayer.powerCooldowns.nature > 0) localPlayer.powerCooldowns.nature -= 1 / 30;

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
      if (mouse.down && localPlayer.attackCooldown <= 0 ) {
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
              addPlayerXp(15);
              addFloatingText(cr.x, cr.y - 15, '+70 🪙', '#ffd32a');
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
          addPlayerXp(8);
          addFloatingText(br.x, br.y - 15, '+25 🪙', '#ffd32a');
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
          addPlayerXp(25);
          addFloatingText(ch.x, ch.y - 15, '+50 🪙', '#ffd32a');
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
          if (o.type === 'heal') {
            localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 30);
            addFloatingText(localPlayer.x, localPlayer.y - 15, '+30 HP', '#2ed573');
          } else {
            localPlayer.stamina = Math.min(100, localPlayer.stamina + 30);
            addFloatingText(localPlayer.x, localPlayer.y - 15, '+30 Vigor', '#00e5ff');
          }
          addPlayerXp(10);
          sfx.playPotion();
          serverOrbs.splice(i, 1);
          break;
        }
      }

      // Ataque
      if (mouse.down && localPlayer.attackCooldown <= 0 ) {
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
    const bosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0) {
        const dToBoss = Math.hypot(localPlayer.x - boss.x, localPlayer.y - boss.y);
        if (dToBoss < 850 && !localPlayer.isDead) {
          boss.angle = Math.atan2(localPlayer.y - boss.y, localPlayer.x - boss.x);
          boss.x += Math.cos(boss.angle) * boss.speed;
          boss.y += Math.sin(boss.angle) * boss.speed;

          if (dToBoss < 140 && localPlayer.shieldTimer <= 0) {
            localPlayer.hp = Math.max(0, localPlayer.hp - 35);
            triggerScreenShake(14);
            sfx.playSlam();
            addParticle(boss.x, boss.y, boss.color, 15, 6);
            if (localPlayer.hp <= 0) triggerOfflineDeath();
          }
        }
      }
    }

    
    // Dificuldade Dinâmica dos Bots baseada no Poder do Jogador!
    const pRating = getPlayerPowerRating();
    const targetBotMaxHp = Math.round(50 + pRating * 14);
    const targetBotSpeed = Math.min(6.6, 4.6 + pRating * 0.15);
    const targetBotWeapon = pRating > 7 ? 'staff_astral' : (pRating > 5 ? 'sword_fire' : (pRating > 3 ? 'sword_rune' : (pRating > 1.5 ? 'sword_starter' : 'fist')));
    const botDamage = Math.round(10 + pRating * 2.2);

    // Bots IA Humanoides
    for (const b of serverBots.values()) {
      if (b.hp <= 0 || b.isDead) continue;
      b.walkStep = (b.walkStep || 0) + 0.22;

      let bInCity = false;
      for (const c of cities) {
        if (Math.hypot(b.x - c.x, b.y - c.y) < c.radius) { bInCity = true; break; }
      }
      b.inSafeZone = false;

      const dToPlayer = Math.hypot(localPlayer.x - b.x, localPlayer.y - b.y);
      if (dToPlayer < 850 && !localPlayer.isDead ) {
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
              addPlayerXp(250);
              checkOfflineQuestProgress('boss');
              addFloatingText(boss.x, boss.y - 45, '+300 🪙', '#ffd32a', 20, true);
              sfx.playCoin();
              updateKillfeed([{ text: `👑 ${localPlayer.name} derrotou o ${boss.name.toUpperCase()} (+300 🪙)!` }]);
              boss.hp = 0;
            }
            break;
          }
        }
      }

      if (!hit) {
        if (pr.ownerId !== localPlayer.id && !localPlayer.isDead && localPlayer.shieldTimer <= 0 &&
            Math.hypot(pr.x - localPlayer.x, pr.y - localPlayer.y) < localPlayer.radius + 6) {
          hit = true;
          localPlayer.hp = Math.max(0, localPlayer.hp - pr.damage);
          triggerScreenShake(7);
          sfx.playHit();
          addParticle(pr.x, pr.y, pr.color, 8, 5);
          if (localPlayer.hp <= 0) {
            triggerOfflineDeath();
          }
        }

        for (const b of serverBots.values()) {
          if (pr.ownerId !== b.id && b.hp > 0 && !b.isDead && Math.hypot(pr.x - b.x, pr.y - b.y) < b.radius + 6) {
            hit = true;
            b.hp -= pr.damage;
            addFloatingText(b.x, b.y - 20, '-' + pr.damage, pr.color || '#ff4757');
            sfx.playHit();
            addParticle(pr.x, pr.y, pr.color, 8, 5);
            if (b.hp <= 0) {
              b.hp = 0;
              b.isDead = true;
              localPlayer.score += 100;
              localPlayer.gold += 70;
              addPlayerXp(40);
              addFloatingText(b.x, b.y - 35, '+70 🪙', '#ffd32a');
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
  localPlayer.x = 12000 + (Math.random() - 0.5) * 120;
  localPlayer.y = 12000 + (Math.random() - 0.5) * 120;
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
  return { x: 12000 + (Math.random() - 0.5) * 3000, y: 12000 + (Math.random() - 0.5) * 3000 };
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
    serverThirdBoss = msg.thirdBoss || null;

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
  if (keys.t) keys.t = false;
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
  const activeBosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss].filter(b => b && b.hp > 0);
  let activeBoss = null;
  if (activeBosses.length > 0) {
    activeBosses.sort((a, b) => Math.hypot(player.x - a.x, player.y - a.y) - Math.hypot(player.x - b.x, player.y - b.y));
    activeBoss = activeBosses[0];
  }
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

  // Nível Elite e Barra de XP
  const lvlEl = document.getElementById('level-num');
  if (lvlEl) lvlEl.innerText = player.level || 1;
  const xpFill = document.getElementById('xp-bar-fill');
  if (xpFill) {
    const curXp = player.xp || 0;
    const maxXp = player.maxXp || 100;
    const xpPercent = Math.min(100, Math.max(0, (curXp / maxXp) * 100));
    xpFill.style.width = `${xpPercent}%`;
  }
  const xpValEl = document.getElementById('xp-val');
  if (xpValEl) xpValEl.innerText = `${player.xp || 0} / ${player.maxXp || 100}`;

  // Slots de Poderes
  updatePowerSlot('slot-power-slam', 'cd-slam', player.powers?.slam, player.powerCooldowns?.slam);
  updatePowerSlot('slot-power-beam', 'cd-beam', player.powers?.beam, player.powerCooldowns?.beam);
  updatePowerSlot('slot-power-fire', 'cd-fire', player.powers?.fire, player.powerCooldowns?.fire);
  updatePowerSlot('slot-power-shield', 'cd-shield', player.powers?.shield, player.powerCooldowns?.shield);
  updatePowerSlot('slot-power-nature', 'cd-nature', player.powers?.nature, player.powerCooldowns?.nature);

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
  if (category === 'powers') {
    alert('Super Poderes NÃO podem ser comprados com ouro! A única maneira de desbloquear novos poderes é completando as Missões Sagradas da Floresta!');
    return;
  }
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
  let shakeX = 0, shakeY = 0;
  if (screenShake > 0) {
    shakeX = (Math.random() - 0.5) * screenShake;
    shakeY = (Math.random() - 0.5) * screenShake;
    screenShake = Math.max(0, screenShake - 0.7);
  }
  ctx.translate(screenWidth / 2 - camera.x + shakeX, screenHeight / 2 - camera.y + shakeY);

  // 1. Cenário da Floresta Viva
  drawWorldBackground();

  // 1.5. Árvores Procedurais da Floresta
  drawTrees();

  // 2. Os 8 Santuários da Floresta com Fogueiras
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

  // 8. Chefes Titânicos (Pessoas Titãs Humanoides Gigantes)
  if (serverWorldBoss) drawBoss(serverWorldBoss);
  if (serverSecondBoss) drawBoss(serverSecondBoss);
  if (serverThirdBoss) drawBoss(serverThirdBoss);
  if (serverFourthBoss) drawBoss(serverFourthBoss);

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

  // 14. Textos Flutuantes de Dano e Recompensas
  drawFloatingTexts();

  ctx.restore();

  // 15. Efeito de Folhas ao Vento e Vaga-lumes Luminosos
  drawWindLeaves();
  drawFireflies();

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

  // Rede de Trilhas Ancestrais Conectando os 8 Santuários na Floresta Gigante
  ctx.save();
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 48;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  // Da Árvore-Mãe (8000, 8000) para cada um dos outros 7 santuários
  const roads = [
    [8000, 8000, 3200, 3200],   // Para Bosque dos Druidas
    [8000, 8000, 12800, 3200],  // Para Lago Esmeralda
    [8000, 8000, 3200, 12800],  // Para Clareira dos Cogumelos
    [8000, 8000, 12800, 12800], // Para Forjadores da Madeira
    [8000, 8000, 8000, 2200],   // Para Mirante dos Ventos
    [8000, 8000, 13800, 8000],  // Para Bosque dos Cristais
    [8000, 8000, 2200, 8000],   // Para Guardiões da Mata
    // Circuito Perimetral entre os bosques
    [3200, 3200, 8000, 2200],
    [8000, 2200, 12800, 3200],
    [12800, 3200, 13800, 8000],
    [13800, 8000, 12800, 12800],
    [12800, 12800, 8000, 14000],
    [3200, 3200, 2200, 8000],
    [2200, 8000, 3200, 12800]
  ];
  roads.forEach(r => {
    ctx.moveTo(r[0], r[1]);
    ctx.lineTo(r[2], r[3]);
  });
  ctx.stroke();

  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 28;
  ctx.stroke();
  ctx.restore();

  // Grandioso Lago Esmeralda dos Salgueiros (12800, 4200)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(12800, 4200, 700, 450, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#16a085';
  ctx.fill();
  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Lago Místico das Brumas (4500, 11500)
  ctx.beginPath();
  ctx.ellipse(4500, 11500, 500, 320, 0, 0, Math.PI * 2);
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
// Desenho das Árvores Procedurais da Floresta
// -------------------------------------------------------------
function drawTrees() {
  const margin = 120;
  const left = camera.x - screenWidth / 2 - margin;
  const right = camera.x + screenWidth / 2 + margin;
  const top = camera.y - screenHeight / 2 - margin;
  const bottom = camera.y + screenHeight / 2 + margin;

  for (const t of FOREST_TREES) {
    if (t.x < left || t.x > right || t.y < top || t.y > bottom) continue;
    ctx.save();
    // Sombra projetada
    ctx.beginPath();
    ctx.ellipse(t.x + t.size * 0.25, t.y + t.size * 0.35, t.size * 0.85, t.size * 0.45, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fill();

    // Tronco de madeira de carvalho
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(t.x - t.size * 0.18, t.y - t.size * 0.2, t.size * 0.36, t.size * 0.5);

    // Copa da Árvore (folhagem densa multicamadas)
    ctx.fillStyle = t.foliageColor;
    ctx.beginPath();
    ctx.arc(t.x, t.y - t.size * 0.45, t.size * 0.68, 0, Math.PI * 2);
    ctx.arc(t.x - t.size * 0.35, t.y - t.size * 0.18, t.size * 0.52, 0, Math.PI * 2);
    ctx.arc(t.x + t.size * 0.35, t.y - t.size * 0.18, t.size * 0.52, 0, Math.PI * 2);
    ctx.fill();

    // Reflexo de luz na copa
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(t.x, t.y - t.size * 0.55, t.size * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Bagas e frutas silvestres
    if (t.hasFruit) {
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(t.x - t.size * 0.2, t.y - t.size * 0.32, 3, 0, Math.PI * 2);
      ctx.arc(t.x + t.size * 0.24, t.y - t.size * 0.2, 3.5, 0, Math.PI * 2);
      ctx.arc(t.x, t.y - t.size * 0.18, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}


function drawFireflies() {
  ctx.save();
  for (const f of FIREFLIES) {
    f.x += f.vx;
    f.y += f.vy;
    f.glowPhase += 0.05;
    if (f.x < 0) f.x = screenWidth;
    if (f.x > screenWidth) f.x = 0;
    if (f.y < 0) f.y = screenHeight;
    if (f.y > screenHeight) f.y = 0;

    const alpha = 0.3 + Math.sin(f.glowPhase) * 0.4;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = '#2ed573';
    ctx.shadowColor = '#2ed573';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawWindLeaves() {
  ctx.save();
  for (const l of WIND_LEAVES) {
    l.x += l.vx;
    l.y += l.vy + Math.sin(Date.now() * 0.003 + l.x) * 0.6;
    l.rot += l.vRot;
    if (l.x > screenWidth + 20) l.x = -20;
    if (l.y > screenHeight + 20) l.y = -20;

    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.fillStyle = l.color;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.alpha -= 1 / ft.lifetime;
    if (ft.alpha <= 0) {
      floatingTexts.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = ft.alpha;
    ctx.font = `bold ${Math.round(ft.size)}px Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = ft.color;
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}

// -------------------------------------------------------------
// Desenho dos Santuários da Floresta e Fogueiras Sagradas
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

    // Círculo de Proteção do Santuário
    ctx.beginPath();
    ctx.arc(c.x, c.y, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(46, 213, 115, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fogueira Sagrada Animada da Floresta
    // 1. Círculo de Pedras
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(c.x + Math.cos(a) * 22, c.y + Math.sin(a) * 22, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#636e72';
      ctx.fill();
    }
    // 2. Troncos Cruzados
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(c.x - 14, c.y - 12);
    ctx.lineTo(c.x + 14, c.y + 12);
    ctx.moveTo(c.x - 14, c.y + 12);
    ctx.lineTo(c.x + 14, c.y - 12);
    ctx.stroke();

    // 3. Chamas Oscilantes e Brilho Quente
    const flameTime = Date.now() * 0.015;
    const f1 = Math.sin(flameTime) * 3;
    const f2 = Math.cos(flameTime * 1.3) * 4;

    ctx.beginPath();
    ctx.arc(c.x, c.y - 4, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 165, 2, 0.35)';
    ctx.fill();

    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.ellipse(c.x + f1 * 0.5, c.y - 8, 9, 14 + f2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffa502';
    ctx.beginPath();
    ctx.ellipse(c.x - f1 * 0.5, c.y - 6, 6, 11 + f1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd32a';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y - 4, 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();

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

  // --- CAPA DE ELITE DO HERÓI (BILLOWING HERO CAPE) ---
  const capeWave = Math.sin(walkStep * 1.5) * 5;
  ctx.fillStyle = ent.isBot ? '#b71540' : '#4834d4';
  ctx.beginPath();
  ctx.moveTo(-10, -7);
  ctx.lineTo(-24 - Math.abs(legCycle) * 0.4, -12 + capeWave);
  ctx.lineTo(-22 - Math.abs(legCycle) * 0.4, 12 - capeWave);
  ctx.lineTo(-10, 7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Perna Esquerda e Bota com Greva de Elite
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(-10, -12 + legCycle, 6, 12);
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(-11, -2 + legCycle, 8, 5);

  // Perna Direita e Bota
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(-10, 2 - legCycle, 6, 12);
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(-11, 10 - legCycle, 8, 5);

  // 3. Tronco e Peitoral Armadurado de Elite
  ctx.fillStyle = ent.color || '#ff4757';
  ctx.beginPath();
  ctx.roundRect(-12, -10, 18, 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Brasão Dourado no Peito
  ctx.fillStyle = '#ffd32a';
  ctx.beginPath();
  ctx.moveTo(-6, -5);
  ctx.lineTo(2, 0);
  ctx.lineTo(-6, 5);
  ctx.closePath();
  ctx.fill();

  // Cinto de Aço com Fivela Dourada
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(-6, -10, 4, 20);
  ctx.fillStyle = '#ffd32a';
  ctx.fillRect(-7, -3, 6, 6);

  // --- OMBREIRAS DE ELITE DOURADAS (PAULDRONS) ---
  ctx.fillStyle = '#ffd32a';
  ctx.beginPath();
  ctx.arc(-2, -13, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e67e22';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#ffd32a';
  ctx.beginPath();
  ctx.arc(-2, 13, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e67e22';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 4. Braços e Manoplas
  const skin = ent.skinColor || '#ffdcb4';
  ctx.fillStyle = ent.color || '#ff4757';
  ctx.fillRect(0, -14, 8, 6);
  ctx.fillStyle = skin;
  ctx.fillRect(6, -14, 5, 5);

  ctx.fillStyle = ent.color || '#ff4757';
  ctx.fillRect(0, 8, 12, 6);
  ctx.fillStyle = skin;
  ctx.fillRect(10, 8, 5, 5);

  // 5. Arma Equipada com Brilho Encantado
  drawWeaponSprite(ent.weapon || 'sword_starter', ent.charClass);

  // 6. Cabeça, Elmo/Tiara e Olhos Vivos
  ctx.beginPath();
  ctx.arc(-2, 0, 11, 0, Math.PI * 2);
  ctx.fillStyle = skin;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-4, 0, 11, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fillStyle = ent.hairColor || '#2c3e50';
  ctx.fill();

  // Tiara de Guerreiro de Elite
  ctx.fillStyle = '#ffd32a';
  ctx.fillRect(0, -11, 3, 22);

  // Olhos Vivos
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(3, -5, 4, 3);
  ctx.fillRect(3, 2, 4, 3);
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(5, -4, 2, 2);
  ctx.fillRect(5, 3, 2, 2);

  ctx.restore();

  // Aura Mística para Campeões de Alto Nível ou Pontuação Alta
  if ((ent.level && ent.level >= 2) || (ent.score && ent.score >= 200)) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 211, 42, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  }

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

  const bStep = boss.walkStep || (Date.now() * 0.005);
  const legCycle = Math.sin(bStep) * 14;

  // 1. Sombra Titânica no Chão
  ctx.beginPath();
  ctx.ellipse(0, 22, boss.radius * 0.9, boss.radius * 0.42, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  // Anel Rúnico de Poder Sob os Pés do Titã
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, boss.radius + 14, 0, Math.PI * 2);
  ctx.strokeStyle = boss.color || '#ffd32a';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = boss.color || '#ffd32a';
  ctx.shadowBlur = 18;
  ctx.setLineDash([10, 8]);
  ctx.stroke();
  ctx.restore();

  // Se o Boss foi derrotado: repousa no chão com Grande Lápide Ancestral
  if (boss.hp <= 0) {
    ctx.save();
    ctx.rotate(Math.PI * 0.45);
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#3e2723';
    ctx.roundRect(-35, -22, 70, 44, 8);
    ctx.fill();
    ctx.restore();

    ctx.font = '46px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪦', 0, -10);

    ctx.font = 'bold 15px Segoe UI, sans-serif';
    ctx.fillStyle = '#ffd32a';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 6;
    ctx.fillText('👑 TITÃ DA FLORESTA DERROTADO', 0, -60);
    ctx.fillText(boss.name, 0, -80);
    ctx.restore();
    return;
  }

  // --- O CHEFE É UMA PESSOA TITÃ HUMANOIDE GIGANTE ---
  ctx.save();
  ctx.rotate(boss.angle || 0);

  // 2. Capa Colossal do Titã Billowing (Ondulando com os passos)
  const capeWave = Math.sin(bStep * 1.3) * 12;
  ctx.fillStyle = boss.id === 'world_ignis' ? '#b71540' : (boss.id === 'world_druid' ? '#1b4332' : '#2c3e50');
  ctx.beginPath();
  ctx.moveTo(-28, -20);
  ctx.lineTo(-65 - Math.abs(legCycle) * 0.5, -34 + capeWave);
  ctx.lineTo(-60 - Math.abs(legCycle) * 0.5, 34 - capeWave);
  ctx.lineTo(-28, 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 3. Pernas e Grevas Titânicas com Espigões
  ctx.fillStyle = '#2d3436';
  // Perna Esquerda
  ctx.fillRect(-22, -26 + legCycle, 16, 26);
  ctx.fillStyle = boss.color || '#ffd32a';
  ctx.fillRect(-24, -4 + legCycle, 20, 10);
  // Perna Direita
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(-22, 6 - legCycle, 16, 26);
  ctx.fillStyle = boss.color || '#ffd32a';
  ctx.fillRect(-24, 20 - legCycle, 20, 10);

  // 4. Tronco Colossal / Armadura de Placas de Titã
  ctx.fillStyle = '#1e272e';
  ctx.beginPath();
  ctx.roundRect(-28, -24, 44, 48, 8);
  ctx.fill();
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Peitoral Dourado / Emblema Titânico
  ctx.fillStyle = boss.color || '#ffd32a';
  ctx.beginPath();
  ctx.moveTo(-16, -16);
  ctx.lineTo(12, 0);
  ctx.lineTo(-16, 16);
  ctx.closePath();
  ctx.fill();

  // Cinto de Ouro com Gema Rúnica
  ctx.fillStyle = '#d35400';
  ctx.fillRect(-12, -22, 8, 44);
  ctx.fillStyle = '#ffd32a';
  ctx.fillRect(-14, -8, 12, 16);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.arc(-8, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // 5. Ombreiras Titânicas Gigantes com Espinhos (Pauldrons)
  ctx.fillStyle = boss.color || '#ffd32a';
  ctx.beginPath();
  ctx.arc(-8, -32, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e67e22';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = boss.color || '#ffd32a';
  ctx.beginPath();
  ctx.arc(-8, 32, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e67e22';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 6. Braços e Manoplas
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(4, -30, 24, 12);
  ctx.fillRect(4, 18, 24, 12);
  ctx.fillStyle = '#f39c12';
  ctx.fillRect(20, -32, 14, 16);
  ctx.fillRect(20, 16, 14, 16);

  // 7. ARMA GIGANTE LENDÁRIA DO TITÃ
  drawBossWeapon(boss);

  // 8. Cabeça com Elmo de Guerra e Coroa Titânica
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#f5cd79';
  ctx.fill();

  // Elmo de Aço Escuro
  ctx.beginPath();
  ctx.arc(-2, 0, 19, Math.PI * 0.4, Math.PI * 1.6);
  ctx.fillStyle = '#2d3436';
  ctx.fill();

  // Coroa Titânica com Joias
  ctx.fillStyle = '#ffd32a';
  ctx.beginPath();
  ctx.moveTo(8, -16);
  ctx.lineTo(16, -10);
  ctx.lineTo(24, -14);
  ctx.lineTo(20, 0);
  ctx.lineTo(24, 14);
  ctx.lineTo(16, 10);
  ctx.lineTo(8, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e67e22';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Olhos Flamejantes do Titã
  ctx.fillStyle = '#ffd32a';
  ctx.shadowColor = '#ffd32a';
  ctx.shadowBlur = 10;
  ctx.fillRect(10, -7, 6, 4);
  ctx.fillRect(10, 3, 6, 4);
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(13, -6, 3, 2);
  ctx.fillRect(13, 4, 3, 2);

  ctx.restore();

  // 9. Barra de Vida Gigante sobre a Cabeça do Titã
  const bBarW = 100;
  const bBarH = 9;
  const bRatio = Math.max(0, boss.hp / boss.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(-bBarW / 2, -70, bBarW, bBarH);
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(-bBarW / 2, -70, bBarW * bRatio, bBarH);
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(-bBarW / 2, -70, bBarW, bBarH);

  ctx.font = 'bold 13px Segoe UI, sans-serif';
  ctx.fillStyle = '#ffd32a';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 6;
  ctx.textAlign = 'center';
  ctx.fillText(boss.name, 0, -82);
  ctx.font = 'bold 10px Segoe UI, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(Math.round(boss.hp) + ' / ' + boss.maxHp + ' HP', 0, -56);

  ctx.restore();
}

function drawBossWeapon(boss) {
  if (boss.id === 'world_ignis') {
    // Montante Colossal do Fogo
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(26, 12, 60, 10);
    ctx.fillStyle = '#ffd32a';
    ctx.fillRect(24, 10, 12, 14);
    ctx.fillStyle = '#d63031';
    ctx.fillRect(80, 10, 10, 14);
  } else if (boss.id === 'world_druid') {
    // Cajado Tempestuoso do Druida
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(20, 14, 65, 8);
    ctx.beginPath();
    ctx.arc(88, 18, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 15;
    ctx.fill();
  } else {
    // Martelo Titânico da Terra e Ouro
    ctx.fillStyle = '#636e72';
    ctx.fillRect(24, 14, 50, 7);
    ctx.fillStyle = '#ffd32a';
    ctx.fillRect(66, 0, 24, 34);
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 0, 24, 34);
  }
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
    } else if (fx.type === 'nature_cyclone') {
      fx.radius += 8;
      fx.rot = (fx.rot || 0) + 0.22;
      fx.alpha -= 0.035;
      if (fx.alpha <= 0) { activeSpecialEffects.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(fx.x, fx.y);
      ctx.rotate(fx.rot);
      ctx.globalAlpha = fx.alpha;
      ctx.strokeStyle = '#2ed573';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#2ed573';
      ctx.shadowBlur = 16;
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * fx.radius * 0.65, Math.sin(a) * fx.radius * 0.65, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#40916c';
        ctx.fill();
        ctx.stroke();
      }
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

  // Lago Místico no Minimapa
  mCtx.fillStyle = '#16a085';
  mCtx.beginPath();
  mCtx.arc(12800 * sx, 4200 * sy, 8, 0, Math.PI * 2);
  mCtx.fill();
  mCtx.fillStyle = '#2980b9';
  mCtx.beginPath();
  mCtx.arc(4500 * sx, 11500 * sy, 6, 0, Math.PI * 2);
  mCtx.fill();

  // 3 Chefes Titânicos no Minimapa
  const mapBosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
  for (const mb of mapBosses) {
    if (mb && mb.hp > 0) {
      mCtx.fillStyle = mb.color || '#ffd32a';
      mCtx.beginPath();
      mCtx.arc(mb.x * sx, mb.y * sy, 4.5, 0, Math.PI * 2);
      mCtx.fill();
      mCtx.strokeStyle = '#ffffff';
      mCtx.lineWidth = 1;
      mCtx.stroke();
    }
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
    if (e.key === 't' || e.key === 'T') { keys.t = true; castPowerNature(); }
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
  if (e.key === 't' || e.key === 'T') keys.t = false;
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
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.slam ) return;
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
      if (b.hp > 0 && !b.isDead && Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y) < 210) {
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
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.beam ) return;
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
      if (b.hp > 0 && !b.isDead ) {
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
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.fire ) return;
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

function castPowerNature() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.nature ) return;
  if (localPlayer.powerCooldowns?.nature > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.nature = 10;
    sfx.playNatureCyclone();
    activeSpecialEffects.push({
      type: 'nature_cyclone',
      x: localPlayer.x,
      y: localPlayer.y,
      radius: 10,
      color: '#2ed573',
      alpha: 1
    });

    // Causa dano em área de 260px a bots e chefes
    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead && Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y) < 260) {
        b.hp -= 50;
        addFloatingText(b.x, b.y - 25, '-50', '#2ed573');
        addParticle(b.x, b.y, '#2ed573', 12, 6);
        const pa = Math.atan2(b.y - localPlayer.y, b.x - localPlayer.x);
        b.x += Math.cos(pa) * 80;
        b.y += Math.sin(pa) * 80;
        if (b.hp <= 0) {
          b.hp = 0;
          b.isDead = true;
          localPlayer.score += 100;
          localPlayer.gold += 70;
          addPlayerXp(40);
          sfx.playCoin();
          updateKillfeed([{ text: `🌪️ ${localPlayer.name} varreu ${b.name} com o Ciclone (+70 🪙)!` }]);
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

    const bosses = [serverWorldBoss, serverSecondBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0 && Math.hypot(boss.x - localPlayer.x, boss.y - localPlayer.y) < 280) {
        boss.hp -= 50;
        addFloatingText(boss.x, boss.y - 35, '-50', '#2ed573', 18);
        addParticle(boss.x, boss.y, '#2ed573', 15, 6);
        if (boss.hp <= 0) {
          localPlayer.gold += 300;
          localPlayer.score += 600;
          addPlayerXp(250);
          checkOfflineQuestProgress('boss');
          addFloatingText(boss.x, boss.y - 50, '+300 🪙', '#ffd32a', 22, true);
          sfx.playCoin();
          updateKillfeed([{ text: `👑 ${localPlayer.name} aniquilou ${boss.name.toUpperCase()} (+300 🪙)!` }]);
          boss.hp = 0;
        }
      }
    }

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
const slotNature = document.getElementById('slot-power-nature');
if (slotNature) slotNature.addEventListener('click', castPowerNature);

// Botão de Tela Cheia
const btnFullscreen = document.getElementById('btn-fullscreen');
if (btnFullscreen) {
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      btnFullscreen.innerText = '⛶ Sair Tela Cheia';
    } else {
      document.exitFullscreen().catch(() => {});
      btnFullscreen.innerText = '⛶ Tela Cheia';
    }
  });
}

// Botão para abrir Missões a partir da Loja
const btnGotoQuests = document.getElementById('btn-goto-quests-from-shop');
if (btnGotoQuests) {
  btnGotoQuests.addEventListener('click', () => {
    closeShop();
    openQuestsModal();
  });
}

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


// Salvar Progresso
const btnSave = document.getElementById('btn-save-game');
if (btnSave) {
  btnSave.addEventListener('click', () => saveGame(true));
}

// Continuar Jogo Salvo no Lobby
const btnContinue = document.getElementById('btn-continue-save');
if (btnContinue) {
  btnContinue.addEventListener('click', () => {
    const saved = loadSavedGame();
    if (!saved) return;
    sfx.init();
    if (localPlayer) {
      localPlayer.name = saved.name || 'Guilherme';
      localPlayer.charClass = saved.charClass || selectedClass;
      localPlayer.color = saved.color || selectedColor;
      localPlayer.gold = saved.gold || 0;
      localPlayer.level = saved.level || 1;
      localPlayer.xp = saved.xp || 0;
      localPlayer.maxXp = saved.maxXp || 100;
      localPlayer.weapon = saved.weapon || 'fist';
      localPlayer.potions = saved.potions || { heal: 0, speed: 0 };
      localPlayer.powers = saved.powers || { slam: false, beam: false, fire: false, shield: false, nature: false };
      localPlayer.activeQuests = saved.activeQuests || POWER_QUESTS;
      localPlayer.kills = saved.kills || 0;
      localPlayer.score = saved.score || 0;
      localPlayer.minedCount = saved.minedCount || 0;

      const cData = CHARACTER_CLASSES[localPlayer.charClass];
      if (cData) {
        localPlayer.maxHp = cData.baseHp;
        localPlayer.hp = cData.baseHp;
        localPlayer.speed = cData.speed;
      }
      updateHUD(localPlayer);
      renderQuestsList();
    }
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('hud-overlay').style.display = 'block';
    showSaveToast(`✨ Bem-vindo de volta, ${saved.name}! Nível ${saved.level}`);
  });
}

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
