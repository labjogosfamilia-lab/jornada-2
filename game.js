// =============================================================
// JORNADA II: ARENA DOS CAMPEÕES (CLIENTE MULTIPLAYER)
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

  playShoot() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
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
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
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
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playOrb() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
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

// Dados de Rede
let socket = null;
let myId = null;
let arena = { width: 2600, height: 2600 };
let obstacles = [];
let localPlayer = null;

// Snapshots de Entidades
let serverPlayers = new Map();
let serverBots = new Map();
let serverProjectiles = [];
let serverOrbs = [];
let particles = [];

// Câmera
const camera = { x: 1300, y: 1300 };

// Teclado e Entrada
const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
  Space: false, Shift: false
};
const mouse = { x: screenWidth / 2, y: screenHeight / 2, down: false };

// Partículas visuais de efeitos
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
// Conexão WebSocket e Modo Offline de Treino
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
    if (inputVal) {
      host = inputVal;
    } else {
      host = window.location.host;
    }
  }

  // Se estiver num ambiente estático online sem porta (ex: github.io ou vercel.app) e sem host customizado
  if (!customHost && !document.getElementById('server-address')?.value?.trim() && 
      (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'))) {
    startOfflineSimulation();
    return;
  }

  if (socket) {
    socket.close();
  }

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
      } catch (err) {
        console.error('Erro ao ler pacote:', err);
      }
    };

    socket.onclose = () => {
      if (!isOfflineMode) {
        if (dot) dot.innerText = '🤖 Modo Treino (Bots)';
        if (pingInd) pingInd.innerText = 'Local (Offline)';
        startOfflineSimulation();
      }
    };

    socket.onerror = () => {
      if (!isOfflineMode) {
        startOfflineSimulation();
      }
    };
  } catch (e) {
    startOfflineSimulation();
  }
}

