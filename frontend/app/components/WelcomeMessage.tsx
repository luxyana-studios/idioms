import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type WelcomeMessageProps = {
  colors: {
    primary: string;
    textSecondary: string;
  };
};

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ colors }) => (
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
);
