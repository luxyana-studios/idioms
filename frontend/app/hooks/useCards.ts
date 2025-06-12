import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  fetchCards,
  fetchFavoriteCards,
  updateIdiom,
  updateIdiomVote,
  CARDS_PER_PAGE,
} from '../services/cardService';
import { CardData } from '../types/card';

interface InfiniteQueryData {
  pages: CardData[][];
  pageParams: unknown[];
}

export const queryKeys = {
  cards: ['cards'] as const,
  cardsWithSearch: (search?: string) => ['cards', search] as const,
  favorites: ['favorites'] as const,
  card: (id: string) => ['card', id] as const,
};

const useInfiniteCardQuery = (
  queryKey: readonly unknown[],
  queryFn: (pageParam: number) => Promise<CardData[]>,
) => {
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
  queryKey: readonly unknown[],
  updateFn: (card: CardData) => CardData,
) => {
  queryClient.setQueriesData(
    { queryKey },
    (oldData: InfiniteQueryData | undefined) => {
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

    onMutate: async ({ cardId, favorite }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cards });
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      const previousCards = queryClient.getQueryData(queryKeys.cards);
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

      updateCacheData(queryClient, queryKeys.cards, (card: CardData) =>
        card.id === cardId ? { ...card, favorite } : card,
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.favorites },
        (oldData: InfiniteQueryData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages
              .map((page: CardData[]) =>
                favorite
                  ? page
                  : page.filter((card: CardData) => card.id !== cardId),
              )
              .filter((page: CardData[]) => page.length > 0),
          };
        },
      );

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

    onMutate: async ({ cardId, voteType }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cards });
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });

      const previousCards = queryClient.getQueryData(queryKeys.cards);
      const previousFavorites = queryClient.getQueryData(queryKeys.favorites);

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
