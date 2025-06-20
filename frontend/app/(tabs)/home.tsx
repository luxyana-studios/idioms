import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Card';
import { useFilteredCards, FilterKey } from '../hooks/useCards';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useCardActions } from '../hooks/useCardActions';
import { CardData } from '../types/card';

type FilterIcon = 'list' | 'star' | 'shuffle' | 'search';

const FILTERS: { key: FilterKey; label: string; icon: FilterIcon }[] = [
  { key: 'all', label: 'All', icon: 'list' },
  { key: 'favorites', label: 'Favorites', icon: 'star' },
  { key: 'random', label: 'Shuffle', icon: 'shuffle' },
  { key: 'search', label: 'Search', icon: 'search' },
];

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
      <View className="px-6 pt-6 pb-3">
        <View
          className="flex-row items-center justify-between"
          style={{ gap: 10 }}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={{
                backgroundColor:
                  activeFilter === f.key
                    ? colors.text
                    : colors.searchBackground,
                borderColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 70,
                minHeight: 44,
                paddingHorizontal: 16,
                marginHorizontal: 0,
              }}
              className="p-3 rounded-2xl border shadow-lg"
            >
              <Ionicons
                name={f.icon}
                size={20}
                color={activeFilter === f.key ? colors.background : colors.text}
                style={{ marginRight: activeFilter === f.key ? 8 : 0 }}
              />
              {activeFilter === f.key && (
                <Text
                  style={{
                    color: colors.background,
                    fontWeight: 'bold',
                  }}
                >
                  {f.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeFilter === 'search' && (
        <>
          <View className="px-6 pb-2">
            <Animated.View
              style={{
                transform: [{ scale: searchBarScale }],
                backgroundColor: colors.searchBackground,
                borderColor: colors.border,
              }}
              className="flex-row items-center rounded-2xl overflow-hidden border shadow-lg"
            >
              <View className="pl-4">
                <Ionicons
                  name="search"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <TextInput
                className="flex-1 py-4 px-3 text-lg font-medium"
                style={{ color: colors.text }}
                placeholder="Search idioms"
                value={searchInput}
                onChangeText={setSearchInput}
                onFocus={handleFocus}
                placeholderTextColor={colors.textSecondary}
              />
              {searchInput !== '' && (
                <TouchableOpacity onPress={handleClear} className="pr-5">
                  <Ionicons
                    name="close"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
          <View className="px-6 pb-2 flex-row space-x-3">
            <TouchableOpacity
              onPress={() =>
                setSearchSort(
                  searchSort === 'frequency' ? undefined : 'frequency',
                )
              }
              style={{
                backgroundColor:
                  searchSort === 'frequency'
                    ? colors.text
                    : colors.searchBackground,
                borderColor: colors.border,
                flex: 1,
              }}
              className="flex-row items-center justify-center p-3 rounded-2xl border shadow-lg"
            >
              <Ionicons
                name="trending-up"
                size={18}
                color={
                  searchSort === 'frequency' ? colors.background : colors.text
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color:
                    searchSort === 'frequency'
                      ? colors.background
                      : colors.text,
                  fontWeight: searchSort === 'frequency' ? 'bold' : 'normal',
                }}
              >
                Frequency
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setSearchSort(searchSort === 'imagery' ? undefined : 'imagery')
              }
              style={{
                backgroundColor:
                  searchSort === 'imagery'
                    ? colors.text
                    : colors.searchBackground,
                borderColor: colors.border,
                flex: 1,
              }}
              className="flex-row items-center justify-center p-3 rounded-2xl border shadow-lg"
            >
              <Ionicons
                name="image-outline"
                size={18}
                color={
                  searchSort === 'imagery' ? colors.background : colors.text
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color:
                    searchSort === 'imagery' ? colors.background : colors.text,
                  fontWeight: searchSort === 'imagery' ? 'bold' : 'normal',
                }}
              >
                Imagery
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
