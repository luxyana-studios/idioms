import React from 'react';
import { View, Dimensions, Text, ImageBackground } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { router } from 'expo-router';
import HeroSection from '../../src/components/HeroSection';
import QuickActionsGrid from '../../src/components/QuickActionsGrid';
import ModernPandaAnimation from '../../src/components/ModernPandaAnimation';
import Constants from 'expo-constants';
import type { PalettePreset } from '../../src/utils/palette';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const pandaBackground = require('../../assets/background/fondo-panda.webp');

const apiUrl = Constants.expoConfig?.extra?.API_URL ?? 'API URL not found';

const HomeScreen = () => {
  const { colors, setPalette, theme, setPreset, computed } = useTheme();

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
      description: 'Browse your favorite idioms',
      icon: 'star-outline' as const,
      route: '/(drawer)/favorites',
    },
    {
      title: 'Random Shuffle',
      description: 'Discover idioms randomly',
      icon: 'shuffle' as const,
      route: '/(drawer)/shuffle',
    },
  ];

  const preset: PalettePreset = {
    dominant: '#8B7355',
    accent: '#D4A574',
    background: undefined,
    textLight: '#2D2A26',
    textDark: '#FAF7F2',
  };

  React.useEffect(() => {
    setPreset(preset);
  }, []);

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <ImageBackground
        source={pandaBackground}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: computed.backgroundImageOpacity,
        }}
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: computed.backgroundImageOverlay,
          zIndex: 1,
        }}
      />

      <ModernPandaAnimation
        width={510}
        height={510}
        style={{
          position: 'absolute',
          top: screenHeight / 2 - 255 + Math.round(screenHeight * 0.09),
          left: screenWidth / 2 - 255,
          zIndex: 2,
          opacity: 0.7,
        }}
      />

      <View
        className="flex-1 px-6"
        style={{
          zIndex: 3,
          paddingTop: 16,
          marginTop: 96,
        }}
      >
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
