import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';

const HomeScreen = () => {
  const { colors } = useTheme();

  // Navigation function with type assertion
  const navigateTo = (route: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(route as any);
  };

  const quickActions = [
    {
      title: 'Search Idioms',
      description: 'Find specific idioms with filters',
      icon: 'search' as const,
      route: '/(drawer)/search?autoFocus=true',
    },
    {
      title: 'Browse All Cards',
      description: 'Explore the complete collection',
      icon: 'list' as const,
      route: '/(drawer)/all',
    },
    {
      title: 'View Favorites',
      description: 'See your saved idioms',
      icon: 'star' as const,
      route: '/(drawer)/favorites',
    },
    {
      title: 'Random Shuffle',
      description: 'Discover idioms randomly',
      icon: 'shuffle' as const,
      route: '/(drawer)/shuffle',
    },
  ];

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="flex-1 px-6 pt-12">
        <View className="mb-8">
          <Text
            style={{ color: colors.text }}
            className="text-4xl font-bold mb-2"
          >
            Welcome to Idioms
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-lg">
            Master the art of idiomatic expressions
          </Text>
        </View>

        <View className="mb-8">
          <Text
            style={{ color: colors.text }}
            className="text-xl font-semibold mb-4"
          >
            Quick Actions
          </Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigateTo(action.route)}
              className="flex-row items-center p-4 mb-3 rounded-xl"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Ionicons name={action.icon} size={24} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-semibold mb-1"
                >
                  {action.title}
                </Text>
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-sm"
                >
                  {action.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-1 justify-center items-center">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <Ionicons name="book" size={48} color={colors.primary} />
          </View>
          <Text
            style={{ color: colors.textSecondary }}
            className="text-center text-lg mb-2"
          >
            Use the menu (☰) to search or browse collections
          </Text>
          <Text
            style={{ color: colors.textSecondary }}
            className="text-center text-sm"
          ></Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
