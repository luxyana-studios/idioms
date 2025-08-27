import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedbackModal from '../../src/components/FeedbackModal';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { MotiView } from 'moti';

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  nativeLanguage?: string;
  learningLanguages?: string[];
  learnedCount?: number;
  streak?: number;
};

const Profile = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const contentPadding = Platform.OS === 'android' ? 36 : 24;
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    subject: '',
    description: '',
    email: '',
  });

  // Initialize with a single mock user for testing. When you connect the backend,
  // remove this initial value and load the user via an API call (see notes below).
  const [user, setUser] = useState<User | null>({
    id: 'u_01',
    name: 'Maria Perez',
    username: 'mariap',
    email: 'maria@example.com',
    bio: 'Passionate about learning languages and sharing idioms.',
    nativeLanguage: 'es',
    learningLanguages: ['en', 'fr'],
    learnedCount: 120,
    streak: 7,
  });

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Keep a simple clear function for development/testing
  const clearUser = useCallback(() => {
    setUser(null);
    showSuccessNotification('Profile cleared');
  }, [showSuccessNotification]);

  /*
    BACKEND INTEGRATION NOTES (TODO):
    - Endpoint suggestions:
      GET  /api/user          -> fetch current user's profile
      POST /api/users         -> create a new user (payload: { name, username, email, ... })
      PUT  /api/user/:id      -> update user profile (partial updates supported)

    - Authentication: include Authorization: Bearer <token> in headers.
    - Payload shape should match the `User` type above.
    - Example fetch stub (call on mount or after login):
      const loadUserFromBackend = async () => {
        // const res = await fetch(`${API_BASE}/user`, { headers: { Authorization: `Bearer ${token}` } });
        // const data = await res.json();
        // setUser(data);
      };

    - On save/update send only changed fields to PUT /api/user/:id.
    - Consider optimistic UI and error handling (show notifications on success/failure).
  */

  const handleFeedbackPress = useCallback(() => {
    setShowFeedbackModal(true);
  }, []);

  const handleSendFeedback = useCallback(() => {
    if (!feedbackForm.subject.trim() || !feedbackForm.description.trim()) {
      Alert.alert(
        'Required Fields',
        'Please complete the subject and description.',
        [{ text: 'OK' }],
      );
      return;
    }
    setShowFeedbackModal(false);
    setFeedbackForm({
      subject: '',
      description: '',
      email: '',
    });
    showSuccessNotification('Feedback sent! Thank you.');
  }, [feedbackForm, showSuccessNotification]);

  const handleSubjectChange = useCallback((text: string) => {
    setFeedbackForm((prev) => ({ ...prev, subject: text }));
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setFeedbackForm((prev) => ({ ...prev, description: text }));
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    setFeedbackForm((prev) => ({ ...prev, email: text }));
  }, []);

  const resetFeedbackForm = useCallback(() => {
    setFeedbackForm({
      subject: '',
      description: '',
      email: '',
    });
    setShowFeedbackModal(false);
  }, []);

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

  const ProfileSection = () => (
    <View className="mb-6">
      <Text
        style={{ color: colors.text }}
        className="text-2xl font-semibold mb-4"
      >
        Profile
      </Text>

      {user ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
          className="p-4 mb-3 rounded-2xl border shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                style={{
                  backgroundColor: colors.text,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.background, fontWeight: '700' }}>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </Text>
              </View>
              <View className="ml-4">
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-semibold"
                >
                  {user.name}
                </Text>
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-sm"
                >
                  @{user.username} • {user.email}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={clearUser} activeOpacity={0.7}>
              <Ionicons
                name="trash-outline"
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {user.bio ? (
            <Text style={{ color: colors.textSecondary }} className="mt-3">
              {user.bio}
            </Text>
          ) : null}

          <View className="flex-row mt-3">
            <View className="mr-4">
              <Text style={{ color: colors.text }} className="font-semibold">
                Native
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                {user.nativeLanguage?.toUpperCase()}
              </Text>
            </View>
            <View className="mr-4">
              <Text style={{ color: colors.text }} className="font-semibold">
                Learning
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                {user.learningLanguages?.join(', ')}
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.text }} className="font-semibold">
                Streak
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                {user.streak ?? 0} days
              </Text>
            </View>
          </View>

          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={() =>
                showSuccessNotification(
                  'Implement PUT /api/user/:id to enable editing',
                )
              }
              style={{ borderColor: colors.border }}
              className="px-4 py-2 rounded-lg border mr-3"
              activeOpacity={0.8}
            >
              <Text style={{ color: colors.text }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                showSuccessNotification(
                  'Implement POST /api/users to create users',
                )
              }
              style={{ borderColor: colors.border }}
              className="px-4 py-2 rounded-lg border"
              activeOpacity={0.8}
            >
              <Text style={{ color: colors.text }}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
          className="p-4 mb-3 rounded-2xl border shadow-sm"
        >
          <Text style={{ color: colors.textSecondary }} className="mb-3">
            Profile not loaded. Connect your backend and implement a
            loadUserFromBackend() call to fetch the user.
          </Text>
        </View>
      )}
    </View>
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'bottom']}
    >
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: contentPadding }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text
          style={{ color: colors.text }}
          className="text-3xl font-bold mb-8"
        >
          Settings
        </Text>

        <ProfileSection />

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
            Feedback
          </Text>
          <SettingItem
            title="Send Feedback"
            description="Let us know your thoughts or report an issue."
            onPress={handleFeedbackPress}
            rightComponent={
              <Ionicons
                name="chatbox-ellipses-outline"
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

      <FeedbackModal
        visible={showFeedbackModal}
        onClose={resetFeedbackForm}
        feedbackForm={feedbackForm}
        onSubjectChange={handleSubjectChange}
        onDescriptionChange={handleDescriptionChange}
        onEmailChange={handleEmailChange}
        onSendFeedback={handleSendFeedback}
        colors={colors}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default Profile;
