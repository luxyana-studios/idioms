/*
  storage.ts
  Lightweight storage abstraction that prefers @react-native-async-storage/async-storage
  on native and falls back to localStorage on web or when AsyncStorage throws.

  Methods: getItem, setItem, removeItem
*/

export const STORAGE_KEYS = {
  API_KEY: 'local_api_key',
  INSTALLATION_ID: 'local_installation_id',
} as const;

import AsyncStorage from '@react-native-async-storage/async-storage';

// Choose a storage backend once at module initialization to avoid repeated checks
type StorageBackend = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  name: string;
};

const isWeb =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

let backend: StorageBackend;

if (isWeb && typeof globalThis.localStorage !== 'undefined') {
  backend = {
    name: 'localStorage',
    getItem: (k: string) => Promise.resolve(globalThis.localStorage.getItem(k)),
    setItem: (k: string, v: string) => {
      globalThis.localStorage.setItem(k, v);
      return Promise.resolve();
    },
    removeItem: (k: string) => {
      globalThis.localStorage.removeItem(k);
      return Promise.resolve();
    },
  };
} else if (AsyncStorage && AsyncStorage.getItem) {
  backend = {
    name: 'AsyncStorage',
    getItem: (k: string) => AsyncStorage.getItem(k),
    setItem: (k: string, v: string) => AsyncStorage.setItem(k, v),
    removeItem: (k: string) => AsyncStorage.removeItem(k),
  };
} else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
  // Fallback to localStorage if available in non-web env (unlikely but safe)
  backend = {
    name: 'localStorage',
    getItem: (k: string) => Promise.resolve(globalThis.localStorage.getItem(k)),
    setItem: (k: string, v: string) => {
      globalThis.localStorage.setItem(k, v);
      return Promise.resolve();
    },
    removeItem: (k: string) => {
      globalThis.localStorage.removeItem(k);
      return Promise.resolve();
    },
  };
} else {
  // No storage available: provide no-op implementations
  backend = {
    name: 'none',
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
  };
}

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    return backend.setItem(key, value);
  } catch (e) {
    // As a last resort, attempt localStorage directly if available
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.setItem(key, value);
    }
    return;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return backend.getItem(key);
  } catch (e) {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage.getItem(key);
    }
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    return backend.removeItem(key);
  } catch (e) {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem(key);
    }
    return;
  }
};
