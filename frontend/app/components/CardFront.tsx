import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Alert, Share } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
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
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setMenuVisible((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleShare = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    try {
      await Share.share({
        message: `"${item.text}" - ${item.meaning}`,
        title: 'Share Idiom',
      });
      closeMenu();
    } catch (error) {
      console.log('Error sharing:', error);
      closeMenu();
    }
  };

  const handleViewStats = (e: GestureResponderEvent) => {
    e.stopPropagation();
    Alert.alert(
      'Idiom Statistics',
      `Frequency: ${item.frequency_of_use}/10\nUpvotes: ${item.upvotes}\nDownvotes: ${item.downvotes}\nLiteral Transparency: ${item.literal_transparency}/10\nTranslation Difficulty: ${item.translation_difficulty}/10`,
      [{ text: 'Close', style: 'default' }],
    );
    closeMenu();
  };

  const handleCopyText = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    try {
      await Clipboard.setStringAsync(item.text);
      Alert.alert('Copied!', 'Text copied to clipboard.');
      closeMenu();
    } catch (error) {
      console.log('Error copying:', error);
      closeMenu();
    }
  };

  const handleReportError = (e: GestureResponderEvent) => {
    e.stopPropagation();
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
    closeMenu();
  };

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

      {menuVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            onPress={closeMenu}
            activeOpacity={1}
          />

          <View
            style={{
              position: 'absolute',
              top: 60,
              right: 20,
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              paddingVertical: 8,
              minWidth: 160,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 15,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <TouchableOpacity
              onPress={handleShare}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="share-outline"
                size={18}
                color={colors.text}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: colors.text, fontSize: 16 }}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewStats}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="stats-chart-outline"
                size={18}
                color={colors.text}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: colors.text, fontSize: 16 }}>
                View Stats
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCopyText}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="copy-outline"
                size={18}
                color={colors.text}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: colors.text, fontSize: 16 }}>
                Copy Text
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReportError}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="flag-outline"
                size={18}
                color={colors.text}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: colors.text, fontSize: 16 }}>
                Report Error
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default CardFront;
