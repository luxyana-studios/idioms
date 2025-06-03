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

  const getSentimentColor = (sentiment: string[]) => {
    if (sentiment.includes('positive')) return '#10B981';
    if (sentiment.includes('negative')) return '#EF4444';
    return '#6B7280';
  };

  const getFrequencyIndicator = (frequency: number) => {
    if (frequency >= 8) return { icon: 'flame', color: '#F59E0B' };
    if (frequency >= 6) return { icon: 'star', color: '#8B5CF6' };
    if (frequency >= 4) return { icon: 'heart', color: '#EC4899' };
    return { icon: 'leaf', color: '#10B981' };
  };

  const frequencyIndicator = getFrequencyIndicator(item.frequency_of_use);
  const sentimentColor = getSentimentColor(item.sentiment);

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
      <View className="absolute top-4 left-4 flex-row items-center space-x-2">
        <View className="flex-row items-center bg-black/20 rounded-full px-3 py-1">
          <Ionicons
            name={frequencyIndicator.icon as any}
            size={14}
            color={frequencyIndicator.color}
          />
          <Text
            className="text-xs font-bold ml-1"
            style={{ color: colors.text }}
          >
            {item.frequency_of_use}
          </Text>
        </View>

        <View
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: sentimentColor }}
        />
      </View>

      <View className="absolute top-4 right-16 flex-row flex-wrap">
        {item.category_theme.slice(0, 2).map((category, index) => (
          <View
            key={index}
            className="bg-white/10 rounded-full px-2 py-1 mb-1 mr-1"
          >
            <Text
              className="text-xs font-medium"
              style={{ color: colors.text }}
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

      <View className="absolute bottom-4 left-4 right-16 flex-row justify-between items-center">
        <View className="flex-row space-x-3">
          <View className="flex-row items-center">
            <Ionicons name="eye" size={12} color={colors.textSecondary} />
            <Text
              className="text-xs ml-1"
              style={{ color: colors.textSecondary }}
            >
              {item.literal_transparency}/10
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="language" size={12} color={colors.textSecondary} />
            <Text
              className="text-xs ml-1"
              style={{ color: colors.textSecondary }}
            >
              {item.translation_difficulty}/10
            </Text>
          </View>
        </View>
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
