import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
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
  const [sortByFrequency, setSortByFrequency] = useState(false);
  const [sortByImagery, setSortByImagery] = useState(false);

  // Determine which sort parameter to use
  const getSortParameter = () => {
    if (sortByFrequency) return '-frequency';
    if (sortByImagery) return '-imagery';
    return undefined;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useCards(undefined, getSortParameter());

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
        {error ? 'Error loading shuffled cards' : 'No shuffled cards found'}
      </Text>
      <Text style={{ color: colors.textSecondary }} className="mt-2">
        {error ? 'Pull to refresh or try again' : 'No cards to display'}
      </Text>
    </View>
  );

  const handleTrendPress = () => {
    setSortByFrequency((prev) => !prev);
    if (sortByImagery) setSortByImagery(false); // Disable imagery when enabling frequency
  };

  const handleImageryPress = () => {
    setSortByImagery((prev) => !prev);
    if (sortByFrequency) setSortByFrequency(false); // Disable frequency when enabling imagery
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="px-6 pt-6 pb-3">
        <View className="flex-row items-center space-x-3">
          <View className="flex-1">
            <SearchBar
              onSearch={() => {}}
              onClear={() => {}}
              onFocus={handleSearchBarFocus}
            />
          </View>

          {/* Trend Arrow Button */}
          <TouchableOpacity
            style={{
              backgroundColor: sortByFrequency
                ? colors.text
                : colors.searchBackground,
              borderColor: colors.border,
            }}
            className="p-4 rounded-2xl border shadow-lg"
            onPress={handleTrendPress}
          >
            <Ionicons
              name="trending-up"
              size={20}
              color={sortByFrequency ? colors.background : colors.text}
            />
          </TouchableOpacity>

          {/* Theater Mask Button */}
          <TouchableOpacity
            style={{
              backgroundColor: sortByImagery
                ? colors.text
                : colors.searchBackground,
              borderColor: colors.border,
            }}
            className="p-4 rounded-2xl border shadow-lg"
            onPress={handleImageryPress}
          >
            <Ionicons
              name="happy"
              size={20}
              color={sortByImagery ? colors.background : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

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
