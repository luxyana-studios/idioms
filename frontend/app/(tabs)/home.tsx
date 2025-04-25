import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { toggleFavorite, getFavorites } from '../services/favoriteService';
import { CardData } from '../types/card';
import { fetchCards, CARDS_PER_PAGE } from '../services/cardService';
import { Card } from '../components/Card';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const SCROLL_PADDING = 20;

  const handleToggleFavorite = async (id: number) => {
    await toggleFavorite(id);
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
  };

  const updateFavoriteStatus = async () => {
    const favorites = await getFavorites();
    setCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        isFavorite: favorites.includes(card.id),
      })),
    );
  };

  const loadInitialCards = async () => {
    try {
      setIsLoading(true);
      const initialCards = await fetchCards(1, CARDS_PER_PAGE);
      setCards(initialCards);
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
      const newCards = await fetchCards(page + 1, CARDS_PER_PAGE);
      setCards((prev) => [...prev, ...newCards]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more cards:', error);
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
      if (cards.length === 0) {
        loadInitialCards();
      } else {
        updateFavoriteStatus();
      }
    }, [cards.length]),
  );

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            item={card}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Index;
