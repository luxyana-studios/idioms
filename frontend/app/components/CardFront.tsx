import React, { memo, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, Share } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CardData } from '../types/card';
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SmileyDisplay from './SmileyDisplay';
import { VotingButtons } from './VotingButtons';
import GradientBackground from './GradientBackground';
import IdiomStats from './IndicatorsDisplay';
import { MotiView } from 'moti';
import * as Clipboard from 'expo-clipboard';

type IoniconsName = keyof typeof Ionicons.glyphMap;

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

interface MenuOption {
  id: string;
  title: string;
  icon: IoniconsName;
  action: () => void;
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
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [notificationData, setNotificationData] = useState({
    icon: '',
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const showSuccessNotification = (message: string) => {
    setNotificationData({ icon: '', title: '', message, type: 'success' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleSharePress = async () => {
    setIsMenuVisible(false);
    try {
      await Share.share({
        message: `${item.text}\n\nMeaning: ${item.meaning}\n\nExample: ${item.examples[0] || 'No example available'}`,
        title: 'Check out this idiom!',
      });
    } catch {
      // Silent fail for share errors
    }
  };

  const handleStatsPress = () => {
    setIsMenuVisible(false);
    setShowStats(!showStats);
  };

  const handleCopyPress = async () => {
    setIsMenuVisible(false);
    const fullText = `${item.text}\n\nMeaning: ${item.meaning}\n\nExample: ${item.examples[0] || 'No example available'}`;

    try {
      await Clipboard.setStringAsync(fullText);
      showSuccessNotification('Card copied to clipboard');
    } catch {
      showSuccessNotification('Unable to copy');
    }
  };

  const handleReportPress = () => {
    setIsMenuVisible(false);
    setShowReportMenu(true);
  };

  const handleReportOption = (reportType: string) => {
    setShowReportMenu(false);
    showSuccessNotification(`${reportType} reported`);
  };

  const menuOptions: MenuOption[] = [
    {
      id: 'share',
      title: 'Share',
      icon: 'share-outline',
      action: handleSharePress,
    },
    {
      id: 'stats',
      title: 'Stats',
      icon: 'bar-chart-outline',
      action: handleStatsPress,
    },
    {
      id: 'copy',
      title: 'Copy',
      icon: 'copy-outline',
      action: handleCopyPress,
    },
    {
      id: 'report',
      title: 'Report',
      icon: 'flag-outline',
      action: handleReportPress,
    },
  ];

  const reportOptions: {
    id: string;
    title: string;
    icon: IoniconsName;
  }[] = [
    {
      id: 'wrong-translation',
      title: 'Wrong translation',
      icon: 'language-outline',
    },
    {
      id: 'missing-context',
      title: 'Missing context',
      icon: 'information-circle-outline',
    },
    { id: 'poor-example', title: 'Poor example', icon: 'list-outline' },
  ];

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

      {/* Dot Menu Button */}
      <TouchableOpacity
        onPress={handleMenuPress}
        style={{
          position: 'absolute',
          top: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1000,
        }}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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

      {/* Dot Menu Modal */}
      {isMenuVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20, // Matching card border radius
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            paddingTop: CARD_HEIGHT * 0.12, // Position below dot menu button
            paddingRight: CARD_WIDTH * 0.05,
            zIndex: 9999,
          }}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20, // Matching card border radius
            }}
            activeOpacity={1}
            onPress={() => setIsMenuVisible(false)}
          />

          <View
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.9)', // Added transparency
              borderRadius: 16,
              padding: 16, // Reduced padding since no title
              minWidth: 200,
              maxWidth: 260,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              zIndex: 10000,
            }}
          >
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={option.action}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  borderBottomWidth: index < menuOptions.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={22}
                  color="#FFFFFF"
                  style={{ marginRight: 16 }}
                />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '500',
                    flex: 1,
                  }}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Report Menu */}
      {showReportMenu && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
            }}
            activeOpacity={1}
            onPress={() => setShowReportMenu(false)}
          />

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.95)',
              borderRadius: 16,
              padding: 20,
              minWidth: 200,
              maxWidth: 280,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Report Issue
              </Text>
              <TouchableOpacity
                onPress={() => setShowReportMenu(false)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {reportOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleReportOption(option.title)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderBottomWidth: index < reportOptions.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: '500',
                    flex: 1,
                  }}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </MotiView>
        </View>
      )}

      {/* Stats Display */}
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
          {/* Header del stats */}
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

      {/* Simple Notification */}
      {showNotification && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ type: 'timing', duration: 200 }}
          style={{
            position: 'absolute',
            top: CARD_HEIGHT * 0.12,
            left: CARD_WIDTH * 0.15,
            right: CARD_WIDTH * 0.15,
            backgroundColor: 'rgba(31, 41, 55, 0.95)', // Same as dot menu
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            zIndex: 10001,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            {notificationData.message}
          </Text>
        </MotiView>
      )}
    </Animated.View>
  );
};

// memoized to prevent rerenders when props unchanged
export default memo(CardFront);
