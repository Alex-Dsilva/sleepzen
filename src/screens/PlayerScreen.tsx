import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useAudio } from '../context/AudioContext';
import { useApp } from '../context/AppContext';
import { BreathingOrb } from '../components/BreathingOrb';
import { SoundMixerModal } from '../components/SoundMixerModal';
import { MOOD_OPTIONS } from '../data/contentManifest';

export const PlayerScreen: React.FC = () => {
  const { preferences } = useApp();
  const {
    isPlaying,
    isPaused,
    isFading,
    activeMood,
    remainingSeconds,
    totalSeconds,
    progressPercent,
    currentPhaseIndex,
    currentPhase,
    phases,
    pauseSession,
    resumeSession,
    skipPhase,
    stopSession,
  } = useAudio();

  const [mixerVisible, setMixerVisible] = useState(false);
  const [dimMode, setDimMode] = useState(false);

  const moodMeta = MOOD_OPTIONS.find((m) => m.id === activeMood) || MOOD_OPTIONS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If in Dim Mode (bedside black screen), render ultra-minimal screen with tap-to-wake
  if (dimMode) {
    return (
      <TouchableOpacity
        style={styles.dimScreenContainer}
        activeOpacity={1}
        onPress={() => setDimMode(false)}
      >
        <Ionicons name="moon" size={24} color="#334155" />
        <Text style={styles.dimTapHint}>Screen Dimmed • Tap anywhere to wake</Text>
        <Text style={styles.dimTimerText}>{formatTime(remainingSeconds)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => stopSession(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.topTitleGroup}>
            <Text style={styles.topCategory}>{moodMeta.shortLabel}</Text>
            <Text style={styles.topSessionTitle}>Guided Relaxation</Text>
          </View>

          <TouchableOpacity
            style={styles.topActionBtn}
            onPress={() => setDimMode(true)}
            activeOpacity={0.7}
            accessibilityLabel="Dim screen for sleep"
          >
            <Ionicons name="eye-off-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Phase Stepper Pills */}
        <View style={styles.stepperRow}>
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            return (
              <View
                key={phase.id}
                style={[
                  styles.stepSegment,
                  isCompleted && styles.stepSegmentCompleted,
                  isCurrent && styles.stepSegmentCurrent,
                ]}
              />
            );
          })}
        </View>

        {/* Current Phase Header */}
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseStepCount}>
            Phase {currentPhaseIndex + 1} of {phases.length}
          </Text>
          <Text style={styles.phaseName}>{currentPhase?.title || 'Rest'}</Text>
          <Text style={styles.phaseDescription}>{currentPhase?.subtitle || ''}</Text>
        </View>

        {/* Central Soothing Visualizer */}
        <View style={styles.visualizerContainer}>
          <BreathingOrb
            reducedMotion={preferences.reducedMotion}
            breathPacing={currentPhase?.breathPacing}
            phaseTitle={currentPhase?.title}
          />
        </View>

        {/* Dynamic Voice Narration Prompt Card */}
        {currentPhase?.script ? (
          <View style={styles.scriptCard}>
            <Text style={styles.scriptText}>"{currentPhase.script}"</Text>
          </View>
        ) : null}

        {/* Timer & Fade Status */}
        <View style={styles.timerRow}>
          <Text style={styles.timerText}>{formatTime(remainingSeconds)} remaining</Text>
          {isFading && (
            <View style={styles.fadeBadge}>
              <Ionicons name="volume-mute-outline" size={14} color={Colors.accentWarm} />
              <Text style={styles.fadeBadgeText}>Gentle Fade-Out</Text>
            </View>
          )}
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsRow}>
          {/* Sound Mixer */}
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() => setMixerVisible(true)}
            activeOpacity={0.7}
            accessibilityLabel="Sound Mixer"
          >
            <Ionicons name="options-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Skip Phase */}
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={skipPhase}
            activeOpacity={0.7}
            accessibilityLabel="Skip current phase"
          >
            <Ionicons name="play-skip-forward-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Main Play / Pause */}
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={isPaused ? resumeSession : pauseSession}
            activeOpacity={0.8}
            accessibilityLabel={isPaused ? 'Resume session' : 'Pause session'}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={30}
              color="#080C16"
              style={isPaused ? { marginLeft: 3 } : undefined}
            />
          </TouchableOpacity>

          {/* End Session */}
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() => stopSession(true)}
            activeOpacity={0.7}
            accessibilityLabel="End session"
          >
            <Ionicons name="stop-outline" size={22} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Mixer Modal */}
        <SoundMixerModal
          visible={mixerVisible}
          onClose={() => setMixerVisible(false)}
          showNarrationControl={true}
        />
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
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitleGroup: {
    alignItems: 'center',
  },
  topCategory: {
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  topSessionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  topActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    marginBottom: 8,
  },
  stepSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.surfaceLight,
  },
  stepSegmentCompleted: {
    backgroundColor: Colors.accentPrimary,
  },
  stepSegmentCurrent: {
    backgroundColor: '#38BDF8',
  },
  phaseHeader: {
    alignItems: 'center',
    marginVertical: 4,
  },
  phaseStepCount: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  phaseName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  phaseDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  scriptCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  scriptText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  timerText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  fadeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  fadeBadgeText: {
    color: Colors.accentWarm,
    fontSize: 11,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingTop: 10,
  },
  secondaryControl: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playPauseButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  dimScreenContainer: {
    flex: 1,
    backgroundColor: '#030509',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  dimTapHint: {
    color: '#334155',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  dimTimerText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
  },
});
