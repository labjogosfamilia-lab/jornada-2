// =============================================================
// JORNADA II: ARENA & CIDADE DOS CAMPEÕES (CLIENTE MULTIPLAYER)
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
    const startFreq = color === '#ff4757' ? 400 : (color === '#ffd32a' ? 700 : 550);
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
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
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
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
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
}

const sfx = new SoundFX();

// -------------------------------------------------------------
// Inicialização do Canvas e Estado do Jogo
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

// Dados de Rede e Mundo
let socket = null;
let myId = null;
let arena = { width: 3600, height: 3600 };
let city = { x: 1800, y: 1800, radius: 320, name: 'Cidade dos Guardiões' };
let npcs = [
  { id: 'npc_blacksmith', name: 'Brok, o Ferreiro', icon: '🔨', x: 1720, y: 1760, radius: 28, type: 'weapons' },
  { id: 'npc_alchemist', name: 'Sylva, a Alquimista', icon: '🧪', x: 1880, y: 1760, radius: 28, type: 'potions' },
  { id: 'npc_mage', name: 'Mago Elidor', icon: '🧙‍♂️', x: 1800, y: 1880, radius: 28, type: 'powers' }
];

let shopCatalog = {
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

let obstacles = [];
let localPlayer = null;

// Snapshots de Entidades
let serverPlayers = new Map();
let serverBots = new Map();
let serverProjectiles = [];
let serverChests = [];
let serverOrbs = [];
let particles = [];
let activeSpecialEffects = []; // Linhas de raio astral e ondas sísmicas

// Câmera
const camera = { x: 1800, y: 1800 };

// Teclado e Entrada
const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
  Space: false, Shift: false,
  r: false, f: false, e: false, '1': false, '2': false
};
const mouse = { x: screenWidth / 2, y: screenHeight / 2, down: false };
let nearbyNpc = null;
let currentShopTab = 'weapons';

// Partículas
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

