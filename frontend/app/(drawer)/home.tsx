import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { router } from 'expo-router';
import HeroSection from '../../src/components/HeroSection';
import QuickActionsGrid from '../../src/components/QuickActionsGrid';
import ModernPandaAnimation from '../../src/components/ModernPandaAnimation';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.API_URL ?? 'API URL not found';

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
      <ModernPandaAnimation
        width={510}
        height={510}
        style={{
          position: 'absolute',
          top: screenHeight / 2 - 255,
          left: screenWidth / 2 - 255,
          zIndex: 0,
          opacity: 0.7,
        }}
      />

      <View className="flex-1 px-6 pt-12" style={{ zIndex: 1 }}>
        <HeroSection colors={colors} />
        <QuickActionsGrid
          colors={colors}
          quickActions={quickActions}
          navigateTo={navigateTo}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
