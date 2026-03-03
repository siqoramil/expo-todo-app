import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TranslationKey } from '@/i18n/translations';

const AUTH_KEY = '@auth_user';

export interface LocalUser {
  id: string;
  email: string;
}

type TranslateFn = (key: TranslationKey) => string;

interface AuthState {
  user: LocalUser | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string, t: TranslateFn) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, t: TranslateFn) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

async function getUsers(): Promise<Record<string, { id: string; email: string; password: string }>> {
  const raw = await AsyncStorage.getItem('@registered_users');
  return raw ? JSON.parse(raw) : {};
}

async function saveUsers(users: Record<string, { id: string; email: string; password: string }>): Promise<void> {
  await AsyncStorage.setItem('@registered_users', JSON.stringify(users));
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  signIn: async (email, password, t) => {
    if (!email.trim()) return { error: t('validationEmailRequired') };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return { error: t('validationEmailInvalid') };
    if (!password) return { error: t('validationPasswordRequired') };
    if (password.length < 6) return { error: t('validationPasswordMin') };

    set({ loading: true });
    try {
      const users = await getUsers();
      const userRecord = users[email.toLowerCase()];
      if (!userRecord) {
        set({ loading: false });
        return { error: t('userNotFound') };
      }
      if (userRecord.password !== password) {
        set({ loading: false });
        return { error: t('wrongPassword') };
      }
      const localUser: LocalUser = { id: userRecord.id, email: userRecord.email };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(localUser));
      set({ user: localUser, loading: false });
      return { error: null };
    } catch {
      set({ loading: false });
      return { error: t('signInError') };
    }
  },

  signUp: async (email, password, t) => {
    if (!email.trim()) return { error: t('validationEmailRequired') };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return { error: t('validationEmailInvalid') };
    if (!password) return { error: t('validationPasswordRequired') };
    if (password.length < 6) return { error: t('validationPasswordMin') };

    set({ loading: true });
    try {
      const users = await getUsers();
      const key = email.toLowerCase();
      if (users[key]) {
        set({ loading: false });
        return { error: t('emailAlreadyRegistered') };
      }
      const id = generateId();
      users[key] = { id, email, password };
      await saveUsers(users);
      const localUser: LocalUser = { id, email };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(localUser));
      set({ user: localUser, loading: false });
      return { error: null };
    } catch {
      set({ loading: false });
      return { error: t('signUpError') };
    }
  },

  signOut: async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    set({ user: null });
  },

  initialize: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (raw) {
        const user: LocalUser = JSON.parse(raw);
        set({ user, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }
  },
}));
