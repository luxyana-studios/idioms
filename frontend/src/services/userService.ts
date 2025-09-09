import Constants from 'expo-constants';
import { setItem, STORAGE_KEYS, getItem } from './storage';
import { apiFetch } from './apiClient';
import { v4 as uuidv4 } from 'uuid';

const IDIOMS_BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

const API_ROUTES = {
  USERS: 'users/',
} as const;

const handleApiError = async (response: Response) => {
  const text = await response.text();
  throw new Error(`Server error ${response.status}: ${text.slice(0, 200)}`);
};

const generateUUID = (): string => uuidv4();

const getOrCreateInstallationId = async (): Promise<string> => {
  const existing = await getItem(STORAGE_KEYS.INSTALLATION_ID);
  if (existing) return existing;

  const id = generateUUID();
  await setItem(STORAGE_KEYS.INSTALLATION_ID, id);
  return id;
};

export interface RegisterUserResponse {
  id: string;
  installation_id: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

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

  const data = (await response.json()) as RegisterUserResponse;

  if (data && typeof data.api_key === 'string' && data.api_key) {
    await setItem(STORAGE_KEYS.API_KEY, data.api_key);
    return data.api_key;
  }

  return null;
};
