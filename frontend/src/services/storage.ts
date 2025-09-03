/*
  storage.ts
  Lightweight storage abstraction that prefers expo-secure-store, falls back to
  @react-native-async-storage/async-storage, and finally localStorage on web.

  Methods: getItem, setItem, removeItem
*/

export const STORAGE_KEYS = {
  API_KEY: 'idioms_api_key',
  INSTALLATION_ID: 'idioms_installation_id',
} as const;

import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (AsyncStorage && AsyncStorage.setItem) {
      await AsyncStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    // fallthrough to localStorage
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    globalThis.localStorage.setItem(key, value);
    return;
  }

  return;
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (AsyncStorage && AsyncStorage.getItem) {
      return AsyncStorage.getItem(key);
    }
  } catch (e) {
    // fallthrough
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage.getItem(key);
  }

  return null;
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    if (AsyncStorage && AsyncStorage.removeItem) {
      await AsyncStorage.removeItem(key);
      return;
    }
  } catch (e) {
    // fallthrough
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    globalThis.localStorage.removeItem(key);
    return;
  }

  return;
};
