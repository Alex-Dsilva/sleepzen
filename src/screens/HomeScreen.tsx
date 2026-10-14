import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { MOOD_OPTIONS, AMBIENT_SOUNDS } from '../data/contentManifest';
import { MoodId, SessionDuration, AmbientSoundId } from '../types';
import { SoundMixerModal } from '../components/SoundMixerModal';

export const HomeScreen: React.FC = () => {
  const {
    navigateTo,
    selectedMood,
    setSelectedMood,
    selectedDuration,
    setSelectedDuration,
    selectedAmbient,
    setSelectedAmbient,
    preferences,
  } = useApp();

  const { startSession } = useAudio();
  const [mixerVisible, setMixerVisible] = useState(false);

  const activeMoodObj = MOOD_OPTIONS.find((m) => m.id === selectedMood) || MOOD_OPTIONS[0];
  const activeAmbientObj = AMBIENT_SOUNDS.find((a) => a.id === selectedAmbient) || AMBIENT_SOUNDS[0];

  const handleStartSleep = () => {
    startSession(selectedMood, selectedDuration, selectedAmbient);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bedside Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Tonight's Wind-Down</Text>
            <Text style={styles.greetingSubtitle}>Calm before clever • Screen can go dark</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigateTo('history')}
              activeOpacity={0.7}
              accessibilityLabel="View session history"
            >
              <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigateTo('settings')}
              activeOpacity={0.7}
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* PRIMARY CALL TO ACTION: START SLEEP */}
          <TouchableOpacity
            style={styles.startSleepCard}
            onPress={handleStartSleep}
            activeOpacity={0.88}
            accessibilityLabel={`Start sleep session for ${activeMoodObj.shortLabel}, ${selectedDuration} minutes`}
          >
            <View style={styles.startCardInner}>
              <View style={styles.startCardTextCol}>
                <View style={styles.readyBadge}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.readyBadgeText}>Ready for Bed</Text>
                </View>
                <Text style={styles.startCardTitle}>Start Sleep</Text>
                <Text style={styles.startCardMeta}>
                  {activeMoodObj.shortLabel} • {selectedDuration} min • {activeAmbientObj.name}
                </Text>
              </View>
              <View style={styles.playButtonGlow}>
                <Ionicons name="play" size={28} color="#080C16" />
              </View>
            </View>
          </TouchableOpacity>

          {/* MOOD SELECTION: "How are you feeling right now?" */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
            </View>

            <View style={styles.moodList}>
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <TouchableOpacity
                    key={mood.id}
                    style={[styles.moodCard, isSelected && styles.moodCardSelected]}
                    onPress={() => setSelectedMood(mood.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.moodIconWrap,
                        { backgroundColor: isSelected ? mood.accent : '#1E293B' },
                      ]}
                    >
                      <Ionicons
                        name={mood.icon as any}
                        size={22}
                        color={isSelected ? '#080C16' : mood.accent}
                      />
                    </View>
                    <View style={styles.moodTextWrap}>
                      <Text
                        style={[
                          styles.moodTitle,
                          isSelected && { color: Colors.textPrimary, fontWeight: '700' },
                        ]}
                      >
                        {mood.title}
                      </Text>
                      <Text style={styles.moodSubtitle} numberOfLines={2}>
                        {mood.subtitle}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={Colors.accentPrimary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* DURATION SELECTOR: 5, 10, 20 Minutes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Length</Text>
            <View style={styles.durationSelector}>
              {([5, 10, 20] as SessionDuration[]).map((dur) => {
                const isSelected = selectedDuration === dur;
                return (
                  <TouchableOpacity
                    key={dur}
                    style={[styles.durPill, isSelected && styles.durPillSelected]}
                    onPress={() => setSelectedDuration(dur)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.durPillText, isSelected && styles.durPillTextSelected]}>
                      {dur} min
                    </Text>
                    {dur === 10 && <Text style={styles.defaultSub}>Default</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* AMBIENT SOUND PREVIEW & SOUND MIXER SHORTCUT */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Background Sound</Text>
              <TouchableOpacity onPress={() => setMixerVisible(true)}>
                <Text style={styles.sectionLink}>Customize</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.ambientPillCard}
              onPress={() => setMixerVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.ambientPillLeft}>
                <Ionicons
                  name={activeAmbientObj.icon as any}
                  size={20}
                  color={activeAmbientObj.color}
                />
                <View>
                  <Text style={styles.ambientPillName}>{activeAmbientObj.name}</Text>
                  <Text style={styles.ambientPillSub}>{activeAmbientObj.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* STANDALONE SOUND MACHINE SHORTCUT */}
          <TouchableOpacity
            style={styles.soundMachineShortcut}
            onPress={() => navigateTo('mixer')}
            activeOpacity={0.8}
          >
            <Ionicons name="radio-outline" size={20} color={Colors.accentSecondary} />
            <Text style={styles.soundMachineText}>Sleep Sound Machine (No Narration)</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.accentSecondary} />
          </TouchableOpacity>
        </ScrollView>

        {/* In-app sound mixer modal */}
        <SoundMixerModal
          visible={mixerVisible}
          onClose={() => setMixerVisible(false)}
          showNarrationControl={false}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    paddingVertical: 18,
    gap: 20,
    paddingBottom: 36,
  },
  startSleepCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.accentPrimary,
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  startCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startCardTextCol: {
    flex: 1,
    marginRight: 16,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentSecondary,
  },
  readyBadgeText: {
    color: Colors.accentSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  startCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  startCardMeta: {
    fontSize: 13,
    color: '#C7D2FE',
    lineHeight: 18,
  },
  playButtonGlow: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  section: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionLink: {
    color: Colors.accentPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  moodList: {
    gap: 10,
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  moodCardSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#131D3B',
  },
  moodIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodTextWrap: {
    flex: 1,
  },
  moodTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  moodSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  durPill: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durPillSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#1E1B4B',
  },
  durPillText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  durPillTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  defaultSub: {
    fontSize: 9,
    color: Colors.accentPrimary,
    marginTop: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ambientPillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ambientPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ambientPillName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  ambientPillSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  soundMachineShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1E36',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  soundMachineText: {
    color: '#E0F2FE',
    fontSize: 13,
    fontWeight: '600',
  },
});
