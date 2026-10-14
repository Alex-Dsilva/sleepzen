import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { AMBIENT_SOUNDS } from '../data/contentManifest';
import { AmbientSoundId } from '../types';

export const SoundMixerScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const {
    activeAmbient,
    ambientVolume,
    setAmbientVolume,
    isPlaying,
    ambientOnlyMode,
    playAmbientOnly,
    stopAmbientOnly,
  } = useAudio();

  const [selectedTimer, setSelectedTimer] = useState<number>(30); // minutes

  const handleTogglePlay = (soundId: AmbientSoundId) => {
    if (isPlaying && ambientOnlyMode && activeAmbient === soundId) {
      stopAmbientOnly();
    } else {
      playAmbientOnly(soundId, selectedTimer);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigateTo('home')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Sound Machine</Text>
            <Text style={styles.headerSubtitle}>Pure ambient sleep loops • No talking</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Sleep Timer Selector */}
          <View style={styles.timerCard}>
            <Text style={styles.cardLabel}>Sleep Timer</Text>
            <View style={styles.timerRow}>
              {[15, 30, 45, 60].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[styles.timerBtn, selectedTimer === mins && styles.timerBtnSelected]}
                  onPress={() => {
                    setSelectedTimer(mins);
                    if (isPlaying && ambientOnlyMode) {
                      playAmbientOnly(activeAmbient, mins);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.timerBtnText,
                      selectedTimer === mins && styles.timerBtnTextSelected,
                    ]}
                  >
                    {mins}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Soundscapes List */}
          <Text style={styles.sectionHeader}>Soundscapes</Text>
          <View style={styles.soundList}>
            {AMBIENT_SOUNDS.map((sound) => {
              const isCurrentlyPlaying = isPlaying && ambientOnlyMode && activeAmbient === sound.id;

              return (
                <TouchableOpacity
                  key={sound.id}
                  style={[styles.soundRowCard, isCurrentlyPlaying && styles.soundRowCardPlaying]}
                  onPress={() => handleTogglePlay(sound.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.soundIconWrap,
                      { backgroundColor: isCurrentlyPlaying ? sound.color : '#1E293B' },
                    ]}
                  >
                    <Ionicons
                      name={sound.icon as any}
                      size={24}
                      color={isCurrentlyPlaying ? '#080C16' : sound.color}
                    />
                  </View>

                  <View style={styles.soundTextCol}>
                    <Text style={styles.soundTitle}>{sound.name}</Text>
                    <Text style={styles.soundDesc}>{sound.subtitle}</Text>
                  </View>

                  <View
                    style={[
                      styles.playIconCircle,
                      isCurrentlyPlaying && styles.playIconCircleActive,
                    ]}
                  >
                    <Ionicons
                      name={isCurrentlyPlaying ? 'pause' : 'play'}
                      size={18}
                      color={isCurrentlyPlaying ? '#080C16' : Colors.textPrimary}
                      style={!isCurrentlyPlaying ? { marginLeft: 2 } : undefined}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Volume Level Slider */}
          <View style={styles.volumeCard}>
            <View style={styles.volumeHeader}>
              <View style={styles.volHeaderLeft}>
                <Ionicons name="volume-medium-outline" size={20} color={Colors.accentSecondary} />
                <Text style={styles.volCardTitle}>Master Volume</Text>
              </View>
              <Text style={styles.volPercentText}>{Math.round(ambientVolume * 100)}%</Text>
            </View>

            <View style={styles.volumeSteps}>
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((step) => (
                <TouchableOpacity
                  key={step}
                  style={[
                    styles.volStep,
                    ambientVolume >= step - 0.05 && styles.volStepActive,
                  ]}
                  onPress={() => setAmbientVolume(step)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.volStepLabel,
                      ambientVolume >= step - 0.05 && styles.volStepLabelActive,
                    ]}
                  >
                    {Math.round(step * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  scrollContent: {
    paddingVertical: 18,
    gap: 18,
    paddingBottom: 36,
  },
  timerCard: {
    backgroundColor: Colors.surfaceCard,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  timerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timerBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  timerBtnSelected: {
    backgroundColor: Colors.accentPrimary,
  },
  timerBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  timerBtnTextSelected: {
    color: '#080C16',
    fontWeight: '700',
  },
  sectionHeader: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  soundList: {
    gap: 10,
  },
  soundRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  soundRowCardPlaying: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#1E1B4B',
  },
  soundIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundTextCol: {
    flex: 1,
  },
  soundTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  soundDesc: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  playIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircleActive: {
    backgroundColor: Colors.accentPrimary,
  },
  volumeCard: {
    backgroundColor: Colors.surfaceCard,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  volHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volCardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  volPercentText: {
    color: Colors.accentSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  volumeSteps: {
    flexDirection: 'row',
    gap: 6,
  },
  volStep: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  volStepActive: {
    backgroundColor: Colors.accentSecondary,
  },
  volStepLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  volStepLabelActive: {
    color: '#080C16',
    fontWeight: '700',
  },
});
