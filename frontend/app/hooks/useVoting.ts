import { useState } from 'react';
import { CardData } from '../types/card';
import { updateIdiomVote } from '../services/cardService';

export const useVoting = (
  cards: CardData[],
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>,
) => {
  const [isVoting, setIsVoting] = useState<string | null>(null);

  const handleVote = async (
    cardId: string,
    voteType: 'upvote' | 'downvote',
  ) => {
    const currentCard = cards.find((card) => card.id === cardId);
    if (!currentCard || isVoting === cardId) return;

    setIsVoting(cardId);

    try {
      const updatedCard = await updateIdiomVote(cardId, voteType);

      setCards((prevCards) => {
        const updatedCards = prevCards.map((card) =>
          card.id === cardId ? updatedCard : card,
        );

        return updatedCards.sort((a, b) => {
          const scoreA = a.upvotes - a.downvotes;
          const scoreB = b.upvotes - b.downvotes;
          return scoreB - scoreA;
        });
      });
    } catch (error) {
      console.error('Error updating vote:', error);
    } finally {
      setIsVoting(null);
    }
  };

  return {
    handleVote,
    isVoting,
  };
};
