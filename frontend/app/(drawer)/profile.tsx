import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { MotiView } from 'moti';
import ReportModal from '../../src/components/ReportModal';

const Profile = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const [showTechnicalReport, setShowTechnicalReport] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleTechnicalReportPress = () => {
    setShowTechnicalReport(true);
  };

  const handleTechnicalReportOption = (reportType: string) => {
    setShowTechnicalReport(false);
    showSuccessNotification(`${reportType} reported`);
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
            title="Report Technical Issue"
            description="Report bugs, crashes, or app problems"
            onPress={handleTechnicalReportPress}
            rightComponent={
              <Ionicons
                name="bug-outline"
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

      <ReportModal
        isVisible={showTechnicalReport}
        onClose={() => setShowTechnicalReport(false)}
        onReportSelected={handleTechnicalReportOption}
      />

      {showNotification && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ type: 'timing', duration: 200 }}
          style={{
            position: 'absolute',
            top: 100,
            left: 20,
            right: 20,
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
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
              color: colors.text,
              fontSize: 14,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            {notificationMessage}
          </Text>
        </MotiView>
      )}
    </View>
  );
};

export default Profile;
