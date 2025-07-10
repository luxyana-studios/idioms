import { memo, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import SmileyDisplay from './SmileyDisplay';
import VotingButtons from './VotingButtons';
import GradientBackground from './GradientBackground';
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
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 12,
      borderWidth: 0.8,
      borderColor: 'rgba(255,255,255,0.2)',
      overflow: 'hidden',
    }),
    [CARD_WIDTH, CARD_HEIGHT, colors.shadowColor],
  );

  return (
    <Animated.View style={[containerStyle, frontAnimatedStyle]}>
      <GradientBackground hasMatte={true} />
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.2)']}
        locations={[0, 0.1, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.6)',
          borderRadius: 20,
        }}
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
