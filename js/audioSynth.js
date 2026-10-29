// audioSynth.js - Sintetizador Chiptune Retro 8-bit / 16-bit nativo (Web Audio API)
// NÃ£o depende de arquivos de Ã¡udio externos, funcionando de forma 100% autÃ´noma e imediata.

class RetroAudioSynth {
  constructor() {
  this.ctx = null;
  this.muted = false;
  this.volume = 0.25;
  this.musicEnabled = true;

  this.musicTimer = null;
  this.musicGain = null;
  this.musicStep = 0;
  this.nextMusicNoteTime = 0;
  this.musicTempo = 100;

  this._audioUnlocked = false;
  this._unlockHandler = () => this.unlockAudio();

  // Registra cada evento apenas uma vez.
  window.addEventListener("pointerdown", this._unlockHandler);
  window.addEventListener("keydown", this._unlockHandler);
}

  
init(userGesture = false) {
  // NÃ£o cria o Ã¡udio durante a inicializaÃ§Ã£o automÃ¡tica do jogo.
  if (!this.ctx && !userGesture) {
    return null;
  }

  if (!this.ctx) {
    const AudioCtx =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioCtx) {
      console.warn("Este navegador nÃ£o suporta Web Audio API.");
      return null;
    }

    try {
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn("Erro ao criar AudioContext:", e);
      return null;
    }
  }

  // SÃ³ tenta liberar o Ã¡udio quando chamado por uma interaÃ§Ã£o.
  if (userGesture && this.ctx.state === "suspended") {
    this.ctx.resume().catch(() => {});
  }

  return this.ctx;
}


