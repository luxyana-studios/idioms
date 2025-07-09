import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import CardList from '../components/CardList';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { SortButtons } from '../components/SortButtons';
import { CategoryChips } from '../components/CategoryChips';
import { useFilteredCards } from '../hooks/useCards';
import useCardActions from '../hooks/useCardActions';
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from '../components/SearchBar';

const SearchScreen = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  const [searchInput, setSearchInput] = useState(
    (params.query as string) || '',
  );
  const [debouncedInput, setDebouncedInput] = useState(
    (params.query as string) || '',
  );
  const [searchSort, setSearchSort] = useState<
    'frequency' | 'imagery' | undefined
  >((params.sort as 'frequency' | 'imagery') || undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    (params.category as string) || null,
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    // eslint-disable-next-line no-empty
    if (params.autoFocus === 'true') {
      // Intentionally left blank for future autofocus logic
    }
  }, [params.autoFocus]);

  useEffect(() => {
    const shouldShow = isSearchFocused || searchInput.length > 0;

    if (shouldShow !== showAdvancedOptions) {
      setShowAdvancedOptions(shouldShow);
    }
  }, [isSearchFocused, searchInput, showAdvancedOptions]);

  const {
    cards,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredCards({
    activeFilter: 'search',
    debouncedSearchInput: debouncedInput,
    searchSort,
    shuffleSeed: undefined,
    selectedCategory,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  const handleClear = () => {
    setSearchInput('');
    setSelectedCategory(null);
    setSearchSort(undefined);
    setIsSearchFocused(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleCategoryPress = useCallback(
    (category: string) => {
      setSelectedCategory((currentCategory) => {
        const newSelectedCategory =
          category === currentCategory ? null : category;
        return newSelectedCategory;
      });
      setIsSearchFocused(false);
    },
    [setSelectedCategory],
  );

  const handleSortPress = (sortType: 'frequency' | 'imagery') => {
    const newSearchSort = searchSort === sortType ? undefined : sortType;
    setSearchSort(newSearchSort);

    setIsSearchFocused(false);
  };

  const removeSort = () => {
    setSearchSort(undefined);
  };

  const removeCategory = () => {
    setSelectedCategory(null);
  };

  const getContentPadding = () => {
    let topPadding = 80;
    if (showAdvancedOptions) {
      topPadding += 50;
    } else if (searchSort || selectedCategory) {
      topPadding += 15;
    }
    return topPadding;
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View
        style={{ backgroundColor: colors.background }}
        className="absolute top-0 left-0 right-0 z-10 px-4 pt-0 pb-3"
      >
        <SearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          onFocus={handleSearchFocus}
          onClear={handleClear}
        />

        {!showAdvancedOptions && (searchSort || selectedCategory) && (
          <ActiveFilterChips
            searchSort={searchSort}
            selectedCategory={selectedCategory}
            onRemoveSort={removeSort}
            onRemoveCategory={removeCategory}
          />
        )}

        {!(searchSort || selectedCategory) && (
          <View>
            <SortButtons
              searchSort={searchSort}
              onSortPress={handleSortPress}
            />
            <View style={{ marginTop: -8 }}>
              <CategoryChips
                selectedCategory={selectedCategory}
                onCategoryPress={handleCategoryPress}
              />
            </View>
          </View>
        )}
      </View>

      <View style={{ paddingTop: getContentPadding() }} className="flex-1">
        <CardList
          cards={cards}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFavoritePress={toggleFavorite}
          onVotePress={handleVote}
          emptyText={error ? 'Error loading cards' : 'No cards found'}
          emptySubtext={
            error
              ? 'Pull to refresh or try again'
              : 'Try a different search term'
          }
        />
      </View>
    </View>
  );
};

export default SearchScreen;
