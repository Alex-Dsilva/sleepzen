import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, CompletedSession } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: '@sleepzen_user_preferences',
  SESSIONS: '@sleepzen_completed_sessions',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  hasCompletedOnboarding: false,
  defaultMood: 'racing-thoughts',
  defaultDuration: 10,
  defaultAmbientSound: 'rain',
  ambientVolume: 0.7,
  narrationVolume: 0.85,
  fadeDurationSeconds: 30,
  reducedMotion: false,
  dimModeEnabled: false,
  reminderEnabled: false,
  reminderTime: '22:30',
};

export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!json) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(json) };
  } catch (error) {
    console.warn('Failed to load preferences from storage:', error);
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  try {
    const current = await loadPreferences();
    const updated = { ...current, ...prefs };
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Failed to save preferences to storage:', error);
    return DEFAULT_PREFERENCES;
  }
}

export async function loadCompletedSessions(): Promise<CompletedSession[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!json) return [];
    return JSON.parse(json);
  } catch (error) {
    console.warn('Failed to load session history:', error);
    return [];
  }
}

export async function saveCompletedSession(session: CompletedSession): Promise<CompletedSession[]> {
  try {
    const current = await loadCompletedSessions();
    const updated = [session, ...current];
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Failed to save session to storage:', error);
    return [];
  }
}

export async function updateSessionFeedback(sessionId: string, rating: CompletedSession['feedback']): Promise<CompletedSession[]> {
  try {
    const current = await loadCompletedSessions();
    const updated = current.map((s) => (s.id === sessionId ? { ...s, feedback: rating } : s));
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Failed to update session feedback:', error);
    return [];
  }
}

export async function clearAllLocalData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.PREFERENCES, STORAGE_KEYS.SESSIONS]);
  } catch (error) {
    console.warn('Failed to clear local data:', error);
  }
}
