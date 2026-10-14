import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenName,
  UserPreferences,
  CompletedSession,
  MoodId,
  SessionDuration,
  AmbientSoundId,
} from '../types';
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
  loadCompletedSessions,
  saveCompletedSession,
  updateSessionFeedback,
  clearAllLocalData,
} from '../utils/storage';

interface AppContextType {
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  sessions: CompletedSession[];
  recordSession: (session: CompletedSession) => Promise<void>;
  rateSession: (sessionId: string, rating: CompletedSession['feedback']) => Promise<void>;
  resetAllData: () => Promise<void>;
  // Active session parameters selected on Home
  selectedMood: MoodId;
  setSelectedMood: (mood: MoodId) => void;
  selectedDuration: SessionDuration;
  setSelectedDuration: (duration: SessionDuration) => void;
  selectedAmbient: AmbientSoundId;
  setSelectedAmbient: (sound: AmbientSoundId) => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Active choices
  const [selectedMood, setSelectedMood] = useState<MoodId>('racing-thoughts');
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(10);
  const [selectedAmbient, setSelectedAmbient] = useState<AmbientSoundId>('rain');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const savedPrefs = await loadPreferences();
      const savedSessions = await loadCompletedSessions();
      setPreferences(savedPrefs);
      setSessions(savedSessions);

      setSelectedMood(savedPrefs.defaultMood);
      setSelectedDuration(savedPrefs.defaultDuration);
      setSelectedAmbient(savedPrefs.defaultAmbientSound);

      // If user hasn't seen onboarding yet, take them to onboarding
      if (!savedPrefs.hasCompletedOnboarding) {
        setCurrentScreen('onboarding');
      }
      setIsLoaded(true);
    }
    init();
  }, []);

  const navigateTo = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const handleUpdatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = await savePreferences(newPrefs);
    setPreferences(updated);
  };

  const handleRecordSession = async (session: CompletedSession) => {
    const updated = await saveCompletedSession(session);
    setSessions(updated);
  };

  const handleRateSession = async (sessionId: string, rating: CompletedSession['feedback']) => {
    const updated = await updateSessionFeedback(sessionId, rating);
    setSessions(updated);
  };

  const handleResetAllData = async () => {
    await clearAllLocalData();
    setPreferences(DEFAULT_PREFERENCES);
    setSessions([]);
    setSelectedMood(DEFAULT_PREFERENCES.defaultMood);
    setSelectedDuration(DEFAULT_PREFERENCES.defaultDuration);
    setSelectedAmbient(DEFAULT_PREFERENCES.defaultAmbientSound);
    setCurrentScreen('onboarding');
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        preferences,
        updatePreferences: handleUpdatePreferences,
        sessions,
        recordSession: handleRecordSession,
        rateSession: handleRateSession,
        resetAllData: handleResetAllData,
        selectedMood,
        setSelectedMood,
        selectedDuration,
        setSelectedDuration,
        selectedAmbient,
        setSelectedAmbient,
        activeSessionId,
        setActiveSessionId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
