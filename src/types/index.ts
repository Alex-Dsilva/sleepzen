export type MoodId =
  | 'racing-thoughts'
  | 'stressed-tense'
  | 'restless'
  | 'sleepy-awake';

export interface MoodOption {
  id: MoodId;
  title: string;
  shortLabel: string;
  subtitle: string;
  icon: string;
  accent: string;
  compositionDescription: string;
}

export type SessionDuration = 5 | 10 | 20;

export interface SessionPhase {
  id: string;
  title: string;
  subtitle: string;
  startPercent: number; // 0 - 100
  endPercent: number;   // 0 - 100
  script: string;
  breathPacing?: {
    inhale: number;
    hold: number;
    exhale: number;
  };
}

export interface SessionComposition {
  moodId: MoodId;
  moodTitle: string;
  phases: SessionPhase[];
}

export type AmbientSoundId = 'rain' | 'ocean' | 'forest' | 'pink-noise';

export interface AmbientSoundOption {
  id: AmbientSoundId;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
}

export type FeedbackRating = 'very-helpful' | 'relaxing' | 'neutral' | 'not-for-me';

export interface CompletedSession {
  id: string;
  date: string;
  moodId: MoodId;
  moodTitle: string;
  durationMinutes: number;
  completedPercent: number;
  feedback?: FeedbackRating;
}

export interface UserPreferences {
  hasCompletedOnboarding: boolean;
  defaultMood: MoodId;
  defaultDuration: SessionDuration;
  defaultAmbientSound: AmbientSoundId;
  ambientVolume: number;    // 0.0 - 1.0
  narrationVolume: number;  // 0.0 - 1.0
  fadeDurationSeconds: number;
  reducedMotion: boolean;
  dimModeEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm format, e.g. "22:30"
}

export type ScreenName =
  | 'onboarding'
  | 'home'
  | 'player'
  | 'feedback'
  | 'mixer'
  | 'history'
  | 'settings';
