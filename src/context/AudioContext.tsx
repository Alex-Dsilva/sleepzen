import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MoodId, SessionDuration, AmbientSoundId, SessionPhase, CompletedSession } from '../types';
import { MOOD_PHASES, MOOD_OPTIONS } from '../data/contentManifest';
import { audioManager } from '../audio/AudioManager';
import { useApp } from './AppContext';

interface AudioContextType {
  isPlaying: boolean;
  isPaused: boolean;
  isFading: boolean;
  activeMood: MoodId;
  activeDuration: SessionDuration;
  activeAmbient: AmbientSoundId;
  elapsedSeconds: number;
  totalSeconds: number;
  remainingSeconds: number;
  progressPercent: number;
  currentPhaseIndex: number;
  currentPhase: SessionPhase | null;
  phases: SessionPhase[];
  ambientVolume: number;
  narrationVolume: number;
  ambientOnlyMode: boolean;
  startSession: (mood: MoodId, duration: SessionDuration, ambient: AmbientSoundId) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  skipPhase: () => void;
  stopSession: (shouldRecord?: boolean) => void;
  setAmbientVolume: (vol: number) => void;
  setNarrationVolume: (vol: number) => void;
  playAmbientOnly: (ambient: AmbientSoundId, timerMinutes?: number) => void;
  stopAmbientOnly: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, recordSession, setActiveSessionId, navigateTo } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodId>('racing-thoughts');
  const [activeDuration, setActiveDuration] = useState<SessionDuration>(10);
  const [activeAmbient, setActiveAmbient] = useState<AmbientSoundId>('rain');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [ambientVolume, setAmbientVolumeState] = useState(preferences.ambientVolume);
  const [narrationVolume, setNarrationVolumeState] = useState(preferences.narrationVolume);
  const [ambientOnlyMode, setAmbientOnlyMode] = useState(false);

  const totalSeconds = activeDuration * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const progressPercent = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;

  const phases = MOOD_PHASES[activeMood] || [];
  const currentPhase = phases[currentPhaseIndex] || null;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const lastSpokenPhaseRef = useRef<number>(-1);

  // Handle phase determination based on progress percentage
  useEffect(() => {
    if (!isPlaying || ambientOnlyMode) return;

    const currentPercent = (elapsedSeconds / totalSeconds) * 100;
    const phaseIdx = phases.findIndex(
      (p) => currentPercent >= p.startPercent && currentPercent < p.endPercent
    );

    const validIdx = phaseIdx !== -1 ? phaseIdx : phases.length - 1;

    if (validIdx !== currentPhaseIndex) {
      setCurrentPhaseIndex(validIdx);
    }

    // Trigger voice narration when entering a new phase
    if (validIdx !== lastSpokenPhaseRef.current && phases[validIdx]) {
      lastSpokenPhaseRef.current = validIdx;
      audioManager.speakPhaseScript(phases[validIdx]);
    }

    // Trigger gentle fade-out during final fade duration (e.g. last 30s)
    const fadeThreshold = preferences.fadeDurationSeconds || 30;
    if (remainingSeconds <= fadeThreshold && !isFading && remainingSeconds > 0) {
      setIsFading(true);
    }
  }, [elapsedSeconds, isPlaying, ambientOnlyMode, phases, currentPhaseIndex, totalSeconds, remainingSeconds, isFading, preferences.fadeDurationSeconds]);

  // Main 1-second interval loop
  useEffect(() => {
    if (isPlaying && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= totalSeconds) {
            handleSessionComplete();
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, totalSeconds]);

  const handleSessionComplete = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFading(true);

    const moodMeta = MOOD_OPTIONS.find((m) => m.id === activeMood);
    const newSessionId = 'sess_' + Date.now();

    const session: CompletedSession = {
      id: newSessionId,
      date: new Date().toISOString(),
      moodId: activeMood,
      moodTitle: moodMeta ? moodMeta.title : 'Guided Relaxation',
      durationMinutes: activeDuration,
      completedPercent: 100,
    };

    await recordSession(session);
    setActiveSessionId(newSessionId);

    // Fade narration and ambient sound smoothly
    await audioManager.fadeOutAndStop(preferences.fadeDurationSeconds || 20);

    setIsPlaying(false);
    setIsPaused(false);
    setIsFading(false);
    navigateTo('feedback');
  };

  const startSession = (mood: MoodId, duration: SessionDuration, ambient: AmbientSoundId) => {
    if (timerRef.current) clearInterval(timerRef.current);
    audioManager.stopAll();

    setActiveMood(mood);
    setActiveDuration(duration);
    setActiveAmbient(ambient);
    setElapsedSeconds(0);
    setCurrentPhaseIndex(0);
    setIsFading(false);
    setIsPaused(false);
    setAmbientOnlyMode(false);
    sessionStartTimeRef.current = Date.now();
    lastSpokenPhaseRef.current = -1;

    audioManager.playAmbient(ambient, ambientVolume);
    setIsPlaying(true);
    navigateTo('player');
  };

  const pauseSession = () => {
    setIsPaused(true);
    audioManager.pause();
  };

  const resumeSession = () => {
    setIsPaused(false);
    audioManager.resume();
  };

  const skipPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      const nextPhase = phases[currentPhaseIndex + 1];
      const targetSeconds = Math.round((nextPhase.startPercent / 100) * totalSeconds);
      setElapsedSeconds(targetSeconds);
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      lastSpokenPhaseRef.current = currentPhaseIndex + 1;
      audioManager.speakPhaseScript(nextPhase);
    }
  };

  const stopSession = async (shouldRecord = true) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (shouldRecord && elapsedSeconds > 45) {
      const moodMeta = MOOD_OPTIONS.find((m) => m.id === activeMood);
      const newSessionId = 'sess_' + Date.now();
      const session: CompletedSession = {
        id: newSessionId,
        date: new Date().toISOString(),
        moodId: activeMood,
        moodTitle: moodMeta ? moodMeta.title : 'Guided Relaxation',
        durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
        completedPercent: Math.round((elapsedSeconds / totalSeconds) * 100),
      };
      await recordSession(session);
      setActiveSessionId(newSessionId);
    }

    audioManager.stopAll();
    setIsPlaying(false);
    setIsPaused(false);
    setIsFading(false);
    setElapsedSeconds(0);

    if (shouldRecord && elapsedSeconds > 45) {
      navigateTo('feedback');
    } else {
      navigateTo('home');
    }
  };

  const setAmbientVolume = (vol: number) => {
    setAmbientVolumeState(vol);
    audioManager.setAmbientVolume(vol);
  };

  const setNarrationVolume = (vol: number) => {
    setNarrationVolumeState(vol);
    audioManager.setNarrationVolume(vol);
  };

  const playAmbientOnly = (ambient: AmbientSoundId, timerMinutes = 30) => {
    if (timerRef.current) clearInterval(timerRef.current);
    audioManager.stopAll();

    setActiveAmbient(ambient);
    setAmbientOnlyMode(true);
    setIsPlaying(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setActiveDuration(timerMinutes as any);

    audioManager.playAmbient(ambient, ambientVolume);
  };

  const stopAmbientOnly = () => {
    audioManager.stopAll();
    setIsPlaying(false);
    setIsPaused(false);
    setAmbientOnlyMode(false);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isPaused,
        isFading,
        activeMood,
        activeDuration,
        activeAmbient,
        elapsedSeconds,
        totalSeconds,
        remainingSeconds,
        progressPercent,
        currentPhaseIndex,
        currentPhase,
        phases,
        ambientVolume,
        narrationVolume,
        ambientOnlyMode,
        startSession,
        pauseSession,
        resumeSession,
        skipPhase,
        stopSession,
        setAmbientVolume,
        setNarrationVolume,
        playAmbientOnly,
        stopAmbientOnly,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
