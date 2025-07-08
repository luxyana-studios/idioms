import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SortButtonsProps {
  searchSort?: 'frequency' | 'imagery';
  onSortPress: (sortType: 'frequency' | 'imagery') => void;
}

export const SortButtons: React.FC<SortButtonsProps> = ({
  searchSort,
  onSortPress,
}) => {
  const { colors } = useTheme();

  return (
    <View className="flex-row gap-2 mb-4">
      <TouchableOpacity
        onPress={() => onSortPress('frequency')}
        className="flex-1 py-3 px-4 rounded-full border"
        style={{
          backgroundColor:
            searchSort === 'frequency' ? colors.primary + '20' : colors.surface,
          borderColor:
            searchSort === 'frequency' ? colors.primary : colors.border,
        }}
      >
        <Text
          style={{
            color: searchSort === 'frequency' ? colors.primary : colors.text,
          }}
          className="text-center font-medium text-base"
        >
          Sort by Frequency
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSortPress('imagery')}
        className="flex-1 py-3 px-4 rounded-full border"
        style={{
          backgroundColor:
            searchSort === 'imagery' ? colors.primary + '20' : colors.surface,
          borderColor:
            searchSort === 'imagery' ? colors.primary : colors.border,
        }}
      >
        <Text
          style={{
            color: searchSort === 'imagery' ? colors.primary : colors.text,
          }}
          className="text-center font-medium text-base"
        >
          Sort by Imagery
        </Text>
      </TouchableOpacity>
    </View>
  );
};
