import {
  View,
  ActivityIndicator,
  Text,
  ViewToken,
  Animated,
  Dimensions,
} from 'react-native';
import { Card } from '../components/Card';
import FilterBar from '../components/FilterBar';
import { useFilteredCards, FilterKey } from '../hooks/useCards';
import useCardActions from '../hooks/useCardActions';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardData } from '../types/card';
import { useTheme } from '../contexts/ThemeContext';
import { FlatList } from 'react-native';

const Home = () => {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [searchSort, setSearchSort] = useState<
    'frequency' | 'imagery' | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [viewableIndices, setViewableIndices] = useState<Set<number>>(
    new Set(),
  );
  // stable viewability config and callback refs
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 25,
    minimumViewTime: 100,
  });
  const prevViewableRef = useRef<Set<number>>(new Set());
  const onViewableItemsChangedRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const newSet = new Set(viewableItems.map((v) => v.index ?? 0));
      // compare with previous to avoid redundant updates
      const prevSet = prevViewableRef.current;
      const isEqual =
        newSet.size === prevSet.size &&
        [...newSet].every((i) => prevSet.has(i));
      if (!isEqual) {
        prevViewableRef.current = newSet;
        setViewableIndices(newSet);
      }
    },
  );

  const [shuffleSeed, setShuffleSeed] = useState<number>(() =>
    Math.floor(Math.random() * 1000000),
  );

  const searchAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const {
    cards,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredCards({
    activeFilter,
    debouncedSearchInput: debouncedInput,
    searchSort,
    shuffleSeed,
    selectedCategory,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  const handleFocus = () => {
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const handleClear = () => {
    setSearchInput('');
    setSelectedCategory(null);
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const searchBarScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );
  const renderNoResults = () => (
    <View className="py-10 px-4 items-center">
      <Text style={{ color: colors.textSecondary }} className="text-lg">
        {error ? 'Error loading cards' : 'No cards found'}
      </Text>
      <Text style={{ color: colors.textSecondary }} className="mt-2">
        {error ? 'Pull to refresh or try again' : 'No cards to display'}
      </Text>
    </View>
  );

  // fixed item height for getItemLayout
  const ITEM_HEIGHT = Dimensions.get('window').height * 0.75 + 30; // card height + vertical margins
  const handleFilterChange = (filter: FilterKey) => {
    setActiveFilter(filter);

    if (filter !== 'search') {
      setSelectedCategory(null);
    }

    if (filter === 'random') {
      setShuffleSeed(Math.floor(Math.random() * 1000000));
    }
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        searchSort={searchSort}
        onSearchSortChange={setSearchSort}
        onSearchFocus={handleFocus}
        onSearchClear={handleClear}
        searchBarScale={searchBarScale}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />

      <FlatList
        // virtualization props
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        data={cards}
        keyExtractor={useCallback((item: CardData) => item.id, [])}
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
        scrollEventThrottle={16}
        renderItem={useCallback(
          ({ item, index }: { item: CardData; index: number }) => (
            <Card
              item={item}
              visible={viewableIndices.has(index)}
              onFavoritePress={toggleFavorite}
              onVotePress={handleVote}
            />
          ),
          [viewableIndices, toggleFavorite, handleVote],
        )}
        ListEmptyComponent={!isLoading ? renderNoResults : null}
        ListFooterComponent={isFetchingNextPage ? renderLoadingIndicator : null}
        onRefresh={refetch}
        refreshing={isLoading}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={0.85}
        snapToAlignment="start"
      />
    </View>
  );
};

export default Home;
