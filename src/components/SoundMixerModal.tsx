import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { AMBIENT_SOUNDS } from '../data/contentManifest';
import { AmbientSoundId } from '../types';
import { useAudio } from '../context/AudioContext';

interface SoundMixerModalProps {
  visible: boolean;
  onClose: () => void;
  showNarrationControl?: boolean;
}

export const SoundMixerModal: React.FC<SoundMixerModalProps> = ({
  visible,
  onClose,
  showNarrationControl = true,
}) => {
  const {
    activeAmbient,
    ambientVolume,
    narrationVolume,
    setAmbientVolume,
    setNarrationVolume,
    playAmbientOnly,
    ambientOnlyMode,
  } = useAudio();

  const handleSelectSound = (soundId: AmbientSoundId) => {
    if (ambientOnlyMode) {
      playAmbientOnly(soundId);
    } else {
      // In active session, switch ambient sound smoothly
      setAmbientVolume(ambientVolume);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Sound Mixer</Text>
              <Text style={styles.subtitle}>Calibrated for bedside comfort</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Ambient Sound Selection */}
            <Text style={styles.sectionLabel}>Ambient Soundscape</Text>
            <View style={styles.soundGrid}>
              {AMBIENT_SOUNDS.map((sound) => {
                const isSelected = activeAmbient === sound.id;
                return (
                  <TouchableOpacity
                    key={sound.id}
                    style={[styles.soundCard, isSelected && styles.soundCardSelected]}
                    onPress={() => handleSelectSound(sound.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.soundIconCircle,
                        { backgroundColor: isSelected ? sound.color : '#1E293B' },
                      ]}
                    >
                      <Ionicons
                        name={sound.icon as any}
                        size={20}
                        color={isSelected ? '#080C16' : sound.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.soundName,
                        isSelected && { color: Colors.textPrimary, fontWeight: '700' },
                      ]}
                    >
                      {sound.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Ambient Volume Level */}
            <View style={styles.sliderGroup}>
              <View style={styles.sliderLabelRow}>
                <View style={styles.labelWithIcon}>
                  <Ionicons name="volume-medium-outline" size={18} color={Colors.accentSecondary} />
                  <Text style={styles.sliderTitle}>Ambient Volume</Text>
                </View>
                <Text style={styles.sliderValue}>{Math.round(ambientVolume * 100)}%</Text>
              </View>

              {/* Step Volume Controls */}
              <View style={styles.volumeButtonsRow}>
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((step) => (
                  <TouchableOpacity
                    key={step}
                    style={[
                      styles.volStepBtn,
                      ambientVolume >= step - 0.05 && styles.volStepBtnActive,
                    ]}
                    onPress={() => setAmbientVolume(step)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.volStepText,
                        ambientVolume >= step - 0.05 && styles.volStepTextActive,
                      ]}
                    >
                      {Math.round(step * 100)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Narration Voice Volume (if in guided session) */}
            {showNarrationControl && (
              <View style={styles.sliderGroup}>
                <View style={styles.sliderLabelRow}>
                  <View style={styles.labelWithIcon}>
                    <Ionicons name="mic-outline" size={18} color={Colors.accentPrimary} />
                    <Text style={styles.sliderTitle}>Voice Narration</Text>
                  </View>
                  <Text style={styles.sliderValue}>{Math.round(narrationVolume * 100)}%</Text>
                </View>

                <View style={styles.volumeButtonsRow}>
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((step) => (
                    <TouchableOpacity
                      key={step}
                      style={[
                        styles.volStepBtn,
                        narrationVolume >= step - 0.05 && styles.volStepBtnActive,
                      ]}
                      onPress={() => setNarrationVolume(step)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.volStepText,
                          narrationVolume >= step - 0.05 && styles.volStepTextActive,
                        ]}
                      >
                        {Math.round(step * 100)}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Sleep Timer & Fade Note */}
            <View style={styles.infoBanner}>
              <Ionicons name="moon-outline" size={18} color={Colors.accentPrimary} />
              <Text style={styles.infoText}>
                Audio smoothly fades over the final 30 seconds rather than cutting off abruptly.
              </Text>
            </View>
          </ScrollView>

          {/* Done CTA */}
          <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
  },
  content: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  soundCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  soundCardSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#1E1B4B',
  },
  soundIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundName: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  sliderGroup: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sliderValue: {
    color: Colors.accentPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  volumeButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  volStepBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  volStepBtnActive: {
    backgroundColor: Colors.accentPrimary,
  },
  volStepText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  volStepTextActive: {
    color: '#080C16',
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  infoText: {
    color: '#C7D2FE',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  doneButton: {
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#080C16',
    fontSize: 15,
    fontWeight: '700',
  },
});