// Simulação Local com Bots caso o servidor remoto esteja offline
function startOfflineSimulation() {
  if (isOfflineMode) return;
  isOfflineMode = true;

  const dot = document.getElementById('server-status-dot');
  const pingInd = document.getElementById('ping-indicator');
  if (dot) dot.innerText = '🤖 Modo Bots (Offline)';
  if (pingInd) pingInd.innerText = '60 FPS (Local)';

  // Inicializa mapa e jogador local
  obstacles = [
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

  myId = 'local_hero';
  localPlayer = {
    id: myId,
    name: document.getElementById('player-name')?.value?.trim() || 'Guilherme',
    color: selectedColor || '#00e5ff',
    x: 1300,
    y: 1300,
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
    radius: 24
  };
  serverPlayers.set(myId, localPlayer);

  // Orbes
  serverOrbs = [];
  for (let i = 0; i < 25; i++) {
    serverOrbs.push({
      id: 'orb_' + i,
      x: 150 + Math.random() * (arena.width - 300),
      y: 150 + Math.random() * (arena.height - 300),
      type: Math.random() > 0.4 ? 'heal' : 'energy',
      value: 25,
      radius: 14
    });
  }

  // Cria 8 Bots Inteligentes locais
  const BOT_NAMES = ['Arconte Sylas', 'Valquíria Kira', 'Titã Gorok', 'Sombra Vane', 'Mago Elidor', 'Sentinela Kael', 'Caçador Rex', 'Lorde Malakor'];
  serverBots.clear();
  BOT_NAMES.forEach((name, idx) => {
    const angle = (idx / BOT_NAMES.length) * Math.PI * 2;
    serverBots.set('bot_' + idx, {
      id: 'bot_' + idx,
      isBot: true,
      name: name + ' (BOT)',
      color: ['#ff4757', '#ffa502', '#70a1ff', '#2ed573'][idx % 4],
      x: 1300 + Math.cos(angle) * 700,
      y: 1300 + Math.sin(angle) * 700,
      vx: 0,
      vy: 0,
      speed: 5.4,
      angle: Math.random() * Math.PI * 2,
      hp: 100,
      maxHp: 100,
      score: 0,
      radius: 24,
      dashCooldown: 0,
      attackCooldown: 0
    });
  });

  // Loop de simulação offline
  offlineSimulationInterval = setInterval(() => {
    if (!isOfflineMode || !localPlayer) return;

    // 1. Movimentação do jogador local
    let dx = 0, dy = 0;
    if (keys.w || keys.ArrowUp) dy -= 1;
    if (keys.s || keys.ArrowDown) dy += 1;
    if (keys.a || keys.ArrowLeft) dx -= 1;
    if (keys.d || keys.ArrowRight) dx += 1;

    const angle = Math.atan2(mouse.y - screenHeight / 2, mouse.x - screenWidth / 2);
    localPlayer.angle = angle;

    let spd = localPlayer.speed;
    if (localPlayer.dashCooldown > 0) localPlayer.dashCooldown -= 1 / 30;
    if (localPlayer.attackCooldown > 0) localPlayer.attackCooldown -= 1 / 30;
    if (localPlayer.stamina < 100) localPlayer.stamina = Math.min(100, localPlayer.stamina + 20 / 30);

    if (keys.Space && localPlayer.dashCooldown <= 0 && localPlayer.stamina >= 25) {
      localPlayer.stamina -= 25;
      localPlayer.dashCooldown = 1.4;
      spd *= 3.5;
      sfx.playDash();
      addParticle(localPlayer.x, localPlayer.y, localPlayer.color, 12, 6);
      keys.Space = false;
    }

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      localPlayer.x = Math.max(localPlayer.radius, Math.min(arena.width - localPlayer.radius, localPlayer.x + (dx / len) * spd));
      localPlayer.y = Math.max(localPlayer.radius, Math.min(arena.height - localPlayer.radius, localPlayer.y + (dy / len) * spd));
    }

    // Ataque local
    if (mouse.down && localPlayer.attackCooldown <= 0) {
      localPlayer.attackCooldown = 0.28;
      sfx.playShoot();
      serverProjectiles.push({
        id: Math.random(),
        ownerId: localPlayer.id,
        color: localPlayer.color,
        x: localPlayer.x + Math.cos(angle) * 30,
        y: localPlayer.y + Math.sin(angle) * 30,
        vx: Math.cos(angle) * 16,
        vy: Math.sin(angle) * 16,
        lifetime: 55
      });
    }

    // 2. Atualização dos Bots
    for (const bot of serverBots.values()) {
      if (bot.hp <= 0) continue;
      if (bot.dashCooldown > 0) bot.dashCooldown -= 1 / 30;
      if (bot.attackCooldown > 0) bot.attackCooldown -= 1 / 30;

      const target = localPlayer;
      const dist = Math.hypot(target.x - bot.x, target.y - bot.y);
      const angleToTarget = Math.atan2(target.y - bot.y, target.x - bot.x);
      bot.angle = angleToTarget;

      if (dist > 280) {
        bot.x += Math.cos(bot.angle) * bot.speed;
        bot.y += Math.sin(bot.angle) * bot.speed;
      } else if (dist < 150) {
        bot.x -= Math.cos(bot.angle) * bot.speed;
        bot.y -= Math.sin(bot.angle) * bot.speed;
      } else {
        bot.x += Math.cos(bot.angle + Math.PI / 2) * bot.speed;
        bot.y += Math.sin(bot.angle + Math.PI / 2) * bot.speed;
      }

      if (dist < 600 && bot.attackCooldown <= 0 && Math.random() < 0.08) {
        bot.attackCooldown = 0.5;
        serverProjectiles.push({
          id: Math.random(),
          ownerId: bot.id,
          color: bot.color,
          x: bot.x + Math.cos(bot.angle) * 30,
          y: bot.y + Math.sin(bot.angle) * 30,
          vx: Math.cos(bot.angle) * 15,
          vy: Math.sin(bot.angle) * 15,
          lifetime: 55
        });
      }
    }

    // 3. Projéteis e Colisões
    for (let i = serverProjectiles.length - 1; i >= 0; i--) {
      const pr = serverProjectiles[i];
      pr.x += pr.vx;
      pr.y += pr.vy;
      pr.lifetime--;

      let hit = false;
      if (pr.x < 0 || pr.x > arena.width || pr.y < 0 || pr.y > arena.height || pr.lifetime <= 0) {
        hit = true;
      }

      if (!hit) {
        // Checa colisão com jogador
        if (pr.ownerId !== localPlayer.id && Math.hypot(pr.x - localPlayer.x, pr.y - localPlayer.y) < localPlayer.radius + 6) {
          hit = true;
          localPlayer.hp = Math.max(0, localPlayer.hp - 20);
          sfx.playHit();
          addParticle(pr.x, pr.y, pr.color, 8, 5);
          if (localPlayer.hp <= 0) {
            setTimeout(() => { localPlayer.hp = 100; localPlayer.x = 1300; localPlayer.y = 1300; }, 2000);
          }
        }

        // Checa colisão com bots
        for (const bot of serverBots.values()) {
          if (pr.ownerId !== bot.id && bot.hp > 0 && Math.hypot(pr.x - bot.x, pr.y - bot.y) < bot.radius + 6) {
            hit = true;
            bot.hp -= 25;
            sfx.playHit();
            addParticle(pr.x, pr.y, pr.color, 8, 5);
            if (bot.hp <= 0) {
              localPlayer.score += 100;
              bot.hp = 0;
              updateKillfeed([{ text: `⚡ ${localPlayer.name} eliminou ${bot.name}!` }]);
              setTimeout(() => { bot.hp = 100; bot.x = 1300 + (Math.random() - 0.5) * 800; bot.y = 1300 + (Math.random() - 0.5) * 800; }, 3000);
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
    obstacles = msg.obstacles;
    localPlayer = msg.player;
  } else if (msg.type === 'state') {
    // Atualiza Jogadores
    serverPlayers.clear();
    for (const p of msg.players) {
      serverPlayers.set(p.id, p);
      if (p.id === myId) {
        localPlayer = p;
        updateHUD(p);
      }
    }

    // Atualiza Bots
    serverBots.clear();
    for (const b of msg.bots) {
      serverBots.set(b.id, b);
    }

    serverProjectiles = msg.projectiles;
    serverOrbs = msg.orbs;

    updateLeaderboard();
  } else if (msg.type === 'killfeed') {
    updateKillfeed(msg.feed);
  } else if (msg.type === 'chat') {
    addChatMessage(msg.sender, msg.color, msg.text);
  } else if (msg.type === 'hit') {
    sfx.playHit();
    addParticle(msg.x, msg.y, msg.color || '#ff4757', 8, 5);
  } else if (msg.type === 'effect' && msg.name === 'dash') {
    sfx.playDash();
    addParticle(msg.x, msg.y, msg.color || '#00e5ff', 12, 6);
  }
}

// -------------------------------------------------------------
// Envio Periódico de Comandos do Jogador (Input Loop)
// -------------------------------------------------------------
function sendInput() {
  if (!socket || socket.readyState !== WebSocket.OPEN || !localPlayer) return;

  // Calcula o ângulo a partir do centro da tela até o ponteiro do mouse
  const screenCenterX = screenWidth / 2;
  const screenCenterY = screenHeight / 2;
  const angle = Math.atan2(mouse.y - screenCenterY, mouse.x - screenCenterX);

  const isUp = keys.w || keys.ArrowUp;
  const isDown = keys.s || keys.ArrowDown;
  const isLeft = keys.a || keys.ArrowLeft;
  const isRight = keys.d || keys.ArrowRight;
  const isAttack = mouse.down;
  const isDash = keys.Space || keys.Shift;

  socket.send(JSON.stringify({
    type: 'input',
    input: {
      up: isUp,
      down: isDown,
      left: isLeft,
      right: isRight,
      attack: isAttack,
      dash: isDash,
      angle: angle
    }
  }));

  if (isDash) {
    keys.Space = false; // Trigger único por toque
  }
}
setInterval(sendInput, 1000 / 30);

// -------------------------------------------------------------
// Atualização de HUD
// -------------------------------------------------------------
function updateHUD(player) {
  const hpBar = document.getElementById('hp-bar');
  const hpVal = document.getElementById('hp-val');
  const staminaBar = document.getElementById('stamina-bar');
  const staminaVal = document.getElementById('stamina-val');

  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const staminaPercent = Math.max(0, Math.min(100, (player.stamina / 100) * 100));

  hpBar.style.width = `${hpPercent}%`;
  hpVal.innerText = `${player.hp} / ${player.maxHp}`;

  staminaBar.style.width = `${staminaPercent}%`;
  staminaVal.innerText = `${Math.round(player.stamina)} / 100`;
}

function updateLeaderboard() {
  const all = [...serverPlayers.values(), ...serverBots.values()];
  all.sort((a, b) => (b.score || 0) - (a.score || 0));

  const container = document.getElementById('lb-entries');
  container.innerHTML = '';

  const top = all.slice(0, 5);
  top.forEach((ent, idx) => {
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

  // Remove mensagens antigas
  if (container.children.length > 5) {
    container.removeChild(container.firstChild);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

// -------------------------------------------------------------
// Renderização Principal do Jogo (60+ FPS)
// -------------------------------------------------------------
function render() {
  requestAnimationFrame(render);

  // 1. Atualização Suave da Câmera (Seguindo o Jogador Local)
  if (localPlayer) {
    camera.x += (localPlayer.x - camera.x) * 0.12;
    camera.y += (localPlayer.y - camera.y) * 0.12;
  }

  ctx.clearRect(0, 0, screenWidth, screenHeight);

  ctx.save();
  // Translada o mundo para a posição da câmera
  ctx.translate(screenWidth / 2 - camera.x, screenHeight / 2 - camera.y);

  // 2. Desenhar Grade de Fundo da Arena
  drawArenaGrid();

  // 3. Desenhar Limites da Arena (Barreira de Energia)
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, arena.width, arena.height);

  // 4. Desenhar Orbes Sagrados
  for (const orb of serverOrbs) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fillStyle = orb.type === 'heal' ? '#2ed573' : '#00e5ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  // 5. Desenhar Obstáculos e Ruínas
  for (const obs of obstacles) {
    drawObstacle(obs);
  }

  // 6. Desenhar Partículas de Efeitos
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

  // 7. Desenhar Projéteis
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

  // 8. Desenhar Bots
  for (const bot of serverBots.values()) {
    drawEntity(bot);
  }

  // 9. Desenhar Jogadores
  for (const player of serverPlayers.values()) {
    drawEntity(player);
  }

  ctx.restore();

  // 10. Atualizar Minimapa
  drawMinimap();
}

function drawArenaGrid() {
  const gridSize = 100;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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
}

function drawObstacle(obs) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);

  if (obs.type === 'sanctuary') {
    ctx.fillStyle = 'rgba(46, 213, 115, 0.15)';
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = '#2ed573';
    ctx.font = '13px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️ ' + obs.label, obs.x, obs.y + 5);
  } else if (obs.type === 'pillar') {
    ctx.fillStyle = '#1e272e';
    ctx.strokeStyle = '#70a1ff';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#70a1ff';
    ctx.font = '12px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(obs.label, obs.x, obs.y + 4);
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

  // Sombra suave
  ctx.beginPath();
  ctx.arc(0, 4, ent.radius || 24, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();

  // Direcionamento e Arma / Cajado Cósmico
  ctx.save();
  ctx.rotate(ent.angle);
  ctx.fillStyle = '#ced6e0';
  ctx.fillRect(10, -4, 20, 8); // Tubo de disparo
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

  // Barra de Vida Superior
  const barWidth = 44;
  const barHeight = 5;
  const hpRatio = Math.max(0, ent.hp / ent.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(-barWidth / 2, -36, barWidth, barHeight);
  ctx.fillStyle = ent.isBot ? '#ffa502' : '#2ed573';
  ctx.fillRect(-barWidth / 2, -36, barWidth * hpRatio, barHeight);

  // Nome do Campeão
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

  // Obstáculos no minimapa
  mCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (const obs of obstacles) {
    mCtx.beginPath();
    mCtx.arc(obs.x * scaleX, obs.y * scaleY, obs.radius * scaleX, 0, Math.PI * 2);
    mCtx.fill();
  }

  // Bots (Pontos Laranja)
  mCtx.fillStyle = '#ffa502';
  for (const bot of serverBots.values()) {
    if (bot.hp > 0) {
      mCtx.beginPath();
      mCtx.arc(bot.x * scaleX, bot.y * scaleY, 2.5, 0, Math.PI * 2);
      mCtx.fill();
    }
  }

  // Jogadores (Pontos Azuis/Verdes)
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
// Controles de Entrada (Teclado, Mouse e Touch)
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

  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
  if (e.code === 'Space') keys.Space = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.Shift = true;
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  if (e.code === 'Space') keys.Space = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.Shift = false;
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mousedown', (e) => {
  if (e.target.id === 'gameCanvas') {
    mouse.down = true;
    sfx.init();
    sfx.playShoot();
  }
});

window.addEventListener('mouseup', () => {
  mouse.down = false;
});

// Suporte para Botões Mobile Touch
document.getElementById('btn-mobile-dash').addEventListener('touchstart', (e) => {
  e.preventDefault();
  keys.Space = true;
});
document.getElementById('btn-mobile-attack').addEventListener('touchstart', (e) => {
  e.preventDefault();
  mouse.down = true;
  sfx.init();
  sfx.playShoot();
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
