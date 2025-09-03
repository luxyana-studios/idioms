import Constants from 'expo-constants';
import { getItem } from './storage';
import { STORAGE_KEYS } from './storage';

const IDIOMS_BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

const defaultHeaders = {
  Accept: 'application/json',
  'ngrok-skip-browser-warning': 'idioms',
};

export const getAuthHeaders = async (extra: Record<string, string> = {}) => {
  const apiKey = await getItem(STORAGE_KEYS.API_KEY);
  const headers: Record<string, string> = { ...defaultHeaders, ...extra };
  if (apiKey) headers['x-api-key'] = apiKey;
  return headers;
};

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  if (!IDIOMS_BACKEND_URL) {
    throw new Error('No API URL configured');
  }

  const url = new URL(path, IDIOMS_BACKEND_URL).toString();

  const extraHeaders = (options.headers as Record<string, string>) || {};
  const authHeaders = await getAuthHeaders(extraHeaders);

  const merged: RequestInit = {
    ...options,
    headers: authHeaders,
  };

  return fetch(url, merged);
};
