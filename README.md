# ⚔️ Jornada II: Arena dos Campeões (Multiplayer Online)

Um jogo multiplayer de ação tática em tempo real projetado para rodar no seu próprio computador/servidor dedicado, com **capacidade para conexões simultâneas sem limite teórico** e **sistema autônomo de Bots Inteligentes** para completar as partidas quando não houver jogadores humanos suficientes!

---

## 🌐 Jogue Online Agora no Navegador:
👉 **[https://labjogosfamilia-lab.github.io/jornada-2/](https://labjogosfamilia-lab.github.io/jornada-2/)**

Compatível com PC e Celular (com suporte a bots inteligentes e conexão com servidores dedicados).

---

## 🚀 Como Iniciar e Jogar

### 1. No seu PC (Servidor Host):
- Dê um duplo-clique no arquivo **`iniciar_servidor.bat`**.
- O servidor dedicado iniciará imediatamente e abrirá o jogo automaticamente no seu navegador em `http://localhost:3000`.

### 2. Convidando Amigos pela Internet ou Rede Local:
Quando a janela preta do servidor abrir, ela exibirá seus IPs de conexão, por exemplo:
- **Pelo Radmin VPN / Hamachi:** `http://26.xxx.xxx.xxx:3000` (Seus amigos só precisam colar esse endereço no navegador do PC ou celular deles).
- **Pelo Wi-Fi / Rede da Casa:** `http://192.168.1.xxx:3000`.

> **Vantagem Absoluta:** Seus amigos **não precisam instalar absolutamente nada**! Eles apenas abrem o link no navegador e já caem na batalha com você em tempo real.

---

## 🕹️ Controles

| Ação | Teclado & Mouse | Celular / Touch |
| :--- | :--- | :--- |
| **Mover o Campeão** | `W, A, S, D` ou `Setas` | Teclas / Arrastar |
| **Mirar** | Mover o cursor do Mouse | Direção do movimento |
| **Atacar / Disparo Astral** | `Botão Esquerdo do Mouse` | Botão ⚔️ |
| **Esquiva Rápida (Dash)** | `Barra de Espaço` ou `Shift` | Botão 💨 |
| **Conversar no Chat** | Pressionar `Enter` | Campo de texto inferior |

---

## 🤖 Sistema de Bots Inteligentes

- **Equilíbrio Automático de Vagas:** O servidor monitora constantemente a quantidade de jogadores humanos. Se estiver jogando sozinho, bots entram para treinar com você. Conforme seus amigos entram no servidor, os bots cedem espaço harmoniosamente.
- **Comportamento Tático Avançado:**
  - **Fuga Estratégica:** Quando o bot fica com menos de 45% de vida, ele busca ativamente o orbe de cura mais próximo pelo mapa.
  - **Strafe Circular:** Flanqueia o inimigo em círculos enquanto mantém a mira.
  - **Esquiva Reativa:** Se detectar um tiro vindo em sua direção a curta distância, gasta vigor para dar Dash evasivo.
  - **Predição de Mira:** Calcula o vetor de movimento do alvo para não errar disparos óbvios.

---

## 🛠️ Arquitetura Técnica

- **Engine:** HTML5 Canvas Acelerado por Hardware + Vanilla JavaScript ES6+.
- **Servidor:** Motor Node.js nativo portátil (`bin/node.exe`) com protocolo WebSocket RFC 6455 puro de baixíssima latência (zero dependências externas ou `node_modules` pesados).
- **Áudio:** Síntese sonora em tempo real via **Web Audio API** (sons de tiro, impacto, dash e coleta gerados proceduralmente pelo processador de som).
- **Loop de Simulação:** Servidor Autoritário a 30 Ticks/segundo com interpolação suave a 60+ FPS no cliente.
