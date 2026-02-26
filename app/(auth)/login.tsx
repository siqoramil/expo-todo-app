import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';

  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const result = await signIn(email.trim(), password);
    if (result.error) {
      setError(result.error);
    }
  };

  const inputBg = isDark ? '#2A2D30' : '#F3F4F6';
  const inputColor = isDark ? '#F5F5F5' : '#1A1A2E';
  const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <LinearGradient
        colors={isDark ? ['#2D3436', '#1E2022'] : ['#636E72', '#B2BEC3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerContent}>
          <Ionicons name="checkmark-circle" size={48} color="#fff" style={styles.headerIcon} />
          <ThemedText style={styles.headerTitle}>{t('loginTitle')}</ThemedText>
          <ThemedText style={styles.headerSubtitle}>{t('loginSubtitle')}</ThemedText>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.form}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={[styles.card, isDark && styles.cardDark]}
        >
          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              {t('emailLabel')}
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: inputColor }]}
              value={email}
              onChangeText={setEmail}
              placeholder={t('emailPlaceholder')}
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              {t('passwordLabel')}
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: inputColor }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={placeholderColor}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={loading || !email || !password}
            style={[styles.primaryBtn, (loading || !email || !password) && styles.primaryBtnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.primaryBtnText}>{t('loginButton')}</ThemedText>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace('/(auth)/register')} style={styles.linkBtn}>
            <ThemedText style={[styles.linkText, isDark && styles.linkTextDark]}>
              {t('noAccount')}{' '}
            </ThemedText>
            <ThemedText style={styles.linkTextAccent}>{t('register')}</ThemedText>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#F7F8FC',
  },
  bgDark: {
    backgroundColor: '#151718',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  form: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardDark: {
    backgroundColor: '#1E2022',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  fieldLabelDark: {
    color: '#9CA3AF',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkTextDark: {
    color: '#9CA3AF',
  },
  linkTextAccent: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
});
