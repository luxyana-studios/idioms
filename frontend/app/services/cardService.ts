import { CardData } from '../types/card';

export const CARDS_PER_PAGE = 20;
const IDIOMS_BACKEND_URL = process.env.EXPO_PUBLIC_IDIOMS_BACKEND_URL;

const API_ROUTES = {
  IDIOMS: 'idioms/',
  SMILEYS: 'smileys/', // Nueva ruta para los smileys
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
 * @param search - Optional search term to filter cards by title
 * @returns Promise<CardData[]> - Array of card data
 */
export const fetchCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
  search?: string,
): Promise<CardData[]> => {
  const url = new URL(API_ROUTES.IDIOMS, IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  if (search) {
    url.searchParams.append('search', search.trim());
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
 * Generates smileys for a given idiom text
 * @param text - The idiom text to generate smileys for
 * @returns Promise<string[]> - Array of emoji strings
 */
export const generateSmileys = async (text: string): Promise<string[]> => {
  const url = new URL(API_ROUTES.SMILEYS, IDIOMS_BACKEND_URL);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) return handleApiError(response);

  const result = await response.json();
  return result.depiction || [];
};
