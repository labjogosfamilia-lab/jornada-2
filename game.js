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
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {}
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

  playSwordSlash() {
    if (!this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.13);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.13);
      filter.Q.setValueAtTime(2.2, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.13);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playPunch() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(170, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.26, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
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

  playThunder() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  playBlizzard() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playBlackHole() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.7);
  }

  playDragon() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
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

const CITIES = FOREST_SANCTUARIES;

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

const BUILDINGS = FOREST_STRUCTURES;

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

// Missões da Floresta para Ganhar Poderes (ÚNICO JEITO DE GANHAR PODER!)
const POWER_QUESTS = [
  { id: 'q_slam', name: '⚡ Provação do Trovão', desc: 'Derrote 10 Inimigos em Combate na Floresta', target: 10, type: 'kill', rewardPower: 'power_slam', powerName: 'Pisão Sísmico [R]' },
  { id: 'q_beam', name: '🏹 Harmonia Astral', desc: 'Minere 12 Cristais de Gemas Sagradas', target: 12, type: 'mine', rewardPower: 'power_beam', powerName: 'Raio Astral [F]' },
  { id: 'q_fire', name: '🔥 Fogo Ancestral', desc: 'Derrote 20 Inimigos em Batalha na Floresta', target: 20, type: 'kill', rewardPower: 'power_fire', powerName: 'Meteoro Flamejante [C]' },
  { id: 'q_shield', name: '🛡️ Relíquia Sagrada', desc: 'Encontre e Abra 15 Baús de Tesouro Ancestrais', target: 15, type: 'chest', rewardPower: 'power_shield', powerName: 'Escudo Divino [V]' },
  { id: 'q_nature', name: '🌪️ Fúria da Floresta', desc: 'Derrote 3 Titãs Chefes Guardiões da Mata', target: 3, type: 'boss', rewardPower: 'power_nature', powerName: 'Ciclone de Folhas [T]' },
  { id: 'q_thunder', name: '⚡ Julgamento dos Relâmpagos', desc: 'Derrote 30 Inimigos em Batalha Sangrenta', target: 30, type: 'kill', rewardPower: 'power_thunder', powerName: 'Julgamento do Trovão [G]' },
  { id: 'q_blizzard', name: '❄️ Coração do Inverno', desc: 'Descubra e Abra 25 Baús de Tesouro Ocultos', target: 25, type: 'chest', rewardPower: 'power_blizzard', powerName: 'Nevasca Glacial [B]' },
  { id: 'q_blackhole', name: '🌑 Singularidade do Vazio', desc: 'Minere 25 Cristais de Gemas Raras da Floresta', target: 25, type: 'mine', rewardPower: 'power_blackhole', powerName: 'Singularidade do Vazio [Z]' },
  { id: 'q_dragon', name: '🐉 Despertar do Dragão Ancestral', desc: 'Derrote 5 Titãs Chefes Supremos da Floresta', target: 5, type: 'boss', rewardPower: 'power_dragon', powerName: 'Sopro do Dragão Ancestral [X]' }
];

const SHOP_CATALOG = {
  weapons: [
    { id: 'fist', name: 'Punhos do Sobrevivente', cost: 0, damage: 14, color: '#ffdcb4', desc: 'Desarmado: socos velozes corpo a corpo' },
    { id: 'sword_starter', name: 'Lâmina de Carvalho Rústica', cost: 60, damage: 24, color: '#00e5ff', desc: 'Espada de madeira: corte corpo a corpo balanceado' },
    { id: 'sword_iron', name: 'Espada de Ferro Forjado', cost: 120, damage: 34, color: '#dfe4ea', desc: 'Aço temperado: lâmina afiada e resistente' },
    { id: 'sword_rune', name: 'Lâmina Rúnica da Floresta', cost: 220, damage: 46, color: '#2ed573', desc: '+50% Dano & corte rúnico veloz corpo a corpo' },
    { id: 'sword_poison', name: 'Espada Venenosa da Serpente', cost: 360, damage: 60, color: '#1dd1a1', desc: 'Lâmina embebida em veneno mortal da floresta' },
    { id: 'sword_fire', name: 'Lâmina do Fogo da Mata', cost: 520, damage: 78, color: '#ff4757', desc: 'Lâmina flamejante: corte incandescente devastador' },
    { id: 'sword_lightning', name: 'Espada Tempestuosa do Trovão', cost: 750, damage: 98, color: '#00d2d3', desc: 'Lâmina de relâmpagos: velocidade extrema e corte elétrico' },
    { id: 'sword_shadow', name: 'Lâmina Sombria do Crepúsculo', cost: 1050, damage: 120, color: '#a29bfe', desc: 'Forjada no eclipse: golpes críticos sombrios brutais' },
    { id: 'staff_astral', name: 'Cajado Ancião dos Druidas', cost: 1250, damage: 45, triple: true, color: '#ffd32a', desc: 'Cajado druídico: disparo triplo mágico à distância' },
    { id: 'sword_titan', name: 'Espada Colossal dos Titãs', cost: 1650, damage: 155, color: '#ff5252', desc: 'Montante épico de 2 mãos: impacto sísmico colossal' },
    { id: 'sword_celestial', name: 'Lâmina Celestial da Luz Sagrada', cost: 2300, damage: 195, color: '#ffd32a', desc: 'Espada divina mítica: o poder supremo da floresta' }
  ],
  potions: [
    { id: 'potion_heal', name: 'Néctar Curativo da Floresta', cost: 40, heal: 50, icon: '🧪', desc: 'Recupera +50 de HP imediatamente [Tecla 1]' },
    { id: 'potion_speed', name: 'Extrato de Fúria do Vento', cost: 55, speedBoost: 1.5, icon: '⚡', desc: 'Vigor máximo e corrida acelerada por 10s [Tecla 2]' },
    { id: 'potion_super_heal', name: 'Elixir Vital Sagrado', cost: 95, heal: 120, icon: '💖', desc: 'Cura Suprema: restaura +120 de Vida [Tecla 3]' },
    { id: 'potion_shield', name: 'Poção de Casca de Ferro', cost: 80, shield: 90, icon: '🛡️', desc: 'Armadura arbórea: +90 de Escudo Sagrado por 15s [Tecla 4]' },
    { id: 'potion_strength', name: 'Sangue de Titã Dracônico', cost: 115, strength: 1.6, icon: '🐉', desc: 'Fúria sagrada: +60% Dano de Ataque por 15s [Tecla 5]' }
  ]
};

