import { StorageAdapter } from './types';

// Local storage adapter (fallback)
export const localStorageAdapter: StorageAdapter = {
  async get(key: string) {
    return localStorage.getItem(key);
  },
  async set(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  async remove(key: string) {
    localStorage.removeItem(key);
  },
};

// Create storage with Telegram cloud support
export const createStorage = (
  cloudGet?: (key: string) => Promise<string | null>,
  cloudSet?: (key: string, value: string) => Promise<void>
): StorageAdapter => {
  if (cloudGet && cloudSet) {
    return {
      async get(key: string) {
        try {
          return await cloudGet(key);
        } catch {
          return localStorage.getItem(key);
        }
      },
      async set(key: string, value: string) {
        try {
          await cloudSet(key, value);
        } catch {
          localStorage.setItem(key, value);
        }
      },
      async remove(key: string) {
        localStorage.removeItem(key);
      },
    };
  }
  return localStorageAdapter;
};

// Storage keys
export const STORAGE_KEYS = {
  USER: 'avyx_user',
  ONBOARDING_COMPLETE: 'avyx_onboarding',
  THEME: 'avyx_theme',
  APPLIED_TASKS: 'avyx_applied_tasks',
} as const;