// Simulação Local com Bots caso servidor esteja offline
function startOfflineSimulation() {
  if (isOfflineMode) return;
  isOfflineMode = true;

  const dot = document.getElementById('server-status-dot');
  const pingInd = document.getElementById('ping-indicator');
  if (dot) dot.innerText = '🤖 Modo Bots (Offline)';
  if (pingInd) pingInd.innerText = '60 FPS (Local)';

  // Gera mapa offline completo
  obstacles = [
    { x: 1800, y: 1480, radius: 45, type: 'city_gate', label: 'Portão Norte' },
    { x: 1800, y: 2120, radius: 45, type: 'city_gate', label: 'Portão Sul' },
    { x: 1480, y: 1800, radius: 45, type: 'city_gate', label: 'Portão Oeste' },
    { x: 2120, y: 1800, radius: 45, type: 'city_gate', label: 'Portão Leste' },
    { x: 800, y: 800, radius: 95, type: 'sanctuary', label: 'Carvalho Ancestral' },
    { x: 600, y: 1100, radius: 65, type: 'rock', label: 'Monólito da Floresta' },
    { x: 2800, y: 800, radius: 95, type: 'pillar', label: 'Templo Glacial de Niflheim' },
    { x: 800, y: 2800, radius: 95, type: 'pillar', label: 'Labirinto das Sombras' },
    { x: 2800, y: 2800, radius: 100, type: 'pillar', label: 'Núcleo da Forja Ardente' }
  ];

  myId = 'local_hero';
  localPlayer = {
    id: myId,
    name: document.getElementById('player-name')?.value?.trim() || 'Guilherme',
    color: selectedColor || '#00e5ff',
    x: 1800,
    y: 1800,
    vx: 0,
    vy: 0,
    speed: 6.5,
    angle: 0,
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    gold: 150, // Ouro para testar lojas
    score: 0,
    kills: 0,
    weapon: 'sword_starter',
    potions: { heal: 1, speed: 1 },
    powers: { slam: false, beam: false },
    powerCooldowns: { slam: 0, beam: 0 },
    dashCooldown: 0,
    attackCooldown: 0,
    speedBoostTimer: 0,
    inSafeZone: true,
    radius: 24
  };
  serverPlayers.set(myId, localPlayer);

  // Baús de Ouro
  serverChests = [];
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 600 + Math.random() * 1000;
    serverChests.push({
      id: 'ch_' + i,
      x: 1800 + Math.cos(angle) * r,
      y: 1800 + Math.sin(angle) * r,
      radius: 18,
      gold: 40 + Math.floor(Math.random() * 30)
    });
  }

  // Orbes
  serverOrbs = [];
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 500 + Math.random() * 1100;
    serverOrbs.push({
      id: 'orb_' + i,
      x: 1800 + Math.cos(angle) * r,
      y: 1800 + Math.sin(angle) * r,
      type: Math.random() > 0.5 ? 'heal' : 'energy',
      value: 30,
      radius: 14
    });
  }

  // 12 Bots ESPALHADOS pelos 4 biomas
  const BOT_NAMES = ['Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane', 'Sentinela Kael', 'Caçador Rex', 'Guardião Thorne', 'Lorde Malakor', 'Druida Rowan', 'Lâmina Lyra', 'Paladino Uther', 'Andarilho Jarek'];
  serverBots.clear();
  BOT_NAMES.forEach((bName, idx) => {
    const angle = (idx / BOT_NAMES.length) * Math.PI * 2;
    const r = 700 + Math.random() * 800; // Espalhados longe da cidade!
    serverBots.set('bot_' + idx, {
      id: 'bot_' + idx,
      isBot: true,
      name: bName + ' (BOT)',
      color: ['#ff4757', '#ffa502', '#70a1ff', '#2ed573', '#a29bfe'][idx % 5],
      x: 1800 + Math.cos(angle) * r,
      y: 1800 + Math.sin(angle) * r,
      vx: 0,
      vy: 0,
      speed: 5.5,
      angle: Math.random() * Math.PI * 2,
      hp: 100,
      maxHp: 100,
      gold: 50,
      score: 0,
      weapon: idx % 2 === 0 ? 'sword_rune' : 'sword_starter',
      radius: 24,
      dashCooldown: 0,
      attackCooldown: 0
    });
  });

  // Loop de simulação offline
  offlineSimulationInterval = setInterval(() => {
    if (!isOfflineMode || !localPlayer) return;

    // Checa se está na Cidade
    const dCity = Math.hypot(localPlayer.x - city.x, localPlayer.y - city.y);
    localPlayer.inSafeZone = dCity < city.radius;
    if (localPlayer.inSafeZone && localPlayer.hp < localPlayer.maxHp) {
      localPlayer.hp = Math.min(localPlayer.maxHp, localPlayer.hp + 6 / 30);
    }

    // Cooldowns
    if (localPlayer.dashCooldown > 0) localPlayer.dashCooldown -= 1 / 30;
    if (localPlayer.attackCooldown > 0) localPlayer.attackCooldown -= 1 / 30;
    if (localPlayer.stamina < 100) localPlayer.stamina = Math.min(100, localPlayer.stamina + 20 / 30);
    if (localPlayer.speedBoostTimer > 0) localPlayer.speedBoostTimer -= 1 / 30;
    if (localPlayer.powerCooldowns.slam > 0) localPlayer.powerCooldowns.slam -= 1 / 30;
    if (localPlayer.powerCooldowns.beam > 0) localPlayer.powerCooldowns.beam -= 1 / 30;

    // Movimentação
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
      localPlayer.x = Math.max(localPlayer.radius, Math.min(arena.width - localPlayer.radius, localPlayer.x + (dx / len) * spd));
      localPlayer.y = Math.max(localPlayer.radius, Math.min(arena.height - localPlayer.radius, localPlayer.y + (dy / len) * spd));
    }

    // Coleta de Baús de Ouro
    for (let i = serverChests.length - 1; i >= 0; i--) {
      const ch = serverChests[i];
      if (Math.hypot(localPlayer.x - ch.x, localPlayer.y - ch.y) < localPlayer.radius + ch.radius) {
        localPlayer.gold += ch.gold;
        localPlayer.score += 25;
        sfx.playCoin();
        addParticle(ch.x, ch.y, '#ffd32a', 15, 6);
        updateKillfeed([{ text: `🪙 ${localPlayer.name} abriu um baú ancestral (+${ch.gold} Ouro)!` }]);
        serverChests.splice(i, 1);
        break;
      }
    }

    // Coleta de Orbes
    for (let i = serverOrbs.length - 1; i >= 0; i--) {
      const o = serverOrbs[i];
      if (Math.hypot(localPlayer.x - o.x, localPlayer.y - o.y) < localPlayer.radius + o.radius) {
        if (o.type === 'heal') localPlayer.hp = Math.min(100, localPlayer.hp + 30);
        else localPlayer.stamina = Math.min(100, localPlayer.stamina + 30);
        sfx.playPotion();
        serverOrbs.splice(i, 1);
        break;
      }
    }

    // Ataque local com arma ativa (somente fora da cidade)
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
            lifetime: 55
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
          lifetime: 55
        });
      }
    }

    // Bots IA Offline
    for (const b of serverBots.values()) {
      if (b.hp <= 0) continue;
      const dToCity = Math.hypot(b.x - city.x, b.y - city.y);
      b.inSafeZone = dToCity < city.radius;

      const dToPlayer = Math.hypot(localPlayer.x - b.x, localPlayer.y - b.y);
      if (dToPlayer < 750 && !localPlayer.inSafeZone && !b.inSafeZone) {
        b.angle = Math.atan2(localPlayer.y - b.y, localPlayer.x - b.x);
        if (dToPlayer > 260) {
          b.x += Math.cos(b.angle) * b.speed;
          b.y += Math.sin(b.angle) * b.speed;
        } else {
          b.x += Math.cos(b.angle + Math.PI / 2) * b.speed;
          b.y += Math.sin(b.angle + Math.PI / 2) * b.speed;
        }

        if (Math.random() < 0.06 && (!b.attackCooldown || b.attackCooldown <= 0)) {
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
            lifetime: 55
          });
        }
      } else {
        // Passeia pelo bioma
        b.x += Math.cos(b.angle) * (b.speed * 0.6);
        b.y += Math.sin(b.angle) * (b.speed * 0.6);
        if (Math.random() < 0.02) b.angle += (Math.random() - 0.5) * 1.5;
      }
      if (b.attackCooldown > 0) b.attackCooldown -= 1 / 30;
    }

    // Projéteis offline
    for (let i = serverProjectiles.length - 1; i >= 0; i--) {
      const pr = serverProjectiles[i];
      pr.x += pr.vx;
      pr.y += pr.vy;
      pr.lifetime--;

      let hit = false;
      if (pr.x < 0 || pr.x > arena.width || pr.y < 0 || pr.y > arena.height || pr.lifetime <= 0) hit = true;

      // Destrói ao atingir muralha da cidade
      if (!hit && Math.hypot(pr.x - city.x, pr.y - city.y) < city.radius) hit = true;

      if (!hit) {
        if (pr.ownerId !== localPlayer.id && !localPlayer.inSafeZone && Math.hypot(pr.x - localPlayer.x, pr.y - localPlayer.y) < localPlayer.radius + 6) {
          hit = true;
          localPlayer.hp = Math.max(0, localPlayer.hp - pr.damage);
          sfx.playHit();
          addParticle(pr.x, pr.y, pr.color, 8, 5);
          if (localPlayer.hp <= 0) {
            setTimeout(() => { localPlayer.hp = 100; localPlayer.x = 1800; localPlayer.y = 1800; }, 2500);
          }
        }

        for (const b of serverBots.values()) {
          if (pr.ownerId !== b.id && b.hp > 0 && !b.inSafeZone && Math.hypot(pr.x - b.x, pr.y - b.y) < b.radius + 6) {
            hit = true;
            b.hp -= pr.damage;
            sfx.playHit();
            addParticle(pr.x, pr.y, pr.color, 8, 5);
            if (b.hp <= 0) {
              b.hp = 0;
              localPlayer.score += 100;
              localPlayer.gold += 65;
              sfx.playCoin();
              updateKillfeed([{ text: `⚡ ${localPlayer.name} derrotou ${b.name} (+65 🪙)!` }]);
              setTimeout(() => {
                b.hp = 100;
                b.x = 1800 + (Math.random() - 0.5) * 1600;
                b.y = 1800 + (Math.random() - 0.5) * 1600;
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

function handleServerMessage(msg) {
  if (msg.type === 'welcome') {
    myId = msg.id;
    arena = msg.arena;
    city = msg.city || city;
    npcs = msg.npcs || npcs;
    shopCatalog = msg.catalog || shopCatalog;
    obstacles = msg.obstacles;
    localPlayer = msg.player;
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
    serverChests = msg.chests || [];
    serverOrbs = msg.orbs || [];

    updateLeaderboard();
  } else if (msg.type === 'killfeed') {
    updateKillfeed(msg.feed);
  } else if (msg.type === 'chat') {
    addChatMessage(msg.sender, msg.color, msg.text);
  } else if (msg.type === 'hit') {
    sfx.playHit();
    addParticle(msg.x, msg.y, msg.color || '#ff4757', 8, 5);
  } else if (msg.type === 'effect') {
    if (msg.name === 'dash') {
      sfx.playDash();
      addParticle(msg.x, msg.y, msg.color || '#00e5ff', 12, 6);
    } else if (msg.name === 'chest_opened') {
      sfx.playCoin();
      addParticle(msg.x, msg.y, '#ffd32a', 18, 7);
    } else if (msg.name === 'heal') {
      sfx.playPotion();
      addParticle(msg.x, msg.y, '#2ed573', 15, 6);
    } else if (msg.name === 'speed_boost') {
      sfx.playPotion();
      addParticle(msg.x, msg.y, '#ffd32a', 15, 7);
    } else if (msg.name === 'seismic_slam') {
      sfx.playSlam();
      activeSpecialEffects.push({
        type: 'slam_wave',
        x: msg.x,
        y: msg.y,
        radius: 10,
        maxRadius: msg.radius || 200,
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
    }
  }
}

// -------------------------------------------------------------
// Envio Periódico de Entrada
// -------------------------------------------------------------
function sendInput() {
  if (!socket || socket.readyState !== WebSocket.OPEN || !localPlayer) return;

  const angle = Math.atan2(mouse.y - screenHeight / 2, mouse.x - screenWidth / 2);
  const isUp = keys.w || keys.ArrowUp;
  const isDown = keys.s || keys.ArrowDown;
  const isLeft = keys.a || keys.ArrowLeft;
  const isRight = keys.d || keys.ArrowRight;
  const isAttack = mouse.down;
  const isDash = keys.Space || keys.Shift;
  const isSlam = keys.r;
  const isBeam = keys.f;
  const isUseHeal = keys['1'];
  const isUseSpeed = keys['2'];

  socket.send(JSON.stringify({
    type: 'input',
    input: {
      up: isUp,
      down: isDown,
      left: isLeft,
      right: isRight,
      attack: isAttack,
      dash: isDash,
      powerSlam: isSlam,
      powerBeam: isBeam,
      useHeal: isUseHeal,
      useSpeed: isUseSpeed,
      angle: angle
    }
  }));

  if (isDash) keys.Space = false;
  if (isSlam) keys.r = false;
  if (isBeam) keys.f = false;
  if (isUseHeal) keys['1'] = false;
  if (isUseSpeed) keys['2'] = false;
}
setInterval(sendInput, 1000 / 30);

// -------------------------------------------------------------
// Atualização de HUD
// -------------------------------------------------------------
function updateHUD(player) {
  // HP e Stamina
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const staminaPercent = Math.max(0, Math.min(100, (player.stamina / 100) * 100));

  document.getElementById('hp-bar').style.width = `${hpPercent}%`;
  document.getElementById('hp-val').innerText = `${Math.round(player.hp)} / ${player.maxHp}`;
  document.getElementById('stamina-bar').style.width = `${staminaPercent}%`;
  document.getElementById('stamina-val').innerText = `${Math.round(player.stamina)} / 100`;

  // Ouro
  document.getElementById('gold-val').innerText = player.gold || 0;

  // Safe Zone Banner
  const banner = document.getElementById('safe-zone-banner');
  if (banner) {
    banner.style.display = player.inSafeZone ? 'block' : 'none';
  }

  // Poções no Quick Slot
  const healCount = player.potions?.heal || 0;
  const speedCount = player.potions?.speed || 0;
  document.getElementById('count-heal-pot').innerText = healCount;
  document.getElementById('count-speed-pot').innerText = speedCount;

  // Poderes e Cooldowns
  const slamSlot = document.getElementById('slot-power-slam');
  const beamSlot = document.getElementById('slot-power-beam');
  const slamCd = document.getElementById('cd-slam');
  const beamCd = document.getElementById('cd-beam');

  if (player.powers?.slam) {
    slamSlot.classList.remove('locked');
    if (player.powerCooldowns?.slam > 0) {
      slamCd.style.display = 'flex';
      slamCd.innerText = Math.ceil(player.powerCooldowns.slam) + 's';
    } else {
      slamCd.style.display = 'none';
    }
  } else {
    slamSlot.classList.add('locked');
    slamCd.style.display = 'none';
  }

  if (player.powers?.beam) {
    beamSlot.classList.remove('locked');
    if (player.powerCooldowns?.beam > 0) {
      beamCd.style.display = 'flex';
      beamCd.innerText = Math.ceil(player.powerCooldowns.beam) + 's';
    } else {
      beamCd.style.display = 'none';
    }
  } else {
    beamSlot.classList.add('locked');
    beamCd.style.display = 'none';
  }

  // Proximidade com NPCs para abrir a Loja
  checkNpcProximity(player);
}

function checkNpcProximity(player) {
  let foundNpc = null;
  for (const npc of npcs) {
    const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (dist < 85) {
      foundNpc = npc;
      break;
    }
  }

  nearbyNpc = foundNpc;
  const promptEl = document.getElementById('npc-interact-prompt');
  if (foundNpc) {
    promptEl.style.display = 'block';
    promptEl.innerHTML = `💬 [E] Falar com <b>${foundNpc.name}</b>`;
  } else {
    promptEl.style.display = 'none';
  }
}

// -------------------------------------------------------------
// Sistema da Loja da Cidade
// -------------------------------------------------------------
function openShop(npc = null) {
  const modal = document.getElementById('shop-modal');
  const title = document.getElementById('shop-npc-title');
  if (npc) {
    title.innerHTML = `${npc.icon} ${npc.name}`;
    currentShopTab = npc.type; // Abre direto na aba correspondente
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
    if (currentShopTab === 'powers' && ((item.id === 'power_slam' && localPlayer?.powers?.slam) || (item.id === 'power_beam' && localPlayer?.powers?.beam))) isOwned = true;

    card.innerHTML = `
      <div class="shop-item-info">
        <h4>${item.icon || '⚔️'} ${item.name}</h4>
        <p>${item.desc}</p>
      </div>
      <button class="btn-buy-item ${isOwned ? 'owned' : ''}" data-id="${item.id}" data-category="${currentShopTab}">
        ${isOwned ? 'EQUIPADO' : `🪙 ${item.cost} Ouro`}
      </button>
    `;
    container.appendChild(card);
  });

  // Eventos de Compra
  container.querySelectorAll('.btn-buy-item:not(.owned)').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      const itemId = btn.dataset.id;
      buyItem(cat, itemId);
    });
  });
}

function buyItem(category, itemId) {
  const item = shopCatalog[category]?.find(it => it.id === itemId);
  if (!item || !localPlayer) return;

  if (localPlayer.gold < item.cost) {
    alert('Ouro insuficiente! Explore os biomas e derrote inimigos para conseguir mais ouro!');
    return;
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'buy_item',
      category: category,
      itemId: itemId
    }));
  } else {
    // Processamento Offline
    localPlayer.gold -= item.cost;
    sfx.playCoin();
    if (category === 'weapons') localPlayer.weapon = item.id;
    if (category === 'potions') {
      if (itemId === 'potion_heal') localPlayer.potions.heal++;
      if (itemId === 'potion_speed') localPlayer.potions.speed++;
    }
    if (category === 'powers') {
      if (itemId === 'power_slam') localPlayer.powers.slam = true;
      if (itemId === 'power_beam') localPlayer.powers.beam = true;
    }
    updateHUD(localPlayer);
    renderShopItems();
  }
}

// -------------------------------------------------------------
// Renderização Principal do Jogo (60+ FPS)
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

  // 1. Grade de Fundo e Biomas
  drawWorldBackground();

  // 2. Cidade Sagrada Central (Safe Zone)
  drawCity();

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

  // 4. Baús de Ouro (Chests)
  for (const ch of serverChests) {
    drawChest(ch);
  }

  // 5. Obstáculos e Templos
  for (const obs of obstacles) {
    drawObstacle(obs);
  }

  // 6. NPCs da Cidade
  for (const npc of npcs) {
    drawNpc(npc);
  }

  // 7. Efeitos Especiais de Poderes (Ondas Sísmicas e Raios Astrais)
  drawSpecialEffects();

  // 8. Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  // 9. Projéteis
  for (const pr of serverProjectiles) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = pr.color || '#00e5ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }

  // 10. Bots Espalhados
  for (const bot of serverBots.values()) {
    drawEntity(bot);
  }

  // 11. Jogadores
  for (const player of serverPlayers.values()) {
    drawEntity(player);
  }

  ctx.restore();

  // 12. Minimapa Tático
  drawMinimap();
}

