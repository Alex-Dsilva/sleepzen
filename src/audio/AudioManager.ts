import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Platform } from 'react-native';
import { AmbientSoundId, SessionPhase } from '../types';
import { soundSynthesizer } from './SoundSynthesizer';

class AudioManager {
  private ambientSound: Audio.Sound | null = null;
  private isAmbientPlaying: boolean = false;
  private currentAmbientId: AmbientSoundId | null = null;
  private ambientVolume: number = 0.7;
  private narrationVolume: number = 0.85;
  private activePhase: SessionPhase | null = null;
  private speechUtterance: any = null;

  constructor() {
    // Audio session will be configured safely once React components mount
  }

  public async configureAudioSession() {
    try {
      if (Platform.OS !== 'web' && Audio && typeof Audio.setAudioModeAsync === 'function') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS?.DoNotMix ?? 1,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid?.DoNotMix ?? 1,
          playThroughEarpieceAndroid: false,
        });
      }
    } catch (e) {
      console.warn('Could not set audio mode:', e);
    }
  }

  public async playAmbient(soundId: AmbientSoundId, volume = 0.7) {
    this.currentAmbientId = soundId;
    this.ambientVolume = volume;
    this.isAmbientPlaying = true;

    // Use SoundSynthesizer for organic looped soundscapes
    soundSynthesizer.playAmbient(soundId, volume);
  }

  public setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    soundSynthesizer.setVolume(this.ambientVolume);
  }

  public setNarrationVolume(volume: number) {
    this.narrationVolume = Math.max(0, Math.min(1, volume));
    if (this.speechUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechUtterance.volume = this.narrationVolume;
    }
  }

  public speakPhaseScript(phase: SessionPhase) {
    this.activePhase = phase;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phase.script);
        this.speechUtterance = utterance;
        utterance.rate = 0.82; // Calm, unhurried bedtime pace
        utterance.pitch = 0.95; // Gentle, lower soothing pitch
        utterance.volume = this.narrationVolume;

        // Try to pick a natural English voice (en-IN or calming en-GB/en-US)
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find((v) => v.lang.includes('en-IN'));
        const gentleVoice = indianVoice || voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Google'));
        if (gentleVoice) {
          utterance.voice = gentleVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis unavailable:', err);
      }
    }
  }

  public stopNarration() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.activePhase = null;
  }

  public pause() {
    this.stopNarration();
    soundSynthesizer.setVolume(0);
    this.isAmbientPlaying = false;
  }

  public resume() {
    if (this.currentAmbientId) {
      this.isAmbientPlaying = true;
      soundSynthesizer.setVolume(this.ambientVolume);
    }
    if (this.activePhase) {
      this.speakPhaseScript(this.activePhase);
    }
  }

  public async fadeOutAndStop(durationSeconds = 15): Promise<void> {
    this.stopNarration();
    await soundSynthesizer.fadeOut(durationSeconds);
    this.isAmbientPlaying = false;
    this.currentAmbientId = null;
  }

  public stopAll() {
    this.stopNarration();
    soundSynthesizer.stop();
    this.isAmbientPlaying = false;
    this.currentAmbientId = null;
    this.activePhase = null;
  }

  public getIsPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public getCurrentAmbientId(): AmbientSoundId | null {
    return this.currentAmbientId;
  }
}

export const audioManager = new AudioManager();