// -------------------------------------------------------------
// Árvores Procedurais da Floresta (8,500 Árvores Densas no Mundo Colossal 24000x24000)
// -------------------------------------------------------------
const FOREST_TREES = [];
(function generateForestTrees() {
  let seed = 54321;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  for (let i = 0; i < 8500; i++) {
    const x = 200 + rnd() * 23600;
    const y = 200 + rnd() * 23600;
    let insideSanc = false;
    for (const s of FOREST_SANCTUARIES) {
      if (Math.hypot(x - s.x, y - s.y) < s.radius + 80) {
        insideSanc = true;
        break;
      }
    }
    if (!insideSanc) {
      const size = 32 + rnd() * 42;
      const shade = rnd();
      let foliageColor = '#2d6a4f';
      if (shade > 0.85) foliageColor = '#1b4332'; // Pinheiro escuro ancestral
      else if (shade > 0.68) foliageColor = '#40916c'; // Carvalho esmeralda
      else if (shade > 0.50) foliageColor = '#52b788'; // Bosque vivo verde
      else if (shade > 0.35) foliageColor = '#2f5233'; // Mata fechada
      else if (shade > 0.20) foliageColor = '#e67e22'; // Árvore outonal dourada
      else if (shade > 0.10) foliageColor = '#fd79a8'; // Cerejeira mística dos bosques
      else foliageColor = '#74c69d'; // Salgueiro suave
      
      const hasFruit = rnd() > 0.52;
      const fruitColor = rnd() > 0.35 ? '#ff4757' : (rnd() > 0.5 ? '#ffd32a' : '#a29bfe');
      FOREST_TREES.push({ x, y, size, foliageColor, hasFruit, fruitColor });
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


var localPlayer = null;

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
    potions: localPlayer.potions || { heal: 0, speed: 0, superHeal: 0, shield: 0, strength: 0 },
    powers: localPlayer.powers || { slam: false, beam: false, fire: false, shield: false, nature: false, thunder: false, blizzard: false, blackhole: false, dragon: false },
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
  Space: false, Shift: false, q: false,
  r: false, f: false, c: false, v: false, t: false,
  g: false, b: false, z: false, x: false, e: false,
  '1': false, '2': false, '3': false, '4': false, '5': false
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
// Mecânicas de Combate Melee & Funções de Ataque
// -------------------------------------------------------------
function calcAngleDiff(a, b) {
  let diff = a - b;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return Math.abs(diff);
}

function executeOfflineAttack(attacker, isPlayer) {
  const wId = attacker.weapon || 'fist';
  const weaponsList = (shopCatalog && shopCatalog.weapons) ? shopCatalog.weapons : SHOP_CATALOG.weapons;
  const wData = weaponsList.find(w => w.id === wId) || weaponsList[0];
  attacker.attackCooldown = wId === 'fist' ? 0.20 : (wId === 'sword_lightning' ? 0.22 : 0.27);
  attacker.slashTimer = 0.22;

  let attackDmg = wData.damage;
  if (attacker.strengthTimer > 0) {
    attackDmg = Math.round(attackDmg * 1.6);
  }

  // Se for o Cajado Astral (arma mágica druídica), dispara projéteis mágicos à distância
  if (wId === 'staff_astral') {
    sfx.playShoot(wData.color);
    [-0.2, 0, 0.2].forEach(spr => {
      serverProjectiles.push({
        id: Math.random(),
        ownerId: attacker.id,
        color: wData.color,
        damage: attackDmg,
        x: attacker.x + Math.cos(attacker.angle + spr) * 30,
        y: attacker.y + Math.sin(attacker.angle + spr) * 30,
        vx: Math.cos(attacker.angle + spr) * 16,
        vy: Math.sin(attacker.angle + spr) * 16,
        lifetime: 65
      });
    });

    if (isPlayer) {
      // Também permite minerar cristais de diamante que estiverem na frente imediata do cajado
      for (let i = serverMineCrystals.length - 1; i >= 0; i--) {
        const cr = serverMineCrystals[i];
        const dist = Math.hypot(cr.x - attacker.x, cr.y - attacker.y);
        if (dist <= 95 + cr.radius) {
          const dir = Math.atan2(cr.y - attacker.y, cr.x - attacker.x);
          if (calcAngleDiff(dir, attacker.angle) < 1.35) {
            cr.hp--;
            localPlayer.gold += 20;
            sfx.playHit();
            addParticle(cr.x, cr.y, cr.color, 10, 5);
            addFloatingText(cr.x, cr.y - 20, '-1', cr.color, 15);
            if (cr.hp <= 0) {
              localPlayer.gold += cr.gold;
              localPlayer.score += 40;
              localPlayer.minedCount++;
              addPlayerXp(15);
              addFloatingText(cr.x, cr.y - 15, `+${cr.gold} 🪙`, '#ffd32a');
              sfx.playCoin();
              addParticle(cr.x, cr.y, '#ffd32a', 20, 7);
              updateKillfeed([{ text: `💎 ${localPlayer.name} minerou um Diamante (+${cr.gold} 🪙)!` }]);
              checkOfflineQuestProgress('mine');
              serverMineCrystals.splice(i, 1);
              setTimeout(() => {
                const sp = getOfflineSpawnPoint();
                serverMineCrystals.push({
                  id: 'cry_' + Date.now() + Math.random(),
                  x: sp.x,
                  y: sp.y,
                  hp: 3,
                  maxHp: 3,
                  radius: 20,
                  name: 'Diamante Sagrado',
                  color: ['#00e5ff', '#ff4757', '#a29bfe', '#2ed573'][Math.floor(Math.random() * 4)],
                  gold: 70
                });
              }, 12000);
            }
          }
        }
      }
      // Também quebra barris na frente imediata do cajado
      for (let i = serverBreakables.length - 1; i >= 0; i--) {
        const br = serverBreakables[i];
        const dist = Math.hypot(br.x - attacker.x, br.y - attacker.y);
        if (dist <= 95 + br.radius) {
          const dir = Math.atan2(br.y - attacker.y, br.x - attacker.x);
          if (calcAngleDiff(dir, attacker.angle) < 1.35) {
            localPlayer.gold += br.gold;
            addPlayerXp(8);
            addFloatingText(br.x, br.y - 15, `+${br.gold} 🪙`, '#ffd32a');
            sfx.playCoin();
            addParticle(br.x, br.y, '#e67e22', 12, 5);
            serverBreakables.splice(i, 1);
            setTimeout(() => {
              const sp = getOfflineSpawnPoint();
              serverBreakables.push({
                id: 'brk_' + Date.now() + Math.random(),
                x: sp.x,
                y: sp.y,
                radius: 16,
                gold: 25
              });
            }, 10000);
          }
        }
      }
    }
    return;
  }

  // --- COMBATE CORPO A CORPO (ESPADA OU SOCO: SEM PROJÉTEIS, 100% MELEE) ---
  if (wId === 'fist') {
    sfx.playPunch();
  } else {
    sfx.playSwordSlash();
  }

  // Animação Visual de Corte (Arco cortante de lâmina/punho na frente do personagem)
  const isTitan = wId === 'sword_titan';
  const isCelestial = wId === 'sword_celestial';
  const slashRadius = wId === 'fist' ? 52 : (isTitan ? 92 : (isCelestial ? 86 : 78));

  activeSpecialEffects.push({
    type: 'melee_slash',
    x: attacker.x,
    y: attacker.y,
    angle: attacker.angle,
    radius: slashRadius,
    color: wData.color,
    weaponId: wId,
    progress: 0
  });

  const meleeReach = slashRadius + 22;
  const maxCone = 1.25; // Leque de corte frontal (~143 graus)

  if (isPlayer) {
    // 1. Acerta Bots Inimigos
    for (const b of serverBots.values()) {
      if (b.hp <= 0 || b.isDead) continue;
      const dist = Math.hypot(b.x - attacker.x, b.y - attacker.y);
      if (dist <= meleeReach + b.radius) {
        const dir = Math.atan2(b.y - attacker.y, b.x - attacker.x);
        if (calcAngleDiff(dir, attacker.angle) < maxCone) {
          b.hp -= attackDmg;
          // Efeito de impacto e recuo físico
          b.x += Math.cos(attacker.angle) * 22;
          b.y += Math.sin(attacker.angle) * 22;
          sfx.playHit();
          triggerScreenShake(isTitan ? 8 : (isCelestial ? 6 : 3));
          addParticle(b.x, b.y, wData.color, isCelestial ? 14 : 8, 4);

          if (wId === 'sword_poison') {
            addFloatingText(b.x, b.y - 45, '☠️ Veneno!', '#1dd1a1', 13);
          } else if (wId === 'sword_lightning') {
            addParticle(b.x, b.y, '#00d2d3', 10, 5);
          }

          addFloatingText(b.x, b.y - 20, `-${attackDmg}`, wData.color, 16, attacker.strengthTimer > 0);

          if (b.hp <= 0) {
            b.hp = 0;
            b.isDead = true;
            localPlayer.score += 100;
            localPlayer.gold += 70;
            addPlayerXp(40);
            addFloatingText(b.x, b.y - 35, '+70 🪙', '#ffd32a');
            sfx.playCoin();
            updateKillfeed([{ text: `⚔️ ${localPlayer.name} derrotou ${b.name} (+70 🪙)!` }]);
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
        }
      }
    }

    // 2. Acerta Chefes Titânicos
    const bosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0) {
        const dist = Math.hypot(boss.x - attacker.x, boss.y - attacker.y);
        if (dist <= meleeReach + boss.radius) {
          const dir = Math.atan2(boss.y - attacker.y, boss.x - attacker.x);
          if (calcAngleDiff(dir, attacker.angle) < maxCone) {
            boss.hp -= attackDmg;
            sfx.playHit();
            triggerScreenShake(isTitan ? 10 : 6);
            addParticle(boss.x, boss.y, wData.color, 12, 5);
            addFloatingText(boss.x, boss.y - 35, `-${attackDmg}`, wData.color, 18, true);

            if (boss.hp <= 0) {
              localPlayer.gold += 300;
              localPlayer.score += 600;
              addPlayerXp(250);
              checkOfflineQuestProgress('boss');
              addFloatingText(boss.x, boss.y - 45, '+300 🪙', '#ffd32a', 20, true);
              sfx.playCoin();
              updateKillfeed([{ text: `👑 ${localPlayer.name} golpeou o ${boss.name.toUpperCase()} até a queda (+300 🪙)!` }]);
              boss.hp = 0;
            }
          }
        }
      }
    }

    // 3. Minera Cristais de Gemas com o Golpe Melee
    for (let i = serverMineCrystals.length - 1; i >= 0; i--) {
      const cr = serverMineCrystals[i];
      const dist = Math.hypot(cr.x - attacker.x, cr.y - attacker.y);
      if (dist <= meleeReach + cr.radius) {
        const dir = Math.atan2(cr.y - attacker.y, cr.x - attacker.x);
        if (calcAngleDiff(dir, attacker.angle) < maxCone) {
          cr.hp--;
          localPlayer.gold += 20;
          sfx.playHit();
          addParticle(cr.x, cr.y, cr.color, 10, 5);
          if (cr.hp <= 0) {
            localPlayer.gold += cr.gold;
            localPlayer.score += 40;
            localPlayer.minedCount++;
            addPlayerXp(15);
            addFloatingText(cr.x, cr.y - 15, `+${cr.gold} 🪙`, '#ffd32a');
            sfx.playCoin();
            addParticle(cr.x, cr.y, '#ffd32a', 20, 7);
            updateKillfeed([{ text: `💎 ${localPlayer.name} quebrou uma Gema (+${cr.gold} 🪙)!` }]);
            checkOfflineQuestProgress('mine');
            serverMineCrystals.splice(i, 1);
            setTimeout(() => {
              const sp = getOfflineSpawnPoint();
              serverMineCrystals.push({
                id: 'cry_' + Date.now() + Math.random(),
                x: sp.x,
                y: sp.y,
                hp: 3,
                maxHp: 3,
                radius: 20,
                name: 'Diamante Sagrado',
                color: ['#00e5ff', '#ff4757', '#a29bfe', '#2ed573'][Math.floor(Math.random() * 4)],
                gold: 70
              });
            }, 12000);
          }
        }
      }
    }

    // 4. Quebra Barris e Caixas com o Golpe Melee
    for (let i = serverBreakables.length - 1; i >= 0; i--) {
      const br = serverBreakables[i];
      const dist = Math.hypot(br.x - attacker.x, br.y - attacker.y);
      if (dist <= meleeReach + br.radius) {
        const dir = Math.atan2(br.y - attacker.y, br.x - attacker.x);
        if (calcAngleDiff(dir, attacker.angle) < maxCone) {
          localPlayer.gold += br.gold;
          addPlayerXp(8);
          addFloatingText(br.x, br.y - 15, `+${br.gold} 🪙`, '#ffd32a');
          sfx.playCoin();
          addParticle(br.x, br.y, '#e67e22', 12, 5);
          serverBreakables.splice(i, 1);
          setTimeout(() => {
            const sp = getOfflineSpawnPoint();
            serverBreakables.push({
              id: 'brk_' + Date.now() + Math.random(),
              x: sp.x,
              y: sp.y,
              radius: 16,
              gold: 25
            });
          }, 10000);
        }
      }
    }
  } else {
    // É um BOT atacando corpo a corpo
    if (!localPlayer.isDead && localPlayer.shieldTimer <= 0) {
      const dist = Math.hypot(localPlayer.x - attacker.x, localPlayer.y - attacker.y);
      if (dist <= meleeReach + localPlayer.radius) {
        const dir = Math.atan2(localPlayer.y - attacker.y, localPlayer.x - attacker.x);
        if (calcAngleDiff(dir, attacker.angle) < maxCone) {
          const dmg = attacker.damage || wData.damage || 15;
          localPlayer.hp = Math.max(0, localPlayer.hp - dmg);
          localPlayer.x += Math.cos(attacker.angle) * 18;
          localPlayer.y += Math.sin(attacker.angle) * 18;
          sfx.playHit();
          triggerScreenShake(7);
          addParticle(localPlayer.x, localPlayer.y, wData.color, 8, 5);
          addFloatingText(localPlayer.x, localPlayer.y - 20, `-${dmg}`, '#ff4757');
          if (localPlayer.hp <= 0) {
            triggerOfflineDeath();
          }
        }
      }
    }
  }
}

// -------------------------------------------------------------
// Simulação Offline com Mundo Gigante (24000 x 24000)
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
    potions: { heal: 0, speed: 0, superHeal: 0, shield: 0, strength: 0 },
    powers: { slam: false, beam: false, fire: false, shield: false, nature: false, thunder: false, blizzard: false, blackhole: false, dragon: false },
    powerCooldowns: { slam: 0, beam: 0, fire: 0, shield: 0, nature: 0, thunder: 0, blizzard: 0, blackhole: 0, dragon: 0 },
    level: 1,
    xp: 0,
    maxXp: 100,
    dashCooldown: 0,
    attackCooldown: 0,
    speedBoostTimer: 0,
    strengthTimer: 0,
    isSprinting: false,
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

    localPlayer.inSafeZone = false; // Combate total em todo o mundo!

    if (localPlayer.shieldTimer > 0) localPlayer.shieldTimer -= 1 / 30;
    if (localPlayer.dashCooldown > 0) localPlayer.dashCooldown -= 1 / 30;
    if (localPlayer.attackCooldown > 0) localPlayer.attackCooldown -= 1 / 30;
    if (localPlayer.slashTimer > 0) localPlayer.slashTimer -= 1 / 30;
    if (localPlayer.speedBoostTimer > 0) localPlayer.speedBoostTimer -= 1 / 30;
    if (localPlayer.strengthTimer > 0) localPlayer.strengthTimer -= 1 / 30;
    if (!localPlayer.isSprinting && localPlayer.stamina < 100) {
      localPlayer.stamina = Math.min(100, localPlayer.stamina + 22 / 30);
    }
    if (localPlayer.powerCooldowns.slam > 0) localPlayer.powerCooldowns.slam -= 1 / 30;
    if (localPlayer.powerCooldowns.beam > 0) localPlayer.powerCooldowns.beam -= 1 / 30;
    if (localPlayer.powerCooldowns.fire > 0) localPlayer.powerCooldowns.fire -= 1 / 30;
    if (localPlayer.powerCooldowns.shield > 0) localPlayer.powerCooldowns.shield -= 1 / 30;
    if (localPlayer.powerCooldowns.nature > 0) localPlayer.powerCooldowns.nature -= 1 / 30;
    if (localPlayer.powerCooldowns.thunder > 0) localPlayer.powerCooldowns.thunder -= 1 / 30;
    if (localPlayer.powerCooldowns.blizzard > 0) localPlayer.powerCooldowns.blizzard -= 1 / 30;
    if (localPlayer.powerCooldowns.blackhole > 0) localPlayer.powerCooldowns.blackhole -= 1 / 30;
    if (localPlayer.powerCooldowns.dragon > 0) localPlayer.powerCooldowns.dragon -= 1 / 30;

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

      const len = Math.hypot(dx, dy);
      localPlayer.isSprinting = false;

      // CORRER NO SHIFT
      if (keys.Shift && len > 0 && localPlayer.stamina > 2) {
        localPlayer.isSprinting = true;
        spd *= 1.7; // 70% mais rápido no Shift!
        localPlayer.stamina = Math.max(0, localPlayer.stamina - 0.32); // consome vigor suavemente
        localPlayer.walkStep += 0.44;
        if (Math.random() < 0.35) {
          addParticle(localPlayer.x - (dx / len) * 14, localPlayer.y - (dy / len) * 14 + 10, '#bdc3c7', 2, 2);
        }
      } else if (len > 0) {
        localPlayer.walkStep += 0.28;
      } else {
        localPlayer.walkStep = 0; // Parado: pernas alinhadas e descansadas
      }

      // DASH NO Q (ou Espaço)
      if ((keys.q || keys.Space) && localPlayer.dashCooldown <= 0 && localPlayer.stamina >= 15) {
        performPlayerDash();
        keys.q = false;
        keys.Space = false;
      }

      if (len > 0) {
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

      // Quebra de Barris
      for (let i = serverBreakables.length - 1; i >= 0; i--) {
        const br = serverBreakables[i];
        if (Math.hypot(localPlayer.x - br.x, localPlayer.y - br.y) < localPlayer.radius + br.radius) {
          localPlayer.gold += br.gold;
          addPlayerXp(8);
          addFloatingText(br.x, br.y - 15, '+25 🪙', '#ffd32a');
          sfx.playCoin();
          addParticle(br.x, br.y, '#e67e22', 12, 5);

          // Chance de Dropar Poções!
          if (Math.random() < 0.28) {
            const potList = ['heal', 'speed', 'shield', 'superHeal', 'strength'];
            const droppedPot = potList[Math.floor(Math.random() * potList.length)];
            localPlayer.potions[droppedPot] = (localPlayer.potions[droppedPot] || 0) + 1;
            const potIcons = { heal: '🧪 +1 Néctar', speed: '⚡ +1 Vigor', shield: '🛡️ +1 Escudo', superHeal: '💖 +1 Elixir Vital', strength: '🐉 +1 Sangue de Titã' };
            addFloatingText(br.x, br.y - 35, potIcons[droppedPot], '#2ed573', 15, true);
          }

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

          // Chance Alta de Dropar Poções Raras!
          if (Math.random() < 0.6) {
            const potList = ['superHeal', 'shield', 'strength', 'heal', 'speed'];
            const droppedPot = potList[Math.floor(Math.random() * potList.length)];
            localPlayer.potions[droppedPot] = (localPlayer.potions[droppedPot] || 0) + 1;
            const potIcons = { heal: '🧪 +1 Néctar Curativo', speed: '⚡ +1 Vigor do Vento', shield: '🛡️ +1 Poção de Escudo', superHeal: '💖 +1 Elixir Vital', strength: '🐉 +1 Sangue de Titã' };
            addFloatingText(ch.x, ch.y - 35, potIcons[droppedPot], '#ffd32a', 16, true);
          }

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

      // Ataque / Combate Corpo a Corpo (Espada ou Soco) ou Cajado Mágico
      if (mouse.down && localPlayer.attackCooldown <= 0) {
        executeOfflineAttack(localPlayer, true);
      }
    }

    // Chefes do Mundo
    const bosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0) {
        let bossMoving = false;
        const dToBoss = Math.hypot(localPlayer.x - boss.x, localPlayer.y - boss.y);
        if (dToBoss < 1200 && !localPlayer.isDead) {
          boss.angle = Math.atan2(localPlayer.y - boss.y, localPlayer.x - boss.x);
          boss.x += Math.cos(boss.angle) * boss.speed;
          boss.y += Math.sin(boss.angle) * boss.speed;
          bossMoving = true;

          if (dToBoss < 140 && localPlayer.shieldTimer <= 0) {
            localPlayer.hp = Math.max(0, localPlayer.hp - 35);
            triggerScreenShake(14);
            sfx.playSlam();
            addParticle(boss.x, boss.y, boss.color, 15, 6);
            if (localPlayer.hp <= 0) triggerOfflineDeath();
          }
        }
        if (bossMoving) {
          boss.walkStep = (boss.walkStep || 0) + 0.16;
        } else {
          boss.walkStep = 0; // Parado: pernas alinhadas
        }
      }
    }

    // Dificuldade Dinâmica dos Bots baseada no Poder do Jogador!
    const pRating = getPlayerPowerRating();
    const targetBotMaxHp = Math.round(50 + pRating * 14);
    const targetBotSpeed = Math.min(6.8, 4.6 + pRating * 0.15);
    const targetBotWeapon = pRating > 10 ? 'sword_celestial' : (pRating > 8 ? 'sword_titan' : (pRating > 6 ? 'sword_shadow' : (pRating > 5 ? 'sword_lightning' : (pRating > 4 ? 'sword_fire' : (pRating > 3 ? 'sword_poison' : (pRating > 2 ? 'sword_rune' : (pRating > 1 ? 'sword_iron' : 'sword_starter')))))));
    const botDamage = Math.round(10 + pRating * 2.2);

    // Bots IA Humanoides
    for (const b of serverBots.values()) {
      if (b.hp <= 0 || b.isDead) {
        b.walkStep = 0;
        continue;
      }
      if (b.slashTimer > 0) b.slashTimer -= 1 / 30;
      if (b.dashCooldown > 0) b.dashCooldown -= 1 / 30;
      if (b.attackCooldown > 0) b.attackCooldown -= 1 / 30;
      if (b.stamina === undefined) b.stamina = 100;

      b.inSafeZone = false;

      let isMoving = false;
      b.isSprinting = false;
      const dToPlayer = Math.hypot(localPlayer.x - b.x, localPlayer.y - b.y);

      if (dToPlayer < 850 && !localPlayer.isDead) {
        b.angle = Math.atan2(localPlayer.y - b.y, localPlayer.x - b.x);

        // BOTE DANDO DASH NO Q!
        if (b.dashCooldown <= 0 && b.stamina >= 20 && dToPlayer > 120 && dToPlayer < 380 && Math.random() < 0.045) {
          b.stamina -= 20;
          b.dashCooldown = 2.5 + Math.random() * 2.0;
          const dashDist = 80;
          b.x = Math.max(80, Math.min(arena.width - 80, b.x + Math.cos(b.angle) * dashDist));
          b.y = Math.max(80, Math.min(arena.height - 80, b.y + Math.sin(b.angle) * dashDist));
          if (dToPlayer < 1100) sfx.playDash();
          for (let p = 0; p < 8; p++) {
            addParticle(b.x, b.y, b.color, 2, 4);
          }
          addFloatingText(b.x, b.y - 25, '💨 Dash!', b.color, 14);
        }

        // BOTE CORRENDO NO SHIFT!
        let bSpeed = b.speed;
        if (dToPlayer > 140 && b.stamina > 5) {
          b.isSprinting = true;
          bSpeed *= 1.55; // Correndo no Shift!
          b.stamina = Math.max(0, b.stamina - 0.25);
          if (Math.random() < 0.25) {
            addParticle(b.x, b.y + 10, '#a4b0be', 1, 1.5);
          }
        } else {
          b.stamina = Math.min(100, b.stamina + 20 / 30);
        }

        if (b.weapon === 'staff_astral') {
          // Cajado Druídico: Mantém certa distância e atira projéteis mágicos
          if (dToPlayer > 260) {
            b.x += Math.cos(b.angle) * bSpeed;
            b.y += Math.sin(b.angle) * bSpeed;
            isMoving = true;
          } else {
            b.x += Math.cos(b.angle + Math.PI / 2) * bSpeed;
            b.y += Math.sin(b.angle + Math.PI / 2) * bSpeed;
            isMoving = true;
          }

          if (Math.random() < 0.05 && (!b.attackCooldown || b.attackCooldown <= 0)) {
            b.attackCooldown = 0.5;
            executeOfflineAttack(b, false);
          }
        } else {
          // Espadas e Punhos: Avança para combate corpo a corpo direto (SEM PROJÉTEIS)!
          if (dToPlayer > 55) {
            b.x += Math.cos(b.angle) * bSpeed;
            b.y += Math.sin(b.angle) * bSpeed;
            isMoving = true;
          }
          if (dToPlayer <= 90 && (!b.attackCooldown || b.attackCooldown <= 0)) {
            b.attackCooldown = 0.45;
            executeOfflineAttack(b, false);
          }
        }
      } else {
        b.stamina = Math.min(100, b.stamina + 25 / 30);
        // Patrulha natural: alterna entre andar e ficar parado descansando
        if (b.isWandering === undefined) b.isWandering = Math.random() > 0.4;
        if (Math.random() < 0.02) {
          b.isWandering = !b.isWandering;
          if (b.isWandering) b.angle += (Math.random() - 0.5) * 2;
        }
        if (b.isWandering) {
          b.x += Math.cos(b.angle) * (b.speed * 0.45);
          b.y += Math.sin(b.angle) * (b.speed * 0.45);
          isMoving = true;
        }
      }

      // Limites da Arena (Nunca sai do mapa)
      b.x = Math.max(80, Math.min(arena.width - 80, b.x));
      b.y = Math.max(80, Math.min(arena.height - 80, b.y));

      // Animação de caminhada somente quando está realmente andando
      if (isMoving) {
        b.walkStep = (b.walkStep || 0) + (b.isSprinting ? 0.38 : 0.22);
      } else {
        b.walkStep = 0; // Parado descansando
      }

      if (b.attackCooldown > 0) b.attackCooldown -= 1 / 30;
    }

    // Projéteis Offline
    for (let i = serverProjectiles.length - 1; i >= 0; i--) {
      const pr = serverProjectiles[i];
      pr.x += pr.vx; pr.y += pr.vy; pr.lifetime--;

      let hit = false;
      if (pr.x < 0 || pr.x > arena.width || pr.y < 0 || pr.y > arena.height || pr.lifetime <= 0) hit = true;

      // Colisão de Projéteis com Cristais de Diamante e Gemas Sagradas
      if (!hit) {
        for (let cIdx = serverMineCrystals.length - 1; cIdx >= 0; cIdx--) {
          const cr = serverMineCrystals[cIdx];
          if (Math.hypot(pr.x - cr.x, pr.y - cr.y) < cr.radius + 14) {
            hit = true;
            cr.hp--;
            sfx.playHit();
            addParticle(cr.x, cr.y, cr.color || '#00e5ff', 12, 5);
            addFloatingText(cr.x, cr.y - 20, '-1', cr.color || '#00e5ff', 15);
            if (pr.ownerId === localPlayer.id) {
              localPlayer.gold += 20;
            }
            if (cr.hp <= 0) {
              if (pr.ownerId === localPlayer.id) {
                localPlayer.gold += cr.gold;
                localPlayer.score += 40;
                localPlayer.minedCount = (localPlayer.minedCount || 0) + 1;
                addPlayerXp(15);
                addFloatingText(cr.x, cr.y - 15, `+${cr.gold} 🪙 Diamante Minerado!`, '#ffd32a', 16, true);
                sfx.playCoin();
                addParticle(cr.x, cr.y, '#ffd32a', 20, 7);
                updateKillfeed([{ text: `💎 ${localPlayer.name} minerou um Diamante Sagrado (+${cr.gold} 🪙)!` }]);
                checkOfflineQuestProgress('mine');
              }
              serverMineCrystals.splice(cIdx, 1);
              setTimeout(() => {
                const sp = getOfflineSpawnPoint();
                serverMineCrystals.push({
                  id: 'cry_' + Date.now() + Math.random(),
                  x: sp.x,
                  y: sp.y,
                  hp: 3,
                  maxHp: 3,
                  radius: 20,
                  name: 'Diamante Sagrado',
                  color: ['#00e5ff', '#ff4757', '#a29bfe', '#2ed573'][Math.floor(Math.random() * 4)],
                  gold: 70
                });
              }, 12000);
            }
            break;
          }
        }
      }

      // Colisão de Projéteis com Barris Destrutíveis
      if (!hit) {
        for (let bIdx = serverBreakables.length - 1; bIdx >= 0; bIdx--) {
          const br = serverBreakables[bIdx];
          if (Math.hypot(pr.x - br.x, pr.y - br.y) < br.radius + 12) {
            hit = true;
            if (pr.ownerId === localPlayer.id) {
              localPlayer.gold += br.gold;
              addPlayerXp(8);
              addFloatingText(br.x, br.y - 15, `+${br.gold} 🪙`, '#ffd32a');
              sfx.playCoin();
            }
            addParticle(br.x, br.y, '#e67e22', 12, 5);
            serverBreakables.splice(bIdx, 1);
            setTimeout(() => {
              const sp = getOfflineSpawnPoint();
              serverBreakables.push({
                id: 'brk_' + Date.now() + Math.random(),
                x: sp.x,
                y: sp.y,
                radius: 16,
                gold: 25
              });
            }, 10000);
            break;
          }
        }
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
  localPlayer.walkStep = 0;
  resetAllKeys();
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

  // Renasce na Capital Central (12000, 12000)
  localPlayer.x = 12000 + (Math.random() - 0.5) * 120;
  localPlayer.y = 12000 + (Math.random() - 0.5) * 120;
  localPlayer.hp = localPlayer.maxHp;
  localPlayer.stamina = localPlayer.maxStamina;
  localPlayer.isDead = false;
  localPlayer.shieldTimer = 3; // 3 segundos de invulnerabilidade
  localPlayer.walkStep = 0;
  resetAllKeys();

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
    } else if (msg.name === 'melee_slash') {
      if (msg.weaponId === 'fist') sfx.playPunch();
      else sfx.playSwordSlash();
      activeSpecialEffects.push({
        type: 'melee_slash',
        x: msg.x,
        y: msg.y,
        angle: msg.angle,
        radius: msg.radius || 78,
        color: msg.color || '#00e5ff',
        weaponId: msg.weaponId,
        progress: 0
      });
      const ent = (localPlayer && localPlayer.id === msg.ownerId) ? localPlayer : (serverPlayers.get(msg.ownerId) || serverBots.get(msg.ownerId));
      if (ent) ent.slashTimer = 0.22;
    } else if (msg.name === 'nature_cyclone') {
      sfx.playNatureCyclone();
      activeSpecialEffects.push({
        type: 'nature_cyclone',
        x: msg.x,
        y: msg.y,
        radius: 10,
        color: msg.color || '#2ed573',
        alpha: 1
      });
    } else if (msg.name === 'thunder_strike') {
      sfx.playThunder();
      triggerScreenShake(9);
      activeSpecialEffects.push({
        type: 'thunder_strike',
        x: msg.x,
        y: msg.y,
        radius: msg.radius || 280,
        color: msg.color || '#f1c40f',
        alpha: 1,
        progress: 0
      });
    } else if (msg.name === 'blizzard_blast') {
      sfx.playBlizzard();
      activeSpecialEffects.push({
        type: 'blizzard_blast',
        x: msg.x,
        y: msg.y,
        radius: 10,
        maxRadius: msg.radius || 320,
        color: msg.color || '#74b9ff',
        alpha: 1
      });
    } else if (msg.name === 'black_hole') {
      sfx.playBlackHole();
      triggerScreenShake(7);
      activeSpecialEffects.push({
        type: 'black_hole',
        x: msg.x,
        y: msg.y,
        radius: 10,
        maxRadius: msg.radius || 350,
        color: '#6c5ce7',
        duration: 90,
        alpha: 1
      });
    } else if (msg.name === 'dragon_breath') {
      sfx.playDragon();
      triggerScreenShake(10);
      activeSpecialEffects.push({
        type: 'dragon_breath',
        x: msg.x,
        y: msg.y,
        angle: msg.angle || 0,
        reach: msg.reach || 460,
        color: '#ff4757',
        alpha: 1,
        progress: 0
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
      dash: (keys.q || keys.Space) && !localPlayer.isDead,
      sprint: keys.Shift && !localPlayer.isDead,
      powerSlam: keys.r,
      powerBeam: keys.f,
      powerFire: keys.c,
      powerShield: keys.v,
      powerNature: keys.t,
      powerThunder: keys.g,
      powerBlizzard: keys.b,
      powerBlackHole: keys.z,
      powerDragon: keys.x,
      useHeal: keys['1'],
      useSpeed: keys['2'],
      useSuperHeal: keys['3'],
      useShieldPot: keys['4'],
      useStrengthPot: keys['5'],
      angle: angle
    }
  }));

  if (keys.Space) keys.Space = false;
  if (keys.q) keys.q = false;
  if (keys.r) keys.r = false;
  if (keys.f) keys.f = false;
  if (keys.c) keys.c = false;
  if (keys.v) keys.v = false;
  if (keys.t) keys.t = false;
  if (keys.g) keys.g = false;
  if (keys.b) keys.b = false;
  if (keys.z) keys.z = false;
  if (keys.x) keys.x = false;
  if (keys['1']) keys['1'] = false;
  if (keys['2']) keys['2'] = false;
  if (keys['3']) keys['3'] = false;
  if (keys['4']) keys['4'] = false;
  if (keys['5']) keys['5'] = false;
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
    const qDesc = document.getElementById('quest-desc');
    if (qDesc) qDesc.innerText = `${curQuest.name} (${curQuest.current || 0}/${curQuest.target})`;
    const qRew = document.querySelector('.quest-reward');
    if (qRew) qRew.innerText = `Recompensa: ✨ ${curQuest.powerName || 'Super Poder'}`;
  }

  const cHeal = document.getElementById('count-heal-pot');
  if (cHeal) cHeal.innerText = player.potions?.heal || 0;
  const cSpeed = document.getElementById('count-speed-pot');
  if (cSpeed) cSpeed.innerText = player.potions?.speed || 0;
  const cSuper = document.getElementById('count-super-pot');
  if (cSuper) cSuper.innerText = player.potions?.superHeal || 0;
  const cShield = document.getElementById('count-shield-pot');
  if (cShield) cShield.innerText = player.potions?.shield || 0;
  const cStr = document.getElementById('count-strength-pot');
  if (cStr) cStr.innerText = player.potions?.strength || 0;

  // Indicador de Cooldown do Dash [Q]
  const cdDash = document.getElementById('cd-dash');
  if (cdDash) {
    if (player.dashCooldown > 0) {
      cdDash.style.display = 'flex';
      cdDash.innerText = player.dashCooldown.toFixed(1) + 's';
    } else {
      cdDash.style.display = 'none';
    }
  }

  // Indicador visual de corrida no Shift
  const slotSprint = document.getElementById('slot-sprint');
  if (slotSprint) {
    slotSprint.classList.toggle('active-sprint', !!player.isSprinting);
  }

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
  updatePowerSlot('slot-power-thunder', 'cd-thunder', player.powers?.thunder, player.powerCooldowns?.thunder);
  updatePowerSlot('slot-power-blizzard', 'cd-blizzard', player.powers?.blizzard, player.powerCooldowns?.blizzard);
  updatePowerSlot('slot-power-blackhole', 'cd-blackhole', player.powers?.blackhole, player.powerCooldowns?.blackhole);
  updatePowerSlot('slot-power-dragon', 'cd-dragon', player.powers?.dragon, player.powerCooldowns?.dragon);

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
  resetAllKeys();
  renderQuestsList();
  document.getElementById('quests-modal').style.display = 'flex';
}

function closeQuestsModal() {
  resetAllKeys();
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
  resetAllKeys();
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
  resetAllKeys();
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
      if (itemId === 'potion_heal') localPlayer.potions.heal = (localPlayer.potions.heal || 0) + 1;
      if (itemId === 'potion_speed') localPlayer.potions.speed = (localPlayer.potions.speed || 0) + 1;
      if (itemId === 'potion_super_heal') localPlayer.potions.superHeal = (localPlayer.potions.superHeal || 0) + 1;
      if (itemId === 'potion_shield') localPlayer.potions.shield = (localPlayer.potions.shield || 0) + 1;
      if (itemId === 'potion_strength') localPlayer.potions.strength = (localPlayer.potions.strength || 0) + 1;
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
      ctx.fillStyle = t.fruitColor || '#ff4757';
      ctx.beginPath();
      ctx.arc(t.x - t.size * 0.2, t.y - t.size * 0.32, 3.2, 0, Math.PI * 2);
      ctx.arc(t.x + t.size * 0.24, t.y - t.size * 0.2, 3.5, 0, Math.PI * 2);
      ctx.arc(t.x, t.y - t.size * 0.18, 3.2, 0, Math.PI * 2);
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

  // Aura de Força Dracônica (+60% Dano de Ataque)
  if (ent.strengthTimer > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 71, 87, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff4757';
    ctx.shadowBlur = 16;
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

  // Braço Direito (Arma) com Animação Dinâmica de Corte / Golpe Melee
  ctx.save();
  if (ent.slashTimer > 0) {
    const swingPhase = Math.sin((ent.slashTimer / 0.22) * Math.PI);
    ctx.translate(6, 11);
    ctx.rotate(swingPhase * 0.95 - 0.45);
    ctx.translate(-6, -11);
  }
  ctx.fillStyle = ent.color || '#ff4757';
  ctx.fillRect(0, 8, 12, 6);
  ctx.fillStyle = skin;
  ctx.fillRect(10, 8, 5, 5);

  // 5. Arma Equipada com Brilho Encantado
  drawWeaponSprite(ent.weapon || 'sword_starter', ent.charClass);
  ctx.restore();

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
  if (weaponId === 'fist') {
    // Desarmado / Punhos: Atadura de couro e nós dos dedos fechados (sem lâmina!)
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(12, 7, 7, 7);
    ctx.fillStyle = '#f5cd79';
    ctx.fillRect(16, 8, 4, 5);
  } else if (weaponId === 'sword_iron') {
    // Espada de Ferro Forjado: Lâmina prateada reforçada e cabo de aço escuro
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(14, 5, 4, 10);
    ctx.fillStyle = '#dfe4ea';
    ctx.fillRect(18, 8, 24, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 9, 20, 2);
  } else if (weaponId === 'sword_rune') {
    // Lâmina Rúnica da Floresta: Aço temperado esmeralda com runas azuis
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(14, 8, 25, 5);
    ctx.fillStyle = '#1e90ff';
    ctx.fillRect(14, 6, 5, 9);
    ctx.fillStyle = '#7bed9f';
    ctx.fillRect(19, 9, 17, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(22, 10, 8, 1);
  } else if (weaponId === 'sword_poison') {
    // Espada Venenosa da Serpente: Lâmina verde-ácida com veneno fluorescente
    ctx.fillStyle = '#10ac84';
    ctx.fillRect(14, 5, 5, 10);
    ctx.fillStyle = '#1dd1a1';
    ctx.fillRect(19, 8, 26, 5);
    ctx.fillStyle = '#ee5253';
    ctx.beginPath();
    ctx.arc(16, 10, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#55efc4';
    ctx.fillRect(22, 9, 18, 2);
  } else if (weaponId === 'sword_fire') {
    // Lâmina do Fogo da Mata: Espada incandescente com guarda dourada e lâmina flamejante
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(14, 7, 28, 6);
    ctx.fillStyle = '#ffd32a';
    ctx.fillRect(14, 5, 5, 10);
    ctx.fillStyle = '#ffa502';
    ctx.fillRect(19, 8, 20, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(23, 9, 12, 2);
  } else if (weaponId === 'sword_lightning') {
    // Espada Tempestuosa do Trovão: Lâmina ciano relampejante com choque elétrico
    ctx.fillStyle = '#00d2d3';
    ctx.fillRect(14, 5, 5, 11);
    ctx.fillStyle = '#01a3a4';
    ctx.fillRect(19, 8, 28, 5);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00d2d3';
    ctx.shadowBlur = 8;
    ctx.fillRect(22, 9, 22, 2);
    ctx.shadowBlur = 0;
  } else if (weaponId === 'sword_shadow') {
    // Lâmina Sombria do Crepúsculo: Aço escuro obsidiana com aura violeta
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(14, 5, 5, 11);
    ctx.fillStyle = '#57606f';
    ctx.fillRect(19, 7, 30, 6);
    ctx.fillStyle = '#a29bfe';
    ctx.fillRect(23, 8, 22, 3);
  } else if (weaponId === 'staff_astral') {
    // Cajado Druídico com Orbe Cósmico Roxo/Dourado
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(10, 8, 26, 4);
    ctx.beginPath();
    ctx.arc(38, 10, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd32a';
    ctx.shadowColor = '#ffd32a';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (weaponId === 'sword_titan') {
    // Espada Colossal dos Titãs: Montante gigante de duas mãos largo e pesado
    ctx.fillStyle = '#b33939';
    ctx.fillRect(12, 4, 6, 13);
    ctx.fillStyle = '#d1ccc0';
    ctx.fillRect(18, 6, 36, 8);
    ctx.fillStyle = '#ff5252';
    ctx.fillRect(22, 8, 28, 4);
  } else if (weaponId === 'sword_celestial') {
    // Lâmina Celestial: Lâmina sagrada dourada divina com resplendor radiante
    ctx.fillStyle = '#f9ca24';
    ctx.fillRect(12, 4, 6, 13);
    ctx.fillStyle = '#f6e58d';
    ctx.fillRect(18, 7, 38, 6);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd32a';
    ctx.shadowBlur = 16;
    ctx.fillRect(22, 8, 30, 3);
    ctx.shadowBlur = 0;
  } else {
    // Lâmina de Carvalho Rústica: Empunhadura de madeira nobre e lâmina de ferro polido
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(14, 8, 22, 5);
    ctx.fillStyle = '#e58e26';
    ctx.fillRect(14, 6, 4, 9);
    ctx.fillStyle = '#ced6e0';
    ctx.fillRect(18, 9, 16, 3);
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

  const bStep = boss.walkStep || 0;
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
    } else if (fx.type === 'melee_slash') {
      fx.progress = (fx.progress || 0) + 0.16;
      if (fx.progress >= 1) { activeSpecialEffects.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(fx.x, fx.y);
      ctx.rotate(fx.angle);

      const alpha = Math.sin(fx.progress * Math.PI);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.95));

      const r = fx.radius || 78;
      const arcSpread = 1.15;
      const startArc = -arcSpread + fx.progress * 0.35;
      const endArc = arcSpread + fx.progress * 0.35;

      // Arco brilhante de corte da lâmina / golpe
      ctx.beginPath();
      ctx.arc(0, 0, r, startArc, endArc);
      ctx.strokeStyle = fx.color || '#00e5ff';
      ctx.lineWidth = fx.weaponId === 'fist' ? 5 : 8;
      ctx.shadowColor = fx.color || '#00e5ff';
      ctx.shadowBlur = 18;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Fio da lâmina reluzente (núcleo afiado branco)
      ctx.beginPath();
      ctx.arc(0, 0, r - 3, startArc + 0.1, endArc - 0.05);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Rastro de vento cortante
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, startArc + 0.2, endArc - 0.15);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    } else if (fx.type === 'thunder_strike') {
      fx.progress = (fx.progress || 0) + 0.08;
      fx.alpha -= 0.045;
      if (fx.alpha <= 0 || fx.progress >= 1) { activeSpecialEffects.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = Math.max(0, fx.alpha);

      // Onda de choque elétrica no chão
      const curR = (fx.radius || 280) * fx.progress;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, curR, 0, Math.PI * 2);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00d2d3';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Relâmpagos em Zigue-zague caindo dos céus
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      let boltY = fx.y - 700;
      let boltX = fx.x + (Math.sin(fx.progress * 20) * 40);
      ctx.moveTo(boltX, boltY);
      while (boltY < fx.y) {
        boltY += 45;
        boltX += (Math.random() - 0.5) * 60;
        ctx.lineTo(boltX, boltY);
      }
      ctx.lineTo(fx.x, fx.y);
      ctx.stroke();

      // Feixe secundário de trovão azul elétrico
      ctx.strokeStyle = '#00d2d3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let b2Y = fx.y - 650;
      let b2X = fx.x - 20;
      ctx.moveTo(b2X, b2Y);
      while (b2Y < fx.y) {
        b2Y += 50;
        b2X += (Math.random() - 0.5) * 50;
        ctx.lineTo(b2X, b2Y);
      }
      ctx.lineTo(fx.x, fx.y);
      ctx.stroke();

      // Impacto radiante no solo
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, 45 * (1 - fx.progress), 0, Math.PI * 2);
      ctx.fillStyle = '#f1c40f';
      ctx.shadowBlur = 25;
      ctx.fill();

      ctx.restore();
    } else if (fx.type === 'blizzard_blast') {
      fx.radius += 10;
      fx.alpha -= 0.038;
      if (fx.alpha <= 0) { activeSpecialEffects.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = Math.max(0, fx.alpha);

      // Círculo de gelo expansivo
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#74b9ff';
      ctx.lineWidth = 5;
      ctx.shadowColor = '#00cec9';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // 8 Estilhaços de Cristais Árticos pontiagudos girando
      const shards = 8;
      for (let s = 0; s < shards; s++) {
        const a = (s / shards) * Math.PI * 2 + (fx.radius * 0.02);
        const sx = fx.x + Math.cos(a) * fx.radius;
        const sy = fx.y + Math.sin(a) * fx.radius;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(a + Math.PI / 2);

        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(-6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#74b9ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    } else if (fx.type === 'black_hole') {
      fx.duration = (fx.duration || 90) - 1;
      fx.rot = (fx.rot || 0) + 0.18;
      if (fx.duration <= 0) { activeSpecialEffects.splice(i, 1); continue; }

      const pulse = 1 + Math.sin(Date.now() * 0.015) * 0.15;
      const coreR = 36 * pulse;

      ctx.save();
      ctx.translate(fx.x, fx.y);
      ctx.rotate(fx.rot);

      // Anel de Acreção de Energia do Vazio
      ctx.beginPath();
      ctx.arc(0, 0, (fx.maxRadius || 350) * 0.45 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.4)';
      ctx.lineWidth = 12;
      ctx.shadowColor = '#a29bfe';
      ctx.shadowBlur = 24;
      ctx.stroke();

      // Braços espirais da singularidade
      for (let k = 0; k < 4; k++) {
        const sa = (k / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(0, 0, 75, sa, sa + 1.2);
        ctx.strokeStyle = '#a29bfe';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      // Núcleo Negro Gravitacional Absoluto
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a14';
      ctx.shadowColor = '#6c5ce7';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.strokeStyle = '#6c5ce7';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();
    } else if (fx.type === 'dragon_breath') {
      fx.progress = (fx.progress || 0) + 0.055;
      fx.alpha -= 0.035;
      if (fx.alpha <= 0 || fx.progress >= 1) { activeSpecialEffects.splice(i, 1); continue; }

      ctx.save();
      ctx.translate(fx.x, fx.y);
      ctx.rotate(fx.angle);
      ctx.globalAlpha = Math.max(0, fx.alpha);

      const reach = fx.reach || 460;
      const curReach = reach * Math.min(1, fx.progress * 1.5);
      const halfCone = 0.55; // ~63 graus

      // Camada Externa: Chamas Dracônicas Vermelhas
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(curReach, -Math.sin(halfCone) * curReach);
      ctx.lineTo(curReach * 1.08, 0);
      ctx.lineTo(curReach, Math.sin(halfCone) * curReach);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 71, 87, 0.55)';
      ctx.shadowColor = '#ff4757';
      ctx.shadowBlur = 25;
      ctx.fill();

      // Camada Média: Fogo Dourado Ancestral
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(curReach * 0.85, -Math.sin(halfCone * 0.7) * curReach * 0.85);
      ctx.lineTo(curReach * 0.95, 0);
      ctx.lineTo(curReach * 0.85, Math.sin(halfCone * 0.7) * curReach * 0.85);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 165, 2, 0.75)';
      ctx.fill();

      // Núcleo Incandescente Branco/Amarelo
      ctx.beginPath();
      ctx.moveTo(35, 0);
      ctx.lineTo(curReach * 0.55, -Math.sin(halfCone * 0.4) * curReach * 0.55);
      ctx.lineTo(curReach * 0.65, 0);
      ctx.lineTo(curReach * 0.55, Math.sin(halfCone * 0.4) * curReach * 0.55);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffd32a';
      ctx.shadowBlur = 20;
      ctx.fill();

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
    resetAllKeys();
    return;
  }

  setKey(e, true);

  if (localPlayer && !localPlayer.isDead) {
    const k = (e.key || '').toLowerCase();
    if (k === '1' || e.code === 'Digit1') { keys['1'] = true; useHealPotion(); }
    if (k === '2' || e.code === 'Digit2') { keys['2'] = true; useSpeedPotion(); }
    if (k === '3' || e.code === 'Digit3') { keys['3'] = true; useSuperHealPotion(); }
    if (k === '4' || e.code === 'Digit4') { keys['4'] = true; useShieldPotion(); }
    if (k === '5' || e.code === 'Digit5') { keys['5'] = true; useStrengthPotion(); }
    if (k === 'q' || e.code === 'KeyQ') { performPlayerDash(); }
    if (k === 'r' || e.code === 'KeyR') { keys.r = true; castPowerSlam(); }
    if (k === 'f' || e.code === 'KeyF') { keys.f = true; castPowerBeam(); }
    if (k === 'c' || e.code === 'KeyC') { keys.c = true; castPowerFire(); }
    if (k === 'v' || e.code === 'KeyV') { keys.v = true; castPowerShield(); }
    if (k === 't' || e.code === 'KeyT') { keys.t = true; castPowerNature(); }
    if (k === 'g' || e.code === 'KeyG') { keys.g = true; castPowerThunder(); }
    if (k === 'b' || e.code === 'KeyB') { keys.b = true; castPowerBlizzard(); }
    if (k === 'z' || e.code === 'KeyZ') { keys.z = true; castPowerBlackHole(); }
    if (k === 'x' || e.code === 'KeyX') { keys.x = true; castPowerDragon(); }
    if ((k === 'e' || e.code === 'KeyE') && nearbyNpc) openShop(nearbyNpc);
  }
});

window.addEventListener('keyup', (e) => {
  setKey(e, false);
  const k = (e.key || '').toLowerCase();
  if (k === 'q' || e.code === 'KeyQ') keys.q = false;
  if (k === 'r' || e.code === 'KeyR') keys.r = false;
  if (k === 'f' || e.code === 'KeyF') keys.f = false;
  if (k === 'c' || e.code === 'KeyC') keys.c = false;
  if (k === 'v' || e.code === 'KeyV') keys.v = false;
  if (k === 't' || e.code === 'KeyT') keys.t = false;
  if (k === 'g' || e.code === 'KeyG') keys.g = false;
  if (k === 'b' || e.code === 'KeyB') keys.b = false;
  if (k === 'z' || e.code === 'KeyZ') keys.z = false;
  if (k === 'x' || e.code === 'KeyX') keys.x = false;
  if (k === '1' || e.code === 'Digit1') keys['1'] = false;
  if (k === '2' || e.code === 'Digit2') keys['2'] = false;
  if (k === '3' || e.code === 'Digit3') keys['3'] = false;
  if (k === '4' || e.code === 'Digit4') keys['4'] = false;
  if (k === '5' || e.code === 'Digit5') keys['5'] = false;
});

function setKey(e, isPressed) {
  const code = e.code;
  const k = (e.key || '').toLowerCase();

  // W / A / S / D e Setas Direcionais
  if (code === 'KeyW' || k === 'w') keys.w = isPressed;
  if (code === 'KeyS' || k === 's') keys.s = isPressed;
  if (code === 'KeyA' || k === 'a') keys.a = isPressed;
  if (code === 'KeyD' || k === 'd') keys.d = isPressed;

  if (code === 'KeyG' || k === 'g') keys.g = isPressed;
  if (code === 'KeyB' || k === 'b') keys.b = isPressed;
  if (code === 'KeyZ' || k === 'z') keys.z = isPressed;
  if (code === 'KeyX' || k === 'x') keys.x = isPressed;

  if (code === 'ArrowUp' || e.key === 'ArrowUp') keys.ArrowUp = isPressed;
  if (code === 'ArrowDown' || e.key === 'ArrowDown') keys.ArrowDown = isPressed;
  if (code === 'ArrowLeft' || e.key === 'ArrowLeft') keys.ArrowLeft = isPressed;
  if (code === 'ArrowRight' || e.key === 'ArrowRight') keys.ArrowRight = isPressed;

  if (code === 'KeyQ' || k === 'q') {
    keys.q = isPressed;
    if (isPressed) performPlayerDash();
  }
  if (code === 'Space' || e.key === ' ') {
    keys.Space = isPressed;
    if (isPressed) performPlayerDash();
  }
  if (code === 'ShiftLeft' || code === 'ShiftRight' || k === 'shift') keys.Shift = isPressed;
  if (code === 'KeyE' || k === 'e') keys.e = isPressed;
}

function resetAllKeys() {
  for (const k in keys) {
    keys[k] = false;
  }
  mouse.down = false;
  if (localPlayer) {
    localPlayer.walkStep = 0;
    localPlayer.isSprinting = false;
  }
}

window.addEventListener('blur', resetAllKeys);
window.addEventListener('focus', resetAllKeys);
window.addEventListener('contextmenu', resetAllKeys);

function performPlayerDash() {
  if (!localPlayer || localPlayer.isDead) return;
  if (localPlayer.dashCooldown > 0) return;
  if (localPlayer.stamina < 15) {
    addFloatingText(localPlayer.x, localPlayer.y - 25, 'Sem Vigor!', '#ff4757', 15);
    return;
  }

  localPlayer.stamina -= 15;
  localPlayer.dashCooldown = 0.9;
  sfx.playDash();

  let dx = 0, dy = 0;
  if (keys.w || keys.ArrowUp) dy -= 1;
  if (keys.s || keys.ArrowDown) dy += 1;
  if (keys.a || keys.ArrowLeft) dx -= 1;
  if (keys.d || keys.ArrowRight) dx += 1;

  let dashAngle = localPlayer.angle;
  if (dx !== 0 || dy !== 0) {
    dashAngle = Math.atan2(dy, dx);
  }

  const dashDist = 88;
  const targetX = Math.max(localPlayer.radius, Math.min(arena.width - localPlayer.radius, localPlayer.x + Math.cos(dashAngle) * dashDist));
  const targetY = Math.max(localPlayer.radius, Math.min(arena.height - localPlayer.radius, localPlayer.y + Math.sin(dashAngle) * dashDist));

  let blocked = false;
  for (const b of buildings) {
    if (targetX > b.x - b.w / 2 && targetX < b.x + b.w / 2 &&
        targetY > b.y - b.h / 2 && targetY < b.y + b.h / 2) {
      blocked = true;
      break;
    }
  }
  if (!blocked) {
    localPlayer.x = targetX;
    localPlayer.y = targetY;
  }

  for (let i = 0; i < 14; i++) {
    addParticle(localPlayer.x - Math.cos(dashAngle) * i * 3.5, localPlayer.y - Math.sin(dashAngle) * i * 3.5, localPlayer.color, 2, 4);
  }
  addFloatingText(localPlayer.x, localPlayer.y - 25, '💨 DASH!', '#00e5ff', 16, true);
  updateHUD(localPlayer);
}

function useHealPotion() {
  if (!localPlayer || localPlayer.isDead) return;
  if (localPlayer.potions?.heal > 0 && localPlayer.hp < localPlayer.maxHp) {
    if (isOfflineMode) {
      localPlayer.potions.heal--;
      localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 50);
      sfx.playPotion();
      addParticle(localPlayer.x, localPlayer.y, '#2ed573', 15, 6);
      addFloatingText(localPlayer.x, localPlayer.y - 20, '+50 HP', '#2ed573', 17);
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
      addFloatingText(localPlayer.x, localPlayer.y - 20, '⚡ FÚRIA DO VENTO!', '#ffd32a', 17);
      updateHUD(localPlayer);
    }
  }
}

function useSuperHealPotion() {
  if (!localPlayer || localPlayer.isDead) return;
  if ((localPlayer.potions?.superHeal || 0) > 0 && localPlayer.hp < localPlayer.maxHp) {
    if (isOfflineMode) {
      localPlayer.potions.superHeal--;
      localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 120);
      sfx.playPotion();
      addParticle(localPlayer.x, localPlayer.y, '#ff6b81', 25, 7);
      addFloatingText(localPlayer.x, localPlayer.y - 25, '💖 +120 HP ELIXIR!', '#ff6b81', 18, true);
      updateHUD(localPlayer);
    }
  }
}

function useShieldPotion() {
  if (!localPlayer || localPlayer.isDead) return;
  if ((localPlayer.potions?.shield || 0) > 0) {
    if (isOfflineMode) {
      localPlayer.potions.shield--;
      localPlayer.shieldTimer = Math.max(localPlayer.shieldTimer || 0, 15);
      sfx.playPotion();
      addParticle(localPlayer.x, localPlayer.y, '#00e5ff', 25, 7);
      addFloatingText(localPlayer.x, localPlayer.y - 25, '🛡️ CASCA DE FERRO (+15s)!', '#00e5ff', 18, true);
      updateHUD(localPlayer);
    }
  }
}

function useStrengthPotion() {
  if (!localPlayer || localPlayer.isDead) return;
  if ((localPlayer.potions?.strength || 0) > 0) {
    if (isOfflineMode) {
      localPlayer.potions.strength--;
      localPlayer.strengthTimer = 15;
      sfx.playPotion();
      addParticle(localPlayer.x, localPlayer.y, '#ff4757', 25, 7);
      addFloatingText(localPlayer.x, localPlayer.y - 25, '🐉 SANGUE DE TITÃ (+60% DANO)!', '#ff4757', 18, true);
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

function castPowerThunder() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.thunder) return;
  if (localPlayer.powerCooldowns?.thunder > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.thunder = 9;
    sfx.playThunder();
    triggerScreenShake(9);
    activeSpecialEffects.push({
      type: 'thunder_strike',
      x: localPlayer.x,
      y: localPlayer.y,
      radius: 280,
      color: '#f1c40f',
      alpha: 1,
      progress: 0
    });

    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead && Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y) < 280) {
        b.hp -= 55;
        addFloatingText(b.x, b.y - 25, '⚡ -55', '#f1c40f', 16, true);
        addParticle(b.x, b.y, '#f1c40f', 14, 6);
        const pa = Math.atan2(b.y - localPlayer.y, b.x - localPlayer.x);
        b.x += Math.cos(pa) * 75;
        b.y += Math.sin(pa) * 75;
        if (b.hp <= 0) {
          b.hp = 0;
          b.isDead = true;
          localPlayer.score += 100;
          localPlayer.gold += 70;
          addPlayerXp(40);
          sfx.playCoin();
          updateKillfeed([{ text: `⚡ ${localPlayer.name} fulminou ${b.name} com o Trovão (+70 🪙)!` }]);
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

    const bosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0 && Math.hypot(boss.x - localPlayer.x, boss.y - localPlayer.y) < 300) {
        boss.hp -= 65;
        addFloatingText(boss.x, boss.y - 40, '⚡ -65', '#f1c40f', 20, true);
        addParticle(boss.x, boss.y, '#f1c40f', 18, 7);
        if (boss.hp <= 0) {
          localPlayer.gold += 300;
          localPlayer.score += 600;
          addPlayerXp(250);
          checkOfflineQuestProgress('boss');
          addFloatingText(boss.x, boss.y - 50, '+300 🪙', '#ffd32a', 22, true);
          sfx.playCoin();
          updateKillfeed([{ text: `👑 ${localPlayer.name} fulminou ${boss.name.toUpperCase()} (+300 🪙)!` }]);
          boss.hp = 0;
        }
      }
    }
    updateHUD(localPlayer);
  }
}

function castPowerBlizzard() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.blizzard) return;
  if (localPlayer.powerCooldowns?.blizzard > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.blizzard = 8;
    sfx.playBlizzard();
    activeSpecialEffects.push({
      type: 'blizzard_blast',
      x: localPlayer.x,
      y: localPlayer.y,
      radius: 10,
      maxRadius: 320,
      color: '#74b9ff',
      alpha: 1
    });

    // Dispara 8 estilhaços de gelo em 360 graus
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      serverProjectiles.push({
        id: Math.random(),
        ownerId: localPlayer.id,
        color: '#74b9ff',
        damage: 34,
        x: localPlayer.x + Math.cos(a) * 35,
        y: localPlayer.y + Math.sin(a) * 35,
        vx: Math.cos(a) * 15,
        vy: Math.sin(a) * 15,
        lifetime: 60
      });
    }

    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead && Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y) < 260) {
        b.hp -= 30;
        addFloatingText(b.x, b.y - 25, '❄️ -30', '#74b9ff', 15);
        addParticle(b.x, b.y, '#74b9ff', 12, 5);
        if (b.hp <= 0) {
          b.hp = 0;
          b.isDead = true;
          localPlayer.score += 100;
          localPlayer.gold += 70;
          addPlayerXp(40);
          sfx.playCoin();
          updateKillfeed([{ text: `❄️ ${localPlayer.name} congelou ${b.name} na Nevasca (+70 🪙)!` }]);
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

function castPowerBlackHole() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.blackhole) return;
  if (localPlayer.powerCooldowns?.blackhole > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.blackhole = 11;
    sfx.playBlackHole();
    triggerScreenShake(8);

    const holeX = localPlayer.x + Math.cos(localPlayer.angle) * 180;
    const holeY = localPlayer.y + Math.sin(localPlayer.angle) * 180;

    activeSpecialEffects.push({
      type: 'black_hole',
      x: holeX,
      y: holeY,
      radius: 10,
      maxRadius: 350,
      color: '#6c5ce7',
      duration: 90,
      alpha: 1
    });

    // Puxa e causa dano de colapso gravitacional
    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead && Math.hypot(b.x - holeX, b.y - holeY) < 350) {
        b.hp -= 68;
        addFloatingText(b.x, b.y - 25, '🌑 -68', '#a29bfe', 17, true);
        addParticle(b.x, b.y, '#6c5ce7', 15, 6);
        // Atração gravitacional forte para o centro do buraco negro
        const pa = Math.atan2(holeY - b.y, holeX - b.x);
        b.x += Math.cos(pa) * 120;
        b.y += Math.sin(pa) * 120;
        if (b.hp <= 0) {
          b.hp = 0;
          b.isDead = true;
          localPlayer.score += 100;
          localPlayer.gold += 70;
          addPlayerXp(40);
          sfx.playCoin();
          updateKillfeed([{ text: `🌑 ${localPlayer.name} tragou ${b.name} para o Vazio (+70 🪙)!` }]);
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

    const bosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0 && Math.hypot(boss.x - holeX, boss.y - holeY) < 360) {
        boss.hp -= 75;
        addFloatingText(boss.x, boss.y - 40, '🌑 -75', '#a29bfe', 20, true);
        addParticle(boss.x, boss.y, '#6c5ce7', 18, 7);
        if (boss.hp <= 0) {
          localPlayer.gold += 300;
          localPlayer.score += 600;
          addPlayerXp(250);
          checkOfflineQuestProgress('boss');
          addFloatingText(boss.x, boss.y - 50, '+300 🪙', '#ffd32a', 22, true);
          sfx.playCoin();
          updateKillfeed([{ text: `👑 ${localPlayer.name} engoliu ${boss.name.toUpperCase()} no Vazio (+300 🪙)!` }]);
          boss.hp = 0;
        }
      }
    }
    updateHUD(localPlayer);
  }
}

