import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../theme/colors';

interface BreathingOrbProps {
  reducedMotion?: boolean;
  breathPacing?: {
    inhale: number;
    hold: number;
    exhale: number;
  };
  phaseTitle?: string;
}

export const BreathingOrb: React.FC<BreathingOrbProps> = ({
  reducedMotion = false,
  breathPacing = { inhale: 4, hold: 2, exhale: 6 },
  phaseTitle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;
  const [breathText, setBreathText] = useState('Breathe naturally');

  useEffect(() => {
    if (reducedMotion) {
      setBreathText('Rest quietly');
      return;
    }

    let isMounted = true;

    const runBreathCycle = () => {
      if (!isMounted) return;

      // 1. Inhale
      setBreathText('Inhale gently...');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.35,
          duration: breathPacing.inhale * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: breathPacing.inhale * 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!isMounted) return;

        // 2. Gentle Hold
        if (breathPacing.hold > 0) {
          setBreathText('Soft pause...');
        }

        setTimeout(() => {
          if (!isMounted) return;

          // 3. Exhale
          setBreathText('Exhale and release...');
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.0,
              duration: breathPacing.exhale * 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.4,
              duration: breathPacing.exhale * 1000,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (isMounted) {
              runBreathCycle();
            }
          });
        }, breathPacing.hold * 1000);
      });
    };

    runBreathCycle();

    return () => {
      isMounted = false;
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [reducedMotion, breathPacing]);

  return (
    <View style={styles.container}>
      {/* Outer Glow Halo */}
      <Animated.View
        style={[
          styles.outerHalo,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Middle Soothing Ring */}
      <Animated.View
        style={[
          styles.middleRing,
          {
            transform: [{ scale: Animated.multiply(scaleAnim, 0.9) }],
          },
        ]}
      />

      {/* Core Orb */}
      <View style={styles.coreOrb}>
        <Text style={styles.breathGuidanceText}>{breathText}</Text>
        {phaseTitle && <Text style={styles.phaseSubtitle}>{phaseTitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  outerHalo: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.accentPrimary,
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 8,
  },
  middleRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.35)',
  },
  coreOrb: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  breathGuidanceText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  phaseSubtitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
});
