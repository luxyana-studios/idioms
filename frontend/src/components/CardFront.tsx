import { memo, useMemo, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import SmileyDisplay from './SmileyDisplay';
import VotingButtons from './VotingButtons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import DotMenu from './DotMenu';
import StatsModal from './StatsModal';

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

const DARK_FAVORITE_COLOR = '#D4A574';

const CardFront: React.FC<CardFrontProps> = ({
  item,
  frontAnimatedStyle,
  handleFavoritePress,
  onVotePress,
  CARD_WIDTH,
  CARD_HEIGHT,
}) => {
  const { theme, colors, computed } = useTheme();
  const [showStats, setShowStats] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(item.favorite);

  useEffect(() => {
    setIsFavorite(item.favorite);
  }, [item.favorite]);

  const handleStatsToggle = () => {
    setShowStats(!showStats);
  };

  // Organic Flow: larger border radius, softer shadows
  const containerStyle = useMemo<ViewStyle>(
    () => ({
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 36, // Organic larger curves
      padding: 28,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute' as const,
      shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210', // Sage-tinted shadow
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2, // Softer shadow
      shadowRadius: 24, // Larger blur for organic feel
      elevation: 10,
      borderWidth: 1,
      borderColor:
        theme === 'light'
          ? 'rgba(167, 196, 160, 0.25)' // Sage border
          : 'rgba(184, 212, 176, 0.15)',
      overflow: 'hidden',
    }),
    [CARD_WIDTH, CARD_HEIGHT, theme],
  );

  return (
    <Animated.View style={[containerStyle, frontAnimatedStyle]}>
      {/* Organic Flow gradient: cream → sage → terracotta blend */}
      <LinearGradient
        colors={
          theme === 'light'
            ? [
                'rgba(167, 196, 160, 0.08)', // Soft sage tint
                colors.cardBackground ?? '#FDFCFA',
                'rgba(212, 165, 116, 0.06)', // Subtle terracotta warmth
              ]
            : [
                'rgba(184, 212, 176, 0.1)', // Dark sage tint
                colors.cardBackground ?? '#2D3530',
                'rgba(229, 184, 148, 0.08)', // Dark terracotta warmth
              ]
        }
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 36 }]}
      />
      {/* Subtle organic overlay for depth */}
      <LinearGradient
        colors={
          theme === 'light'
            ? [
                'rgba(167, 196, 160, 0.05)',
                'transparent',
                'rgba(212, 165, 116, 0.04)',
              ]
            : [
                'rgba(184, 212, 176, 0.06)',
                'transparent',
                'rgba(229, 184, 148, 0.05)',
              ]
        }
        locations={[0, 0.4, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <DotMenu
        item={item}
        onStatsToggle={handleStatsToggle}
        CARD_WIDTH={CARD_WIDTH}
        CARD_HEIGHT={CARD_HEIGHT}
      />

      <View className="flex-1 justify-center items-center w-full">
        <Text
          style={{
            color: colors.text,
            textShadowColor: computed.textShadowColor,
            textShadowOffset: computed.textShadowOffset,
            textShadowRadius: computed.textShadowRadius,
          }}
          className="text-3xl font-extrabold text-center mb-6"
        >
          {item.text}
        </Text>

        <SmileyDisplay smileys={item.depiction} />
      </View>

      {/* Organic pill-shaped favorite button */}
      <TouchableOpacity
        onPress={(e) => {
          setIsFavorite((prev) => !prev);
          handleFavoritePress(e);
        }}
        style={{
          position: 'absolute',
          bottom: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 12,
          backgroundColor:
            theme === 'light'
              ? 'rgba(167, 196, 160, 0.15)'
              : 'rgba(184, 212, 176, 0.12)',
          borderRadius: 24, // Organic pill shape
          borderWidth: 1,
          borderColor:
            theme === 'light'
              ? 'rgba(167, 196, 160, 0.3)'
              : 'rgba(184, 212, 176, 0.2)',
        }}
      >
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={28}
          color={
            isFavorite
              ? theme === 'light'
                ? computed.headerColor
                : DARK_FAVORITE_COLOR
              : colors.text
          }
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

      <StatsModal
        item={item}
        isVisible={showStats}
        onClose={() => setShowStats(false)}
        CARD_WIDTH={CARD_WIDTH}
        CARD_HEIGHT={CARD_HEIGHT}
      />
    </Animated.View>
  );
};

// memoized to prevent rerenders when props unchanged
const MemoizedCardFront = memo(CardFront);
MemoizedCardFront.displayName = 'CardFront';

export default MemoizedCardFront;
