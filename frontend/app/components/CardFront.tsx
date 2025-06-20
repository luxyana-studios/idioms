import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Alert, Share } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { setStringAsync } from 'expo-clipboard';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';
import { VotingButtons } from './VotingButtons';
import DropdownMenu from './DropdownMenu';

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
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setMenuVisible((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${item.text}" - ${item.meaning}`,
        title: 'Share Idiom',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleViewStats = () => {
    Alert.alert(
      'Idiom Statistics',
      `Frequency: ${item.frequency_of_use}/10\nUpvotes: ${item.upvotes}\nDownvotes: ${item.downvotes}\nLiteral Transparency: ${item.literal_transparency}/10\nTranslation Difficulty: ${item.translation_difficulty}/10`,
      [{ text: 'Close', style: 'default' }],
    );
  };

  const handleCopyText = async () => {
    try {
      await setStringAsync(item.text);
      Alert.alert('Copied!', 'Text copied to clipboard.');
    } catch (error) {
      console.log('Error copying:', error);
    }
  };

  const handleReportError = () => {
    Alert.alert(
      'Report Error',
      'Thank you for helping us improve. What type of error would you like to report?',
      [
        {
          text: 'Translation Error',
          onPress: () => console.log('Translation error reported'),
        },
        {
          text: 'Content Error',
          onPress: () => console.log('Content error reported'),
        },
        {
          text: 'Technical Issue',
          onPress: () => console.log('Technical issue reported'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const menuItems = [
    {
      id: 'share',
      label: 'Share',
      icon: 'share-outline' as const,
      onPress: handleShare,
    },
    {
      id: 'stats',
      label: 'View Stats',
      icon: 'stats-chart-outline' as const,
      onPress: handleViewStats,
    },
    {
      id: 'copy',
      label: 'Copy Text',
      icon: 'copy-outline' as const,
      onPress: handleCopyText,
    },
    {
      id: 'report',
      label: 'Report Error',
      icon: 'flag-outline' as const,
      onPress: handleReportError,
    },
  ];

  return (
    <>
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
        <TouchableOpacity
          onPress={toggleMenu}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: 8,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 20,
            zIndex: 1000,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </TouchableOpacity>

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

      <DropdownMenu
        visible={menuVisible}
        onClose={closeMenu}
        items={menuItems}
        position={{ top: 60, right: 20 }}
      />
    </>
  );
};

export default CardFront;
