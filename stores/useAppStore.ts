import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language, TranslationKey } from '@/i18n/translations';
import { translations } from '@/i18n/translations';
import type { ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  imageUri: string | null;
}

interface AppState {
  language: Language;
  themeMode: ThemeMode;
  systemColorScheme: ColorSchemeName;
  loaded: boolean;
  profile: UserProfile;
  setLanguage: (lang: Language) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSystemColorScheme: (scheme: ColorSchemeName) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  saveProfile: (userId: string, profile: Partial<UserProfile>) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  t: (key: TranslationKey) => string;
  effectiveTheme: () => 'light' | 'dark';
  init: () => Promise<void>;
}

const LANG_KEY = '@app_language';
const THEME_KEY = '@app_theme';
const PROFILE_KEY = (userId: string) => `@profile_${userId}`;

const DEFAULT_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  imageUri: null,
};

/** Pure selector — reads from state snapshot `s`, not `get()`. Safe with useSyncExternalStore. */
export const selectEffectiveTheme = (s: AppState): 'light' | 'dark' =>
  s.themeMode === 'system'
    ? s.systemColorScheme === 'dark'
      ? 'dark'
      : 'light'
    : s.themeMode;

export const useAppStore = create<AppState>((set, get) => ({
  language: 'uz',
  themeMode: 'system',
  systemColorScheme: null,
  loaded: false,
  profile: DEFAULT_PROFILE,

  setLanguage: (lang) => {
    set({ language: lang });
    AsyncStorage.setItem(LANG_KEY, lang);
  },

  setThemeMode: (mode) => {
    set({ themeMode: mode });
    AsyncStorage.setItem(THEME_KEY, mode);
  },

  setSystemColorScheme: (scheme) => {
    set({ systemColorScheme: scheme });
  },

  setProfile: (partial) => {
    const current = get().profile;
    const updated = { ...current, ...partial };
    set({ profile: updated });
  },

  saveProfile: async (userId: string, partial: Partial<UserProfile>) => {
    const current = get().profile;
    const updated = { ...current, ...partial };
    set({ profile: updated });
    await AsyncStorage.setItem(PROFILE_KEY(userId), JSON.stringify(updated));
  },

  loadProfile: async (userId: string) => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY(userId));
      if (raw) {
        const data: UserProfile = JSON.parse(raw);
        set({ profile: data });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  },

  t: (key) => translations[get().language][key],

  effectiveTheme: () => {
    const { themeMode, systemColorScheme } = get();
    return themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;
  },

  init: async () => {
    const [lang, theme] = await Promise.all([
      AsyncStorage.getItem(LANG_KEY),
      AsyncStorage.getItem(THEME_KEY),
    ]);
    set({
      language: lang === 'uz' || lang === 'ru' || lang === 'en' ? lang : 'uz',
      themeMode:
        theme === 'light' || theme === 'dark' || theme === 'system'
          ? theme
          : 'system',
      loaded: true,
    });
  },
}));
