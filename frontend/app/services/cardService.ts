import { CardData } from '../types/card';

// Constants
const API_DELAY = 500; // Simulated API delay in milliseconds
const CARDS_PER_PAGE = 10;

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

export const fetchCardDetails = async (id: number): Promise<CardData> => {
  // Simulating API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: `Card ${id}`,
        content: `This is the detailed content for card ${id}. Here you can add more detailed information about the card, including additional fields that might not be shown in the card list view.`,
      });
    }, 300); // Simulating network delay
  });
};
