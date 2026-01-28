import React, { memo } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BlobShape from './BlobShape';
import { useTheme } from '../contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OrganicBackgroundProps {
  children?: React.ReactNode;
  variant?: 'home' | 'welcome' | 'default';
  showBlobs?: boolean;
  style?: ViewStyle;
}

/**
 * Organic Flow background component with layered gradients and floating blobs.
 * Creates a soft, alive, gently animated natural atmosphere.
 */
const OrganicBackground: React.FC<OrganicBackgroundProps> = ({
  children,
  variant = 'default',
  showBlobs = true,
  style,
}) => {
  const { theme, colors } = useTheme();

  // Color configurations based on theme
  const gradientColors = {
    light: {
      home: [
        'rgba(250, 247, 242, 1)', // Cream base
        'rgba(167, 196, 160, 0.08)', // Sage tint
        'rgba(212, 165, 116, 0.05)', // Terracotta hint
        'rgba(240, 235, 227, 1)', // Warm surface
      ],
      welcome: [
        'rgba(167, 196, 160, 0.12)', // Stronger sage
        'rgba(250, 247, 242, 1)',
        'rgba(212, 165, 116, 0.08)',
        'rgba(240, 235, 227, 1)',
      ],
      default: [
        'rgba(250, 247, 242, 1)',
        'rgba(240, 235, 227, 1)',
        'rgba(167, 196, 160, 0.05)',
        'rgba(250, 247, 242, 1)',
      ],
    },
    dark: {
      home: [
        'rgba(30, 36, 32, 1)', // Deep forest base
        'rgba(184, 212, 176, 0.08)', // Sage tint
        'rgba(229, 184, 148, 0.05)', // Terracotta hint
        'rgba(42, 48, 43, 1)', // Dark sage surface
      ],
      welcome: [
        'rgba(184, 212, 176, 0.1)', // Stronger sage
        'rgba(30, 36, 32, 1)',
        'rgba(229, 184, 148, 0.06)',
        'rgba(42, 48, 43, 1)',
      ],
      default: [
        'rgba(30, 36, 32, 1)',
        'rgba(42, 48, 43, 1)',
        'rgba(184, 212, 176, 0.04)',
        'rgba(30, 36, 32, 1)',
      ],
    },
  };

  const blobConfigs = {
    light: {
      primary: '#A7C4A0', // Sage
      secondary: '#D4A574', // Terracotta
      tertiary: '#8B7355', // Taupe
    },
    dark: {
      primary: '#B8D4B0', // Light sage
      secondary: '#E5B894', // Light terracotta
      tertiary: '#9E8B75', // Light taupe
    },
  };

  const currentGradient = gradientColors[theme][variant];
  const currentBlobs = blobConfigs[theme];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      {/* Primary gradient layer */}
      <LinearGradient
        colors={currentGradient as [string, string, ...string[]]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Secondary diagonal gradient for depth */}
      <LinearGradient
        colors={
          theme === 'light'
            ? ['transparent', 'rgba(167, 196, 160, 0.06)', 'transparent']
            : ['transparent', 'rgba(184, 212, 176, 0.05)', 'transparent']
        }
        locations={[0, 0.5, 1]}
        start={{ x: 0.8, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating blob decorations */}
      {showBlobs && (
        <>
          {/* Top-left blob */}
          <BlobShape
            size={screenWidth * 0.5}
            color={currentBlobs.primary}
            opacity={theme === 'light' ? 0.08 : 0.06}
            variant="organic1"
            index={0}
            animated
            style={{
              position: 'absolute',
              top: -screenWidth * 0.15,
              left: -screenWidth * 0.2,
            }}
          />

          {/* Top-right blob */}
          <BlobShape
            size={screenWidth * 0.35}
            color={currentBlobs.secondary}
            opacity={theme === 'light' ? 0.06 : 0.05}
            variant="organic2"
            index={1}
            animated
            style={{
              position: 'absolute',
              top: screenHeight * 0.08,
              right: -screenWidth * 0.12,
            }}
          />

          {/* Middle-left blob */}
          <BlobShape
            size={screenWidth * 0.4}
            color={currentBlobs.tertiary}
            opacity={theme === 'light' ? 0.05 : 0.04}
            variant="organic3"
            index={2}
            animated
            style={{
              position: 'absolute',
              top: screenHeight * 0.35,
              left: -screenWidth * 0.18,
            }}
          />

          {/* Bottom-right blob */}
          <BlobShape
            size={screenWidth * 0.55}
            color={currentBlobs.primary}
            opacity={theme === 'light' ? 0.07 : 0.05}
            variant="organic2"
            index={3}
            animated
            style={{
              position: 'absolute',
              bottom: -screenWidth * 0.2,
              right: -screenWidth * 0.15,
            }}
          />

          {/* Bottom-left small blob */}
          <BlobShape
            size={screenWidth * 0.25}
            color={currentBlobs.secondary}
            opacity={theme === 'light' ? 0.05 : 0.04}
            variant="organic1"
            index={4}
            animated
            style={{
              position: 'absolute',
              bottom: screenHeight * 0.15,
              left: screenWidth * 0.05,
            }}
          />
        </>
      )}

      {/* Content layer */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

export const MemoizedOrganicBackground = memo(OrganicBackground);
MemoizedOrganicBackground.displayName = 'OrganicBackground';

export default MemoizedOrganicBackground;
