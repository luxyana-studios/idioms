import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { MotiView } from 'moti';

const Profile = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleFeedbackPress = () => {
    const email = 'feedback@idioms-app.com'; // Replace with your actual email
    const subject = 'Idioms App Feedback';
    const body =
      'Hi! I wanted to share some feedback about the Idioms app:\n\n[Please describe your feedback, bug report, or feature request here]\n\nThanks!';

    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch(() => {
      Alert.alert(
        'Email Not Available',
        'Please send your feedback to: feedback@idioms-app.com',
        [{ text: 'OK' }],
      );
    });
  };

  const SettingItem = ({
    title,
    description,
    onPress,
    rightComponent,
  }: {
    title: string;
    description: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      className="p-4 mb-3 rounded-2xl border shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            style={{ color: colors.text }}
            className="text-lg font-semibold mb-1"
          >
            {title}
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-sm">
            {description}
          </Text>
        </View>
        {rightComponent && <View className="ml-4">{rightComponent}</View>}
      </View>
    </TouchableOpacity>
  );

  const ThemeSelector = () => (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          backgroundColor: theme === 'light' ? colors.text : 'transparent',
          borderColor: colors.border,
        }}
        className="p-2 rounded-lg border mr-2"
        activeOpacity={0.7}
      >
        <Ionicons
          name="sunny"
          size={20}
          color={theme === 'light' ? colors.background : colors.textSecondary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          backgroundColor: theme === 'dark' ? colors.text : 'transparent',
          borderColor: colors.border,
        }}
        className="p-2 rounded-lg border"
        activeOpacity={0.7}
      >
        <Ionicons
          name="moon"
          size={20}
          color={theme === 'dark' ? colors.background : colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="flex-1 px-6 pt-12">
        <Text
          style={{ color: colors.text }}
          className="text-3xl font-bold mb-8"
        >
          Settings
        </Text>

        <View className="mb-6">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4"
          >
            Appearance
          </Text>

          <SettingItem
            title="Theme"
            description={`Current theme: ${theme === 'light' ? 'Light' : 'Dark'}`}
            rightComponent={<ThemeSelector />}
          />
        </View>

        <View className="mb-6">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4"
          >
            Support
          </Text>

          <SettingItem
            title="Send Feedback"
            description="Share feedback, report bugs, or suggest features"
            onPress={handleFeedbackPress}
            rightComponent={
              <Ionicons
                name="mail-outline"
                size={24}
                color={colors.textSecondary}
              />
            }
          />
        </View>

        <View className="mb-6">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4"
          >
            About
          </Text>

          <SettingItem
            title="App Version"
            description="Idioms Learning App v1.0.0"
            rightComponent={
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.textSecondary}
              />
            }
          />
        </View>
      </ScrollView>

      {showNotification && (
        <MotiView
          from={{ opacity: 0, translateY: -20, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            position: 'absolute',
            top: 100,
            left: 20,
            right: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            zIndex: 10001,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 12,
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="#4ADE80"
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {notificationMessage}
            </Text>
          </View>
        </MotiView>
      )}
    </View>
  );
};

export default Profile;
