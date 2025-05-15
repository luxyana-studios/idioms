import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { CardData } from '../types/card';
import { fetchCards, CARDS_PER_PAGE } from '../services/cardService';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const SCROLL_PADDING = 20;

  const loadCards = async (search?: string) => {
    try {
      setIsLoading(true);
      const newCards = await fetchCards(1, CARDS_PER_PAGE, search);
      setCards(newCards);
      setPage(1);
      setSearchQuery(search || '');
    } catch (error) {
      console.error('Error loading initial cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCards = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newCards = await fetchCards(page + 1, CARDS_PER_PAGE, searchQuery);
      if (newCards.length === 0) {
        return;
      }
      setCards((prevCards) => [...prevCards, ...newCards]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, searchQuery]);

  const handleSearch = (query: string) => {
    if (query.length >= 2) {
      loadCards(query);
    } else if (query.length === 0) {
      loadCards();
    }
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - SCROLL_PADDING
      ) {
        loadMoreCards();
      }
    },
    [loadMoreCards],
  );

  useEffect(() => {
    loadCards();
  }, []);

  const toggleFavorite = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
  };

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  const renderNoResults = () => (
    <View className="py-10 px-4 items-center">
      <Text className="text-gray-500 text-lg">No results found</Text>
      <Text className="text-gray-400 mt-2">
        Try with different search terms
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <SearchBar onSearch={handleSearch} onClear={() => loadCards()} />

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
