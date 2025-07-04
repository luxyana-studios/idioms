import {
  View,
  ActivityIndicator,
  Text,
  ViewToken,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
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

  const [viewableIndices, setViewableIndices] = useState<Set<number>>(
    new Set(),
  );
  // track scroll velocity
  const scrollOffset = useRef(0);
  const scrollTime = useRef(Date.now());
  const [scrollDown, setScrollDown] = useState(false);
  // stable viewability config and callback refs
  const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 5 });
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
  const ITEM_HEIGHT = Dimensions.get('window').height * 0.75 + 32; // card height + vertical margins
  const handleFilterChange = (filter: FilterKey) => {
    setActiveFilter(filter);

    if (filter === 'random') {
      setShuffleSeed(Math.floor(Math.random() * 1000000));
    }
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
      />

      <FlatList
        // virtualization props
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        data={cards}
        keyExtractor={(item: CardData) => item.id}
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
        // measure scroll speed
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const now = Date.now();
          const y = e.nativeEvent.contentOffset.y;
          const dy = y - scrollOffset.current;
          setScrollDown(dy > 0);
          scrollOffset.current = y;
          scrollTime.current = now;
        }}
        scrollEventThrottle={16}
        renderItem={useCallback(
          ({ item, index }: { item: CardData; index: number }) => (
            <Card
              item={item}
              index={index}
              visible={viewableIndices.has(index)}
              scrollDown={scrollDown}
              onFavoritePress={toggleFavorite}
              onVotePress={handleVote}
            />
          ),
          [viewableIndices, scrollDown, toggleFavorite, handleVote],
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
      />
    </View>
  );
};

export default Home;
