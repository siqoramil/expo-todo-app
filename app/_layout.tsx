import '../global.css';
import '../lib/nativewind-interop';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme as useNWColorScheme } from 'nativewind';
import 'react-native-reanimated';

import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';
import { ThemeTransition } from '@/components/ThemeTransition';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setColorScheme } = useNWColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const storeLoaded = useAppStore((s) => s.loaded);
  const init = useAppStore((s) => s.init);
  const loadProfile = useAppStore((s) => s.loadProfile);
  const setSystemColorScheme = useAppStore((s) => s.setSystemColorScheme);
  const themeMode = useAppStore((s) => s.themeMode);
  const effectiveTheme = useAppStore(selectEffectiveTheme);

  const authInitialized = useAuthStore((s) => s.initialized);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);

  const [showSplash, setShowSplash] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    init();
    initializeAuth();
  }, [init, initializeAuth]);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    }
  }, [user?.id, loadProfile]);

  useEffect(() => {
    setSystemColorScheme(colorScheme);
  }, [colorScheme, setSystemColorScheme]);

  useEffect(() => {
    setColorScheme(themeMode);
  }, [themeMode, setColorScheme]);

  useEffect(() => {
    if (!authInitialized || !storeLoaded || !loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      setTimeout(() => router.replace('/(auth)/login'), 0);
    } else if (user && inAuthGroup) {
      setTimeout(() => router.replace('/(tabs)'), 0);
    }
  }, [user, authInitialized, storeLoaded, loaded, segments, router]);

  const appReady = loaded && storeLoaded && authInitialized;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
      <ThemeTransition theme={effectiveTheme === 'dark' ? 'dark' : 'light'} />
      {showSplash && (
        <AnimatedSplashScreen
          onFinish={handleSplashFinish}
          theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
        />
      )}
    </ThemeProvider>
  );
}
