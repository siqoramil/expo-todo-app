import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const storeLoaded = useAppStore((s) => s.loaded);
  const init = useAppStore((s) => s.init);
  const loadProfile = useAppStore((s) => s.loadProfile);
  const setSystemColorScheme = useAppStore((s) => s.setSystemColorScheme);
  const effectiveTheme = useAppStore(selectEffectiveTheme);

  const authInitialized = useAuthStore((s) => s.initialized);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);

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
    if (!authInitialized || !storeLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, authInitialized, storeLoaded, segments, router]);

  if (!loaded || !storeLoaded || !authInitialized) {
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
    </ThemeProvider>
  );
}
