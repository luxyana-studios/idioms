import { CardData } from '../types/card';
import Constants from 'expo-constants';

export const CARDS_PER_PAGE = 20;

export const getBackendUrl = (): string => {
  const rawUrl = Constants.expoConfig?.extra?.IDIOMS_BACKEND_URL;

  if (!rawUrl?.trim()) {
    throw new Error('Missing IDIOMS_BACKEND_URL in app config');
  }

  return rawUrl.trim().replace(/\/?$/, '/');
};

const IDIOMS_BACKEND_URL = getBackendUrl();

const handleApiError = async (response: Response) => {
  const errorText = await response.text();
  console.error(`HTTP Error ${response.status}:`, errorText);
  throw new Error(
    `Server error: ${response.status} - ${errorText.slice(0, 100)}`,
  );
};

export const fetchCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
  search?: string,
): Promise<CardData[]> => {
  const url = new URL('idioms/', IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  if (search) url.searchParams.append('search', search.trim());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
    });

    if (!response.ok) return handleApiError(response);

    const data = await response.json();
    return Array.isArray(data)
      ? data
      : Promise.reject('Expected array of cards');
  } catch (error) {
    console.error('Fetch error:', error);
    throw error instanceof Error ? error : new Error('Network request failed');
  }
};
