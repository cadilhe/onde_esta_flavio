// mapCanvas.js - Renderização do Mini-Mapa e do Mapa Tático Mundial (Canvas 16-bits)
// Animações de radar, rotas pontilhadas e localização do investigador

class GameMapRenderer {
  constructor(miniCanvasId) {
    this.miniCanvas = document.getElementById(miniCanvasId);
    this.miniCtx = this.miniCanvas ? this.miniCanvas.getContext('2d') : null;
    this.mapImg = new Image();
    this.mapImg.src = 'assets/images/map_world.png';
    this.animFrame = null;
    this.pulsePhase = 0;

    // Coordenadas das cidades mapeadas na imagem (252x127)
    // O mapa de referência foca em Américas, Europa, África
    this.coords = {
      rio: { x: 92, y: 88, name: "Rio de Janeiro" },
      atibaia: { x: 88, y: 87, name: "Atibaia" },
      brasilia: { x: 89, y: 82, name: "Brasília" },
      miami: { x: 68, y: 46, name: "Miami" },
      buenos_aires: { x: 84, y: 98, name: "Buenos Aires" },
      punta_del_este: { x: 87, y: 95, name: "Punta del Este" },
      zurique: { x: 145, y: 38, name: "Zurique" }
    };

    this.mapImg.onload = () => {
      this.startAnimation();
    };
  }

  startAnimation() {
    const render = () => {
      this.pulsePhase += 0.08;
      this.drawMiniMap();
      this.animFrame = requestAnimationFrame(render);
    };
    render();
  }

  drawMiniMap() {
    if (!this.miniCtx || !this.mapImg.complete) return;
    const ctx = this.miniCtx;
    const w = this.miniCanvas.width;
    const h = this.miniCanvas.height;

    // Limpa
    ctx.clearRect(0, 0, w, h);

    // Desenha imagem de fundo do mapa
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.mapImg, 0, 0, w, h);

    // Obtém histórico de viagens e local atual
    const history = window.GAME_DATA ? window.GAME_DATA.state.historicoViagens : ["rio"];
    const currentId = window.GAME_DATA ? window.GAME_DATA.state.localAtual : "rio";

    // Desenha rotas percorridas (linhas pontilhadas vermelhas brilhantes)
    if (history.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = '#ff2222';
      ctx.lineWidth = 2;

      for (let i = 0; i < history.length - 1; i++) {
        const from = this.coords[history[i]];
        const to = this.coords[history[i + 1]];
        if (from && to) {
          // Escala coordenadas conforme tamanho do canvas
          const sx = w / 252;
          const sy = h / 127;
          ctx.moveTo(from.x * sx, from.y * sy);
          ctx.lineTo(to.x * sx, to.y * sy);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Desenha pontos das cidades conhecidas
    const sx = w / 252;
    const sy = h / 127;

    Object.keys(this.coords).forEach(cityKey => {
      const c = this.coords[cityKey];
      const cx = c.x * sx;
      const cy = c.y * sy;

      if (cityKey === currentId) {
        // Posição atual do jogador (radar piscante amarelo/verde)
        const radius = 4 + Math.sin(this.pulsePhase) * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(2, radius), 0, Math.PI * 2);
        ctx.fillStyle = '#ffff00';
        ctx.fill();

        // Anel de radar
        const ringRadius = 5 + ((this.pulsePhase * 3) % 9);
        const alpha = Math.max(0, 1 - ringRadius / 14);
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Mira tática
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy);
        ctx.lineTo(cx + 6, cy);
        ctx.moveTo(cx, cy - 6);
        ctx.lineTo(cx, cy + 6);
        ctx.stroke();
      } else if (history.includes(cityKey)) {
        // Cidade já visitada
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffaa';
        ctx.fill();
      }
    });

    // Scanner / Scanline retrô sutil no mapa
    const scanY = (this.pulsePhase * 25) % h;
    ctx.fillStyle = 'rgba(0, 255, 120, 0.12)';
    ctx.fillRect(0, scanY, w, 3);
  }

  // Renderiza mapa expandido em modal
  drawTacticalMap(canvasId) {
    const fullCanvas = document.getElementById(canvasId);
    if (!fullCanvas) return;
    const ctx = fullCanvas.getContext('2d');
    const w = fullCanvas.width;
    const h = fullCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;

    // Fundo oceano
    ctx.fillStyle = '#040d21';
    ctx.fillRect(0, 0, w, h);

    // Desenha mapa ampliado com pixel-art perfeito
    if (this.mapImg.complete) {
      ctx.drawImage(this.mapImg, 0, 0, w, h);
    }

    // Grid tático de coordenadas
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const history = window.GAME_DATA ? window.GAME_DATA.state.historicoViagens : ["rio"];
    const currentId = window.GAME_DATA ? window.GAME_DATA.state.localAtual : "rio";
    const sx = w / 252;
    const sy = h / 127;

    // Rotas percorridas
    if (history.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 3;
      for (let i = 0; i < history.length - 1; i++) {
        const from = this.coords[history[i]];
        const to = this.coords[history[i + 1]];
        if (from && to) {
          ctx.moveTo(from.x * sx, from.y * sy);
          ctx.lineTo(to.x * sx, to.y * sy);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Marcadores e etiquetas das cidades
    Object.keys(this.coords).forEach(cityKey => {
      const c = this.coords[cityKey];
      const cx = c.x * sx;
      const cy = c.y * sy;
      const isCurrent = cityKey === currentId;

      ctx.beginPath();
      ctx.arc(cx, cy, isCurrent ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? '#ffff00' : (history.includes(cityKey) ? '#00ffaa' : '#ffffff');
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rótulo da cidade em pixel font
      ctx.font = '10px "Courier New", monospace';
      ctx.fillStyle = isCurrent ? '#ffff00' : '#ffffff';
      ctx.fillText(c.name.toUpperCase(), cx + 8, cy + 3);
    });
  }
}

window.GameMapRenderer = GameMapRenderer;
