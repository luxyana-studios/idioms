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

// Backend response shape for user registration. Exported so other services can reuse it later.
export interface RegisterUserResponse {
  api_key?: string | null;
  user?: {
    api_key?: string | null;
    // allow extra fields the backend may return
    [key: string]: unknown;
  } | null;
  // allow top-level extra fields as well
  [key: string]: unknown;
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

  // backend returns the created user object with api_key — prefer top-level, then user.api_key
  const apiKey: string | null =
    typeof data?.api_key === 'string' && data.api_key
      ? data.api_key
      : typeof data?.user?.api_key === 'string' && data.user?.api_key
        ? data.user.api_key
        : null;

  if (apiKey) {
    await setItem(STORAGE_KEYS.API_KEY, apiKey);
    return apiKey;
  }

  return null;
};

// Note: `getSavedApiKey` was inlined into the hook. If other modules need direct access
// to the stored API key in the future, re-export a getter here that calls `getItem`.
