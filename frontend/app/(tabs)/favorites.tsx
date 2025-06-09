import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { Card } from '../components/Card';
import { CardData } from '../types/card';
import { fetchFavoriteCards, updateIdiom } from '../services/cardService';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from 'expo-router';

const Favorites = () => {
  const [favoriteCards, setFavoriteCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { colors } = useTheme();
  const shouldRefresh = useRef(false);

  const loadFavorites = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && hasLoaded) return;

      setIsLoading(true);
      try {
        let allFavorites: CardData[] = [];
        let page = 1;
        let hasMore = true;
        const limit = 50;

        while (hasMore) {
          const favoritesPage = await fetchFavoriteCards(page, limit);
          allFavorites = allFavorites.concat(favoritesPage);

          if (favoritesPage.length < limit) {
            hasMore = false;
          } else {
            page += 1;
          }
        }

        setFavoriteCards(allFavorites);
        setHasLoaded(true);
      } catch {
        setFavoriteCards([]);
      } finally {
        setIsLoading(false);
      }
    },
    [hasLoaded],
  );

  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded || shouldRefresh.current) {
        loadFavorites(true);
        shouldRefresh.current = false;
      }
    }, [hasLoaded, loadFavorites]),
  );

  const toggleFavorite = async (cardId: string) => {
    const card = favoriteCards.find((c) => c.id === cardId);
    if (!card) return;

    setFavoriteCards((prev) => prev.filter((c) => c.id !== cardId));

    try {
      await updateIdiom(cardId, false);
      shouldRefresh.current = true;
    } catch {
      setFavoriteCards((prev) => [...prev, card]);
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
