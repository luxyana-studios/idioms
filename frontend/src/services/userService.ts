import Constants from 'expo-constants';
import { getItem, setItem, removeItem } from './storage';
import { STORAGE_KEYS } from './storage';

const BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

export const registerOrGetApiKey = async (): Promise<string | null> => {
  const existingApiKey = await getItem(STORAGE_KEYS.API_KEY);
  if (existingApiKey) {
    return existingApiKey;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'idioms',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const apiKey = data.user.api_key;

    await setItem(STORAGE_KEYS.API_KEY, apiKey);
    return apiKey;
  } catch {
    return null;
  }
};

export const getCurrentUser = async () => {
  const apiKey = await getItem(STORAGE_KEYS.API_KEY);
  if (!apiKey) return null;

  try {
    const response = await fetch(`${BACKEND_URL}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'idioms',
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await removeItem(STORAGE_KEYS.API_KEY);
      }
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
};
