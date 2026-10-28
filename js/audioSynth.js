// audioSynth.js - Sintetizador Chiptune Retro 8-bit / 16-bit nativo (Web Audio API)
// Não depende de arquivos de áudio externos, funcionando de forma 100% autônoma e imediata.

class RetroAudioSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.25;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.playBeep(520, 0.08, 'square');
    }
    return this.muted;
  }

  playBeep(freq = 440, duration = 0.08, type = 'square', vol = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      const v = vol !== null ? vol : this.volume;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(v, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Som de teletype ao renderizar letras
  playKeyClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Ruído de teclado clássico DOS
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);

      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  // Bipe de clique de botão DOS
  playButtonClick() {
    this.playBeep(640, 0.04, 'square', this.volume * 0.4);
    setTimeout(() => {
      this.playBeep(880, 0.05, 'square', this.volume * 0.3);
    }, 40);
  }

  // Jingle ao descobrir uma evidência
  playClueFound() {
    if (this.muted) return;
    const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.12, 'square', this.volume * 0.5);
      }, idx * 100);
    });
  }

  // Efeito de decolagem / viagem de avião
  playFlightSwoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(330, now + 1.0);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {}
  }

  // Sirene da Polícia Federal no confronto
  playPoliceSiren(times = 4) {
    if (this.muted) return;
    let step = 0;
    const interval = setInterval(() => {
      this.playBeep(step % 2 === 0 ? 960 : 720, 0.15, 'sawtooth', this.volume * 0.6);
      step++;
      if (step >= times * 2) clearInterval(interval);
    }, 180);
  }

  // Estrondo do carimbo judicial da anulação (Plot Twist)
  playStampThud() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Golpe grave pesado (sub-bass punch)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

      gain.gain.setValueAtTime(this.volume * 1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);

      // Ruído de impacto
      setTimeout(() => {
        this.playBeep(260, 0.08, 'sawtooth', this.volume * 0.7);
      }, 30);
    } catch (e) {}
  }

  // Jingle de Vitória
  playVictory() {
    if (this.muted) return;
    const chords = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.50, d: 0.45 } // C6
    ];
    let delay = 0;
    chords.forEach(c => {
      setTimeout(() => {
        this.playBeep(c.f, c.d, 'square', this.volume * 0.6);
      }, delay);
      delay += c.d * 1000 + 30;
    });
  }

  // Derrota por Prescrição (Jingle Fúnebre Sarcástico)
  playDefeatPrescription() {
    if (this.muted) return;
    const notes = [440, 415.3, 392, 349.23]; // A4, Ab4, G4, F4
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.28, 'sawtooth', this.volume * 0.5);
      }, idx * 260);
    });
  }
}

// Exporta instância global
window.audioSynth = new RetroAudioSynth();
