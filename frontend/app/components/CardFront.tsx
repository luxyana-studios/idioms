import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';

interface CardFrontProps {
  item: CardData;
  frontAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleFavoritePress: (e: GestureResponderEvent) => void;
  handleUpvote: (e: GestureResponderEvent) => void;
  handleDownvote: (e: GestureResponderEvent) => void;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

const CardFront: React.FC<CardFrontProps> = ({
  item,
  frontAnimatedStyle,
  handleFavoritePress,
  handleUpvote,
  handleDownvote,
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
      <View className="flex-1 justify-center items-center w-full">
        <Text
          style={{ color: colors.text }}
          className="text-3xl font-extrabold text-center mb-6"
        >
          {item.text}
        </Text>

        <SmileyDisplay smileys={item.depiction} />
      </View>

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
          name={item.favorite ? 'star' : 'star-outline'}
          size={28}
          color={item.favorite ? '#FFD700' : colors.text}
        />
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          bottom: CARD_HEIGHT * 0.05,
          left: CARD_WIDTH * 0.05,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={handleDownvote}
          style={{
            padding: 8,
            marginRight: 12,
          }}
          activeOpacity={0.6}
        >
          <Ionicons name="heart-dislike" size={22} color="#FF4500" />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
            minWidth: 30,
            marginRight: 12,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {item.upvotes - item.downvotes}
        </Text>

        <TouchableOpacity
          onPress={handleUpvote}
          style={{
            padding: 8,
          }}
          activeOpacity={0.6}
        >
          <Ionicons name="heart" size={22} color="#7193FF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default CardFront;
