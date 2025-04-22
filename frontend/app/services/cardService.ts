import { CardData } from '../types/card';

// Constants
const API_DELAY = 500; // Simulated API delay in milliseconds
export const CARDS_PER_PAGE = 20;

// Helper function to generate mock card data
const generateMockCard = (id: number): CardData => ({
  id,
  title: `Card ${id}`,
  content: `This is the content of card ${id}. You can add more information here.`,
});

// Helper function to simulate API delay
const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, API_DELAY));

/**
 * Fetches a paginated list of cards
 * @param page - The page number to fetch (1-based)
 * @param limit - Number of cards per page
 * @returns Promise with array of cards
 */
export const fetchCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
): Promise<CardData[]> => {
  await simulateApiDelay();

  const start = (page - 1) * limit + 1;
  const cards: CardData[] = [];

  for (let i = 0; i < limit; i++) {
    cards.push(generateMockCard(start + i));
  }

  return cards;
};
