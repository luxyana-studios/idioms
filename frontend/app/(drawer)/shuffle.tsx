import React, { useState, useCallback } from 'react';
import CardList from '../components/CardList';
import { useFilteredCards, FilterKey } from '../hooks/useCards';
import useCardActions from '../hooks/useCardActions';
import { useFocusEffect } from '@react-navigation/native';

const ShuffleScreen = () => {
  const activeFilter: FilterKey = 'random';

  const [shuffleSeed, setShuffleSeed] = useState<number>(() =>
    Math.floor(Math.random() * 1000000),
  );

  useFocusEffect(
    useCallback(() => {
      setShuffleSeed(Math.floor(Math.random() * 1000000));
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

  return (
    <CardList
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
