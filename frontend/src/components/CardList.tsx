import React, { useRef, useState, useCallback, forwardRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ViewToken,
  FlatList,
  Pressable,
} from 'react-native';
import Card from './Card';
import { CardData } from '../types/card';
import { useTheme } from '../contexts/ThemeContext';
import { CARD_DIMENSIONS } from '../constants/cardConfig';
import { useDailyNotification } from '../hooks/useDailyNotification';

interface CardListProps {
  cards: CardData[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFavoritePress: (id: string) => void;
  onVotePress: (id: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  emptyText: string;
  emptySubtext: string;
}

const ITEM_HEIGHT = CARD_DIMENSIONS.ITEM_HEIGHT;

/**
 * CardList component uses forwardRef to expose the underlying FlatList methods to parent components.
 * This allows parent components to call methods like scrollToIndex directly on the FlatList.
 *
 * @type {FlatList<CardData>} - The ref type is specifically a FlatList of CardData items
 * @param {CardListProps} props - Component props including cards data and callback functions
 * @param {React.Ref<FlatList<CardData>>} ref - Reference to the FlatList component
 */
const CardList = forwardRef<FlatList<CardData>, CardListProps>(
  (
    {
      cards,
      isLoading,
      error,
      refetch,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      onFavoritePress,
      onVotePress,
      emptyText,
      emptySubtext,
    },
    ref,
  ) => {
    const { colors } = useTheme();
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

    const renderLoadingIndicator = () => (
      <View className="py-4">
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );

    const renderNoResults = () => (
      <View className="py-10 px-4 items-center">
        <Text style={{ color: colors.textSecondary }} className="text-lg">
          {emptyText}
        </Text>
        <Text style={{ color: colors.textSecondary }} className="mt-2">
          {emptySubtext}
        </Text>
      </View>
    );

    const { sendTestNotification } = useDailyNotification();

    const TestNotificationHeader = () => (
      <View className="w-full px-2 mb-3">
        <Pressable
          onPress={sendTestNotification}
          className="w-full items-center justify-center rounded-lg"
          style={{ backgroundColor: colors.primary, paddingVertical: 12 }}
        >
          <Text style={{ color: colors.text, fontWeight: '600' }}>
            Probar notificación
          </Text>
        </Pressable>
      </View>
    );

    return (
      <View style={{ backgroundColor: colors.background }} className="flex-1">
        <FlatList
          ref={ref}
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
          ListHeaderComponent={<TestNotificationHeader />}
          scrollEventThrottle={16}
          renderItem={useCallback(
            ({ item, index }: { item: CardData; index: number }) => (
              <Card
                item={item}
                visible={viewableIndices.has(index)}
                onFavoritePress={() => onFavoritePress(item.id)}
                onVotePress={(voteType) =>
                  onVotePress(item.id, voteType as 'upvote' | 'downvote')
                }
              />
            ),
            [viewableIndices, onFavoritePress, onVotePress],
          )}
          ListEmptyComponent={!isLoading ? renderNoResults : null}
          ListFooterComponent={
            isFetchingNextPage ? renderLoadingIndicator : null
          }
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
  },
);

CardList.displayName = 'CardList';
export default CardList;
