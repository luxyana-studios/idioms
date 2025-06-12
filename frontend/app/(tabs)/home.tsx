import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { useCards } from '../hooks/useCards';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useCardActions } from '../hooks/useCardActions';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const { colors } = useTheme();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useCards(debouncedSearchQuery || undefined);

  const cards = useMemo(() => {
    return data?.pages.flat() ?? [];
  }, [data]);

  const { handleScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );

  const renderNoResults = () => (
    <View className="py-10 px-4 items-center">
      <Text style={{ color: colors.textSecondary }} className="text-lg">
        {error ? 'Error loading cards' : 'No results found'}
      </Text>
      <Text style={{ color: colors.textSecondary }} className="mt-2">
        {error
          ? 'Pull to refresh or try again'
          : 'Try with different search terms'}
      </Text>
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <SearchBar onSearch={handleSearch} onClear={handleClear} />

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
          : cards.map((card) => (
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
