import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { CompletedSession } from '../types';

export const HistoryScreen: React.FC = () => {
  const { sessions, navigateTo, resetAllData } = useApp();

  const totalMinutes = sessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  const getFeedbackLabel = (fb?: CompletedSession['feedback']) => {
    switch (fb) {
      case 'very-helpful':
        return 'Very Helpful ✨';
      case 'relaxing':
        return 'Relaxing 🌿';
      case 'neutral':
        return 'Neutral ⚪';
      case 'not-for-me':
        return 'Not for me ✕';
      default:
        return 'Completed';
    }
  };

  const handleClearHistory = () => {
    // Alert or confirmation
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Reset local session history? This will clear all recorded wind-down sessions.')) {
        resetAllData();
      }
    } else {
      Alert.alert(
        'Reset History',
        'Are you sure you want to clear your local session log?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: resetAllData },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: CompletedSession }) => {
    const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.badge}>
            <Ionicons name="moon-outline" size={14} color={Colors.accentPrimary} />
            <Text style={styles.badgeText}>{item.moodTitle}</Text>
          </View>
          <Text style={styles.cardDate}>{formattedDate}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.durationText}>{item.durationMinutes} min routine</Text>
          <Text style={styles.feedbackBadge}>{getFeedbackLabel(item.feedback)}</Text>
        </View>
      </View>
    );
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
            <Text style={styles.headerTitle}>Routine History</Text>
            <Text style={styles.headerSubtitle}>Honest records • No invented sleep scores</Text>
          </View>
          {sessions.length > 0 ? (
            <TouchableOpacity onPress={handleClearHistory} style={styles.clearBtn}>
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Aggregate Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes Relaxed</Text>
          </View>
        </View>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bed-outline" size={54} color={Colors.surfaceLight} />
            <Text style={styles.emptyTitle}>No Sessions Recorded Yet</Text>
            <Text style={styles.emptySubtitle}>
              When you complete a bedtime routine, your wind-down record will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  clearBtn: {
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    paddingVertical: 18,
    marginVertical: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.accentPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    gap: 12,
    paddingBottom: 32,
  },
  historyCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardDate: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackBadge: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
