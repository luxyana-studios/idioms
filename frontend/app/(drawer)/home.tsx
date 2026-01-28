import React from 'react';
import { View, Dimensions, ImageBackground } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../src/contexts/ThemeContext';
import { router } from 'expo-router';
import HeroSection from '../../src/components/HeroSection';
import QuickActionsGrid from '../../src/components/QuickActionsGrid';
import ModernPandaAnimation from '../../src/components/ModernPandaAnimation';
import OrganicBackground from '../../src/components/OrganicBackground';
import { useMascotFloating } from '../../src/hooks/useFloatingAnimation';
import { useBreathingAnimation } from '../../src/hooks/useBreathingAnimation';
import type { PalettePreset } from '../../src/utils/palette';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const pandaBackground = require('../../assets/background/fondo-panda.webp');

const HomeScreen = () => {
  const { colors, theme, setPreset, computed } = useTheme();

  // Organic Flow animations for the panda mascot
  const mascotFloatStyle = useMascotFloating(true);
  const mascotBreathStyle = useBreathingAnimation({
    minScale: 1.0,
    maxScale: 1.012,
    duration: 5000,
    enabled: true,
  });

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

  // Organic Flow preset: Sage green dominant
  const preset: PalettePreset = {
    dominant: '#A7C4A0', // Sage green
    accent: '#D4A574', // Terracotta
    background: undefined,
    textLight: '#2D2A26',
    textDark: '#FAF7F2',
  };

  React.useEffect(() => {
    setPreset(preset);
  }, []);

  return (
    <OrganicBackground variant="home" showBlobs>
      {/* Panda background image with organic overlay */}
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
          opacity: computed.backgroundImageOpacity * 0.85,
        }}
      />

      {/* Organic Flow overlay - sage-tinted for cohesion */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor:
            theme === 'light'
              ? 'rgba(167, 196, 160, 0.15)' // Light sage overlay
              : 'rgba(30, 36, 32, 0.4)', // Forest overlay
          zIndex: 1,
        }}
      />

      {/* Panda mascot with breathing and floating animations */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: screenHeight / 2 - 255 + Math.round(screenHeight * 0.09),
            left: screenWidth / 2 - 255,
            zIndex: 2,
            opacity: 0.75,
          },
          mascotFloatStyle,
          mascotBreathStyle,
        ]}
      >
        <ModernPandaAnimation width={510} height={510} />
      </Animated.View>

      {/* Main content */}
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
    </OrganicBackground>
  );
};

export default HomeScreen;
