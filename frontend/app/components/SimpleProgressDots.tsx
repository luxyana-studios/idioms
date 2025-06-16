import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface SimpleProgressDotsProps {
  currentStep: number | string;
  totalSteps: number;
  steps?: string[];
  colors?: {
    active?: string;
    inactive?: string;
    completed?: string;
  };
  size?: number;
  spacing?: number;
  containerStyle?: object;
}

export const SimpleProgressDots: React.FC<SimpleProgressDotsProps> = ({
  currentStep,
  totalSteps,
  steps,
  colors = {
    active: '#FFD700',
    inactive: 'rgba(255, 255, 255, 0.3)',
    completed: '#10B981',
  },
  size = 8,
  spacing = 4,
  containerStyle,
}) => {
  const getCurrentIndex = () => {
    if (typeof currentStep === 'string' && steps) {
      return steps.indexOf(currentStep);
    }
    return typeof currentStep === 'number' ? currentStep : 0;
  };

  const currentIndex = getCurrentIndex();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <ProgressDot
          key={index}
          index={index}
          currentIndex={currentIndex}
          colors={colors}
          size={size}
          spacing={spacing}
        />
      ))}
    </View>
  );
};

interface ProgressDotProps {
  index: number;
  currentIndex: number;
  colors: {
    active?: string;
    inactive?: string;
    completed?: string;
  };
  size: number;
  spacing: number;
}

const ProgressDot: React.FC<ProgressDotProps> = ({
  index,
  currentIndex,
  colors,
  size,
  spacing,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = index === currentIndex;
    const isCompleted = index < currentIndex;

    const backgroundColor = isActive
      ? colors.active!
      : isCompleted
        ? colors.completed!
        : colors.inactive!;

    const scale = withTiming(isActive ? 1.25 : 1, {
      duration: 300,
    });

    return {
      backgroundColor,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          marginHorizontal: spacing,
        },
        animatedStyle,
      ]}
    />
  );
};
