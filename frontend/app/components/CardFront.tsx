import React, { memo, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';
import { VotingButtons } from './VotingButtons';
import GradientBackground from './GradientBackground';
import IdiomStats from './IndicatorsDisplay';
import DotMenu from './DotMenu';
import { MotiView } from 'moti';

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
  const [showStats, setShowStats] = useState(false);

  const handleStatsToggle = () => {
    setShowStats(!showStats);
  };

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

      <DotMenu
        item={item}
        onStatsToggle={handleStatsToggle}
        CARD_WIDTH={CARD_WIDTH}
        CARD_HEIGHT={CARD_HEIGHT}
      />

      <View className="flex-1 justify-center items-center w-full">
        <Text
          style={{
            color: '#FFFFFF',
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

      {showStats && (
        <MotiView
          from={{ opacity: 0, translateY: -20, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -20, scale: 0.9 }}
          transition={{ type: 'timing', duration: 300 }}
          style={{
            position: 'absolute',
            top: CARD_HEIGHT * 0.1,
            left: CARD_WIDTH * 0.05,
            right: CARD_WIDTH * 0.05,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            zIndex: 1000,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255, 255, 255, 0.2)',
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                color: '#FFD700',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Idiom Statistics
            </Text>
            <TouchableOpacity
              onPress={() => setShowStats(false)}
              style={{
                padding: 4,
              }}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <IdiomStats item={item} />
        </MotiView>
      )}
    </Animated.View>
  );
};

// memoized to prevent rerenders when props unchanged
export default memo(CardFront);
