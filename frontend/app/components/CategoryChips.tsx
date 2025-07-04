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
    if (selectedCategory === category) {
      onCategoryPress('');
    } else {
      onCategoryPress(category);
    }
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
    <View className="px-6 pb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0,
          gap: 8,
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
                  ? colors.text
                  : colors.searchBackground,
                borderColor: colors.border,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                shadowColor: colors.text,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  color: isSelected ? colors.background : colors.text,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: 14,
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
