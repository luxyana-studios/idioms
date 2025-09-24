import Constants from 'expo-constants';
import { getItem, setItem, removeItem } from './storage';
import { STORAGE_KEYS } from './storage';

const generateInstallationId = () => {
  return `idioms-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
};

const getOrCreateInstallationId = async (): Promise<string> => {
  let installationId = await getItem(STORAGE_KEYS.INSTALLATION_ID);
  if (!installationId) {
    installationId = generateInstallationId();
    await setItem(STORAGE_KEYS.INSTALLATION_ID, installationId);
  }
  return installationId;
};

const BACKEND_URL = Constants.expoConfig?.extra?.API_URL;

export const registerOrGetApiKey = async (): Promise<string | null> => {
  const existingApiKey = await getItem(STORAGE_KEYS.API_KEY);

  if (existingApiKey) {
    return existingApiKey;
  }

  try {
    const installationId = await getOrCreateInstallationId();

    const response = await fetch(`${BACKEND_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'idioms',
      },
      body: JSON.stringify({
        installation_id: installationId,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const apiKey = data.api_key;

    await setItem(STORAGE_KEYS.API_KEY, apiKey);
    return apiKey;
  } catch {
    return null;
  }
};
