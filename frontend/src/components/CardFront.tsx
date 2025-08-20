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

const DARK_FAVORITE_COLOR = '#E8D04D';

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
      <LinearGradient
        colors={[
          colors.cardBackground ?? '#e7f2e1',
          colors.secondary ?? colors.surface ?? '#cfe0c5',
          colors.surface ?? '#dbe7d4',
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.92, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
      />
      <LinearGradient
        colors={[
          (colors.text ?? '#000000') + '12',
          'transparent',
          (colors.text ?? '#000000') + '1F',
        ]}
        locations={[0, 0.3, 1]}
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

      <TouchableOpacity
        onPress={(e) => {
          setIsFavorite((prev) => !prev);
          handleFavoritePress(e);
        }}
        style={{
          position: 'absolute',
          bottom: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 10,
          backgroundColor: computed.softBackground,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: computed.subtleBorder,
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
