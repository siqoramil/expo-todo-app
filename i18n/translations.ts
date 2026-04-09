import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

export type Language = 'uz' | 'ru' | 'en';

export const translations = { uz, ru, en } as const;

export type TranslationKey = keyof typeof uz;

// Category emoji mapping (shared, not translated)
export const CATEGORY_EMOJI: Record<string, string> = {
  personal: '👤',
  work: '💼',
  shopping: '🛒',
  health: '💪',
  study: '📚',
  other: '📌',
};

export const CATEGORY_COLORS: Record<string, string> = {
  personal: '#6C5CE7',
  work: '#0984E3',
  shopping: '#00B894',
  health: '#E17055',
  study: '#FDCB6E',
  other: '#636E72',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#00B894',
  medium: '#FDCB6E',
  high: '#E17055',
};
