import { useState } from 'react';
import { Text, TouchableOpacity, View, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
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

  const { theme, colors } = useTheme();
  const overlayBg =
    theme === 'light'
      ? (colors.text ?? '#111111') + '33'
      : 'rgba(0, 0, 0, 0.6)';
  const menuBg =
    theme === 'light'
      ? (colors.surface ?? '#ffffff') + 'F2'
      : 'rgba(31, 41, 55, 0.95)';
  const menuBorder =
    theme === 'light'
      ? (colors.border ?? '#cbd5e1') + '99'
      : 'rgba(255, 255, 255, 0.2)';
  const divider =
    theme === 'light'
      ? (colors.border ?? '#cbd5e1') + '99'
      : 'rgba(255, 255, 255, 0.1)';

  const triggerBg = 'rgba(0, 0, 0, 0.2)';
  const triggerBorder = 'rgba(255, 255, 255, 0.3)';
  const iconColor = theme === 'light' ? (colors.text ?? '#1f2937') : '#FFFFFF';
  const labelColor = theme === 'light' ? (colors.text ?? '#1f2937') : '#FFFFFF';
  const triggerIconColor = '#FFFFFF';
  const triggerIconShadowColor =
    theme === 'light' ? '#00000055' : 'transparent';

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

  return (
    <>
      <TouchableOpacity
        onPress={handleMenuPress}
        style={{
          position: 'absolute',
          top: CARD_HEIGHT * 0.05,
          right: CARD_WIDTH * 0.05,
          padding: 10,
          backgroundColor: triggerBg,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: triggerBorder,
          zIndex: 1000,
        }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={triggerIconColor}
          style={{
            textShadowColor: triggerIconShadowColor,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1.2,
          }}
        />
      </TouchableOpacity>

      {isMenuVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: overlayBg,
            borderRadius: 20,
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
              borderRadius: 20,
            }}
            activeOpacity={1}
            onPress={() => setIsMenuVisible(false)}
          />

          <View
            style={{
              backgroundColor: menuBg,
              borderRadius: 16,
              padding: 16,
              minWidth: 200,
              maxWidth: 260,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: theme === 'light' ? 0.2 : 0.35,
              shadowRadius: theme === 'light' ? 12 : 16,
              elevation: 20,
              borderWidth: 1,
              borderColor: menuBorder,
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
                  borderBottomColor: divider,
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={iconColor}
                  style={{ marginRight: 16 }}
                />
                <Text
                  style={{
                    color: labelColor,
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

      {showReportMenu && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: overlayBg,
            borderRadius: 20,
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
              backgroundColor: menuBg,
              borderRadius: 16,
              padding: 20,
              minWidth: 200,
              maxWidth: 240,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: theme === 'light' ? 0.2 : 0.35,
              shadowRadius: theme === 'light' ? 12 : 16,
              elevation: 20,
              borderWidth: 1,
              borderColor: menuBorder,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: divider,
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  color: labelColor,
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
                <Ionicons name="close" size={18} color={iconColor} />
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
                  borderBottomColor: divider,
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={iconColor}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    color: labelColor,
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
            backgroundColor: menuBg,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: menuBorder,
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
              color: labelColor,
              fontSize: 14,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {notificationMessage}
          </Text>
        </MotiView>
      )}
    </>
  );
};

export default DotMenu;
