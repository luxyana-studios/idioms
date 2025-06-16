import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

export const useWelcomeAnimations = () => {
  // Core animation values
  const pulseAnim = useSharedValue(1);
  const cardFlipAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);
  const starsOpacity = useSharedValue(0.3);

  // Sparkle animations
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);
  const sparkle4 = useSharedValue(0);
  const sparkle5 = useSharedValue(0);
  const sparkle6 = useSharedValue(0);

  // Scroll animations
  const scroll1 = useSharedValue(0);
  const scroll2 = useSharedValue(0);
  const scroll3 = useSharedValue(0);

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulseAnim.value },
      {
        rotate: `${interpolate(pulseAnim.value, [1, 1.1], [0, 2])}deg`,
      },
    ],
  }));

  const starsStyle = useAnimatedStyle(() => ({
    opacity: starsOpacity.value,
  }));

  const cardFlipStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(cardFlipAnim.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const cardBackStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(cardFlipAnim.value, [0, 1], [180, 360])}deg` },
    ],
  }));

  // Individual sparkle styles
  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [{ scale: sparkle1.value }],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [{ scale: sparkle2.value }],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [{ scale: sparkle3.value }],
  }));

  const sparkle4Style = useAnimatedStyle(() => ({
    opacity: sparkle4.value,
    transform: [{ scale: sparkle4.value }],
  }));

  const sparkle5Style = useAnimatedStyle(() => ({
    opacity: sparkle5.value,
    transform: [{ scale: sparkle5.value }],
  }));

  const sparkle6Style = useAnimatedStyle(() => ({
    opacity: sparkle6.value,
    transform: [{ scale: sparkle6.value }],
  }));

  // Individual scroll styles
  const scroll1Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scroll1.value, [0, 1], [0, -10]),
      },
      { scale: 1.1 },
    ],
    opacity: interpolate(scroll1.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  const scroll2Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scroll2.value, [0, 1], [0, -10]),
      },
      { scale: 0.95 },
    ],
    opacity: interpolate(scroll2.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  const scroll3Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scroll3.value, [0, 1], [0, -10]),
      },
      { scale: 0.95 },
    ],
    opacity: interpolate(scroll3.value, [0, 0.5, 1], [0.7, 1, 0.7]),
  }));

  // Individual emoji styles
  const emoji1Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const emoji2Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const emoji3Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  const emoji4Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [1, 1.2], [0.7, 1]),
    transform: [
      {
        translateY: interpolate(pulseAnim.value, [1, 1.2], [0, -5]),
      },
    ],
  }));

  // Group styles into arrays
  const sparkleStyles = [
    sparkle1Style,
    sparkle2Style,
    sparkle3Style,
    sparkle4Style,
    sparkle5Style,
    sparkle6Style,
  ];

  const scrollStyles = [scroll1Style, scroll2Style, scroll3Style];

  const emojiStyles = [emoji1Style, emoji2Style, emoji3Style, emoji4Style];

  // Animation functions
  const startPulseAnimation = () => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
    );
    starsOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 }),
      ),
      -1,
    );
  };

  const flipCard = (setCardFlipped: (value: boolean) => void) => {
    runOnJS(setCardFlipped)(true);
    cardFlipAnim.value = withTiming(1, { duration: 700 });

    const sparkleValues = [
      sparkle1,
      sparkle2,
      sparkle3,
      sparkle4,
      sparkle5,
      sparkle6,
    ];
    sparkleValues.forEach((sparkle, index) => {
      sparkle.value = withSequence(
        withTiming(0, { duration: index * 100 }),
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 400 }),
      );
    });
  };

  const startScrollAnimation = () => {
    const scrollValues = [scroll1, scroll2, scroll3];
    scrollValues.forEach((scroll, index) => {
      scroll.value = withRepeat(
        withSequence(
          withTiming(0, { duration: index * 200 }),
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 }),
        ),
        -1,
      );
    });
  };

  const startFinalAnimation = () => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500 }),
        withTiming(1, { duration: 1500 }),
      ),
      -1,
      false,
    );
  };

  const resetCardFlip = () => {
    cardFlipAnim.value = 0;
  };

  return {
    // Values
    pulseAnim,
    cardFlipAnim,
    progressAnim,
    starsOpacity,

    // Styles
    pulseStyle,
    starsStyle,
    cardFlipStyle,
    cardBackStyle,
    sparkleStyles,
    scrollStyles,
    emojiStyles,

    // Functions
    startPulseAnimation,
    flipCard,
    startScrollAnimation,
    startFinalAnimation,
    resetCardFlip,
  };
};
