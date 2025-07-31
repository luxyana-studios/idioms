import { CardData } from '../types/card';
import Constants from 'expo-constants';

export const CARDS_PER_PAGE = 20;
const IDIOMS_BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

const API_ROUTES = {
  IDIOMS: 'idioms/',
} as const;

const handleApiError = async (response: Response) => {
  const errorText = await response.text();
  console.error(`HTTP Error ${response.status}:`, errorText);
  throw new Error(
    `Server error: ${response.status} - ${errorText.slice(0, 100)}`,
  );
};

/**
 * Fetches cards from the backend with optional search functionality
 * @param page - The page number to fetch
 * @param limit - Number of cards per page
 * @param search - Optional search term to filter cards by title, meaning, and explanation
 * @param sort - Optional sort parameter (e.g., 'frequency', '-frequency')
 * @param category - Optional category to filter cards by category_theme
 * @returns Promise<CardData[]> - Array of card data
 */
export const fetchCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
  search?: string,
  sort?: string,
  category?: string,
): Promise<CardData[]> => {
  const url = new URL(API_ROUTES.IDIOMS, IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  if (search) {
    url.searchParams.append('text', search.trim());
  }

  if (category) {
    url.searchParams.append('category', category.trim());
  }

  if (sort) {
    url.searchParams.append('sort', sort);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};

/**
 * Fetches shuffled cards from the backend
 * @param page - The page number to fetch
 * @param limit - Number of cards per page
 * @param seed - Optional integer seed for shuffling (generates random if not provided)
 * @returns Promise<CardData[]> - Array of shuffled card data
 */
export const fetchShuffledCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
  seed?: number,
): Promise<CardData[]> => {
  const url = new URL(`${API_ROUTES.IDIOMS}random`, IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append(
    'seed',
    (seed || Math.floor(Math.random() * 1000000)).toString(),
  );

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};

/**
 * Fetches favorite cards from the backend
 * @param page - The page number to fetch
 * @param limit - Number of cards per page
 * @returns Promise<CardData[]> - Array of favorite card data
 */
export const fetchFavoriteCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
): Promise<CardData[]> => {
  const url = new URL(`${API_ROUTES.IDIOMS}favorites`, IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};

/**
 * Updates the favorite status of an idiom
 * @param idiomId - The ID of the idiom to update
 * @param favorite - The new favorite status (true/false)
 * @returns Promise<CardData> - The updated card data
 */
export const updateIdiom = async (
  idiomId: string,
  favorite: boolean,
): Promise<CardData> => {
  const url = new URL(`${API_ROUTES.IDIOMS}${idiomId}`, IDIOMS_BACKEND_URL);

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
    body: JSON.stringify({ favorite }),
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};

/**
 * Updates the vote status of an idiom using the specific upvote/downvote endpoints
 * @param idiomId - The ID of the idiom to vote on
 * @param voteType - The type of vote ('upvote' or 'downvote')
 * @param increment - Whether to increment the vote (always true for this implementation)
 * @returns Promise<CardData> - The updated card data
 */
export const updateIdiomVote = async (
  idiomId: string,
  voteType: 'upvote' | 'downvote',
): Promise<CardData> => {
  const endpoint = voteType === 'upvote' ? 'upvote' : 'downvote';
  const url = new URL(
    `${API_ROUTES.IDIOMS}${idiomId}/${endpoint}`,
    IDIOMS_BACKEND_URL,
  );

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};

/**
 * Fetches all available categories from the backend
 * @returns Promise<string[]> - Array of category names
 */
export const fetchCategories = async (): Promise<string[]> => {
  const url = new URL(`${API_ROUTES.IDIOMS}categories`, IDIOMS_BACKEND_URL);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};
