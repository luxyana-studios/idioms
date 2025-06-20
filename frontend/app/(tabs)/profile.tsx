import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const { theme, colors, toggleTheme } = useTheme();

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
    </View>
  );
};

export default Profile;
