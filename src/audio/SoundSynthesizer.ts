/**
 * SoundSynthesizer: Generates high-fidelity ambient soundscapes
 * (Rain, Ocean Waves, Night Forest, Soft Broadband Noise)
 * using Web Audio API on web, and provides audio management for Expo.
 */

import { AmbientSoundId } from '../types';

class SoundSynthesizer {
  private audioCtx: any = null;
  private isPlaying: boolean = false;
  private currentSound: AmbientSoundId | null = null;
  private masterGain: any = null;
  private nodes: any[] = [];
  private currentVolume: number = 0.7;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
  }

  private ensureAudioContext() {
    if (!this.audioCtx) {
      this.initAudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
    }
  }

  public playAmbient(soundId: AmbientSoundId, volume = 0.7) {
    this.stop();
    this.ensureAudioContext();
    this.currentSound = soundId;
    this.setVolume(volume);

    if (!this.audioCtx) return;

    this.isPlaying = true;

    switch (soundId) {
      case 'rain':
        this.startRain();
        break;
      case 'ocean':
        this.startOcean();
        break;
      case 'forest':
        this.startForest();
        break;
      case 'pink-noise':
        this.startPinkNoise();
        break;
    }
  }

  public stop() {
    this.nodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignored
      }
    });
    this.nodes = [];
    this.isPlaying = false;
    this.currentSound = null;
  }

  public fadeOut(durationSeconds = 15): Promise<void> {
    return new Promise((resolve) => {
      if (!this.masterGain || !this.audioCtx) {
        this.stop();
        resolve();
        return;
      }
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + durationSeconds);

      setTimeout(() => {
        this.stop();
        if (this.masterGain && this.audioCtx) {
          this.masterGain.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
        }
        resolve();
      }, durationSeconds * 1000);
    });
  }

  // Pink Noise Buffer generator (1/f noise)
  private createPinkNoiseBuffer(): any {
    if (!this.audioCtx) return null;
    const bufferSize = this.audioCtx.sampleRate * 4;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // --- Rain Generator ---
  private startRain() {
    const buffer = this.createPinkNoiseBuffer();
    if (!buffer) return;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter for distant soft shower
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.audioCtx.currentTime);

    // Highpass to eliminate harsh low rumble
    const highpass = this.audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(250, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.75, this.audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise, filter, highpass, gain);
  }

  // --- Ocean Wave Generator ---
  private startOcean() {
    const buffer = this.createPinkNoiseBuffer();
    if (!buffer) return;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Lowpass filter whose frequency oscillates with slow rhythm (waves)
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

    // LFO for wave swelling
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.audioCtx.currentTime); // ~8 sec wave cycle

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(220, this.audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.9, this.audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.nodes.push(noise, filter, lfo, lfoGain, gain);
  }

  // --- Night Forest Generator ---
  private startForest() {
    // Gentle rustling wind base
    const buffer = this.createPinkNoiseBuffer();
    if (!buffer) return;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    const windGain = this.audioCtx.createGain();
    windGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);
    noise.start();

    // Very quiet gentle cricket pulse
    const cricketOsc = this.audioCtx.createOscillator();
    cricketOsc.type = 'sine';
    cricketOsc.frequency.setValueAtTime(4600, this.audioCtx.currentTime);

    const cricketAmp = this.audioCtx.createGain();
    cricketAmp.gain.setValueAtTime(0.015, this.audioCtx.currentTime);

    const cricketLfo = this.audioCtx.createOscillator();
    cricketLfo.type = 'square';
    cricketLfo.frequency.setValueAtTime(4, this.audioCtx.currentTime);

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
    cricketLfo.connect(lfoGain);
    lfoGain.connect(cricketAmp.gain);

    cricketOsc.connect(cricketAmp);
    cricketAmp.connect(this.masterGain);

    cricketOsc.start();
    cricketLfo.start();

    this.nodes.push(noise, filter, windGain, cricketOsc, cricketAmp, cricketLfo, lfoGain);
  }

  // --- Pink Noise Generator ---
  private startPinkNoise() {
    const buffer = this.createPinkNoiseBuffer();
    if (!buffer) return;

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.55, this.audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise, filter, gain);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSound(): AmbientSoundId | null {
    return this.currentSound;
  }
}

export const soundSynthesizer = new SoundSynthesizer();
