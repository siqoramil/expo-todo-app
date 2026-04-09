import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/useAuthStore';
import { clearMockStorage } from './setup';
import type { TranslationKey } from '@/i18n/translations';

const t = (key: TranslationKey) => key;

function resetStore() {
  useAuthStore.setState({ user: null, loading: false, initialized: false });
}

describe('useAuthStore', () => {
  beforeEach(() => {
    clearMockStorage();
    resetStore();
  });

  describe('signUp', () => {
    it("yangi foydalanuvchi ro'yxatdan o'tishi kerak", async () => {
      const { signUp } = useAuthStore.getState();
      const result = await signUp('test@mail.com', 'password123', t);

      expect(result.error).toBeNull();
      const { user } = useAuthStore.getState();
      expect(user).not.toBeNull();
      expect(user!.email).toBe('test@mail.com');
    });

    it("bo'sh email bilan xatolik qaytarishi kerak", async () => {
      const { signUp } = useAuthStore.getState();
      const result = await signUp('', 'password123', t);

      expect(result.error).toBe('validationEmailRequired');
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("noto'g'ri email formati bilan xatolik qaytarishi kerak", async () => {
      const { signUp } = useAuthStore.getState();
      const result = await signUp('invalid-email', 'password123', t);

      expect(result.error).toBe('validationEmailInvalid');
    });

    it("bo'sh parol bilan xatolik qaytarishi kerak", async () => {
      const { signUp } = useAuthStore.getState();
      const result = await signUp('test@mail.com', '', t);

      expect(result.error).toBe('validationPasswordRequired');
    });

    it('qisqa parol bilan xatolik qaytarishi kerak', async () => {
      const { signUp } = useAuthStore.getState();
      const result = await signUp('test@mail.com', '12345', t);

      expect(result.error).toBe('validationPasswordMin');
    });

    it('takroriy email bilan xatolik qaytarishi kerak', async () => {
      const { signUp } = useAuthStore.getState();
      await signUp('test@mail.com', 'password123', t);
      resetStore();

      const result = await useAuthStore.getState().signUp('test@mail.com', 'password456', t);
      expect(result.error).toBe('emailAlreadyRegistered');
    });

    it("email case-insensitive bo'lishi kerak", async () => {
      const { signUp } = useAuthStore.getState();
      await signUp('Test@Mail.com', 'password123', t);
      resetStore();

      const result = await useAuthStore.getState().signUp('test@mail.com', 'password456', t);
      expect(result.error).toBe('emailAlreadyRegistered');
    });
  });

  describe('signIn', () => {
    beforeEach(async () => {
      await useAuthStore.getState().signUp('user@test.com', 'mypassword', t);
      resetStore();
    });

    it("to'g'ri ma'lumotlar bilan kirishi kerak", async () => {
      const result = await useAuthStore.getState().signIn('user@test.com', 'mypassword', t);

      expect(result.error).toBeNull();
      expect(useAuthStore.getState().user).not.toBeNull();
      expect(useAuthStore.getState().user!.email).toBe('user@test.com');
    });

    it("mavjud bo'lmagan email bilan xatolik qaytarishi kerak", async () => {
      const result = await useAuthStore.getState().signIn('nobody@test.com', 'mypassword', t);

      expect(result.error).toBe('userNotFound');
    });

    it("noto'g'ri parol bilan xatolik qaytarishi kerak", async () => {
      const result = await useAuthStore.getState().signIn('user@test.com', 'wrongpassword', t);

      expect(result.error).toBe('wrongPassword');
    });

    it("bo'sh email bilan validatsiya xatoligi qaytarishi kerak", async () => {
      const result = await useAuthStore.getState().signIn('', 'password', t);
      expect(result.error).toBe('validationEmailRequired');
    });

    it("noto'g'ri email formati bilan xatolik qaytarishi kerak", async () => {
      const result = await useAuthStore.getState().signIn('bad-email', 'password', t);
      expect(result.error).toBe('validationEmailInvalid');
    });

    it('qisqa parol bilan xatolik qaytarishi kerak', async () => {
      const result = await useAuthStore.getState().signIn('user@test.com', '123', t);
      expect(result.error).toBe('validationPasswordMin');
    });
  });

  describe('signOut', () => {
    it('foydalanuvchini tizimdan chiqarishi kerak', async () => {
      await useAuthStore.getState().signUp('user@test.com', 'password123', t);
      expect(useAuthStore.getState().user).not.toBeNull();

      await useAuthStore.getState().signOut();
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('initialize', () => {
    it('saqlangan foydalanuvchini yuklashi kerak', async () => {
      await useAuthStore.getState().signUp('user@test.com', 'password123', t);
      resetStore();

      await useAuthStore.getState().initialize();

      const { user, initialized } = useAuthStore.getState();
      expect(user).not.toBeNull();
      expect(user!.email).toBe('user@test.com');
      expect(initialized).toBe(true);
    });

    it("foydalanuvchi bo'lmasa initialized true bo'lishi kerak", async () => {
      await useAuthStore.getState().initialize();

      const { user, initialized } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(initialized).toBe(true);
    });
  });
});
