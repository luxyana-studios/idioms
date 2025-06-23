import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';
import { VotingButtons } from './VotingButtons';
import GradientBackground from './GradientBackground';

interface CardFrontProps {
  item: CardData;
  frontAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleFavoritePress: (e: GestureResponderEvent) => void;
  onVotePress: (
    cardId: string,
    voteType: 'upvote' | 'downvote',
  ) => Promise<void>;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

const CardFront: React.FC<CardFrontProps> = ({
  item,
  frontAnimatedStyle,
  handleFavoritePress,
  onVotePress,
  CARD_WIDTH,
  CARD_HEIGHT,
}) => {
  const { colors } = useTheme();

  // memoize static container style without backgroundColor
  const containerStyle = useMemo<ViewStyle>(
    () => ({
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 20,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute' as const,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    }),
    [CARD_WIDTH, CARD_HEIGHT, colors.shadowColor],
  );

  return (
    <Animated.View style={[containerStyle, frontAnimatedStyle]}>
      <GradientBackground hasMatte={false} />

      <View className="flex-1 justify-center items-center w-full">
        <Text
          style={{
            color: '#FFFFFF', // White text for better contrast
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
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
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <Ionicons
          name={item.favorite ? 'star' : 'star-outline'}
          size={28}
          color={item.favorite ? '#FFD700' : '#FFFFFF'}
        />
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          bottom: CARD_HEIGHT * 0.05,
          left: CARD_WIDTH * 0.05,
        }}
      >
        <VotingButtons
          cardId={item.id}
          upvotes={item.upvotes}
          downvotes={item.downvotes}
          onVote={onVotePress}
        />
      </View>
    </Animated.View>
  );
};

// memoized to prevent rerenders when props unchanged
export default memo(CardFront);
