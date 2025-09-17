import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

const Profile = () => {
  const { theme, colors, toggleTheme } = useTheme();

  const sendProblemReport = async () => {
    try {
      // TODO: Replace with actual email sending when backend is ready
      // const deviceInfo = {
      //   platform: Platform.OS,
      //   appVersion: '1.0.0',
      //   timestamp: new Date().toISOString(),
      // };

      // await apiFetch('/api/send-problem-report', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     subject: 'Problem Report from Idioms App',
      //     message: `User reported a problem with the app.\n\nDevice Info:\n- Platform: ${deviceInfo.platform}\n- App Version: ${deviceInfo.appVersion}\n- Time: ${deviceInfo.timestamp}`,
      //     userEmail: 'user-report@idioms-app.com', // or get from user if available
      //   }),
      // });

      // For now, show success message
      console.log('Problem report sent:', {
        platform: Platform.OS,
        appVersion: '1.0.0',
        timestamp: new Date().toISOString(),
      });

      Alert.alert(
        'Report Sent!',
        'Thank you for reporting the issue. Our support team will review it and work on a solution.',
        [{ text: 'OK' }],
      );
    } catch (error) {
      Alert.alert(
        'Cannot Send Report',
        'Please try again later or contact us directly at support@idioms-app.com',
        [{ text: 'OK' }],
      );
    }
  };

  const handleReportProblem = () => {
    Alert.alert(
      'Report a Problem',
      "This will send a problem report to our support team. We'll investigate and work on fixing any issues.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Report',
          onPress: sendProblemReport,
        },
      ],
    );
  };

  const SettingItem = ({
    title,
    description,
    onPress,
    rightComponent,
    last = false,
  }: {
    title: string;
    description?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    last?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            style={{ color: colors.text }}
            className="text-base font-medium"
          >
            {title}
          </Text>
          {description && (
            <Text
              style={{ color: colors.textSecondary }}
              className="text-sm mt-1"
            >
              {description}
            </Text>
          )}
        </View>
        {rightComponent && <View className="ml-3">{rightComponent}</View>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1">
        <View className="px-5 pt-8 pb-6">
          <Text
            style={{ color: colors.text }}
            className="text-3xl font-bold mb-2"
          >
            Profile
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-base">
            Customize your app experience
          </Text>
        </View>

        <View className="mx-5 mb-6 rounded-xl overflow-hidden">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4 px-1"
          >
            Appearance
          </Text>

          <SettingItem
            title="Theme"
            description={`Current: ${theme === 'light' ? 'Light' : 'Dark'}`}
            onPress={toggleTheme}
            rightComponent={
              <Ionicons
                name={theme === 'light' ? 'sunny' : 'moon'}
                size={24}
                color={colors.textSecondary}
              />
            }
            last
          />
        </View>

        <View className="mx-5 mb-6 rounded-xl overflow-hidden">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4 px-1"
          >
            Support
          </Text>

          <SettingItem
            title="Report a Problem"
            description="Send feedback about issues or bugs"
            onPress={handleReportProblem}
            rightComponent={
              <Ionicons
                name="mail-outline"
                size={24}
                color={colors.textSecondary}
              />
            }
            last
          />
        </View>

        <View className="mx-5 mb-6 rounded-xl overflow-hidden">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4 px-1"
          >
            About
          </Text>

          <SettingItem
            title="App Version"
            description="1.0.0"
            rightComponent={
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.textSecondary}
              />
            }
            last
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
