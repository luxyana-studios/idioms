import React from 'react';
import { View, Text } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';

interface ScrollAnimationProps {
  scrollStyles: AnimatedStyle<object>[];
  pulseStyle: AnimatedStyle<object>;
  colors: ReturnType<typeof useTheme>['colors'];
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  scrollStyles,
  pulseStyle,
  colors,
}) => {
  const expressions = [
    { emoji: '🌍', text: 'Around the world', meaning: 'En todo el mundo' },
    { emoji: '🎨', text: 'Piece of cake', meaning: 'Pan comido' },
    { emoji: '🚀', text: 'Shoot for stars', meaning: 'Apuntar alto' },
  ];

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 320,
      }}
    >
      <View style={{ width: 260 }}>
        {expressions.map((expression, index) => (
          <Animated.View
            key={index}
            style={[
              {
                height: 96,
                marginVertical: 8,
                borderRadius: 16,
              },
              scrollStyles[index],
            ]}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                backgroundColor: '#6366F1',
              }}
            >
              <Text style={{ fontSize: 32, marginRight: 16 }}>
                {expression.emoji}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {expression.text}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: 4,
                  }}
                >
                  {expression.meaning}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      <View style={{ marginTop: 2, alignItems: 'center' }}>
        <Animated.View style={pulseStyle}>
          <Ionicons
            name="chevron-down"
            size={32}
            color={colors.textSecondary}
          />
        </Animated.View>
      </View>
    </View>
  );
};
