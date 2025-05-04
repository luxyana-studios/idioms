import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import React, { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { CardData } from '../types/card';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_DIMENSIONS = Dimensions.get('window');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.8;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height * 0.85;

// Definición única de la interfaz
interface CardProps {
  item: CardData;
  onFavoritePress?: (id: number) => void; // Asegúrate que coincida con CardData.id
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
          {/* Cara frontal */}
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

            {/* Ícono de favorito (frontal) */}
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
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

          {/* Cara posterior */}
          <Animated.View
            style={[
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: '#151312',
                borderRadius: 20,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              },
              backAnimatedStyle,
            ]}
          >
            <Text className="text-lg text-white">{item.content}</Text>

            {/* Ícono de favorito (posterior) */}
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
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
        </View>
      </TouchableOpacity>
    </View>
  );
};
