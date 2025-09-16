import Constants from 'expo-constants';
import { getItem, removeItem } from './storage';
import { STORAGE_KEYS } from './storage';

const BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

export const apiFetch = async (
  path: string,
  options: RequestInit = {},
): Promise<Response> => {
  const apiKey = await getItem(STORAGE_KEYS.API_KEY);

  const headers = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'idioms',
    ...(apiKey && { 'x-api-key': apiKey }),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await removeItem(STORAGE_KEYS.API_KEY);
  }

  return response;
};
