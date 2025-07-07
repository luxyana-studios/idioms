import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ViewToken,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { CategoryChips } from '../components/CategoryChips';
import { useFilteredCards } from '../hooks/useCards';
import useCardActions from '../hooks/useCardActions';
import { CardData } from '../types/card';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';

const SearchScreen = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  const [searchInput, setSearchInput] = useState(
    (params.query as string) || '',
  );
  const [debouncedInput, setDebouncedInput] = useState(
    (params.query as string) || '',
  );
  const [searchSort, setSearchSort] = useState<
    'frequency' | 'imagery' | undefined
  >((params.sort as 'frequency' | 'imagery') || undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    (params.category as string) || null,
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

  const [viewableIndices, setViewableIndices] = useState<Set<number>>(
    new Set(),
  );

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 25,
    minimumViewTime: 100,
  });

  const prevViewableRef = useRef<Set<number>>(new Set());
  const onViewableItemsChangedRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const newSet = new Set(viewableItems.map((v) => v.index ?? 0));
      const prevSet = prevViewableRef.current;
      const isEqual =
        newSet.size === prevSet.size &&
        [...newSet].every((i) => prevSet.has(i));
      if (!isEqual) {
        prevViewableRef.current = newSet;
        setViewableIndices(newSet);
      }
    },
  );

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    if (params.autoFocus === 'true') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [params.autoFocus]);

  useEffect(() => {
    const shouldShow = isSearchFocused || searchInput.length > 0;

    if (shouldShow !== showAdvancedOptions) {
      setShowAdvancedOptions(shouldShow);
    }
  }, [isSearchFocused, searchInput, showAdvancedOptions]);

  const {
    cards,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredCards({
    activeFilter: 'search',
    debouncedSearchInput: debouncedInput,
    searchSort,
    shuffleSeed: undefined,
    selectedCategory,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  const handleClear = () => {
    setSearchInput('');
    setSelectedCategory(null);
    setSearchSort(undefined);
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleCategoryPress = useCallback(
    (category: string) => {
      setSelectedCategory((currentCategory) => {
        const newSelectedCategory =
          category === currentCategory ? null : category;
        return newSelectedCategory;
      });
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    },
    [setSelectedCategory],
  );

  const handleSortPress = (sortType: 'frequency' | 'imagery') => {
    const newSearchSort = searchSort === sortType ? undefined : sortType;
    setSearchSort(newSearchSort);

    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const removeSort = () => {
    setSearchSort(undefined);
  };

  const removeCategory = () => {
    setSelectedCategory(null);
  };

  const renderLoadingIndicator = () => (
    <View className="py-4">
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );

  const renderNoResults = () => (
    <View className="py-10 px-4 items-center">
      <Text style={{ color: colors.textSecondary }} className="text-lg">
        {error ? 'Error loading cards' : 'No cards found'}
      </Text>
      <Text style={{ color: colors.textSecondary }} className="mt-2">
        {error ? 'Pull to refresh or try again' : 'Try a different search term'}
      </Text>
    </View>
  );

  const ITEM_HEIGHT = Dimensions.get('window').height * 0.75 + 30;

  const getContentPadding = () => {
    let topPadding = 80;
    if (showAdvancedOptions) {
      topPadding += 140;
    } else if (searchSort || selectedCategory) {
      topPadding += 50;
    }
    return topPadding;
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <View
        style={{ backgroundColor: colors.background }}
        className="absolute top-0 left-0 right-0 z-10 px-4 pt-4 pb-3"
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          className="flex-row items-center px-4 py-3 rounded-full mb-4"
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            ref={searchInputRef}
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search idioms..."
            placeholderTextColor={colors.textSecondary}
            style={{ color: colors.text }}
            className="flex-1 ml-3 text-base"
            returnKeyType="search"
            onFocus={handleSearchFocus}
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="ml-3">
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {!showAdvancedOptions && (searchSort || selectedCategory) && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {searchSort && (
              <View
                style={{
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary,
                }}
                className="flex-row items-center px-3 py-2 rounded-full border"
              >
                <Text
                  style={{ color: colors.primary }}
                  className="text-sm font-medium mr-2"
                >
                  {searchSort === 'frequency' ? 'By Frequency' : 'By Imagery'}
                </Text>
                <TouchableOpacity onPress={removeSort}>
                  <Ionicons name="close" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            {selectedCategory && (
              <View
                style={{
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary,
                }}
                className="flex-row items-center px-3 py-2 rounded-full border"
              >
                <Text
                  style={{ color: colors.primary }}
                  className="text-sm font-medium mr-2 capitalize"
                >
                  {selectedCategory}
                </Text>
                <TouchableOpacity onPress={removeCategory}>
                  <Ionicons name="close" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {!(searchSort || selectedCategory) && (
          <View>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                onPress={() => handleSortPress('frequency')}
                className="flex-1 py-3 px-4 rounded-full border"
                style={{
                  backgroundColor:
                    searchSort === 'frequency'
                      ? colors.primary + '20'
                      : colors.surface,
                  borderColor:
                    searchSort === 'frequency' ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    color:
                      searchSort === 'frequency' ? colors.primary : colors.text,
                  }}
                  className="text-center font-medium text-base"
                >
                  Sort by Frequency
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSortPress('imagery')}
                className="flex-1 py-3 px-4 rounded-full border"
                style={{
                  backgroundColor:
                    searchSort === 'imagery'
                      ? colors.primary + '20'
                      : colors.surface,
                  borderColor:
                    searchSort === 'imagery' ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    color:
                      searchSort === 'imagery' ? colors.primary : colors.text,
                  }}
                  className="text-center font-medium text-base"
                >
                  Sort by Imagery
                </Text>
              </TouchableOpacity>
            </View>

            <CategoryChips
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
            />
          </View>
        )}
      </View>

      <FlatList
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        data={cards}
        keyExtractor={useCallback((item: CardData) => item.id, [])}
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 16,
          paddingTop: getContentPadding(),
        }}
        renderItem={useCallback(
          ({ item, index }: { item: CardData; index: number }) => (
            <Card
              item={item}
              visible={viewableIndices.has(index)}
              onFavoritePress={toggleFavorite}
              onVotePress={handleVote}
            />
          ),
          [viewableIndices, toggleFavorite, handleVote],
        )}
        ListEmptyComponent={!isLoading ? renderNoResults : null}
        ListFooterComponent={isFetchingNextPage ? renderLoadingIndicator : null}
        onRefresh={refetch}
        refreshing={isLoading}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        snapToAlignment="center"
        disableIntervalMomentum={true}
      />
    </View>
  );
};

export default SearchScreen;
