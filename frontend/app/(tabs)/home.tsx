import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CardData } from '../types/card';
import { fetchCards, CARDS_PER_PAGE } from '../services/cardService';
import { Card } from '../components/Card';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const SCROLL_PADDING = 20;

  // Simple animation for search input
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const loadInitialCards = async () => {
    try {
      setIsLoading(true);
      const initialCards = await fetchCards(1, CARDS_PER_PAGE);
      setCards(initialCards);
      setFilteredCards(initialCards);
    } catch (error) {
      console.error('Error loading initial cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCards = useCallback(async () => {
    if (isLoading || searchText !== '') return;
    try {
      setIsLoading(true);
      const newCards = await fetchCards(page + 1, CARDS_PER_PAGE);
      const updatedCards = [...cards, ...newCards];
      setCards(updatedCards);
      setFilteredCards(updatedCards);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, cards, searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(
        (card) =>
          card.title.toLowerCase().includes(text.toLowerCase()) ||
          (card.content &&
            card.content.toLowerCase().includes(text.toLowerCase())),
      );
      setFilteredCards(filtered);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setFilteredCards(cards);
    // Animate search bar back to normal state
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = () => {
    // Animate search bar when focused
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
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
    loadInitialCards();
  }, []);

  // Animation styles
  const searchBarScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015],
  });

  return (
    <View className="flex-1 bg-primary">
      {/* Simple SearchBar */}
      <View className="px-6 pt-6 pb-3">
        <Animated.View
          style={{
            transform: [{ scale: searchBarScale }],
          }}
          className="flex-row items-center rounded-2xl overflow-hidden border border-gray-100 bg-white/90 shadow-lg"
        >
          <TextInput
            className="flex-1 py-4 px-6 text-lg font-medium text-gray-800"
            placeholder="Search idioms..."
            value={searchText}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            placeholderTextColor="#9CA3AF"
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={clearSearch} className="pr-5">
              <Text className="text-gray-400 text-xl">✕</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        keyboardShouldPersistTaps="handled"
      >
        {filteredCards.length === 0 && !isLoading ? (
          <View className="py-10 px-4 items-center">
            <Text className="text-gray-500 text-lg">No results found</Text>
          </View>
        ) : (
          filteredCards.map((card) => <Card key={card.id} item={card} />)
        )}

        {isLoading && (
          <View className="py-4">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
