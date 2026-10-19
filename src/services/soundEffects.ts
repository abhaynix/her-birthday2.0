// Birthday Celebration Audio Engine
// Procedural SFX (Web Audio API) + HTMLAudioElement for background music

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private musicVolume = 0.6;

  // HTMLAudioElement for background music
  private music: HTMLAudioElement | null = null;
  private musicLoaded = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private initMusic() {
    if (this.musicLoaded) return;
    this.music = new Audio();
    this.music.src = '/audio/birthday-song.mp3';
    this.music.preload = 'metadata';
    this.music.loop = true;
    this.music.volume = this.musicVolume;
    this.music.crossOrigin = 'anonymous';

    // Persist mute state
    const savedMute = localStorage.getItem('bday_music_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
      if (this.music) this.music.muted = this.isMuted;
    }

    // Pause on tab hidden, resume on visible
    document.addEventListener('visibilitychange', () => {
      if (this.music) {
        if (document.hidden) {
          this.music.pause();
        } else if (this.getIsMusicPlaying() && !this.isMuted) {
          this.music.play().catch(() => {});
        }
      }
    });

    this.musicLoaded = true;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('bday_music_muted', muted.toString());
    if (this.music) {
      this.music.muted = muted;
    }
    if (muted && this.getIsMusicPlaying()) {
      this.stopMusic();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.music !== null && !this.music.paused && !this.music.ended;
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }

  public getVolume(): number {
    return this.musicVolume;
  }

  // Mechanical tick (odometer roll)
  public playTick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // AudioContext not allowed before user interaction
    }
  }

  // Flame ignition & whoosh
  public playIgnite() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.3);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext error handling
    }
  }

  // Balloon pop
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext error handling
    }
  }

  // Page flip whoosh
  public playPageFlip() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  // Candle blow out + celebration chimes
  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      // Gentle breath puff
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Magical celebration chimes arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.3 + idx * 0.12);
        chimeGain.gain.setValueAtTime(0, ctx.currentTime + 0.3 + idx * 0.12);
        chimeGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.32 + idx * 0.12);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2 + idx * 0.12);
        osc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.3 + idx * 0.12);
        osc.stop(ctx.currentTime + 1.3 + idx * 0.12);
      });
    } catch {
      // ignore
    }
  }

  // Background Music - uses HTMLAudioElement for the actual song file
  public startMusic() {
    this.initMusic();
    if (this.isMuted || !this.music) return Promise.resolve(false);
    if (this.getIsMusicPlaying()) return Promise.resolve(true);
    this.music.volume = this.musicVolume;
    this.music.muted = this.isMuted;
    return this.music.play().then(() => true).catch(() => false);
  }

  public stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  public async toggleMusic(): Promise<boolean> {
    this.initMusic();
    if (this.getIsMusicPlaying()) {
      this.stopMusic();
      return false;
    } else {
      return this.startMusic();
    }
  }
}

export const sounds = new SoundEngine();
