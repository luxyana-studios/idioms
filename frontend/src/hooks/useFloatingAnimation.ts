import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface FloatingOptions {
  distance?: number;
  duration?: number;
  delay?: number;
  enabled?: boolean;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

/**
 * Creates a gentle floating animation effect.
 * Organic Flow: elements sway gently like leaves or water.
 *
 * @param options - Configuration for the floating animation
 * @returns Animated style to apply to a component
 */
export function useFloatingAnimation(options: FloatingOptions = {}) {
  const {
    distance = 4, // Subtle movement in pixels
    duration = 3000, // 3 second full cycle
    delay = 0, // Stagger delay for multiple elements
    enabled = true,
    direction = 'vertical',
  } = options;

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      const floatAnimation = withRepeat(
        withSequence(
          withTiming(-distance, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );

      if (direction === 'vertical' || direction === 'diagonal') {
        translateY.value = withDelay(delay, floatAnimation);
      }

      if (direction === 'horizontal' || direction === 'diagonal') {
        // Offset horizontal slightly for organic feel
        translateX.value = withDelay(
          delay + 150,
          withRepeat(
            withSequence(
              withTiming(distance * 0.6, {
                duration: (duration * 1.2) / 2,
                easing: Easing.inOut(Easing.sin),
              }),
              withTiming(0, {
                duration: (duration * 1.2) / 2,
                easing: Easing.inOut(Easing.sin),
              }),
            ),
            -1,
            false,
          ),
        );
      }
    } else {
      translateY.value = withTiming(0, { duration: 300 });
      translateX.value = withTiming(0, { duration: 300 });
    }
  }, [enabled, distance, duration, delay, direction, translateY, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return animatedStyle;
}

/**
 * Preset for decorative blob floating
 */
export function useBlobFloating(index = 0, enabled = true) {
  return useFloatingAnimation({
    distance: 6,
    duration: 4000 + index * 500, // Stagger timing by index
    delay: index * 400, // Stagger start
    enabled,
    direction: 'diagonal',
  });
}

/**
 * Preset for emoji container floating
 */
export function useEmojiFloating(enabled = true) {
  return useFloatingAnimation({
    distance: 3,
    duration: 3500,
    delay: 0,
    enabled,
    direction: 'vertical',
  });
}

/**
 * Preset for mascot/panda floating
 */
export function useMascotFloating(enabled = true) {
  return useFloatingAnimation({
    distance: 5,
    duration: 4500,
    delay: 0,
    enabled,
    direction: 'diagonal',
  });
}

export default useFloatingAnimation;