function drawWorldBackground() {
  const gridSize = 120;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;

  const startX = Math.max(0, Math.floor((camera.x - screenWidth / 2) / gridSize) * gridSize);
  const endX = Math.min(arena.width, Math.ceil((camera.x + screenWidth / 2) / gridSize) * gridSize);
  const startY = Math.max(0, Math.floor((camera.y - screenHeight / 2) / gridSize) * gridSize);
  const endY = Math.min(arena.height, Math.ceil((camera.y + screenHeight / 2) / gridSize) * gridSize);

  ctx.beginPath();
  for (let x = startX; x <= endX; x += gridSize) {
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
  }
  for (let y = startY; y <= endY; y += gridSize) {
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
  }
  ctx.stroke();

  // Limite da Arena do Mundo
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, arena.width, arena.height);
}

function drawCity() {
  // Pavimentação da Cidade (Círculo de Pedra Sagrada)
  ctx.save();
  ctx.beginPath();
  ctx.arc(city.x, city.y, city.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20, 32, 50, 0.7)';
  ctx.fill();

  // Barreira Rúnica da Safe Zone
  ctx.strokeStyle = '#2ed573';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#2ed573';
  ctx.shadowBlur = 16;
  ctx.stroke();

  // Fonte Sagrada de Cura no Centro
  ctx.beginPath();
  ctx.arc(city.x, city.y, 40, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#2ed573';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 12px Segoe UI, sans-serif';
  ctx.fillStyle = '#2ed573';
  ctx.textAlign = 'center';
  ctx.fillText('🏛️ ' + city.name, city.x, city.y - 50);
  ctx.font = '10px Segoe UI, sans-serif';
  ctx.fillStyle = '#8899aa';
  ctx.fillText('(Zona Segura & Regeneração)', city.x, city.y - 36);

  ctx.restore();
}

function drawChest(ch) {
  ctx.save();
  ctx.translate(ch.x, ch.y);
  // Brilho dourado
  ctx.beginPath();
  ctx.arc(0, 0, ch.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd32a';
  ctx.shadowColor = '#ffd32a';
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.font = '16px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📦', 0, 0);

  ctx.font = 'bold 10px Segoe UI, sans-serif';
  ctx.fillStyle = '#ffd32a';
  ctx.fillText('Baú 🪙', 0, -20);
  ctx.restore();
}

function drawNpc(npc) {
  ctx.save();
  ctx.translate(npc.x, npc.y);

  // Plataforma do NPC
  ctx.beginPath();
  ctx.arc(0, 0, npc.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#1e272e';
  ctx.strokeStyle = '#ffd32a';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fill();

  // Ícone
  ctx.font = '18px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(npc.icon, 0, -2);

  // Nome do NPC
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
      if (fx.alpha <= 0) {
        activeSpecialEffects.splice(i, 1);
        continue;
      }
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
      if (fx.alpha <= 0) {
        activeSpecialEffects.splice(i, 1);
        continue;
      }
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

  if (obs.type === 'city_gate') {
    ctx.fillStyle = 'rgba(46, 213, 115, 0.2)';
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2ed573';
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚪 ' + obs.label, obs.x, obs.y + 4);
  } else if (obs.type === 'sanctuary') {
    ctx.fillStyle = 'rgba(46, 213, 115, 0.15)';
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2ed573';
    ctx.font = '12px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌲 ' + obs.label, obs.x, obs.y + 4);
  } else if (obs.type === 'pillar') {
    ctx.fillStyle = '#1e272e';
    ctx.strokeStyle = '#70a1ff';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#70a1ff';
    ctx.font = '12px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️ ' + obs.label, obs.x, obs.y + 4);
  } else {
    ctx.fillStyle = '#2f3542';
    ctx.strokeStyle = '#57606f';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawEntity(ent) {
  if (ent.hp <= 0) return;

  ctx.save();
  ctx.translate(ent.x, ent.y);

  // Sombra
  ctx.beginPath();
  ctx.arc(0, 4, ent.radius || 24, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();

  // Direcionamento e Arma Equipada
  ctx.save();
  ctx.rotate(ent.angle);
  const wColor = ent.weapon === 'sword_fire' ? '#ff4757' : (ent.weapon === 'staff_astral' ? '#ffd32a' : '#ced6e0');
  ctx.fillStyle = wColor;
  ctx.fillRect(10, -4, 22, 8);
  ctx.restore();

  // Corpo do Campeão
  ctx.beginPath();
  ctx.arc(0, 0, ent.radius || 24, 0, Math.PI * 2);
  ctx.fillStyle = ent.color || '#00e5ff';
  ctx.shadowColor = ent.color || '#00e5ff';
  ctx.shadowBlur = ent.id === myId ? 16 : 8;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Barra de Vida
  const barWidth = 44;
  const barHeight = 5;
  const hpRatio = Math.max(0, ent.hp / ent.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(-barWidth / 2, -36, barWidth, barHeight);
  ctx.fillStyle = ent.isBot ? '#ffa502' : '#2ed573';
  ctx.fillRect(-barWidth / 2, -36, barWidth * hpRatio, barHeight);

  // Nome e Ouro
  ctx.shadowBlur = 0;
  ctx.font = 'bold 11px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(ent.name, 0, -42);

  ctx.restore();
}

function drawMinimap() {
  mCtx.clearRect(0, 0, 160, 160);

  const scaleX = 160 / arena.width;
  const scaleY = 160 / arena.height;

  // Cidade no minimapa
  mCtx.fillStyle = 'rgba(46, 213, 115, 0.25)';
  mCtx.beginPath();
  mCtx.arc(city.x * scaleX, city.y * scaleY, city.radius * scaleX, 0, Math.PI * 2);
  mCtx.fill();

  // Baús (Pontos Dourados)
  mCtx.fillStyle = '#ffd32a';
  for (const ch of serverChests) {
    mCtx.fillRect(ch.x * scaleX - 1.5, ch.y * scaleY - 1.5, 3, 3);
  }

  // Bots (Pontos Laranjas Espalhados)
  mCtx.fillStyle = '#ffa502';
  for (const bot of serverBots.values()) {
    if (bot.hp > 0) {
      mCtx.beginPath();
      mCtx.arc(bot.x * scaleX, bot.y * scaleY, 2.5, 0, Math.PI * 2);
      mCtx.fill();
    }
  }

  // Jogadores (Branco / Ciano)
  for (const p of serverPlayers.values()) {
    if (p.hp > 0) {
      mCtx.fillStyle = p.id === myId ? '#ffffff' : '#00e5ff';
      mCtx.beginPath();
      mCtx.arc(p.x * scaleX, p.y * scaleY, p.id === myId ? 4 : 3, 0, Math.PI * 2);
      mCtx.fill();
    }
  }
}

// -------------------------------------------------------------
// Placar de Líderes e Killfeed
// -------------------------------------------------------------
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
// Controles de Entrada (Teclado, Mouse e Atalhos da Loja)
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

  // Interação com NPC da Cidade [E]
  if (e.key === 'e' || e.key === 'E') {
    if (nearbyNpc) {
      openShop(nearbyNpc);
    }
  }

  // Fechar Loja [Escape]
  if (e.key === 'Escape') {
    closeShop();
  }

  // Atalhos Rápidos de Poções
  if (e.key === '1') {
    keys['1'] = true;
    useHealPotion();
  }
  if (e.key === '2') {
    keys['2'] = true;
    useSpeedPotion();
  }

  // Atalhos Rápidos de Poderes
  if (e.key === 'r' || e.key === 'R') {
    keys.r = true;
    castPowerSlam();
  }
  if (e.key === 'f' || e.key === 'F') {
    keys.f = true;
    castPowerBeam();
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
  if (e.key === '1') keys['1'] = false;
  if (e.key === '2') keys['2'] = false;
});

function useHealPotion() {
  if (!localPlayer) return;
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
  if (!localPlayer) return;
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
  if (!localPlayer || !localPlayer.powers?.slam || localPlayer.inSafeZone) return;
  if (localPlayer.powerCooldowns?.slam > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.slam = 6;
    sfx.playSlam();
    activeSpecialEffects.push({
      type: 'slam_wave',
      x: localPlayer.x,
      y: localPlayer.y,
      radius: 10,
      maxRadius: 200,
      color: '#ffd32a',
      alpha: 1
    });

    for (const b of serverBots.values()) {
      if (b.hp > 0 && !b.inSafeZone && Math.hypot(b.x - localPlayer.x, b.y - localPlayer.y) < 200) {
        b.hp -= 40;
        const pushA = Math.atan2(b.y - localPlayer.y, b.x - localPlayer.x);
        b.x += Math.cos(pushA) * 60;
        b.y += Math.sin(pushA) * 60;
        if (b.hp <= 0) {
          localPlayer.score += 100;
          localPlayer.gold += 65;
          sfx.playCoin();
          updateKillfeed([{ text: `💥 ${localPlayer.name} aniquilou ${b.name} com Pisão Sísmico (+65 🪙)!` }]);
          setTimeout(() => { b.hp = 100; b.x = 1800 + (Math.random() - 0.5) * 1600; b.y = 1800 + (Math.random() - 0.5) * 1600; }, 3000);
        }
      }
    }
    updateHUD(localPlayer);
  }
}

function castPowerBeam() {
  if (!localPlayer || !localPlayer.powers?.beam || localPlayer.inSafeZone) return;
  if (localPlayer.powerCooldowns?.beam > 0) return;

  if (isOfflineMode) {
    localPlayer.powerCooldowns.beam = 8;
    sfx.playBeam();
    const beamEnd = {
      x: localPlayer.x + Math.cos(localPlayer.angle) * 900,
      y: localPlayer.y + Math.sin(localPlayer.angle) * 900
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
      if (b.hp > 0 && !b.inSafeZone) {
        const d = distanceToSegment(b.x, b.y, localPlayer.x, localPlayer.y, beamEnd.x, beamEnd.y);
        if (d < b.radius + 20) {
          b.hp -= 55;
          addParticle(b.x, b.y, '#00e5ff', 10, 6);
          if (b.hp <= 0) {
            localPlayer.score += 100;
            localPlayer.gold += 65;
            sfx.playCoin();
            updateKillfeed([{ text: `🏹 ${localPlayer.name} perfurou ${b.name} com o Raio Astral (+65 🪙)!` }]);
            setTimeout(() => { b.hp = 100; b.x = 1800 + (Math.random() - 0.5) * 1600; b.y = 1800 + (Math.random() - 0.5) * 1600; }, 3000);
          }
        }
      }
    }
    updateHUD(localPlayer);
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

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mousedown', (e) => {
  if (e.target.id === 'gameCanvas') {
    mouse.down = true;
    sfx.init();
  }
});

window.addEventListener('mouseup', () => {
  mouse.down = false;
});

// Cliques nos Quick Slots e Prompt de NPC
document.getElementById('slot-potion-heal').addEventListener('click', useHealPotion);
document.getElementById('slot-potion-speed').addEventListener('click', useSpeedPotion);
document.getElementById('slot-power-slam').addEventListener('click', castPowerSlam);
document.getElementById('slot-power-beam').addEventListener('click', castPowerBeam);
document.getElementById('npc-interact-prompt').addEventListener('click', () => {
  if (nearbyNpc) openShop(nearbyNpc);
});
document.getElementById('btn-close-shop').addEventListener('click', closeShop);

// Abas da Loja
document.querySelectorAll('.shop-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shop-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentShopTab = btn.dataset.tab;
    renderShopItems();
  });
});

// Suporte Mobile
document.getElementById('btn-mobile-dash').addEventListener('touchstart', (e) => {
  e.preventDefault();
  keys.Space = true;
});
document.getElementById('btn-mobile-attack').addEventListener('touchstart', (e) => {
  e.preventDefault();
  mouse.down = true;
  sfx.init();
});
document.getElementById('btn-mobile-attack').addEventListener('touchend', (e) => {
  e.preventDefault();
  mouse.down = false;
});

// -------------------------------------------------------------
// Lobby & Seleção de Perfil
// -------------------------------------------------------------
let selectedColor = '#00e5ff';
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
      color: selectedColor
    }));
  } else if (localPlayer) {
    localPlayer.name = nameInput;
    localPlayer.color = selectedColor;
  }

  document.getElementById('lobby-screen').style.display = 'none';
  document.getElementById('hud-overlay').style.display = 'block';
});

// Inicialização automática
connectWebSocket();
render();
