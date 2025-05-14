import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CardData } from '../types/card';
import { fetchCards, CARDS_PER_PAGE } from '../services/cardService';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const isInitialLoad = useRef(true);
  const SCROLL_PADDING = 20;

  const loadInitialCards = useCallback(
    async (search?: string) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const initialCards = await fetchCards(1, CARDS_PER_PAGE, search);
        setCards(
          Array.from(
            new Map(initialCards.map((card) => [card.id, card])).values(),
          ),
        );
        setPage(1);
      } catch (error) {
        console.error('Error loading cards:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const loadMore = useCallback(async () => {
    if (isLoading || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const newCards = await fetchCards(page + 1, CARDS_PER_PAGE);
      if (newCards.length > 0) {
        setCards((prevCards) => {
          const combined = [...prevCards, ...newCards];
          return Array.from(
            new Map(combined.map((card) => [card.id, card])).values(),
          );
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more cards:', error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, isLoading, isFetchingMore]);

  const handleSearch = useCallback((results: CardData[]) => {
    setCards(results);
    setPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    loadInitialCards();
  }, [loadInitialCards]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isAtBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - SCROLL_PADDING;
      if (isAtBottom) {
        loadMore();
      }
    },
    [loadMore, SCROLL_PADDING],
  );

  const toggleFavorite = useCallback((cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
  }, []);

  const renderLoadingIndicator = useCallback(
    () => (
      <View className="py-4">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ),
    [],
  );

  const renderNoResults = useCallback(
    () => (
      <View className="py-10 px-4 items-center">
        <Text className="text-gray-500 text-lg">No results found</Text>
        <Text className="text-gray-400 mt-2">
          Try with different search terms
        </Text>
      </View>
    ),
    [],
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      loadInitialCards();
      isInitialLoad.current = false;
    }
  }, [loadInitialCards]);

  return (
    <View className="flex-1 bg-primary">
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {cards.length === 0 && !isLoading
          ? renderNoResults()
          : cards.map((card) => (
              <Card
                key={card.id}
                item={card}
                onFavoritePress={toggleFavorite}
              />
            ))}

        {isLoading && renderLoadingIndicator()}
      </ScrollView>
    </View>
  );
};

export default Index;
