import React from 'react';
import { View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface StartAnimationProps {
  pulseStyle: AnimatedStyle<object>;
  emojiStyles: AnimatedStyle<object>[];
}

export const StartAnimation: React.FC<StartAnimationProps> = ({
  pulseStyle,
  emojiStyles,
}) => {
  const emojis = ['🌟', '🎯', '🚀', '💫'];

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 320,
      }}
    >
      <Animated.View
        style={[
          {
            width: 128,
            height: 128,
            borderRadius: 64,
            marginBottom: 24,
          },
          pulseStyle,
        ]}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 64,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F97316',
          }}
        >
          <Ionicons name="flash" size={64} color="white" />
        </View>
      </Animated.View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: 200,
        }}
      >
        {emojis.map((emoji, index) => (
          <Animated.Text
            key={index}
            style={[{ fontSize: 32 }, emojiStyles[index]]}
          >
            {emoji}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
};
