import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TapAnimationProps {
  cardFlipped: boolean;
  flipCard: () => void;
  cardFlipStyle: AnimatedStyle<object>;
  cardBackStyle: AnimatedStyle<object>;
  sparkleStyles: AnimatedStyle<object>[];
}

export const TapAnimation: React.FC<TapAnimationProps> = ({
  cardFlipped,
  flipCard,
  cardFlipStyle,
  cardBackStyle,
  sparkleStyles,
}) => {
  const sparklePositions = [
    { left: width * 0.2, top: 120 },
    { left: width * 0.8, top: 150 },
    { left: width * 0.1, top: 200 },
    { left: width * 0.9, top: 250 },
    { left: width * 0.3, top: 280 },
    { left: width * 0.7, top: 300 },
  ];

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 320,
      }}
    >
      <TouchableOpacity
        onPress={() => !cardFlipped && flipCard()}
        style={{
          width: 260,
          height: 320,
        }}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 24,
              backfaceVisibility: 'hidden',
            },
            cardFlipStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              backgroundColor: '#3B82F6',
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🌟</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white',
                marginTop: 16,
              }}
            >
              Expression
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
              }}
            >
              "Break a leg"
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 24,
              backfaceVisibility: 'hidden',
              transform: [{ rotateY: '180deg' }],
            },
            cardBackStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              backgroundColor: '#10B981',
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎭</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white',
                marginTop: 16,
              }}
            >
              Meaning
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
              }}
            >
              "Good luck!"
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {sparklePositions.map((position, index) => (
        <Animated.View
          key={index}
          style={[
            {
              position: 'absolute',
              width: 16,
              height: 16,
              alignItems: 'center',
              justifyContent: 'center',
              ...position,
            },
            sparkleStyles[index],
          ]}
        >
          <Ionicons name="star" size={12} color="#FFD700" />
        </Animated.View>
      ))}
    </View>
  );
};
