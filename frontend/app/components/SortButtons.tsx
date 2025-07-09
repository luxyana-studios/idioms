import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SortButtonsProps {
  searchSort?: 'frequency' | 'imagery';
  onSortPress: (sortType: 'frequency' | 'imagery') => void;
}

interface SortButtonProps {
  sortType: 'frequency' | 'imagery';
  label: string;
  isSelected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

const SortButton: React.FC<SortButtonProps> = ({
  sortType,
  label,
  isSelected,
  onPress,
  colors,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 py-2 px-3 rounded-full border"
    style={{
      backgroundColor: isSelected ? colors.primary + '20' : colors.surface,
      borderColor: isSelected ? colors.primary : colors.border,
    }}
  >
    <Text
      style={{
        color: isSelected ? colors.primary : colors.text,
      }}
      className="text-center font-medium text-sm"
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const SortButtons: React.FC<SortButtonsProps> = ({
  searchSort,
  onSortPress,
}) => {
  const { colors } = useTheme();

  return (
    <View className="flex-row gap-1 mb-4">
      <SortButton
        sortType="frequency"
        label="Sort by Frequency"
        isSelected={searchSort === 'frequency'}
        onPress={() => onSortPress('frequency')}
        colors={colors}
      />
      <SortButton
        sortType="imagery"
        label="Sort by Imagery"
        isSelected={searchSort === 'imagery'}
        onPress={() => onSortPress('imagery')}
        colors={colors}
      />
    </View>
  );
};
