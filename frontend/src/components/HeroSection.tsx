import React from 'react';
import { View, Text } from 'react-native';

interface HeroSectionProps {
  colors: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ colors }) => {
  return (
    <View className="mb-8 items-center">
      <Text
        style={{ color: colors.text }}
        className="text-4xl font-bold mb-2 text-center"
      >
        Welcome to Idioms
      </Text>
      <Text
        style={{ color: colors.textSecondary }}
        className="text-lg text-center mb-4"
      >
        Master the art of idiomatic expressions
      </Text>
    </View>
  );
};

export default HeroSection;
