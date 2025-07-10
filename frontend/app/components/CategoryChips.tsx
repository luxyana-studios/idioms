import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useCategories } from '../hooks/useCards';

interface CategoryChipsProps {
  selectedCategory: string | null;
  onCategoryPress: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onCategoryPress,
}) => {
  const { colors } = useTheme();
  const { data: categories, isLoading, error } = useCategories();

  const handleCategoryPress = (category: string) => {
    onCategoryPress(category);
  };

  if (isLoading) {
    return (
      <View className="px-6 pb-3">
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  if (error || !categories || categories.length === 0) {
    return null;
  }

  return (
    <View className="px-6 pb-0">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0,
          gap: 4,
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryPress(category)}
              style={{
                backgroundColor: isSelected
                  ? colors.primary + '20'
                  : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 14,
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  color: isSelected ? colors.primary : colors.text,
                  fontWeight: isSelected ? '600' : 'normal',
                  fontSize: 12,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
