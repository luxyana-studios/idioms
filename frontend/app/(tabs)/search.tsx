import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useCards } from '../hooks/useCards';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useCardActions } from '../hooks/useCardActions';
import { CardData } from '../types/card';
import { useLocalSearchParams } from 'expo-router';

const Search = () => {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const searchAnimation = React.useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const searchInputRef = React.useRef<TextInput>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);
    return () => clearTimeout(handler);
  }, [input]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useCards(debouncedInput || undefined);

  const cards = useMemo(() => {
    return data?.pages.flat() ?? [];
  }, [data]);

  const { handleScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  const handleFocus = () => {
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleClear = () => {
    setInput('');
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const searchBarScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );

  const renderNoResults = () => (
    <View className="py-10 px-4 items-center">
      <Text style={{ color: colors.textSecondary }} className="text-lg">
        {error ? 'Error loading cards' : 'No results found'}
      </Text>
      <Text style={{ color: colors.textSecondary }} className="mt-2">
        {error
          ? 'Pull to refresh or try again'
          : 'Try with different search terms'}
      </Text>
    </View>
  );

  useEffect(() => {
    if (params.autoFocus === 'true' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [params]);

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="px-6 pt-6 pb-3">
        <Animated.View
          style={{
            transform: [{ scale: searchBarScale }],
            backgroundColor: colors.searchBackground,
            borderColor: colors.border,
          }}
          className="flex-row items-center rounded-2xl overflow-hidden border shadow-lg"
        >
          <View className="pl-4">
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          </View>
          <TextInput
            ref={searchInputRef}
            className="flex-1 py-4 px-3 text-lg font-medium"
            style={{ color: colors.text }}
            placeholder="Search idioms"
            value={input}
            onChangeText={setInput}
            onFocus={handleFocus}
            placeholderTextColor={colors.textSecondary}
          />
          {input !== '' && (
            <TouchableOpacity onPress={handleClear} className="pr-5">
              <Ionicons name="close" size={20} color={colors.textSecondary} />
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
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor={colors.text}
            colors={[colors.text]}
          />
        }
      >
        {cards.length === 0 && !isLoading
          ? renderNoResults()
          : cards.map((card: CardData) => (
              <Card
                key={card.id}
                item={card}
                onFavoritePress={toggleFavorite}
                onVotePress={handleVote}
              />
            ))}
        {isFetchingNextPage && renderLoadingIndicator()}
      </ScrollView>
    </View>
  );
};

export default Search;
