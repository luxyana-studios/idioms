import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';

type IoniconsName = keyof typeof Ionicons.glyphMap;

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

  const getSentimentIndicator = (sentiment: string[]) => {
    if (sentiment.includes('positive'))
      return {
        color: '#10B981',
        icon: 'happy-outline',
        label: '😊',
      };
    if (sentiment.includes('negative'))
      return {
        color: '#EF4444',
        icon: 'sad-outline',
        label: '😔',
      };
    return {
      color: '#6B7280',
      icon: 'remove-outline',
      label: '😐',
    };
  };

  const getFrequencyIndicator = (frequency: number) => {
    if (frequency >= 8)
      return {
        icon: 'flame' as IoniconsName,
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.2)',
        label: 'Hot',
      };
    if (frequency >= 6)
      return {
        icon: 'trending-up' as IoniconsName,
        color: '#8B5CF6',
        bgColor: 'rgba(139, 92, 246, 0.2)',
        label: 'Popular',
      };
    if (frequency >= 4)
      return {
        icon: 'heart' as IoniconsName,
        color: '#EC4899',
        bgColor: 'rgba(236, 72, 153, 0.2)',
        label: 'Known',
      };
    return {
      icon: 'leaf-outline' as IoniconsName,
      color: '#6B7280',
      bgColor: 'rgba(107, 114, 128, 0.2)',
      label: 'Rare',
    };
  };

  const getDifficultyLevel = (literal: number, translation: number) => {
    const avgDifficulty = (literal + translation) / 2;
    if (avgDifficulty <= 3)
      return {
        icon: 'checkmark-circle' as IoniconsName,
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.2)',
        label: 'Easy',
      };
    if (avgDifficulty <= 6)
      return {
        icon: 'warning' as IoniconsName,
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.2)',
        label: 'Medium',
      };
    return {
      icon: 'close-circle' as IoniconsName,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.2)',
      label: 'Hard',
    };
  };

  const frequencyIndicator = getFrequencyIndicator(item.frequency_of_use);
  const sentimentIndicator = getSentimentIndicator(item.sentiment);
  const difficultyIndicator = getDifficultyLevel(
    item.literal_transparency,
    item.translation_difficulty,
  );

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
      <View className="absolute top-4 left-4">
        <View
          className="flex-row items-center rounded-full px-3 py-2"
          style={{ backgroundColor: frequencyIndicator.bgColor }}
        >
          <Ionicons
            name={frequencyIndicator.icon}
            size={14}
            color={frequencyIndicator.color}
          />
          <Text
            className="text-xs font-semibold ml-1"
            style={{ color: frequencyIndicator.color }}
          >
            {frequencyIndicator.label}
          </Text>
        </View>
      </View>

      <View className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <View className="bg-black/20 rounded-full px-3 py-1">
          <Text className="text-lg">{sentimentIndicator.label}</Text>
        </View>
      </View>

      <View className="absolute top-4 right-4">
        <View
          className="flex-row items-center rounded-full px-3 py-2"
          style={{ backgroundColor: difficultyIndicator.bgColor }}
        >
          <Ionicons
            name={difficultyIndicator.icon}
            size={14}
            color={difficultyIndicator.color}
          />
          <Text
            className="text-xs font-semibold ml-1"
            style={{ color: difficultyIndicator.color }}
          >
            {difficultyIndicator.label}
          </Text>
        </View>
      </View>

      <View className="absolute top-16 right-4 flex-row flex-wrap max-w-24">
        {item.category_theme.slice(0, 1).map((category, index) => (
          <View key={index} className="bg-white/10 rounded-md px-2 py-1 mb-1">
            <Text
              className="text-xs font-medium"
              style={{ color: colors.textSecondary }}
            >
              {category}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-1 justify-center items-center w-full">
        <Text
          style={{ color: colors.text }}
          className="text-3xl font-extrabold text-center mb-6"
        >
          {item.text}
        </Text>

        <SmileyDisplay smileys={item.depiction || []} />
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
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={28}
          color={item.isFavorite ? '#FFD700' : colors.text}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CardFront;
