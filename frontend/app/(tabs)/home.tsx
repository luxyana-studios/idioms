import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Card } from '../components/Card';
import { useCards } from '../hooks/useCards';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useCardActions } from '../hooks/useCardActions';
import { CardData } from '../types/card';

const Home = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useCards();

  const cards = React.useMemo(() => {
    return data?.pages.flat() ?? [];
  }, [data]);

  const { handleScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  const handleSearchBarFocus = () => {
    router.push({ pathname: '/(tabs)/search', params: { autoFocus: 'true' } });
  };

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
      <SearchBar
        onSearch={() => {}}
        onClear={() => {}}
        onFocus={handleSearchBarFocus}
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
