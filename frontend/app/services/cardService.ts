import { API_BASE_URL } from '../../env';
import { CardData } from '../types/card';

// Constants
export const CARDS_PER_PAGE = 20;
const BASE_URL = API_BASE_URL;

/**
 * Fetches a paginated list of cards from the backend
 * @param page - The page number to fetch (1-based)
 * @param limit - Number of cards per page
 * @param search - Optional search query
 * @returns Promise with array of cards
 */
export const fetchCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
  search?: string,
): Promise<CardData[]> => {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (search) {
      console.log(
        'Search functionality is not currently supported by the backend.',
      );
      url.searchParams.append('search', search.trim());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Error fetching cards: ${response.statusText}`);
    }

    const data: CardData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    throw error;
  }
};
