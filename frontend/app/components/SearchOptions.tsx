import React from 'react';
import { View } from 'react-native';
import { SortButtons } from './SortButtons';
import { CategoryChips } from './CategoryChips';

interface SearchOptionsProps {
  searchSort?: 'frequency' | 'imagery';
  selectedCategory: string | null;
  onSortPress: (sortType: 'frequency' | 'imagery') => void;
  onCategoryPress: (category: string) => void;
}

export const SearchOptions: React.FC<SearchOptionsProps> = ({
  searchSort,
  selectedCategory,
  onSortPress,
  onCategoryPress,
}) => {
  return (
    <View>
      <SortButtons searchSort={searchSort} onSortPress={onSortPress} />
      <View style={{ marginTop: -8 }}>
        <CategoryChips
          selectedCategory={selectedCategory}
          onCategoryPress={onCategoryPress}
        />
      </View>
    </View>
  );
};
