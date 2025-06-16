import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ProgressDotsProps } from './types';

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  currentStep,
  totalSteps,
  colors,
  dotSize = 12,
  spacing = 4,
  animationDuration = 300,
  activeScale = 1.3,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 40,
      }}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <ProgressDot
          key={index}
          index={index}
          currentStep={currentStep}
          colors={colors}
          dotSize={dotSize}
          spacing={spacing}
          animationDuration={animationDuration}
          activeScale={activeScale}
        />
      ))}
    </View>
  );
};

interface ProgressDotProps {
  index: number;
  currentStep: number;
  colors: {
    text: string;
    textSecondary: string;
  };
  dotSize: number;
  spacing: number;
  animationDuration: number;
  activeScale: number;
}

const ProgressDot: React.FC<ProgressDotProps> = ({
  index,
  currentStep,
  colors,
  dotSize,
  spacing,
  animationDuration,
  activeScale,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;

    const backgroundColor = isActive
      ? colors.text
      : isCompleted
        ? '#10B981'
        : colors.textSecondary + '50';

    const scale = withTiming(isActive ? activeScale : 1, {
      duration: animationDuration,
    });

    return {
      backgroundColor,
      transform: [{ scale }],
    };
  }, [currentStep, index]);

  return (
    <Animated.View
      style={[
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          marginHorizontal: spacing,
        },
        animatedStyle,
      ]}
    />
  );
};
