import { vi } from 'vitest';

// Mock AsyncStorage
const storage: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => storage[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn(async (key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(async () => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    }),
  },
}));

// Helper to clear mock storage between tests
export function clearMockStorage() {
  Object.keys(storage).forEach((key) => delete storage[key]);
}

export function getMockStorage() {
  return storage;
}
