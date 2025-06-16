import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import {
  fetchCards,
  fetchFavoriteCards,
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
  favorites: ['favorites'] as const,
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

export const useCards = (search?: string) => {
  return useInfiniteCardQuery(queryKeys.cardsWithSearch(search), (pageParam) =>
    fetchCards(pageParam, CARDS_PER_PAGE, search),
  );
};

export const useFavoriteCards = () => {
  return useInfiniteCardQuery(queryKeys.favorites, (pageParam) =>
    fetchFavoriteCards(pageParam, CARDS_PER_PAGE),
  );
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
     * 3. UPDATE ALL CARDS CACHE: Update the favorite status in the main cards list (used in home/search)
     * 4. UPDATE FAVORITES CACHE: Either add the card to favorites or remove it from the favorites list
     *
     * The complexity comes from managing TWO different infinite query caches that both contain
     * the same cards but serve different purposes:
     * - queryKeys.cards: Main list of all cards (with pagination)
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
       * 3. UPDATE ALL CARDS CACHE: Update the favorite status in the main cards list (used in home/search)
       * 4. UPDATE FAVORITES CACHE: Either add the card to favorites or remove it from the favorites list
       *
       * The complexity comes from managing TWO different infinite query caches that both contain
       * the same cards but serve different purposes:
       * - queryKeys.cards: Main list of all cards (with pagination)
       * - queryKeys.favorites: Filtered list of only favorited cards (with pagination)
       */
      // Step 1: Cancel any outgoing refetches to prevent race conditions
      // This ensures our optimistic updates won't be overwritten by stale server responses
      await queryClient.cancelQueries({ queryKey: queryKeys.cards });
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      // Step 2: Snapshot the previous values for rollback on error
      const previousCards = queryClient.getQueryData(queryKeys.cards);
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      // Step 3: Update the favorite status in the main cards cache
      // This updates the card across all pages in the infinite query
      updateCacheData(queryClient, queryKeys.cards, (card: CardData) =>
        card.id === cardId ? { ...card, favorite } : card,
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
      return { previousCards, previousFavorites };
    },

    onError: (err, variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.cards, context.previousCards);
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
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      // Step 2: Snapshot current state for rollback on error
      const previousCards = queryClient.getQueryData(queryKeys.cards);
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      // Step 3: Optimistically update vote counts in both caches
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
      updateCacheData(queryClient, queryKeys.favorites, updateCardVotes);

      return { previousCards, previousFavorites };
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
      updateCacheData(queryClient, queryKeys.favorites, updateWithServerData);
    },

    onError: (err, variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.cards, context.previousCards);
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
