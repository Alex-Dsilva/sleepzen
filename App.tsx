import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AudioProvider } from './src/context/AudioContext';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { FeedbackScreen } from './src/screens/FeedbackScreen';
import { SoundMixerScreen } from './src/screens/SoundMixerScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Colors } from './src/theme/colors';

const NavigationRoot: React.FC = () => {
  const { currentScreen } = useApp();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'home':
        return <HomeScreen />;
      case 'player':
        return <PlayerScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'mixer':
        return <SoundMixerScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AudioProvider>
          <StatusBar style="light" />
          <NavigationRoot />
        </AudioProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
