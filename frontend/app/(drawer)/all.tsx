import { useState, useRef, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ViewToken,
  FlatList,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { useFilteredCards, FilterKey } from '../../src/hooks/useCards';
import useCardActions from '../../src/hooks/useCardActions';
import { CardData } from '../../src/types/card';
import { useTheme } from '../../src/contexts/ThemeContext';
import { CARD_DIMENSIONS } from '../../src/constants/cardConfig';

const ITEM_HEIGHT = CARD_DIMENSIONS.ITEM_HEIGHT;

const AllCardsScreen = () => {
  const { colors } = useTheme();
  const activeFilter: FilterKey = 'all';

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

  const {
    cards,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredCards({
    activeFilter,
    debouncedSearchInput: '',
    searchSort: undefined,
    shuffleSeed: undefined,
    selectedCategory: null,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

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
        {error ? 'Pull to refresh or try again' : 'No cards to display'}
      </Text>
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <FlatList
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={50}
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
        }}
        scrollEventThrottle={16}
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
        decelerationRate={0.85}
        snapToAlignment="start"
      />
    </View>
  );
};

export default AllCardsScreen;
