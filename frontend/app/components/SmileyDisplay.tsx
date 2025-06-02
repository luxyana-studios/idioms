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
    <View
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      className="rounded-2xl p-4 mb-4 border border-yellow-400/20"
    >
      <View className="flex-row flex-wrap justify-center">
        {smileys.map((emoji, index) => (
          <Text key={index} className="text-2xl mr-2 mb-1">
            {emoji}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default SmileyDisplay;
