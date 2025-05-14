import { CardData } from '../types/card';
import Constants from 'expo-constants';

export const CARDS_PER_PAGE = 20;

const getBackendUrl = (): string => {
  const rawUrl = Constants.expoConfig?.extra?.IDIOMS_BACKEND_URL;
  if (!rawUrl?.trim()) {
    throw new Error('Missing IDIOMS_BACKEND_URL in app config');
  }
  return rawUrl.trim();
};

const IDIOMS_BACKEND_URL = getBackendUrl();

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

const fetchData = async <T>(url: URL): Promise<T> => {
  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Invalid response: Expected JSON');
  }

  try {
    const text = await response.text();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON received from server');
  }
};

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
  return await fetchData<CardData[]>(url);
};

export const searchIdioms = async (
  query: string,
  page: number = 1,
  limit: number = CARDS_PER_PAGE,
): Promise<CardData[]> => {
  const url = new URL(API_ROUTES.IDIOMS, IDIOMS_BACKEND_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('search', query.trim());
  const data = await fetchData<CardData[]>(url);
  if (!Array.isArray(data)) {
    throw new Error(
      'Invalid response format: Expected an array of cards (search)',
    );
  }
  return data;
};
