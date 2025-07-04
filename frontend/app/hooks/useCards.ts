import { useMemo } from 'react';
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import {
  fetchCards,
  fetchFavoriteCards,
  fetchShuffledCards,
  updateIdiom,
  updateIdiomVote,
  CARDS_PER_PAGE,
} from '../services/cardService';
import { CardData } from '../types/card';

type QueryKey = readonly unknown[];
type QueryFn = (pageParam: number) => Promise<CardData[]>;

export const queryKeys = {
  cards: ['cards'] as const,
  cardsWithSearch: (search?: string) => ['cards', search] as const,
  cardsWithSort: (search?: string, sort?: string) =>
    ['cards', search, sort] as const,
  favorites: ['favorites'] as const,
  shuffled: (seed?: number) => ['shuffled', seed] as const,
  card: (id: string) => ['card', id] as const,
};

const useInfiniteCardQuery = (queryKey: QueryKey, queryFn: QueryFn) => {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === CARDS_PER_PAGE
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled: true,
  });
};

export const useCards = (search?: string, sort?: string) => {
  return useInfiniteCardQuery(
    queryKeys.cardsWithSort(search, sort),
    (pageParam) => fetchCards(pageParam, CARDS_PER_PAGE, search, sort),
  );
};

export const useFavoriteCards = () => {
  return useInfiniteCardQuery(queryKeys.favorites, (pageParam) =>
    fetchFavoriteCards(pageParam, CARDS_PER_PAGE),
  );
};

export const useShuffledCards = (seed?: number) => {
  return useInfiniteCardQuery(queryKeys.shuffled(seed), (pageParam) =>
    fetchShuffledCards(pageParam, CARDS_PER_PAGE, seed),
  );
};

export type FilterKey = 'all' | 'favorites' | 'random' | 'search';

type UseFilteredCardsProps = {
  activeFilter: FilterKey;
  debouncedSearchInput: string;
  searchSort?: 'frequency' | 'imagery';
  shuffleSeed?: number;
};

export const useFilteredCards = ({
  activeFilter,
  debouncedSearchInput,
  searchSort,
  shuffleSeed,
}: UseFilteredCardsProps) => {
  const sortParam =
    searchSort === 'frequency'
      ? '-frequency'
      : searchSort === 'imagery'
        ? '-imagery'
        : undefined;

  const queries = {
    all: useCards(),
    favorites: useFavoriteCards(),
    random: useShuffledCards(shuffleSeed),
    search: useCards(debouncedSearchInput || undefined, sortParam),
  };

  const activeQuery = queries[activeFilter];

  const cards = useMemo(
    () => activeQuery.data?.pages.flat() ?? [],
    [activeQuery.data],
  );

  return {
    cards,
    isLoading: activeQuery.isLoading,
    error: activeQuery.error,
    refetch: activeQuery.refetch,
    fetchNextPage: activeQuery.fetchNextPage,
    hasNextPage: activeQuery.hasNextPage,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
  };
};

const updateCacheData = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: QueryKey,
  updateFn: (card: CardData) => CardData,
) => {
  queryClient.setQueriesData(
    { queryKey },
    (oldData: InfiniteData<CardData[], number> | undefined) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: CardData[]) => page.map(updateFn)),
      };
    },
  );
};

