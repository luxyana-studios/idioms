import { useEffect, useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { ANIMATION_CONFIG } from '../constants/cardConfig';

interface UseCardEntryAnimationProps {
  visible: boolean;
  scrollDown: boolean;
  index: number;
}

export const useCardEntryAnimation = ({
  visible,
  scrollDown,
  index,
}: UseCardEntryAnimationProps) => {
  const entry = useSharedValue(0);

  // memoize random offsets so they do not change on each render
  const { randomAngle, randomX, randomY } = useMemo(
    () => ({
      randomAngle: Math.random() * 20 - 10,
      randomX: Math.random() * 40 - 20,
      randomY: Math.random() * 40 + 20,
    }),
    [],
  );

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [
      { translateX: interpolate(entry.value, [0, 1], [randomX, 0]) },
      { translateY: interpolate(entry.value, [0, 1], [randomY, 0]) },
      { rotateZ: `${interpolate(entry.value, [0, 1], [randomAngle, 0])}deg` },
    ],
  }));

  useEffect(() => {
    if (!visible) return;
    if (!scrollDown) {
      entry.value = 1;
    } else {
      const delay = Math.min(
        index * ANIMATION_CONFIG.BASE_DELAY,
        ANIMATION_CONFIG.MAX_DELAY,
      );
      entry.value = withDelay(delay, withSpring(1, ANIMATION_CONFIG.ENTRY));
    }
  }, [visible, scrollDown, index, entry]);

  return { entryStyle };
};
