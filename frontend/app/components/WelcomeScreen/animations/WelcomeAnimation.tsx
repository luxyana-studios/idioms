import React from 'react';
import { View, Text } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';

interface WelcomeAnimationProps {
  pulseStyle: AnimatedStyle<object>;
  colors: ReturnType<typeof useTheme>['colors'];
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({
  pulseStyle,
  colors,
}) => {
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
            width: 260,
            height: 320,
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          },
          pulseStyle,
        ]}
      >
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F97316']}
          style={{
            flex: 1,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <Ionicons name="language" size={64} color="white" />
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              marginTop: 16,
            }}
          >
            Idioms
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              marginTop: 8,
            }}
          >
            World Expressions
          </Text>
        </LinearGradient>
      </Animated.View>

      <View
        style={{
          position: 'absolute',
          top: -16,
          right: -16,
        }}
      >
        <Animated.View
          style={[
            {
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(252,211,77,0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            },
            pulseStyle,
          ]}
        >
          <Ionicons name="star" size={20} color="#FFD700" />
        </Animated.View>
      </View>
    </View>
  );
};