function castPowerDragon() {
  if (!localPlayer || localPlayer.isDead || !localPlayer.powers?.dragon) return;
  if (localPlayer.powerCooldowns?.dragon > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.dragon = 13;
    sfx.playDragon();
    triggerScreenShake(11);

    activeSpecialEffects.push({
      type: 'dragon_breath',
      x: localPlayer.x,
      y: localPlayer.y,
      angle: localPlayer.angle,
      reach: 460,
      color: '#ff4757',
      alpha: 1,
      progress: 0
    });

    const maxReach = 460;
    const maxCone = 0.65; // ~74 graus

    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.isDead) {
        const dist = Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y);
        if (dist <= maxReach) {
          const dir = Math.atan2(b.y - localPlayer.y, b.x - localPlayer.x);
          if (calcAngleDiff(dir, localPlayer.angle) < maxCone) {
            b.hp -= 85;
            addFloatingText(b.x, b.y - 25, '🐉 -85 CRÍTICO!', '#ff4757', 18, true);
            addParticle(b.x, b.y, '#ff4757', 16, 7);
            b.x += Math.cos(localPlayer.angle) * 70;
            b.y += Math.sin(localPlayer.angle) * 70;
            if (b.hp <= 0) {
              b.hp = 0;
              b.isDead = true;
              localPlayer.score += 100;
              localPlayer.gold += 70;
              addPlayerXp(40);
              sfx.playCoin();
              updateKillfeed([{ text: `🐉 ${localPlayer.name} incinerou ${b.name} com o Sopro Dracônico (+70 🪙)!` }]);
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
    }

    const bosses = [serverWorldBoss, serverSecondBoss, serverThirdBoss, serverFourthBoss];
    for (const boss of bosses) {
      if (boss && boss.hp > 0) {
        const dist = Math.hypot(boss.x - localPlayer.x, boss.y - localPlayer.y);
        if (dist <= maxReach + boss.radius) {
          const dir = Math.atan2(boss.y - localPlayer.y, boss.x - localPlayer.x);
          if (calcAngleDiff(dir, localPlayer.angle) < maxCone) {
            boss.hp -= 110;
            addFloatingText(boss.x, boss.y - 45, '🐉 -110 TITÂNICO!', '#ff4757', 24, true);
            addParticle(boss.x, boss.y, '#ff4757', 22, 8);
            if (boss.hp <= 0) {
              localPlayer.gold += 300;
              localPlayer.score += 600;
              addPlayerXp(250);
              checkOfflineQuestProgress('boss');
              addFloatingText(boss.x, boss.y - 50, '+300 🪙', '#ffd32a', 22, true);
              sfx.playCoin();
              updateKillfeed([{ text: `👑 ${localPlayer.name} incinerou ${boss.name.toUpperCase()} com Fogo Dracônico (+300 🪙)!` }]);
              boss.hp = 0;
            }
          }
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

const sDash = document.getElementById('slot-dash');
if (sDash) sDash.addEventListener('click', performPlayerDash);

const sSprint = document.getElementById('slot-sprint');
if (sSprint) sSprint.addEventListener('click', () => {
  if (localPlayer) addFloatingText(localPlayer.x, localPlayer.y - 25, 'Segure [Shift] para Correr!', '#ffd32a', 15);
});

document.getElementById('slot-potion-heal')?.addEventListener('click', useHealPotion);
document.getElementById('slot-potion-speed')?.addEventListener('click', useSpeedPotion);
document.getElementById('slot-potion-super')?.addEventListener('click', useSuperHealPotion);
document.getElementById('slot-potion-shield')?.addEventListener('click', useShieldPotion);
document.getElementById('slot-potion-strength')?.addEventListener('click', useStrengthPotion);

const mDash = document.getElementById('btn-mobile-dash');
if (mDash) mDash.addEventListener('click', performPlayerDash);

const mSprint = document.getElementById('btn-mobile-sprint');
if (mSprint) {
  const startSp = (e) => { e.preventDefault(); keys.Shift = true; };
  const endSp = (e) => { e.preventDefault(); keys.Shift = false; };
  mSprint.addEventListener('touchstart', startSp, { passive: false });
  mSprint.addEventListener('touchend', endSp, { passive: false });
  mSprint.addEventListener('mousedown', startSp);
  mSprint.addEventListener('mouseup', endSp);
}

document.getElementById('slot-power-slam')?.addEventListener('click', castPowerSlam);
document.getElementById('slot-power-beam')?.addEventListener('click', castPowerBeam);
document.getElementById('slot-power-fire')?.addEventListener('click', castPowerFire);
document.getElementById('slot-power-shield')?.addEventListener('click', castPowerShield);
document.getElementById('slot-power-nature')?.addEventListener('click', castPowerNature);
document.getElementById('slot-power-thunder')?.addEventListener('click', castPowerThunder);
document.getElementById('slot-power-blizzard')?.addEventListener('click', castPowerBlizzard);
document.getElementById('slot-power-blackhole')?.addEventListener('click', castPowerBlackHole);
document.getElementById('slot-power-dragon')?.addEventListener('click', castPowerDragon);

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
      localPlayer.powers = {
        slam: false, beam: false, fire: false, shield: false, nature: false,
        thunder: false, blizzard: false, blackhole: false, dragon: false,
        ...(saved.powers || {})
      };
      const savedQuestsMap = new Map((saved.activeQuests || []).map(q => [q.id, q]));
      localPlayer.activeQuests = POWER_QUESTS.map(q => {
        const sq = savedQuestsMap.get(q.id);
        const pKey = q.rewardPower.replace('power_', '');
        const powerAlreadyUnlocked = !!localPlayer.powers[pKey];
        if (powerAlreadyUnlocked) {
          return { ...q, current: q.target, completed: true };
        }
        const cur = sq ? Math.min(q.target, sq.current || 0) : 0;
        return { ...q, current: cur, completed: cur >= q.target };
      });
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
