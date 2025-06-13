import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';
import { VotingButtons } from './VotingButtons';

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

  return (
    <Animated.View
      style={[
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 20,
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
      <LinearGradient
        colors={[
          'rgba(139, 92, 246, 0.85)',
          'rgba(236, 72, 153, 0.85)',
          'rgba(249, 115, 22, 0.85)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 20,
          padding: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View className="flex-1 justify-center items-center w-full">
          <Text
            style={{ color: 'white' }}
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
            color={item.favorite ? '#FFD700' : 'white'}
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
      </LinearGradient>
    </Animated.View>
  );
};

export default CardFront;
