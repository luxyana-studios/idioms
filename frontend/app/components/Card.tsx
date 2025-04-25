import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { CardData } from '../types/card';

const SCREEN_DIMENSIONS = Dimensions.get('window');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.8;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height * 0.85;

interface CardProps {
  item: CardData;
  onToggleFavorite: (id: number) => void;
}

export const Card = ({ item, onToggleFavorite }: CardProps) => {
  const rotation = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const starAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(rotation.value, [0, 0.5, 1], [1, 0, 0]),
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

  return (
    <View className="m-4">
      <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        {/* Favorite button - outside of flip area */}
        <Animated.View
          style={[
            starAnimatedStyle,
            {
              position: 'absolute',
              bottom: 20,
              right: 20,
              padding: 10,
              zIndex: 2,
            },
          ]}
        >
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
            <FontAwesome
              name={item.isFavorite ? 'star' : 'star-o'}
              size={24}
              color="#FFD700"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Card with flip animation */}
        <TouchableOpacity
          onPress={handleFlip}
          activeOpacity={1}
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        >
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
          </Animated.View>
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
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
