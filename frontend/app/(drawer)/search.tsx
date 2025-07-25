import React, { useState, useEffect, useCallback } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CardList from '../../src/components/CardList';
import { ActiveFilterChips } from '../../src/components/ActiveFilterChips';
import { SortButtons } from '../../src/components/SortButtons';
import { CategoryChips } from '../../src/components/CategoryChips';
import { useFilteredCards } from '../../src/hooks/useCards';
import useCardActions from '../../src/hooks/useCardActions';
import { useTheme } from '../../src/contexts/ThemeContext';
import SearchBar from '../../src/components/SearchBar';

const SearchScreen = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const SCROLL_HEADER_HIDE_THRESHOLD = Dimensions.get('window').height * 0.025;

  const [searchInput, setSearchInput] = useState(
    (params.query as string) || '',
  );
  const [debouncedInput, setDebouncedInput] = useState(
    (params.query as string) || '',
  );
  const [searchSort, setSearchSort] = useState<
    'frequency' | 'imagery' | undefined
  >((params.sort as 'frequency' | 'imagery') || undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.category ? [params.category as string] : [],
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const headerAnim = React.useRef(new Animated.Value(1)).current;

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
    selectedCategory:
      selectedCategories.length > 0 ? selectedCategories.join(',') : null,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  const handleClear = () => {
    setSearchInput('');
    setSelectedCategories([]);
    setSearchSort(undefined);
    setIsSearchFocused(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategories((currentCategories) => {
      if (currentCategories.includes(category)) {
        return currentCategories.filter((cat) => cat !== category);
      } else {
        return [...currentCategories, category];
      }
    });
    setIsSearchFocused(false);
  }, []);

  const handleSortPress = (sortType: 'frequency' | 'imagery') => {
    const newSearchSort = searchSort === sortType ? undefined : sortType;
    setSearchSort(newSearchSort);

    setIsSearchFocused(false);
  };

  const removeSort = () => {
    setSearchSort(undefined);
  };

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  const getContentPadding = () => {
    let topPadding = 80;
    if (showAdvancedOptions) {
      topPadding += 50;
    } else if (searchSort || selectedCategories.length > 0) {
      topPadding += 15;
    }
    return topPadding;
  };

  const handleScroll = useCallback(
    (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      if (y > SCROLL_HEADER_HIDE_THRESHOLD) {
        if (showHeader) {
          setShowHeader(false);
          Animated.timing(headerAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      } else {
        if (!showHeader) {
          setShowHeader(true);
          Animated.timing(headerAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      }
    },
    [showHeader, headerAnim],
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <Animated.View
        style={{
          backgroundColor: colors.background,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 0,
          paddingBottom: 12,
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-80, 0],
              }),
            },
          ],
        }}
      >
        <SearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          onFocus={handleSearchFocus}
          onClear={handleClear}
        />

        {!showAdvancedOptions &&
          (searchSort || selectedCategories.length > 0) && (
            <ActiveFilterChips
              searchSort={searchSort}
              selectedCategories={selectedCategories}
              onRemoveSort={removeSort}
              onRemoveCategory={removeCategory}
            />
          )}

        {!showAdvancedOptions && (
          <View>
            <SortButtons
              searchSort={searchSort}
              onSortPress={handleSortPress}
            />
            <View style={{ marginTop: -8 }}>
              <CategoryChips
                selectedCategories={selectedCategories}
                onCategoryPress={handleCategoryPress}
              />
            </View>
          </View>
        )}
      </Animated.View>

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
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
};

export default SearchScreen;
