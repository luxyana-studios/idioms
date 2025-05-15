import { CardData } from '../types/card';

export const CARDS_PER_PAGE = 20;

export const getBackendUrl = (): string => {
  const rawUrl = process.env.EXPO_PUBLIC_IDIOMS_BACKEND_URL;

  if (!rawUrl?.trim()) {
    throw new Error('Missing IDIOMS_BACKEND_URL in app config');
  }

  return rawUrl.trim();
};

const IDIOMS_BACKEND_URL = process.env.EXPO_PUBLIC_IDIOMS_BACKEND_URL;

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

export const fetchCards = async (
  page: number,
  limit: number = CARDS_PER_PAGE,
  search?: string,
): Promise<CardData[]> => {
  const url = new URL(API_ROUTES.IDIOMS, IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  if (search) url.searchParams.append('search', search.trim());

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'idioms',
    },
  });

  if (!response.ok) return handleApiError(response);

  return await response.json();
};
