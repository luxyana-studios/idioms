import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BackgroundStarsProps } from './types';

export const BackgroundStars: React.FC<BackgroundStarsProps> = ({
  colors,
  width,
  height,
  starsOpacity,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: starsOpacity.value,
  }));

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {[...Array(20)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            {
              position: 'absolute',
              width: 2,
              height: 2,
              borderRadius: 1,
              left: Math.random() * width,
              top: Math.random() * height,
              backgroundColor: colors.text,
            },
            animatedStyle,
          ]}
        />
      ))}
    </View>
  );
};
