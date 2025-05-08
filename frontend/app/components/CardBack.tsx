// src/components/CardBack.tsx

import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { CardData } from '../types/card';
import { GestureResponderEvent } from 'react-native';

interface CardBackProps {
  item: CardData;
  backAnimatedStyle: AnimatedStyle<ViewStyle>;
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

export const CardBack = ({
  item,
  handleFavoritePress,
  backAnimatedStyle,
  CARD_WIDTH,
  CARD_HEIGHT,
}: CardBackProps) => {
  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundColor: '#151312',
        },
        backAnimatedStyle,
      ]}
    >
      <Text style={styles.content}>{item.content}</Text>
      <TouchableOpacity
        onPress={handleFavoritePress}
        style={[
          styles.iconButton,
          {
            bottom: CARD_HEIGHT * 0.05,
            right: CARD_WIDTH * 0.05,
          },
        ]}
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

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  iconButton: {
    position: 'absolute',
    padding: 10,
  },
});

export default CardBack;
