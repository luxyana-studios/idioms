import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  hasMatte?: boolean; // Para CardBack
}

// Centralized gradient configuration with proper typing
const GRADIENT_CONFIG = {
  colors: [
    '#1A0B3D', // Very deep purple (bottom-left)
    '#2D1B69', // Deep purple
    '#5B21B6', // Intermediate purple
    '#8B5CF6', // Rich purple
    '#A855F7', // Light purple
    '#D946EF', // Vibrant pink-purple
    '#EC4899', // Pink
    '#F97316', // Warm orange
    '#EA580C', // Deep warm orange
    '#9A3412', // Very deep orange (top-right)
  ] as const,
  locations: [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.74, 0.87, 0.95, 1] as const,
  start: { x: 0, y: 1 } as const, // bottom-left
  end: { x: 1, y: 0 } as const, // top-right
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  style,
  children,
  hasMatte = false,
}) => {
  return (
    <>
      <LinearGradient
        colors={GRADIENT_CONFIG.colors}
        start={GRADIENT_CONFIG.start}
        end={GRADIENT_CONFIG.end}
        locations={GRADIENT_CONFIG.locations}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: 20,
          },
          style,
        ]}
      />

      {hasMatte && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
          }}
        />
      )}

      {children}
    </>
  );
};

export default GradientBackground;
