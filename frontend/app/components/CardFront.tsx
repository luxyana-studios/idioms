// src/components/CardFront.tsx

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';

interface CardFrontProps {
  item: CardData;
  frontAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleFavoritePress: (e: GestureResponderEvent) => void;
  animatedStyle: {
    transform: {
      rotateY: string;
    }[];
    backfaceVisibility: 'hidden';
  };
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

const CardFront: React.FC<CardFrontProps> = ({
  item,
  frontAnimatedStyle,
  handleFavoritePress,
  CARD_WIDTH,
  CARD_HEIGHT,
}) => {
  return (
    <Animated.View
      style={[
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundColor: '#221f3d',
          borderRadius: 20,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        },
        frontAnimatedStyle,
      ]}
    >
      <Text className="text-2xl font-bold text-white">{item.title}</Text>
      <TouchableOpacity
        onPress={handleFavoritePress}
        style={{
          position: 'absolute',
          bottom: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 10,
        }}
      >
        <Ionicons
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={28}
          color={item.isFavorite ? '#FFD700' : '#FFFFFF'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CardFront;
