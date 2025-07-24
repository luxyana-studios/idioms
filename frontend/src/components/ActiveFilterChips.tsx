import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface FilterChipProps {
  text: string;
  onRemove: () => void;
  capitalize?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  text,
  onRemove,
  capitalize = false,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.primary + '15',
        borderColor: colors.primary,
      }}
      className={`flex-row items-center px-3 py-2 rounded-full border`}
    >
      <Text
        style={{ color: colors.primary }}
        className={`text-sm font-medium mr-2 ${capitalize ? 'capitalize' : ''}`}
      >
        {text}
      </Text>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

interface ActiveFilterChipsProps {
  searchSort?: 'frequency' | 'imagery';
  selectedCategories: string[];
  onRemoveSort: () => void;
  onRemoveCategory: (category: string) => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  searchSort,
  selectedCategories,
  onRemoveSort,
  onRemoveCategory,
}) => {
  if (!searchSort && selectedCategories.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap gap-1 mb-4">
      {searchSort && (
        <FilterChip
          text={searchSort === 'frequency' ? 'By Frequency' : 'By Imagery'}
          onRemove={onRemoveSort}
        />
      )}

      {selectedCategories.map((category) => (
        <FilterChip
          key={category}
          text={category}
          onRemove={() => onRemoveCategory(category)}
          capitalize={true}
        />
      ))}
    </View>
  );
};
