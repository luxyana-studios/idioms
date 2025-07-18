import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface VotingButtonsProps {
  cardId: string;
  upvotes: number;
  downvotes: number;
  onVote: (cardId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
}

const VotingButtons = ({
  cardId,
  upvotes,
  downvotes,
  onVote,
}: VotingButtonsProps) => {
  const { colors } = useTheme();
  const [isVoting, setIsVoting] = useState(false);

  const handleUpvote = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (isVoting) return;

    setIsVoting(true);
    try {
      await onVote(cardId, 'upvote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (isVoting) return;

    setIsVoting(true);
    try {
      await onVote(cardId, 'downvote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <View className="flex-row items-center space-x-4">
      <TouchableOpacity
        onPress={handleUpvote}
        disabled={isVoting}
        className="flex-row items-center space-x-1 px-3 py-2 rounded-lg"
        style={{
          backgroundColor: 'rgba(113,147,255,0.1)',
          opacity: isVoting ? 0.6 : 1,
        }}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-up-circle" size={24} color="#7193FF" />
        <Text style={{ color: colors.text }} className="text-sm font-medium">
          {upvotes}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
          minWidth: 30,
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      >
        {upvotes - downvotes}
      </Text>

      <TouchableOpacity
        onPress={handleDownvote}
        disabled={isVoting}
        className="flex-row items-center space-x-1 px-3 py-2 rounded-lg"
        style={{
          backgroundColor: 'rgba(255,69,0,0.1)',
          opacity: isVoting ? 0.6 : 1,
        }}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-down-circle" size={24} color="#FF4500" />
        <Text style={{ color: colors.text }} className="text-sm font-medium">
          {downvotes}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VotingButtons;
