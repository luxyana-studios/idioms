import { useRef, useState, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ViewToken,
  Dimensions,
  FlatList,
} from 'react-native';
import Card from './Card';
import { CardData } from '../types/card';
import { useTheme } from '../contexts/ThemeContext';

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

const CardList: React.FC<CardListProps> = ({
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
}) => {
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

  const ITEM_HEIGHT = Dimensions.get('window').height * 0.75 + 30;

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
              onFavoritePress={() => onFavoritePress(item.id)}
              onVotePress={(voteType) =>
                onVotePress(item.id, voteType as 'upvote' | 'downvote')
              }
            />
          ),
          [viewableIndices, onFavoritePress, onVotePress],
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

CardList.displayName = 'CardList';

export default CardList;
