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
      {smileys.map((emoji, index) => (
        <Text key={index} className="text-2xl mr-2 mb-1">
          {emoji}
        </Text>
      ))}
    </View>
  );
};

export default SmileyDisplay;
