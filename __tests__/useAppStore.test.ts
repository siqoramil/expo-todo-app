import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { clearMockStorage, getMockStorage } from './setup';

function resetStore() {
  useAppStore.setState({
    language: 'uz',
    themeMode: 'system',
    systemColorScheme: null,
    loaded: false,
    profile: { firstName: '', lastName: '', email: '', imageUri: null },
  });
}

describe('useAppStore', () => {
  beforeEach(() => {
    clearMockStorage();
    resetStore();
  });

  describe('setLanguage', () => {
    it('tilni o\'zgartirishi kerak', () => {
      useAppStore.getState().setLanguage('en');
      expect(useAppStore.getState().language).toBe('en');
    });

    it('AsyncStorage ga saqlashi kerak', () => {
      useAppStore.getState().setLanguage('ru');
      expect(getMockStorage()['@app_language']).toBe('ru');
    });
  });

  describe('setThemeMode', () => {
    it('tema rejimini o\'zgartirishi kerak', () => {
      useAppStore.getState().setThemeMode('dark');
      expect(useAppStore.getState().themeMode).toBe('dark');
    });

    it('AsyncStorage ga saqlashi kerak', () => {
      useAppStore.getState().setThemeMode('light');
      expect(getMockStorage()['@app_theme']).toBe('light');
    });
  });

  describe('selectEffectiveTheme', () => {
    it('themeMode light bo\'lsa light qaytarishi kerak', () => {
      useAppStore.setState({ themeMode: 'light' });
      const result = selectEffectiveTheme(useAppStore.getState());
      expect(result).toBe('light');
    });

    it('themeMode dark bo\'lsa dark qaytarishi kerak', () => {
      useAppStore.setState({ themeMode: 'dark' });
      const result = selectEffectiveTheme(useAppStore.getState());
      expect(result).toBe('dark');
    });

    it('themeMode system va systemColorScheme dark bo\'lsa dark qaytarishi kerak', () => {
      useAppStore.setState({ themeMode: 'system', systemColorScheme: 'dark' });
      const result = selectEffectiveTheme(useAppStore.getState());
      expect(result).toBe('dark');
    });

    it('themeMode system va systemColorScheme light bo\'lsa light qaytarishi kerak', () => {
      useAppStore.setState({ themeMode: 'system', systemColorScheme: 'light' });
      const result = selectEffectiveTheme(useAppStore.getState());
      expect(result).toBe('light');
    });

    it('themeMode system va systemColorScheme null bo\'lsa light qaytarishi kerak', () => {
      useAppStore.setState({ themeMode: 'system', systemColorScheme: null });
      const result = selectEffectiveTheme(useAppStore.getState());
      expect(result).toBe('light');
    });
  });

  describe('t (translate)', () => {
    it('o\'zbek tilida tarjima qilishi kerak', () => {
      useAppStore.setState({ language: 'uz' });
      const result = useAppStore.getState().t('greeting');
      expect(result).toContain('Salom');
    });

    it('rus tilida tarjima qilishi kerak', () => {
      useAppStore.setState({ language: 'ru' });
      const result = useAppStore.getState().t('greeting');
      expect(result).toContain('Привет');
    });

    it('ingliz tilida tarjima qilishi kerak', () => {
      useAppStore.setState({ language: 'en' });
      const result = useAppStore.getState().t('greeting');
      expect(result).toContain('Hello');
    });
  });

  describe('profile', () => {
    it('profilni yangilashi kerak', () => {
      useAppStore.getState().setProfile({ firstName: 'Ali', lastName: 'Valiyev' });

      const { profile } = useAppStore.getState();
      expect(profile.firstName).toBe('Ali');
      expect(profile.lastName).toBe('Valiyev');
      expect(profile.email).toBe('');
    });

    it('profilni saqlashi va yuklashi kerak', async () => {
      await useAppStore.getState().saveProfile('user1', {
        firstName: 'Ali',
        email: 'ali@test.com',
      });

      resetStore();

      await useAppStore.getState().loadProfile('user1');

      const { profile } = useAppStore.getState();
      expect(profile.firstName).toBe('Ali');
      expect(profile.email).toBe('ali@test.com');
    });
  });

  describe('init', () => {
    it('AsyncStorage dan sozlamalarni yuklashi kerak', async () => {
      const storage = getMockStorage();
      storage['@app_language'] = 'en';
      storage['@app_theme'] = 'dark';

      await useAppStore.getState().init();

      const { language, themeMode, loaded } = useAppStore.getState();
      expect(language).toBe('en');
      expect(themeMode).toBe('dark');
      expect(loaded).toBe(true);
    });

    it('noto\'g\'ri qiymatlar bilan default qaytarishi kerak', async () => {
      const storage = getMockStorage();
      storage['@app_language'] = 'invalid';
      storage['@app_theme'] = 'invalid';

      await useAppStore.getState().init();

      const { language, themeMode } = useAppStore.getState();
      expect(language).toBe('uz');
      expect(themeMode).toBe('system');
    });
  });
});
