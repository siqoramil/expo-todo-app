import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const t = useAppStore((s) => s.t);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const result = await signIn(email.trim(), password, t);
    if (result.error) {
      setError(result.error);
    }
  };

  const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';

  return (
    <View className="flex-1 bg-app-bg dark:bg-app-bg-dark">
      <LinearGradient
        colors={isDark ? ['#2D3436', '#1E2022'] : ['#636E72', '#B2BEC3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 pb-8 rounded-b-[28px]"
        style={{ paddingTop: insets.top + 20 }}
      >
        <Animated.View entering={FadeInDown.duration(600)} className="items-center">
          <Ionicons name="checkmark-circle" size={48} color="#fff" className="mb-3" />
          <ThemedText className="text-[28px] font-extrabold text-white mb-1">
            {t('loginTitle')}
          </ThemedText>
          <ThemedText className="text-sm text-white/70 font-medium">
            {t('loginSubtitle')}
          </ThemedText>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 p-4 justify-center"
      >
        <Animated.View
          entering={FadeInDown.delay(50).duration(400)}
          className="flex-row justify-center gap-2 mb-4"
        >
          {(['uz', 'ru', 'en'] as const).map((lang) => {
            const flag = lang === 'uz' ? '🇺🇿' : lang === 'ru' ? '🇷🇺' : '🇺🇸';
            const active = language === lang;
            return (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ${
                  active ? 'bg-primary' : 'bg-white/15'
                }`}
              >
                <ThemedText className="text-base">{flag}</ThemedText>
                <ThemedText
                  className={`text-xs font-semibold ${
                    active ? 'text-white' : 'text-black/50'
                  }`}
                >
                  {lang.toUpperCase()}
                </ThemedText>
              </Pressable>
            );
          })}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="bg-app-card dark:bg-app-card-dark rounded-[18px] p-5 elevation-2 shadow-black shadow-offset-[0px]/[2px] shadow-opacity-[0.06] shadow-radius-[8px]"
        >
          <View className="mb-4">
            <ThemedText className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              {t('emailLabel')}
            </ThemedText>
            <TextInput
              className="px-3.5 py-3 rounded-xl text-[15px] font-medium bg-[#F3F4F6] dark:bg-[#2A2D30] text-[#1A1A2E] dark:text-[#F5F5F5]"
              value={email}
              onChangeText={setEmail}
              placeholder={t('emailPlaceholder')}
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-4">
            <ThemedText className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              {t('passwordLabel')}
            </ThemedText>
            <TextInput
              className="px-3.5 py-3 rounded-xl text-[15px] font-medium bg-[#F3F4F6] dark:bg-[#2A2D30] text-[#1A1A2E] dark:text-[#F5F5F5]"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={placeholderColor}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {error && (
            <View className="bg-red-100 rounded-[10px] p-3 mb-3.5">
              <ThemedText className="text-danger text-[13px] font-medium text-center">
                {error}
              </ThemedText>
            </View>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={loading || !email || !password}
            className={`bg-primary py-3.5 rounded-[14px] items-center mt-1 ${
              (loading || !email || !password) ? 'opacity-50' : ''
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText className="text-white text-base font-bold">
                {t('loginButton')}
              </ThemedText>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.replace('/(auth)/register')}
            className="flex-row justify-center mt-4"
          >
            <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
              {t('noAccount')}{' '}
            </ThemedText>
            <ThemedText className="text-sm text-primary font-semibold">
              {t('register')}
            </ThemedText>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
