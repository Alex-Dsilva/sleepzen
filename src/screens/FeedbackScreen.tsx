import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { FeedbackRating } from '../types';

export const FeedbackScreen: React.FC = () => {
  const { navigateTo, activeSessionId, rateSession, selectedAmbient } = useApp();
  const { playAmbientOnly } = useAudio();
  const [selectedRating, setSelectedRating] = useState<FeedbackRating | null>(null);

  const ratings: { id: FeedbackRating; label: string; icon: string; color: string }[] = [
    { id: 'very-helpful', label: 'Very Helpful', icon: 'sparkles', color: Colors.accentPrimary },
    { id: 'relaxing', label: 'Calm & Relaxing', icon: 'leaf', color: Colors.accentSecondary },
    { id: 'neutral', label: 'Just Okay', icon: 'ellipse-outline', color: Colors.textSecondary },
    { id: 'not-for-me', label: 'Not for me', icon: 'close-circle-outline', color: Colors.textMuted },
  ];

  const handleSelectRating = async (rating: FeedbackRating) => {
    setSelectedRating(rating);
    if (activeSessionId) {
      await rateSession(activeSessionId, rating);
    }
  };

  const handleKeepAmbient = () => {
    // Keep ambient soundscape playing with 45 min sleep timer
    playAmbientOnly(selectedAmbient, 45);
    navigateTo('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="moon" size={38} color={Colors.accentPrimary} />
          </View>
          <Text style={styles.title}>Session Complete</Text>
          <Text style={styles.subtitle}>Your wind-down routine has finished smoothly.</Text>
        </View>

        {/* The One Optional Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>How helpful was this session?</Text>
          <Text style={styles.questionSub}>Optional feedback stored locally to help improve routines.</Text>

          <View style={styles.ratingGrid}>
            {ratings.map((r) => {
              const isSelected = selectedRating === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.ratingBtn, isSelected && styles.ratingBtnSelected]}
                  onPress={() => handleSelectRating(r.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={r.icon as any} size={20} color={isSelected ? Colors.textPrimary : r.color} />
                  <Text style={[styles.ratingBtnText, isSelected && styles.ratingBtnTextSelected]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ambientContBtn}
            onPress={handleKeepAmbient}
            activeOpacity={0.8}
          >
            <Ionicons name="volume-medium-outline" size={20} color="#080C16" />
            <Text style={styles.ambientContBtnText}>Keep Sound Playing (Sleep Timer)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigateTo('home')}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBtnText}>Return to Home</Text>
          </TouchableOpacity>
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
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
    lineHeight: 20,
  },
  questionCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  questionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  ratingGrid: {
    gap: 10,
  },
  ratingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  ratingBtnSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#1E1B4B',
  },
  ratingBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  ratingBtnTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  footer: {
    gap: 12,
  },
  ambientContBtn: {
    backgroundColor: Colors.accentSecondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  ambientContBtnText: {
    color: '#080C16',
    fontSize: 15,
    fontWeight: '700',
  },
  homeBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
