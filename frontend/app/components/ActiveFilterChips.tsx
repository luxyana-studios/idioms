import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ActiveFilterChipsProps {
  searchSort?: 'frequency' | 'imagery';
  selectedCategory?: string | null;
  onRemoveSort: () => void;
  onRemoveCategory: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  searchSort,
  selectedCategory,
  onRemoveSort,
  onRemoveCategory,
}) => {
  const { colors } = useTheme();

  if (!searchSort && !selectedCategory) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap gap-2 mb-4">
      {searchSort && (
        <View
          style={{
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary,
          }}
          className="flex-row items-center px-3 py-2 rounded-full border"
        >
          <Text
            style={{ color: colors.primary }}
            className="text-sm font-medium mr-2"
          >
            {searchSort === 'frequency' ? 'By Frequency' : 'By Imagery'}
          </Text>
          <TouchableOpacity onPress={onRemoveSort}>
            <Ionicons name="close" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {selectedCategory && (
        <View
          style={{
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary,
          }}
          className="flex-row items-center px-3 py-2 rounded-full border"
        >
          <Text
            style={{ color: colors.primary }}
            className="text-sm font-medium mr-2 capitalize"
          >
            {selectedCategory}
          </Text>
          <TouchableOpacity onPress={onRemoveCategory}>
            <Ionicons name="close" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
