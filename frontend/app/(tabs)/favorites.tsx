import { View, ScrollView, Text } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { CardData } from '../types/card';
import { fetchCards } from '../services/cardService';
import { getFavorites, toggleFavorite } from '../services/favoriteService';
import { Card } from '../components/Card';

const Favorites = () => {
  const [favoriteCards, setFavoriteCards] = useState<CardData[]>([]);

  const loadFavoriteCards = async () => {
    try {
      const allCards = await fetchCards(1, 100); // Fetch a large number of cards
      const favoriteIds = await getFavorites();
      const favorites = allCards.filter((card) =>
        favoriteIds.includes(card.id),
      );
      setFavoriteCards(
        favorites.map((card) => ({ ...card, isFavorite: true })),
      );
    } catch (error) {
      console.error('Error loading favorite cards:', error);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    await toggleFavorite(id);
    // Remove the card from favorites immediately
    setFavoriteCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoriteCards();
    }, []),
  );

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
        }}
      >
        {favoriteCards.length === 0 ? (
          <Text className="text-white text-xl mt-8">
            No favorite idioms yet
          </Text>
        ) : (
          favoriteCards.map((card) => (
            <Card
              key={card.id}
              item={card}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Favorites;
