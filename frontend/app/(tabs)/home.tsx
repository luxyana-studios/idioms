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
import {
  fetchCards,
  updateIdiom,
  updateIdiomVote,
  CARDS_PER_PAGE,
} from '../services/cardService';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { useWelcome } from '../contexts/WelcomeContext';
import WelcomeScreen from '../components/WelcomeScreen';

const Home = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const SCROLL_PADDING = 20;
  const { colors } = useTheme();
  const { showWelcome, setShowWelcome } = useWelcome();

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
    loadCards(query);
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

  const toggleFavorite = async (cardId: string) => {
    const currentCard = cards.find((card) => card.id === cardId);
    if (!currentCard) return;

    const newFavoriteStatus = !currentCard.favorite;

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, favorite: newFavoriteStatus } : card,
      ),
    );

    try {
      await updateIdiom(cardId, newFavoriteStatus);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, favorite: !newFavoriteStatus } : card,
        ),
      );
    }
  };

  const handleVote = async (
    cardId: string,
    voteType: 'upvote' | 'downvote',
  ) => {
    const currentCard = cards.find((card) => card.id === cardId);
    if (!currentCard) return;

    try {
      const updatedCard = await updateIdiomVote(cardId, voteType);

      setCards((prevCards) =>
        prevCards.map((card) => (card.id === cardId ? updatedCard : card)),
      );
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );

  const renderNoResults = () => (
    <View className="py-10 px-4 items-center">
      <Text style={{ color: colors.textSecondary }} className="text-lg">
        No results found
      </Text>
      <Text style={{ color: colors.textSecondary }} className="mt-2">
        Try with different search terms
      </Text>
    </View>
  );

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <SearchBar onSearch={handleSearch} onClear={() => loadCards()} />

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
      >
        {cards.length === 0 && !isLoading
          ? renderNoResults()
          : cards.map((card) => (
              <Card
                key={card.id}
                item={card}
                onFavoritePress={toggleFavorite}
                onVotePress={handleVote}
              />
            ))}

        {isLoading && renderLoadingIndicator()}
      </ScrollView>
    </View>
  );
};

export default Home;
