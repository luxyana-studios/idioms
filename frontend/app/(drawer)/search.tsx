import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Animated, Dimensions, Platform } from 'react-native';
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
  const headerAnim = useRef(new Animated.Value(1)).current;
  const focusLockRef = useRef(false);
  const [optionsRendered, setOptionsRendered] = useState(true);
  const [searchBarHeight, setSearchBarHeight] = useState<number>(64);
  const [optionsHeight, setOptionsHeight] = useState<number>(0);

  const computePadding = () => {
    if (showHeader) {
      return Math.round(searchBarHeight + optionsHeight + 12);
    }
    return Math.round(searchBarHeight + 8);
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

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
    focusLockRef.current = true;
    setTimeout(() => (focusLockRef.current = false), 350);

    if (!showHeader) {
      setOptionsRendered(true);
      setShowHeader(true);
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    if (!showHeader) {
      setOptionsRendered(true);
      setShowHeader(true);
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
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

  const handleScroll = useCallback(
    (event: any) => {
      if (isSearchFocused || focusLockRef.current) return;

      const y = event.nativeEvent.contentOffset.y;
      if (y > SCROLL_HEADER_HIDE_THRESHOLD) {
        if (showHeader) {
          Animated.timing(headerAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: Platform.OS !== 'web',
          }).start(() => {
            setShowHeader(false);
            setOptionsRendered(false);
          });
        }
      } else {
        if (!showHeader) {
          setOptionsRendered(true);
          setShowHeader(true);
          Animated.timing(headerAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        }
      }
    },
    [showHeader, headerAnim, isSearchFocused],
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View
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
        }}
      >
        <View onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}>
          <SearchBar
            value={searchInput}
            onChangeText={setSearchInput}
            onFocus={handleSearchFocus}
            onClear={handleClear}
            onBlur={handleSearchBlur}
          />
        </View>

        {optionsRendered && (
          <Animated.View
            onLayout={(e) => setOptionsHeight(e.nativeEvent.layout.height)}
            style={{
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 0],
                  }),
                },
              ],
              marginTop: 8,
            }}
          >
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
        )}
      </View>

      <View style={{ flex: 1 }}>
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
          contentTopPadding={computePadding()}
        />
      </View>
    </View>
  );
};

export default SearchScreen;
