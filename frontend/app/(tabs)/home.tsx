import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  Animated,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Card';
import { FilterBar } from '../components/FilterBar';
import { useFilteredCards, FilterKey } from '../hooks/useCards';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useCardActions } from '../hooks/useCardActions';
import { CardData } from '../types/card';

const Home = () => {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [searchSort, setSearchSort] = useState<
    'frequency' | 'imagery' | undefined
  >(undefined);
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
  });

  const { handleScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
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

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        searchSort={searchSort}
        onSearchSortChange={setSearchSort}
        onSearchFocus={handleFocus}
        onSearchClear={handleClear}
        searchBarScale={searchBarScale}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor={colors.text}
            colors={[colors.text]}
          />
        }
      >
        {cards.length === 0 && !isLoading
          ? renderNoResults()
          : cards.map((card: CardData) => (
              <Card
                key={card.id}
                item={card}
                onFavoritePress={toggleFavorite}
                onVotePress={handleVote}
              />
            ))}
        {isFetchingNextPage && renderLoadingIndicator()}
      </ScrollView>
    </View>
  );
};

export default Home;
