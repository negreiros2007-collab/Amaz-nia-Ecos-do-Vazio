/**
 * ambient-audio — Gera áudio ambiente proceduralmente (sem arquivos externos).
 * Usa Web Audio API para criar: vento contínuo, sussurros de folhas, pequenos sinos espirituais.
 *
 * Uso: <a-scene ambient-audio="biome: forest"></a-scene>
 */
AFRAME.registerComponent('ambient-audio', {
  schema: {
    biome:  { type: 'string', default: 'forest' }, // forest | river | fire | broken | void
    volume: { type: 'number', default: 0.25 }
  },

  init() {
    this.started = false;
    // Áudio precisa de gesto do usuário — espera primeiro clique
    const start = () => {
      if (this.started) return;
      this.started = true;
      this._setup();
      window.removeEventListener('click', start);
      window.removeEventListener('touchstart', start);
      window.removeEventListener('keydown', start);
    };
    window.addEventListener('click', start);
    window.addEventListener('touchstart', start);
    window.addEventListener('keydown', start);
  },

  _setup() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = this.data.volume;
    master.connect(ctx.destination);
    this.master = master;

    if (this.data.biome === 'forest') this._setupForest();
    else if (this.data.biome === 'river') this._setupRiver();
    else if (this.data.biome === 'fire')  this._setupFire();
    else if (this.data.biome === 'void')  this._setupVoid();
    else this._setupForest();
  },

  /** Vento contínuo via ruído branco filtrado + sussurros aleatórios */
  _setupForest() {
    const ctx = this.ctx;
    // Ruído branco como base do vento
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    filter.Q.value = 1;

    const gain = ctx.createGain();
    gain.gain.value = 0.4;

    // Modulação suave da intensidade do vento
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain).connect(gain.gain);

    noise.connect(filter).connect(gain).connect(this.master);
    noise.start();
    lfo.start();

    // Sino espiritual ocasional (cada 8-15s)
    const ringChime = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.frequency.value = 880 + Math.random() * 440;
      osc.type = 'sine';
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.15, now + 0.05);
      env.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
      osc.connect(env).connect(this.master);
      osc.start(now);
      osc.stop(now + 3.5);
      setTimeout(ringChime, 8000 + Math.random() * 7000);
    };
    setTimeout(ringChime, 2000);
  },

  _setupRiver() {
    const ctx = this.ctx;
    // Ruído rosa filtrado simulando água
    const bufferSize = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179;
      b1 = 0.99332*b1 + w*0.0750759;
      data[i] = (b0+b1+w*0.5362)*0.15;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 1500; filter.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.value = 0.5;
    src.connect(filter).connect(g).connect(this.master);
    src.start();
  },

  _setupFire() {
    const ctx = this.ctx;
    // Crepitar — ruído com modulação rápida
    const bufSize = ctx.sampleRate;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = (Math.random()*2-1) * Math.pow(Math.random(), 5);
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 1200;
    const g = ctx.createGain(); g.gain.value = 0.4;
    src.connect(filt).connect(g).connect(this.master);
    src.start();
  },

  _setupVoid() {
    const ctx = this.ctx;
    // Drone grave + harmônico dissonante
    const osc1 = ctx.createOscillator(); osc1.frequency.value = 55; osc1.type = 'sawtooth';
    const osc2 = ctx.createOscillator(); osc2.frequency.value = 78; osc2.type = 'triangle';
    const g = ctx.createGain(); g.gain.value = 0.12;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 200;
    osc1.connect(filt); osc2.connect(filt);
    filt.connect(g).connect(this.master);
    osc1.start(); osc2.start();
  }
});
