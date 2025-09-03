import Constants from 'expo-constants';
import { setItem, STORAGE_KEYS, getItem } from './storage';
import { apiFetch } from './apiClient';

const IDIOMS_BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

const API_ROUTES = {
  USERS: 'users/',
} as const;

const handleApiError = async (response: Response) => {
  const text = await response.text();
  throw new Error(`Server error ${response.status}: ${text.slice(0, 200)}`);
};

// minimal uuidv4 generator to avoid extra deps
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getOrCreateInstallationId = async (): Promise<string> => {
  const existing = await getItem(STORAGE_KEYS.INSTALLATION_ID);
  if (existing) return existing;

  const id = generateUUID();
  await setItem(STORAGE_KEYS.INSTALLATION_ID, id);
  return id;
};

export const registerOrGetApiKey = async (): Promise<string | null> => {
  const saved = await getItem(STORAGE_KEYS.API_KEY);
  if (saved) return saved;

  if (!IDIOMS_BACKEND_URL) {
    console.warn(
      'No backend URL configured (Constants.expoConfig.extra.API_URL)',
    );
    return null;
  }

  const installation_id = await getOrCreateInstallationId();

  const path = `${API_ROUTES.USERS}register`;
  const response = await apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ installation_id }),
  });

  if (!response.ok) return handleApiError(response);

  const data = await response.json();

  // backend returns the created user object with api_key
  const apiKey = data?.api_key ?? data?.user?.api_key ?? null;

  if (apiKey) {
    await setItem(STORAGE_KEYS.API_KEY, apiKey);
    return apiKey;
  }

  return null;
};

export const getSavedApiKey = async (): Promise<string | null> => {
  return getItem(STORAGE_KEYS.API_KEY);
};
