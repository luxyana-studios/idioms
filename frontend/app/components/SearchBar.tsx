import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchIdioms } from '../services/cardService';
import { CardData } from '../types/card';
import { Text } from 'react-native';

interface SearchBarProps {
  onSearch: (results: CardData[]) => void;
  onClear: () => void;
}

export const SearchBar = ({ onSearch, onClear }: SearchBarProps) => {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchAnimation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);
    return () => clearTimeout(handler);
  }, [input]);

  const performSearch = useCallback(async () => {
    if (debouncedInput) {
      setIsSearching(true);
      try {
        const results = await searchIdioms(debouncedInput);
        onSearch(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      onClear();
      setIsSearching(false);
    }
  }, [debouncedInput, onSearch, onClear]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleFocus = useCallback(() => {
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [searchAnimation]);

  const handleClear = useCallback(() => {
    setInput('');
    onClear();
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [onClear, searchAnimation]);

  const searchBarScale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <View className="px-6 pt-6 pb-3">
      <Animated.View
        style={{ transform: [{ scale: searchBarScale }] }}
        className="flex-row items-center rounded-2xl overflow-hidden border border-gray-100 bg-white/90 shadow-lg"
      >
        <View className="pl-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
        </View>

        <TextInput
          className="flex-1 py-4 px-3 text-lg font-medium text-gray-800"
          placeholder="Search idioms"
          value={input}
          onChangeText={setInput}
          onFocus={handleFocus}
          placeholderTextColor="#9CA3AF"
        />

        {input !== '' && (
          <TouchableOpacity onPress={handleClear} className="pr-5">
            <Ionicons name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {isSearching && (
        <View className="mt-2">
          <Text>Searching...</Text>
        </View>
      )}
    </View>
  );
};
