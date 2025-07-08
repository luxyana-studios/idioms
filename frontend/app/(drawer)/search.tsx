import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardList from '../components/CardList';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { SearchOptions } from '../components/SearchOptions';
import { useFilteredCards } from '../hooks/useCards';
import useCardActions from '../hooks/useCardActions';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';

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

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    if (params.autoFocus === 'true') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
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
    searchInputRef.current?.blur();
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
      searchInputRef.current?.blur();
    },
    [setSelectedCategory],
  );

  const handleSortPress = (sortType: 'frequency' | 'imagery') => {
    const newSearchSort = searchSort === sortType ? undefined : sortType;
    setSearchSort(newSearchSort);

    setIsSearchFocused(false);
    searchInputRef.current?.blur();
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
      topPadding += 140;
    } else if (searchSort || selectedCategory) {
      topPadding += 50;
    }
    return topPadding;
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View
        style={{ backgroundColor: colors.background }}
        className="absolute top-0 left-0 right-0 z-10 px-4 pt-0 pb-3"
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          className="flex-row items-center px-4 py-3 rounded-full mb-4"
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            ref={searchInputRef}
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search idioms..."
            placeholderTextColor={colors.textSecondary}
            style={{ color: colors.text }}
            className="flex-1 ml-3 text-base"
            returnKeyType="search"
            onFocus={handleSearchFocus}
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="ml-3">
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {!showAdvancedOptions && (searchSort || selectedCategory) && (
          <ActiveFilterChips
            searchSort={searchSort}
            selectedCategory={selectedCategory}
            onRemoveSort={removeSort}
            onRemoveCategory={removeCategory}
          />
        )}

        {!(searchSort || selectedCategory) && (
          <SearchOptions
            searchSort={searchSort}
            selectedCategory={selectedCategory}
            onSortPress={handleSortPress}
            onCategoryPress={handleCategoryPress}
          />
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
