import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedView from './AnimatedView';
import { CardData } from '../types/card';
import { setStringAsync } from 'expo-clipboard';
import { useTheme } from '../contexts/ThemeContext';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface DotMenuProps {
  item: CardData;
  onStatsToggle: () => void;
  CARD_WIDTH: number;
  CARD_HEIGHT: number;
}

interface MenuOption {
  id: string;
  title: string;
  icon: IoniconsName;
  action: () => void;
}

const DotMenu: React.FC<DotMenuProps> = ({
  item,
  onStatsToggle,
  CARD_WIDTH,
  CARD_HEIGHT,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { theme, computed } = useTheme();

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
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
    onStatsToggle();
  };

  const handleCopyPress = async () => {
    setIsMenuVisible(false);
    const fullText = `${item.text}\n\nMeaning: ${item.meaning}\n\nExample: ${item.examples[0] || 'No example available'}`;

    try {
      await setStringAsync(fullText);
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
      id: 'wrong-meaning',
      title: 'Wrong meaning',
      icon: 'alert-circle-outline',
    },
    {
      id: 'inappropriate',
      title: 'Inappropriate content',
      icon: 'warning-outline',
    },
    {
      id: 'poor-example',
      title: 'Poor example',
      icon: 'list-outline',
    },
  ];

  // Organic Flow colors
  const organicTriggerBg =
    theme === 'light'
      ? 'rgba(167, 196, 160, 0.2)' // Sage tint
      : 'rgba(184, 212, 176, 0.15)';
  const organicTriggerBorder =
    theme === 'light'
      ? 'rgba(167, 196, 160, 0.35)'
      : 'rgba(184, 212, 176, 0.25)';
  const organicMenuBg =
    theme === 'light'
      ? 'rgba(253, 252, 250, 0.98)' // Warm white
      : 'rgba(42, 48, 43, 0.98)'; // Dark sage

  return (
    <>
      {/* Organic blob-like menu trigger */}
      <TouchableOpacity
        onPress={handleMenuPress}
        style={{
          position: 'absolute',
          top: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 11,
          backgroundColor: organicTriggerBg,
          // Organic blob shape
          borderTopLeftRadius: 18,
          borderTopRightRadius: 22,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 16,
          borderWidth: 1,
          borderColor: organicTriggerBorder,
          zIndex: 1000,
        }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={theme === 'light' ? '#A7C4A0' : '#B8D4B0'}
          style={{
            textShadowColor: computed.triggerIconShadowColor,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1.2,
          }}
        />
      </TouchableOpacity>

      {/* Organic Flow popup menu */}
      {isMenuVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              theme === 'light'
                ? 'rgba(167, 196, 160, 0.15)' // Sage overlay
                : 'rgba(30, 36, 32, 0.5)',
            borderRadius: 36, // Match card radius
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            paddingTop: CARD_HEIGHT * 0.12,
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
              borderRadius: 36,
            }}
            activeOpacity={1}
            onPress={() => setIsMenuVisible(false)}
          />

          <View
            style={{
              backgroundColor: organicMenuBg,
              borderRadius: 24, // Organic larger radius
              padding: 18,
              minWidth: 200,
              maxWidth: 260,
              shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 20,
              borderWidth: 1,
              borderColor:
                theme === 'light'
                  ? 'rgba(167, 196, 160, 0.25)'
                  : 'rgba(184, 212, 176, 0.15)',
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
                  paddingHorizontal: 14,
                  marginBottom: index < menuOptions.length - 1 ? 4 : 0,
                  borderRadius: 16, // Organic item radius
                  backgroundColor:
                    theme === 'light'
                      ? 'rgba(167, 196, 160, 0.08)'
                      : 'rgba(184, 212, 176, 0.05)',
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={theme === 'light' ? '#A7C4A0' : '#B8D4B0'}
                  style={{ marginRight: 14 }}
                />
                <Text
                  style={{
                    color: computed.labelColor,
                    fontSize: 15,
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

      {/* Organic Flow report menu */}
      {showReportMenu && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              theme === 'light'
                ? 'rgba(167, 196, 160, 0.15)'
                : 'rgba(30, 36, 32, 0.5)',
            borderRadius: 36,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            paddingTop: CARD_HEIGHT * 0.18,
            paddingRight: CARD_WIDTH * 0.05,
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
              borderRadius: 36,
            }}
            activeOpacity={1}
            onPress={() => setShowReportMenu(false)}
          />

          <AnimatedView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              backgroundColor: organicMenuBg,
              borderRadius: 24,
              padding: 20,
              minWidth: 200,
              maxWidth: 240,
              shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 20,
              borderWidth: 1,
              borderColor:
                theme === 'light'
                  ? 'rgba(167, 196, 160, 0.25)'
                  : 'rgba(184, 212, 176, 0.15)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: computed.divider,
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  color: computed.labelColor,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Report Issue
              </Text>
              <TouchableOpacity
                onPress={() => setShowReportMenu(false)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={18} color={computed.iconColor} />
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
                  borderBottomColor: computed.divider,
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={computed.iconColor}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    color: computed.labelColor,
                    fontSize: 14,
                    fontWeight: '500',
                    flex: 1,
                  }}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </AnimatedView>
        </View>
      )}

      {/* Organic Flow notification toast */}
      {showNotification && (
        <AnimatedView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 200 }}
          style={{
            position: 'absolute',
            top: CARD_HEIGHT * 0.12,
            left: CARD_WIDTH * 0.15,
            right: CARD_WIDTH * 0.15,
            backgroundColor: organicMenuBg,
            borderRadius: 20, // Organic pill
            padding: 14,
            borderWidth: 1,
            borderColor:
              theme === 'light'
                ? 'rgba(167, 196, 160, 0.3)'
                : 'rgba(184, 212, 176, 0.2)',
            zIndex: 10001,
            shadowColor: theme === 'light' ? '#8B9B7E' : '#0F1210',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: theme === 'light' ? '#5A6B55' : '#C4D4BE',
              fontSize: 14,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {notificationMessage}
          </Text>
        </AnimatedView>
      )}
    </>
  );
};

export default DotMenu;
