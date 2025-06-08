import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { CardData } from '../types/card';
import { fetchCards, updateIdiom } from '../services/cardService';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from 'expo-router';

const Favorites = () => {
  const [favoriteCards, setFavoriteCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      let allCards: CardData[] = [];
      let page = 1;
      let hasMore = true;
      const limit = 50;
      while (hasMore) {
        const cardsPage = await fetchCards(page, limit);
        allCards = allCards.concat(cardsPage);
        if (cardsPage.length < limit) {
          hasMore = false;
        } else {
          page += 1;
        }
      }
      setFavoriteCards(allCards.filter((card) => card.favorite));
    } catch {
      setFavoriteCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  const toggleFavorite = async (cardId: string) => {
    const card = favoriteCards.find((c) => c.id === cardId);
    if (!card) return;
    const newFavorite = !card.favorite;
    setFavoriteCards((prev) => prev.filter((c) => c.id !== cardId));
    try {
      await updateIdiom(cardId, newFavorite);
    } catch {
      setFavoriteCards((prev) => [
        ...prev,
        { ...card, favorite: !newFavorite },
      ]);
    }
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.text}
          style={{ marginTop: 40 }}
        />
      ) : favoriteCards.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-blue-400 font-bold">
            No favorites yet
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {favoriteCards.map((card) => (
            <Card key={card.id} item={card} onFavoritePress={toggleFavorite} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Favorites;
