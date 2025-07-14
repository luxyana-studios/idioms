import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { MotiView } from 'moti';
import ReportModal, { ReportOption } from '../../src/components/ReportModal';
import ReportForm from '../../src/components/ReportForm';

const Profile = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const [showTechnicalReport, setShowTechnicalReport] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReportType, setSelectedReportType] =
    useState<ReportOption | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleTechnicalReportPress = () => {
    setShowTechnicalReport(true);
  };

  const handleSimpleReportOption = (reportType: string) => {
    setShowTechnicalReport(false);
    showSuccessNotification(
      `✅ Report sent! Thanks for helping improve the app.`,
    );
  };

  const handleDetailedReportOption = (reportOption: ReportOption) => {
    setSelectedReportType(reportOption);
    setShowTechnicalReport(false);
    setShowReportForm(true);
  };

  const handleReportFormSubmit = (reportData: any) => {
    setShowReportForm(false);
    setSelectedReportType(null);

    // Here you would typically send the report to your backend
    console.log('Report submitted:', reportData);

    showSuccessNotification(`✅ Report sent! We'll look into it soon.`);
  };

  const handleReportFormClose = () => {
    setShowReportForm(false);
    setSelectedReportType(null);
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
            title="Report App Issue"
            description="Report bugs, performance issues, or app problems"
            onPress={handleTechnicalReportPress}
            rightComponent={
              <Ionicons
                name="flag-outline"
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
        onReportSelected={handleSimpleReportOption}
        onDetailedReportSelected={handleDetailedReportOption}
      />

      <ReportForm
        isVisible={showReportForm}
        onClose={handleReportFormClose}
        onSubmit={handleReportFormSubmit}
        reportType={selectedReportType}
      />

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
