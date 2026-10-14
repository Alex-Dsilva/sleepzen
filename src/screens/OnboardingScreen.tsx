import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { AMBIENT_SOUNDS } from '../data/contentManifest';
import { AmbientSoundId, SessionDuration } from '../types';

export const OnboardingScreen: React.FC = () => {
  const { updatePreferences, navigateTo, setSelectedAmbient, setSelectedDuration } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [preferredSound, setPreferredSound] = useState<AmbientSoundId>('rain');
  const [preferredDuration, setPreferredDuration] = useState<SessionDuration>(10);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else handleComplete();
  };

  const handleComplete = async () => {
    await updatePreferences({
      hasCompletedOnboarding: true,
      defaultAmbientSound: preferredSound,
      defaultDuration: preferredDuration,
    });
    setSelectedAmbient(preferredSound);
    setSelectedDuration(preferredDuration);
    navigateTo('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Step Progress Indicators */}
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
          <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* STEP 1: Brand & Value Proposition */}
          {step === 1 && (
            <View style={styles.stepBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="moon" size={48} color={Colors.accentPrimary} />
              </View>
              <Text style={styles.appName}>SLEEPZEN</Text>
              <Text style={styles.tagline}>A simple, guided wind-down routine that helps you relax before sleep.</Text>
              <Text style={styles.bodyDescription}>
                One question. One guided journey. Then the screen can go dark.
              </Text>
              <View style={styles.featurePills}>
                <View style={styles.pill}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={Colors.accentSecondary} />
                  <Text style={styles.pillText}>Guest-First • No Account Required</Text>
                </View>
                <View style={styles.pill}>
                  <Ionicons name="cloud-offline-outline" size={16} color={Colors.accentGreen} />
                  <Text style={styles.pillText}>100% Offline-Ready Core</Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: Medical Disclaimer & Relaxation Statement */}
          {step === 2 && (
            <View style={styles.stepBox}>
              <View style={[styles.iconCircle, { borderColor: 'rgba(56, 189, 248, 0.4)' }]}>
                <Ionicons name="heart-outline" size={44} color={Colors.accentSecondary} />
              </View>
              <Text style={styles.stepTitle}>Mindful & Honest Relaxation</Text>
              <View style={styles.disclaimerCard}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.accentSecondary} />
                <Text style={styles.disclaimerText}>
                  SLEEPZEN provides gentle relaxation guidance and bedtime audio. It does not diagnose, treat, or cure medical conditions, and does not claim to guarantee sleep within a set number of minutes.
                </Text>
              </View>
              <Text style={styles.guidanceNote}>
                You are always in control: pause or skip any exercise that feels uncomfortable, and return to your natural breathing at any time.
              </Text>
            </View>
          )}

          {/* STEP 3: Bedside Preferences */}
          {step === 3 && (
            <View style={styles.stepBox}>
              <Text style={styles.stepTitle}>Customize Your Bedside</Text>
              <Text style={styles.stepSubtitle}>You can change these anytime in settings.</Text>

              {/* Sound preference */}
              <Text style={styles.fieldLabel}>Default Soundscape</Text>
              <View style={styles.optionsGrid}>
                {AMBIENT_SOUNDS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.prefCard, preferredSound === s.id && styles.prefCardSelected]}
                    onPress={() => setPreferredSound(s.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={s.icon as any}
                      size={20}
                      color={preferredSound === s.id ? Colors.textPrimary : Colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.prefCardText,
                        preferredSound === s.id && styles.prefCardTextSelected,
                      ]}
                    >
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Duration preference */}
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Default Session Length</Text>
              <View style={styles.durationRow}>
                {([5, 10, 20] as SessionDuration[]).map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    style={[styles.durBtn, preferredDuration === dur && styles.durBtnSelected]}
                    onPress={() => setPreferredDuration(dur)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.durBtnText, preferredDuration === dur && styles.durBtnTextSelected]}>
                      {dur} min
                    </Text>
                    {dur === 10 && <Text style={styles.recommendedBadge}>Recommended</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>
              {step === 3 ? 'Start Sleep Routine' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#080C16" />
          </TouchableOpacity>

          {step < 3 && (
            <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip directly to Home</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  progressDot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: Colors.accentPrimary,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  stepBox: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    maxWidth: 320,
  },
  bodyDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  featurePills: {
    gap: 10,
    width: '100%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },
  stepSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  disclaimerCard: {
    backgroundColor: '#0F1E36',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 16,
    padding: 18,
    gap: 12,
    marginBottom: 20,
  },
  disclaimerText: {
    color: '#E0F2FE',
    fontSize: 14,
    lineHeight: 22,
  },
  guidanceNote: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  prefCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  prefCardSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#1E1B4B',
  },
  prefCardText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  prefCardTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  durBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durBtnSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#1E1B4B',
  },
  durBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  durBtnTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  recommendedBadge: {
    fontSize: 9,
    color: Colors.accentPrimary,
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footer: {
    paddingBottom: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.accentPrimary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButtonText: {
    color: '#080C16',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
