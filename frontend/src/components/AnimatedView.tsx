import { useEffect, useRef, PropsWithChildren } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';
import { ViewStyle, ViewProps } from 'react-native';

interface AnimateValues {
  opacity?: number;
  scale?: number;
  translateY?: number;
  translateX?: number;
}

interface TransitionConfig {
  type?: 'timing' | 'spring';
  duration?: number;
  easing?: (value: number) => number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

interface AnimatedViewProps extends ViewProps {
  from: AnimateValues;
  animate: AnimateValues;
  transition?: TransitionConfig;
  onDidAnimate?: (key: string, finished: boolean) => void;
}

/**
 * Lightweight replacement for MotiView using Reanimated v4.
 * Supports from/animate/transition props with timing and spring animations.
 */
const AnimatedView = ({
  from,
  animate,
  transition = {},
  onDidAnimate,
  style,
  children,
  ...rest
}: PropsWithChildren<AnimatedViewProps>) => {
  const opacity = useSharedValue(from.opacity ?? 1);
  const scale = useSharedValue(from.scale ?? 1);
  const translateY = useSharedValue(from.translateY ?? 0);
  const translateX = useSharedValue(from.translateX ?? 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const {
      type = 'timing',
      delay = 0,
      duration = 300,
      easing: easingFn,
      damping,
      stiffness,
      mass,
    } = transition;

    const createAnimation = (toValue: number, key: string) => {
      let animation;
      if (type === 'spring') {
        const springConfig: WithSpringConfig = {};
        if (damping !== undefined) springConfig.damping = damping;
        if (stiffness !== undefined) springConfig.stiffness = stiffness;
        if (mass !== undefined) springConfig.mass = mass;
        animation = withSpring(toValue, springConfig, (finished) => {
          if (onDidAnimate && finished) {
            runOnJS(onDidAnimate)(key, true);
          }
        });
      } else {
        const timingConfig: WithTimingConfig = { duration };
        if (easingFn) timingConfig.easing = easingFn;
        animation = withTiming(toValue, timingConfig, (finished) => {
          if (onDidAnimate && finished) {
            runOnJS(onDidAnimate)(key, true);
          }
        });
      }
      return delay > 0 ? withDelay(delay, animation) : animation;
    };

    if (animate.opacity !== undefined)
      opacity.value = createAnimation(animate.opacity, 'opacity');
    if (animate.scale !== undefined)
      scale.value = createAnimation(animate.scale, 'scale');
    if (animate.translateY !== undefined)
      translateY.value = createAnimation(animate.translateY, 'translateY');
    if (animate.translateX !== undefined)
      translateX.value = createAnimation(animate.translateX, 'translateX');
  }, []);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export default AnimatedView;
