import { useCallback } from 'react';
import { useUpdateFavorite, useVote } from './useCards';
import { CardData } from '../types/card';

interface UseCardActionsProps {
  cards: CardData[];
}

const useCardActions = ({ cards }: UseCardActionsProps) => {
  const updateFavoriteMutation = useUpdateFavorite();
  const voteMutation = useVote();

  const toggleFavorite = useCallback(
    async (cardId: string) => {
      const currentCard = cards.find((card) => card.id === cardId);
      if (!currentCard) return;

      const newFavoriteStatus = !currentCard.favorite;
      updateFavoriteMutation.mutate({ cardId, favorite: newFavoriteStatus });
    },
    [cards, updateFavoriteMutation],
  );

  const handleVote = useCallback(
    async (cardId: string, voteType: 'upvote' | 'downvote') => {
      voteMutation.mutate({ cardId, voteType });
    },
    [voteMutation],
  );

  return {
    toggleFavorite,
    handleVote,
    isUpdatingFavorite: updateFavoriteMutation.isPending,
    isVoting: voteMutation.isPending,
  };
};

export default useCardActions;
