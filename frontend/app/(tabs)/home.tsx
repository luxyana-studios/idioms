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
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { CardData } from '../types/card';
import { fetchCards, CARDS_PER_PAGE } from '../services/cardService';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const SCROLL_PADDING = 20;

  const searchAnimation = useRef(new Animated.Value(0)).current;
  const searchTimeout = useRef<NodeJS.Timeout>();

  const filteredCards = useMemo(() => cards, [cards]);

  const loadInitialCards = async (search?: string) => {
    try {
      setIsLoading(true);
      const initialCards = await fetchCards(1, CARDS_PER_PAGE, search);
      setCards(initialCards);
      setPage(1);
    } catch (error) {
      console.error('Error loading initial cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreCards = useCallback(async () => {
    if (isLoading || searchText.trim() !== '') return;

    try {
      setIsLoading(true);
      const newCards = await fetchCards(page + 1, CARDS_PER_PAGE);
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
  }, [page, isLoading, searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        loadInitialCards(text);
      } else if (text.trim() === '') {
        loadInitialCards();
      }
    }, 500);
  };

  const handleSearchSubmit = () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchText.trim().length >= 2) {
      loadInitialCards(searchText);
    } else if (searchText.trim() === '') {
      loadInitialCards();
    }
  };

  const clearSearch = () => {
    setSearchText('');
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    loadInitialCards();
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = () => {
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
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

  const searchBarScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const toggleFavorite = (cardId: number) => {
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
      {searchText !== '' && (
        <Text className="text-gray-400 mt-2">
          Try with different search terms
        </Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <View className="px-6 pt-6 pb-3">
        <Animated.View
          style={{
            transform: [{ scale: searchBarScale }],
          }}
          className="flex-row items-center rounded-2xl overflow-hidden border border-gray-100 bg-white/90 shadow-lg"
        >
          <View className="pl-4">
            <Ionicons name="search" size={20} color="#9CA3AF" />
          </View>

          <TextInput
            className="flex-1 py-4 px-3 text-lg font-medium text-gray-800"
            placeholder="Search idioms"
            value={searchText}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onSubmitEditing={handleSearchSubmit}
            placeholderTextColor="#9CA3AF"
          />

          {searchText !== '' && (
            <TouchableOpacity onPress={clearSearch} className="pr-5">
              <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

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
        {filteredCards.length === 0 && !isLoading
          ? renderNoResults()
          : filteredCards.map((card) => (
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
