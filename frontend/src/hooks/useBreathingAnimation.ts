import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface BreathingOptions {
  minScale?: number;
  maxScale?: number;
  duration?: number;
  enabled?: boolean;
}

/**
 * Creates a gentle breathing animation effect.
 * Organic Flow: continuous subtle motion like nature breathing.
 *
 * @param options - Configuration for the breathing animation
 * @returns Animated style to apply to a component
 */
export function useBreathingAnimation(options: BreathingOptions = {}) {
  const {
    minScale = 1.0,
    maxScale = 1.015, // Very subtle - organic feel
    duration = 4000, // 4 second full cycle
    enabled = true,
  } = options;

  const scale = useSharedValue(minScale);

  useEffect(() => {
    if (enabled) {
      scale.value = withRepeat(
        withSequence(
          withTiming(maxScale, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin), // Smooth organic easing
          }),
          withTiming(minScale, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1, // Infinite repeat
        false, // Don't reverse
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [enabled, minScale, maxScale, duration, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

/**
 * Preset for card breathing - very subtle
 */
export function useCardBreathing(enabled = true) {
  return useBreathingAnimation({
    minScale: 1.0,
    maxScale: 1.008, // Extra subtle for cards
    duration: 5000, // Slow and gentle
    enabled,
  });
}

/**
 * Preset for emoji/icon breathing - slightly more noticeable
 */
export function useEmojiBreathing(enabled = true) {
  return useBreathingAnimation({
    minScale: 1.0,
    maxScale: 1.03, // Slightly more noticeable
    duration: 3500,
    enabled,
  });
}

/**
 * Preset for button hover/focus breathing
 */
export function useButtonBreathing(enabled = true) {
  return useBreathingAnimation({
    minScale: 1.0,
    maxScale: 1.02,
    duration: 2500,
    enabled,
  });
}

export default useBreathingAnimation;
