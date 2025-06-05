import React from 'react';
import { View, Text } from 'react-native';

interface SmileyDisplayProps {
  smileys: string[];
}

export const SmileyDisplay: React.FC<SmileyDisplayProps> = ({ smileys }) => {
  if (smileys.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap justify-center">
      <Text className="text-2xl text-center">{smileys.join(' ')}</Text>
    </View>
  );
};

export default SmileyDisplay;
