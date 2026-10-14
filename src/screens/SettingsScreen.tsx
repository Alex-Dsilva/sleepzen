import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { SessionDuration } from '../types';

export const SettingsScreen: React.FC = () => {
  const { preferences, updatePreferences, navigateTo, resetAllData } = useApp();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const handleToggleReducedMotion = (val: boolean) => {
    updatePreferences({ reducedMotion: val });
  };

  const handleToggleReminder = (val: boolean) => {
    updatePreferences({ reminderEnabled: val });
  };

  const handleSetDuration = (dur: SessionDuration) => {
    updatePreferences({ defaultDuration: dur });
  };

  const handleSetFade = (seconds: number) => {
    updatePreferences({ fadeDurationSeconds: seconds });
  };

  const handleResetData = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Delete all local data? This will clear all settings, preferences, and routine history.')) {
        resetAllData();
      }
    } else {
      Alert.alert(
        'Delete My Data',
        'This will erase all saved preferences and routine records on this device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete Everything', style: 'destructive', onPress: resetAllData },
        ]
      );
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
            <Text style={styles.headerTitle}>Settings & Safety</Text>
            <Text style={styles.headerSubtitle}>Preferences • Privacy • Honest claims</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* BEDTIME PREFERENCES */}
          <Text style={styles.sectionTitle}>Bedtime Preferences</Text>
          <View style={styles.card}>
            {/* Default Duration */}
            <View style={styles.row}>
              <View style={styles.rowLabelCol}>
                <Text style={styles.rowTitle}>Default Session Length</Text>
                <Text style={styles.rowSub}>Selected when opening the app</Text>
              </View>
              <View style={styles.pillGroup}>
                {([5, 10, 20] as SessionDuration[]).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.smallPill,
                      preferences.defaultDuration === d && styles.smallPillActive,
                    ]}
                    onPress={() => handleSetDuration(d)}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        preferences.defaultDuration === d && styles.smallPillTextActive,
                      ]}
                    >
                      {d}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Fade Duration */}
            <View style={styles.row}>
              <View style={styles.rowLabelCol}>
                <Text style={styles.rowTitle}>Sleep Timer Fade-Out</Text>
                <Text style={styles.rowSub}>Smoothly lowers volume before stopping</Text>
              </View>
              <View style={styles.pillGroup}>
                {[15, 30, 45].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.smallPill,
                      preferences.fadeDurationSeconds === s && styles.smallPillActive,
                    ]}
                    onPress={() => handleSetFade(s)}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        preferences.fadeDurationSeconds === s && styles.smallPillTextActive,
                      ]}
                    >
                      {s}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Bedtime Reminder */}
            <View style={styles.row}>
              <View style={styles.rowLabelCol}>
                <Text style={styles.rowTitle}>Bedtime Reminder</Text>
                <Text style={styles.rowSub}>
                  {preferences.reminderEnabled ? 'Nightly at 10:30 PM (Opt-in)' : 'Off by default'}
                </Text>
              </View>
              <Switch
                value={preferences.reminderEnabled}
                onValueChange={handleToggleReminder}
                trackColor={{ false: Colors.surfaceLight, true: Colors.accentPrimary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ACCESSIBILITY */}
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLabelCol}>
                <Text style={styles.rowTitle}>Reduced Motion</Text>
                <Text style={styles.rowSub}>Replaces breathing animations with a calm static orb</Text>
              </View>
              <Switch
                value={preferences.reducedMotion}
                onValueChange={handleToggleReducedMotion}
                trackColor={{ false: Colors.surfaceLight, true: Colors.accentPrimary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* HEALTH & SAFETY STATEMENT (Verbatim Section 12) */}
          <Text style={styles.sectionTitle}>Health & Safety Statement</Text>
          <View style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.accentSecondary} />
              <Text style={styles.safetyTitle}>Official Health Notice</Text>
            </View>
            <Text style={styles.safetyBody}>
              "SLEEPZEN offers relaxation exercises and bedtime audio. It does not diagnose or treat medical conditions, and it cannot guarantee that you will fall asleep. Stop any exercise that feels uncomfortable. If sleep problems persist or affect your daily life, consider speaking with a qualified healthcare professional."
            </Text>
            <View style={styles.safetyBullet}>
              <Ionicons name="checkmark-circle-outline" size={16} color={Colors.accentGreen} />
              <Text style={styles.bulletText}>Breathing guidance allows natural breathing at all times.</Text>
            </View>
            <View style={styles.safetyBullet}>
              <Ionicons name="checkmark-circle-outline" size={16} color={Colors.accentGreen} />
              <Text style={styles.bulletText}>No compulsory breath holds, tensing pain, or guilt reminders.</Text>
            </View>
          </View>

          {/* PRIVACY & DATA OWNERSHIP */}
          <Text style={styles.sectionTitle}>Privacy & Data Ownership</Text>
          <View style={styles.card}>
            <View style={styles.privacyRow}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.accentPrimary} />
              <Text style={styles.privacyText}>
                Guest-first by default. Your wind-down history is stored entirely on this device. No microphone recording, no wearable surveillance, no invasive tracking.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteDataBtn}
              onPress={handleResetData}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
              <Text style={styles.deleteDataText}>Delete My Data / Reset App</Text>
            </TouchableOpacity>
          </View>

          {/* MONETIZATION & SUBSCRIPTION PREVIEW */}
          <Text style={styles.sectionTitle}>Membership & Support</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subCardTop}>
              <View>
                <Text style={styles.subPlanTitle}>SLEEPZEN Premium</Text>
                <Text style={styles.subPlanPrice}>₹149/month or ₹1,499/year</Text>
              </View>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Free Core Active</Text>
              </View>
            </View>
            <Text style={styles.subCardDesc}>
              All 4 core mood paths and ambient sounds are always 100% free with no account. Premium adds extended narrated libraries and future sound packs.
            </Text>
            <TouchableOpacity
              style={styles.restoreBtn}
              onPress={() => Alert.alert('Restore Purchases', 'Your device is on the free offline core tier. All core features are active!')}
              activeOpacity={0.7}
            >
              <Text style={styles.restoreBtnText}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>

          {/* App Info Footer */}
          <View style={styles.appFooter}>
            <Text style={styles.appVersionText}>SLEEPZEN v1.0.0 (Build Baseline)</Text>
            <Text style={styles.appSubFooterText}>Designed for calm nights • India-first</Text>
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
    gap: 16,
    paddingBottom: 36,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabelCol: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  rowSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  pillGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  smallPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallPillActive: {
    backgroundColor: Colors.accentPrimary,
  },
  smallPillText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  smallPillTextActive: {
    color: '#080C16',
    fontWeight: '700',
  },
  safetyCard: {
    backgroundColor: '#0F1E36',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safetyTitle: {
    color: '#E0F2FE',
    fontSize: 14,
    fontWeight: '700',
  },
  safetyBody: {
    color: '#BAE6FD',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  safetyBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletText: {
    color: '#E2E8F0',
    fontSize: 12,
    flex: 1,
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  deleteDataBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    marginTop: 4,
  },
  deleteDataText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
    gap: 10,
  },
  subCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subPlanTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  subPlanPrice: {
    color: Colors.accentSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  freeBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: {
    color: Colors.accentGreen,
    fontSize: 11,
    fontWeight: '700',
  },
  subCardDesc: {
    color: '#C7D2FE',
    fontSize: 12,
    lineHeight: 18,
  },
  restoreBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  restoreBtnText: {
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  appFooter: {
    alignItems: 'center',
    paddingTop: 10,
    gap: 4,
  },
  appVersionText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  appSubFooterText: {
    color: '#334155',
    fontSize: 11,
  },
});
