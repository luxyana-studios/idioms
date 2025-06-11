import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { Card } from '../components/Card';
import { CardData } from '../types/card';
import {
  fetchFavoriteCards,
  updateIdiom,
  CARDS_PER_PAGE,
} from '../services/cardService';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from 'expo-router';

const Favorites = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const SCROLL_PADDING = 20;
  const { colors } = useTheme();

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const newCards = await fetchFavoriteCards(1, CARDS_PER_PAGE);
      setCards(newCards);
      setPage(1);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading favorite cards:', error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCards = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newCards = await fetchFavoriteCards(page + 1, CARDS_PER_PAGE);
      if (newCards.length === 0) {
        return;
      }
      setCards((prevCards) => [...prevCards, ...newCards]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more favorite cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

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

  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded) {
        loadCards();
      }
    }, [hasLoaded]),
  );

  const toggleFavorite = async (cardId: string) => {
    const currentCard = cards.find((card) => card.id === cardId);
    if (!currentCard) return;

    const newFavoriteStatus = !currentCard.favorite;

    if (!newFavoriteStatus) {
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } else {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, favorite: newFavoriteStatus } : card,
        ),
      );
    }

    try {
      await updateIdiom(cardId, newFavoriteStatus);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      if (!newFavoriteStatus) {
        setCards((prevCards) => [...prevCards, currentCard]);
      } else {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId
              ? { ...card, favorite: !newFavoriteStatus }
              : card,
          ),
        );
      }
    }
  };

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );

  const renderNoFavorites = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl text-blue-400 font-bold">No favorites yet</Text>
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {cards.length === 0 && !isLoading
          ? renderNoFavorites()
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

export default Favorites;
