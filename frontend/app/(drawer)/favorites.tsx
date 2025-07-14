import { View } from 'react-native';
import { useFilteredCards, FilterKey } from '../../src/hooks/useCards';
import useCardActions from '../../src/hooks/useCardActions';
import CardListComponent from '../../src/components/CardList';
import { useTheme } from '../../src/contexts/ThemeContext';

const FavoritesScreen = () => {
  const { colors } = useTheme();
  const activeFilter: FilterKey = 'favorites';

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

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <CardListComponent
        cards={cards}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFavoritePress={toggleFavorite}
        onVotePress={handleVote}
        emptyText={error ? 'Error loading cards' : 'No favorite cards yet'}
        emptySubtext={
          error
            ? 'Pull to refresh or try again'
            : 'Mark cards as favorites to see them here'
        }
      />
    </View>
  );
};

export default FavoritesScreen;
