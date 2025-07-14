import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { router } from 'expo-router';
import QuickAction from '../../src/components/QuickAction';
import { WelcomeMessage } from '../../src/components/WelcomeMessage';

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
      title: 'Browse All Idioms',
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
            <QuickAction
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onPress={() => navigateTo(action.route)}
            />
          ))}
        </View>

        <WelcomeMessage colors={colors} />
      </View>
    </View>
  );
};

export default HomeScreen;
