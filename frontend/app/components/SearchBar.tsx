import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const SearchBar = ({ onSearch, onClear }: SearchBarProps) => {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const searchAnimation = React.useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  useEffect(() => {
    if (debouncedInput) {
      onSearch(debouncedInput);
    }
  }, [debouncedInput, onSearch]);

  const handleFocus = () => {
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleClear = () => {
    setInput('');
    onClear();
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

  return (
    <View className="px-6 pt-6 pb-3">
      <View className="flex-row items-center space-x-4">
        <Animated.View
          style={{
            transform: [{ scale: searchBarScale }],
            backgroundColor: colors.searchBackground,
            borderColor: colors.border,
          }}
          className="flex-1 flex-row items-center rounded-2xl overflow-hidden border shadow-lg"
        >
          <View className="pl-4">
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          </View>

          <TextInput
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

        <View style={{ marginLeft: 8 }}>
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
};