unlockAudio() {
  if (this._audioUnlocked) return;

  const ctx = this.init(true);
  if (!ctx) return;

  ctx.resume()
    .then(() => {
      if (ctx.state !== "running") return;

      this._audioUnlocked = true;

      window.removeEventListener(
        "pointerdown",
        this._unlockHandler
      );

      window.removeEventListener(
        "keydown",
        this._unlockHandler
      );

      // Inicia a mÃºsica somente apÃ³s liberar o Ã¡udio.
      if (!this.muted && this.musicEnabled) {
        this.startMusic();
      }
    })
    .catch((err) => {
      console.warn("NÃ£o foi possÃ­vel liberar o Ã¡udio:", err);
    });
}


  
toggleMute() {
  this.muted = !this.muted;

  if (this.muted) {
    this.stopMusic();
  } else {
    this.init(true);

    if (this.ctx && this.musicEnabled) {
      this.startMusic();
    }

    this.playBeep(520, 0.08, "square");
  }

  return this.muted;
}


  
startMusic() {
  if (
    !this.ctx ||
    this.ctx.state !== "running" ||
    this.muted ||
    !this.musicEnabled ||
    this.musicTimer !== null
  ) {
    return;
  }

  this.musicGain = this.ctx.createGain();
  this.musicGain.gain.value = 0.025;
  this.musicGain.connect(this.ctx.destination);

  this.musicStep = 0;
  this.nextMusicNoteTime = this.ctx.currentTime + 0.05;

  this.scheduleMusic();

  this.musicTimer = window.setInterval(() => {
    this.scheduleMusic();
  }, 25);
}
stopMusic() {
  if (this.musicTimer !== null) {
    window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  if (this.musicGain && this.ctx) {
    const gain = this.musicGain;
    const now = this.ctx.currentTime;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(0, now, 0.025);

    window.setTimeout(() => {
      try { gain.disconnect(); } catch (_) {}
    }, 150);

    this.musicGain = null;
  }
}

toggleMusic() {
  this.musicEnabled = !this.musicEnabled;

  if (this.musicEnabled) {
    const ctx = this.init(true);

    if (ctx) {
      ctx.resume()
        .then(() => this.startMusic())
        .catch(() => {});
    }
  } else {
    this.stopMusic();
  }

  return this.musicEnabled;
}

  scheduleMusic() {
    if (!this.ctx || !this.musicGain || this.muted || !this.musicEnabled) {
      this.stopMusic();
      return;
    }

    const beat = 60 / this.musicTempo;
    const stepDuration = beat / 4;
    const totalSteps = Math.round(240 / stepDuration);
    const now = this.ctx.currentTime;

    // Motivos noir em Ré menor: frases curtas combinadas de formas diferentes.
    const motifs = [
      [0,440,0,523.25,466.16,0,392,0],
      [587.33,0,523.25,0,466.16,440,0,349.23],
      [392,0,349.23,0,311.13,0,349.23,392],
      [440,0,466.16,0,523.25,0,392,0],
      [293.66,0,349.23,392,0,440,0,466.16],
      [523.25,466.16,0,440,392,0,349.23,0],
      [698.46,0,587.33,523.25,0,466.16,440,0],
      [349.23,0,392,0,440,0,311.13,0],
      [0,587.33,523.25,466.16,0,392,349.23,0],
      [466.16,0,523.25,587.33,0,523.25,392,0],
      [392,349.23,0,311.13,349.23,0,293.66,0],
      [523.25,0,466.16,0,440,0,349.23,311.13]
    ];

    // Cada acorde contém a fundamental grave e notas para a harmonia.
    const chords = [
      { bass: 73.42, tones: [146.83,174.61,220] }, // Ré menor
      { bass: 58.27, tones: [116.54,146.83,174.61] }, // Si bemol
      { bass: 87.31, tones: [174.61,220,261.63] }, // Fá
      { bass: 55.00, tones: [110,130.81,164.81] }, // Lá menor
      { bass: 49.00, tones: [98,116.54,146.83] }, // Sol menor
      { bass: 65.41, tones: [130.81,164.81,196] }, // Dó
      { bass: 55.00, tones: [110,138.59,164.81] } // Lá com tensão
    ];

    const progressions = [
      [0,1,2,3],
      [0,4,1,3],
      [4,1,5,6],
      [0,1,3,0]
    ];

    const melodyLevel = [0.13,0.16,0.21,0.12];
    const bassLevel = [0.28,0.32,0.38,0.25];
    const harmonyLevel = [0.055,0.075,0.095,0.06];

    while (this.nextMusicNoteTime < now + 0.12) {
      const i = this.musicStep % totalSteps;

      const t = this.nextMusicNoteTime;
      const section = Math.min(3, Math.floor(i * stepDuration / 60));
      const phrase = Math.floor(i / 64);
      const bar = Math.floor(i / 8);
      const stepInBar = i % 8;
      const barInPhrase = Math.floor((i % 64) / 8);

      // Muda a ordem dos motivos a cada frase e a cada seção.
      const motifIndex =
        (barInPhrase * 5 + phrase * 3 + section * 2) % motifs.length;
      const note = motifs[motifIndex][stepInBar];

      // A harmonia evolui em blocos de quatro compassos.
      const progression = progressions[section];
      const chordIndex = progression[Math.floor(bar / 4) % progression.length];
      const chord = chords[chordIndex];

      // Atenua gradualmente as notas novas nos últimos seis segundos.
      const fadeSteps = Math.max(1, Math.round(6 / stepDuration));
      const fadeOut = i > totalSteps - fadeSteps
        ? Math.max(0.04, (totalSteps - i) / fadeSteps)
        : 1;
      const fadeIn = i < fadeSteps
        ? Math.max(0.04, i / fadeSteps)
        : 1;

const fade = Math.min(fadeOut, fadeIn);

      // Baixo com alternância entre fundamental, quinta e oitava.
      if (stepInBar === 0) {
        this.musicTone(
          chord.bass, t, stepDuration * 2.8,
          "triangle", bassLevel[section] * fade
        );
      } else if (stepInBar === 4) {
        this.musicTone(
          chord.bass * 1.5, t, stepDuration * 1.8,
          "triangle", bassLevel[section] * 0.68 * fade
        );
      } else if (section >= 2 && stepInBar === 6 && bar % 2 === 0) {
        this.musicTone(
          chord.bass * 2, t, stepDuration,
          "triangle", bassLevel[section] * 0.42 * fade
        );
      }

      if (note) {
        this.musicTone(
          note, t, stepDuration * (section === 0 ? 0.65 : 0.78),
          "square", melodyLevel[section] * fade
        );

        // Respostas agudas ocasionais durante o aumento do suspense.
        if (section >= 2 && stepInBar === 6 && bar % 2 === 0) {
          this.musicTone(
            note * 2, t, stepDuration * 0.38,
            "triangle", 0.045 * fade
          );
        }
      }

      // Harmonia espaçada no início; mais presente no suspense.
      if (stepInBar === 0) {
        const toneIndex = (bar + phrase + section) % chord.tones.length;
        this.musicTone(
          chord.tones[toneIndex], t, stepDuration * 3.2,
          "triangle", harmonyLevel[section] * fade
        );
      } else if (section >= 1 && stepInBar === 4 && bar % 2 === 0) {
        this.musicTone(
          chord.tones[(bar + 1) % chord.tones.length],
          t, stepDuration * 1.7,
          "triangle", harmonyLevel[section] * 0.7 * fade
        );
      }

      this.nextMusicNoteTime += stepDuration;
      this.musicStep++;
    }
  }
musicTone(frequency, start, duration, type, volume) {
  if (!this.ctx || !this.musicGain) return;

  const osc = this.ctx.createOscillator();
  const env = this.ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);

  env.gain.setValueAtTime(0.0001, start);
  env.gain.linearRampToValueAtTime(volume, start + 0.01);
  env.gain.setValueAtTime(volume, start + duration * 0.65);
  env.gain.exponentialRampToValueAtTime(
    0.0001, start + duration
  );

  osc.connect(env);
  env.connect(this.musicGain);

  osc.start(start);
  osc.stop(start + duration + 0.01);

  osc.addEventListener("ended", () => {
    osc.disconnect();
    env.disconnect();
  }, { once: true });
}


  playBeep(freq = 440, duration = 0.08, type = 'square', vol = null) {
  if (this.muted || !this.ctx) return;
  if (this.ctx.state !== "running") return;

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
  if (this.muted || !this.ctx) return;

  if (this.ctx.state !== "running") return;

  try {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(
      1200 + Math.random() * 400,
      now
    );

    gain.gain.setValueAtTime(this.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.025
    );

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  } catch (e) {}
}

  // Bipe de clique de botÃ£o DOS
  playButtonClick() {
    this.playBeep(640, 0.04, 'square', this.volume * 0.4);
    setTimeout(() => {
      this.playBeep(880, 0.05, 'square', this.volume * 0.3);
    }, 40);
  }

  // Jingle ao descobrir uma evidÃªncia
  playClueFound() {
    if (this.muted) return;
    const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.12, 'square', this.volume * 0.5);
      }, idx * 100);
    });
  }

  // Efeito de decolagem / viagem de aviÃ£o
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

  // Sirene da PolÃ­cia Federal no confronto
  playPoliceSiren(times = 4) {
    if (this.muted) return;
    let step = 0;
    const interval = setInterval(() => {
      this.playBeep(step % 2 === 0 ? 960 : 720, 0.15, 'sawtooth', this.volume * 0.6);
      step++;
      if (step >= times * 2) clearInterval(interval);
    }, 180);
  }

  // Estrondo do carimbo judicial da anulaÃ§Ã£o (Plot Twist)
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

      // RuÃ­do de impacto
      setTimeout(() => {
        this.playBeep(260, 0.08, 'sawtooth', this.volume * 0.7);
      }, 30);
    } catch (e) {}
  }

  // Jingle de VitÃ³ria
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

  // Derrota por PrescriÃ§Ã£o (Jingle FÃºnebre SarcÃ¡stico)
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

// Exporta instÃ¢ncia global
window.audioSynth = new RetroAudioSynth();
