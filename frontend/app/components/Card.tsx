// src/components/Card.tsx

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

import { CardData } from '../types/card';
import CardFront from './CardFront';
import { CardBack } from './CardBack';

const SCREEN_DIMENSIONS = Dimensions.get('window');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.8;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height * 0.75;

interface CardProps {
  item: CardData;
  onFavoritePress: (id: number) => void;
}

export const Card = ({ item, onFavoritePress }: CardProps) => {
  const rotation = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const handleFlip = () => {
    rotation.value = withSpring(isFlipped ? 0 : 1, {
      damping: 10,
      stiffness: 100,
    });
    setIsFlipped(!isFlipped);
  };

  const handleFavoritePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onFavoritePress?.(item.id);
  };

  return (
    <View className="m-4">
      <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
        <View>
          <CardFront
            item={item}
            handleFavoritePress={handleFavoritePress}
            CARD_WIDTH={CARD_WIDTH}
            CARD_HEIGHT={CARD_HEIGHT}
            frontAnimatedStyle={frontAnimatedStyle}
          />
          <CardBack
            item={item}
            handleFavoritePress={handleFavoritePress}
            CARD_WIDTH={CARD_WIDTH}
            CARD_HEIGHT={CARD_HEIGHT}
            backAnimatedStyle={backAnimatedStyle}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;