export const useUpdateFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, favorite }: { cardId: string; favorite: boolean }) =>
      updateIdiom(cardId, favorite),

    /**
     * OPTIMISTIC UPDATE STRATEGY
     *
     * This function runs BEFORE the server request is made to provide instant UI feedback.
     * It performs the following steps:
     *
     * 1. PREVENT RACE CONDITIONS: Cancel any in-flight queries that might overwrite our optimistic updates
     * 2. BACKUP CURRENT STATE: Store the current cache data so we can rollback if the request fails
     * 3. UPDATE ALL CARDS CACHE: Update the favorite status in all card lists (cards, shuffled, favorites)
     * 4. UPDATE FAVORITES CACHE: Either add the card to favorites or remove it from the favorites list
     *
     * The complexity comes from managing THREE different infinite query caches that both contain
     * the same cards but serve different purposes:
     * - queryKeys.cards: Main list of all cards (with pagination) - used in search
     * - queryKeys.shuffled: Shuffled/random cards (with pagination) - used in home
     * - queryKeys.favorites: Filtered list of only favorited cards (with pagination)
     */
    onMutate: async ({ cardId, favorite }) => {
      /**
       * OPTIMISTIC UPDATE STRATEGY
       *
       * This function runs BEFORE the server request is made to provide instant UI feedback.
       * It performs the following steps:
       *
       * 1. PREVENT RACE CONDITIONS: Cancel any in-flight queries that might overwrite our optimistic updates
       * 2. BACKUP CURRENT STATE: Store the current cache data so we can rollback if the request fails
       * 3. UPDATE ALL CARDS CACHE: Update the favorite status in all card lists (cards, shuffled, favorites)
       * 4. UPDATE FAVORITES CACHE: Either add the card to favorites or remove it from the favorites list
       *
       * The complexity comes from managing THREE different infinite query caches that both contain
       * the same cards but serve different purposes:
       * - queryKeys.cards: Main list of all cards (with pagination) - used in search
       * - queryKeys.shuffled: Shuffled/random cards (with pagination) - used in home
       * - queryKeys.favorites: Filtered list of only favorited cards (with pagination)
       */
      // Step 1: Cancel any outgoing refetches to prevent race conditions
      // This ensures our optimistic updates won't be overwritten by stale server responses
      await queryClient.cancelQueries({ queryKey: queryKeys.cards });
      await queryClient.cancelQueries({ queryKey: ['shuffled'] });
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      // Step 2: Snapshot the previous values for rollback on error
      const previousCards = queryClient.getQueryData(queryKeys.cards);
      const previousShuffled = queryClient.getQueriesData({
        queryKey: ['shuffled'],
      });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      // Step 3: Update the favorite status in all card caches
      // This updates the card across all pages in the infinite queries
      const updateCardFavorite = (card: CardData) =>
        card.id === cardId ? { ...card, favorite } : card;

      updateCacheData(queryClient, queryKeys.cards, updateCardFavorite);
      // Update all shuffled queries regardless of seed
      queryClient.setQueriesData(
        { queryKey: ['shuffled'] },
        (oldData: InfiniteData<CardData[], number> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: CardData[]) =>
              page.map(updateCardFavorite),
            ),
          };
        },
      );

      // Step 4: Update the favorites cache with more complex logic
      // - If favoriting: keep the page as-is (card will appear when cache refreshes)
      // - If unfavoriting: remove the card from all pages and clean up empty pages
      queryClient.setQueriesData(
        { queryKey: queryKeys.favorites },
        (oldData: InfiniteData<CardData[], number> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages
              .map(
                (page: CardData[]) =>
                  favorite
                    ? page // If favoriting, keep page unchanged
                    : page.filter((card: CardData) => card.id !== cardId), // If unfavoriting, remove the card
              )
              .filter((page: CardData[]) => page.length > 0), // Remove any empty pages
          };
        },
      );

      // Return snapshot for potential rollback in onError
      return { previousCards, previousShuffled, previousFavorites };
    },

    onError: (err, variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.cards, context.previousCards);
      }
      if (context?.previousShuffled) {
        // Restore all shuffled query data
        context.previousShuffled.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites,
          context.previousFavorites,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards });
      queryClient.invalidateQueries({ queryKey: ['shuffled'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
};

export const useVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      voteType,
    }: {
      cardId: string;
      voteType: 'upvote' | 'downvote';
    }) => updateIdiomVote(cardId, voteType),

    /**
     * OPTIMISTIC UPDATE STRATEGY FOR VOTING
     *
     * Similar to useUpdateFavorite, this provides instant feedback when users vote.
     * Key differences:
     * - Updates vote counts (upvotes/downvotes) instead of favorite status
     * - Updates BOTH caches simultaneously since votes appear in both contexts
     * - Uses onSuccess to sync with actual server response (votes can change due to rate limiting, etc.)
     *
     * Flow:
     * 1. Cancel in-flight queries to prevent race conditions
     * 2. Backup current state for potential rollback
     * 3. Optimistically increment vote count in both caches
     * 4. If server responds successfully, replace optimistic data with server data
     * 5. If server fails, rollback to previous state
     */
    onMutate: async ({ cardId, voteType }) => {
      // Step 1: Prevent race conditions with in-flight requests
      await queryClient.cancelQueries({ queryKey: queryKeys.cards });
      await queryClient.cancelQueries({ queryKey: ['shuffled'] });
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      // Step 2: Snapshot current state for rollback on error
      const previousCards = queryClient.getQueryData(queryKeys.cards);
      const previousShuffled = queryClient.getQueriesData({
        queryKey: ['shuffled'],
      });
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      // Step 3: Optimistically update vote counts in all caches
      // This gives immediate feedback while the server processes the vote
      const updateCardVotes = (card: CardData) => {
        if (card.id !== cardId) return card;

        return {
          ...card,
          upvotes: voteType === 'upvote' ? card.upvotes + 1 : card.upvotes,
          downvotes:
            voteType === 'downvote' ? card.downvotes + 1 : card.downvotes,
        };
      };

      updateCacheData(queryClient, queryKeys.cards, updateCardVotes);
      // Update all shuffled queries regardless of seed
      queryClient.setQueriesData(
        { queryKey: ['shuffled'] },
        (oldData: InfiniteData<CardData[], number> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: CardData[]) =>
              page.map(updateCardVotes),
            ),
          };
        },
      );
      updateCacheData(queryClient, queryKeys.favorites, updateCardVotes);

      return { previousCards, previousShuffled, previousFavorites };
    },

    /**
     * SYNC WITH SERVER RESPONSE
     *
     * Replace optimistic updates with actual server data.
     * This is important because:
     * - Server might apply rate limiting
     * - Vote counts might be different due to concurrent users
     * - Server has the authoritative vote counts
     */
    onSuccess: (updatedCard) => {
      const updateWithServerData = (card: CardData) =>
        card.id === updatedCard.id ? updatedCard : card;

      updateCacheData(queryClient, queryKeys.cards, updateWithServerData);
      // Update all shuffled queries regardless of seed
      queryClient.setQueriesData(
        { queryKey: ['shuffled'] },
        (oldData: InfiniteData<CardData[], number> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: CardData[]) =>
              page.map(updateWithServerData),
            ),
          };
        },
      );
      updateCacheData(queryClient, queryKeys.favorites, updateWithServerData);
    },

    onError: (err, variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.cards, context.previousCards);
      }
      if (context?.previousShuffled) {
        // Restore all shuffled query data
        context.previousShuffled.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites,
          context.previousFavorites,
        );
      }
    },
  });
};

export default useCards;
