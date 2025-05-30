import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardFrontProps {
  item: CardData;
  frontAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleFavoritePress: (e: GestureResponderEvent) => void;
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
  const { colors } = useTheme();

  return (
    <Animated.View
      style={[
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundColor: colors.cardBackground,
          borderRadius: 20,
          padding: 24,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          shadowColor: colors.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        },
        frontAnimatedStyle,
      ]}
    >
      <Text
        style={{ color: colors.text }}
        className="text-3xl font-extrabold text-center mb-3"
      >
        {item.text}
      </Text>

      <TouchableOpacity
        onPress={handleFavoritePress}
        style={{
          position: 'absolute',
          bottom: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 10,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 999,
        }}
      >
        <Ionicons
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={28}
          color={item.isFavorite ? '#FFD700' : colors.text}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CardFront;
