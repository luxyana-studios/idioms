import React, { useState, useCallback, useRef, useEffect } from 'react';
import CardList from '../../src/components/CardList';
import { useFilteredCards, FilterKey } from '../../src/hooks/useCards';
import useCardActions from '../../src/hooks/useCardActions';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

const ShuffleScreen = () => {
  const activeFilter: FilterKey = 'random';
  const params = useLocalSearchParams();
  const idiomId = params.idiomId as string | undefined;

  const [shuffleSeed, setShuffleSeed] = useState<number>(() =>
    Math.floor(Math.random() * 1000000),
  );

  const cardListRef = useRef<any>(null);
  const hasScrolledToIdiom = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setShuffleSeed(Math.floor(Math.random() * 1000000));
      hasScrolledToIdiom.current = false;
    }, []),
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
    shuffleSeed,
    selectedCategory: null,
  });

  const { toggleFavorite, handleVote } = useCardActions({ cards });

  useEffect(() => {
    if (idiomId && cards.length > 0 && !hasScrolledToIdiom.current) {
      const idx = cards.findIndex((c) => c.id === idiomId);
      if (idx >= 0 && cardListRef.current?.scrollToIndex) {
        cardListRef.current.scrollToIndex({ index: idx, animated: true });
        hasScrolledToIdiom.current = true;
      }
    }
  }, [idiomId, cards]);

  return (
    <CardList
      ref={cardListRef}
      cards={cards}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onFavoritePress={toggleFavorite}
      onVotePress={handleVote}
      emptyText={error ? 'Error loading cards' : 'No cards found'}
      emptySubtext={
        error ? 'Pull to refresh or try again' : 'No cards to display'
      }
    />
  );
};

export default ShuffleScreen;
