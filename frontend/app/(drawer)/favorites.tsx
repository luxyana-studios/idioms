import { View } from 'react-native';
import { useFilteredCards, FilterKey } from '../hooks/useCards';
import useCardActions from '../hooks/useCardActions';
import CardListComponent from '../components/CardList';
import { useTheme } from '../contexts/ThemeContext';

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
