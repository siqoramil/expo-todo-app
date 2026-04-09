import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { AuthInput } from '@/components/auth/AuthInput';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

// Floating orb decoration
function FloatingOrb({
  size,
  color,
  x,
  y,
  delay,
}: {
  size: number;
  color: string;
  x: number;
  y: number;
  delay: number;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isSmall = width < 375;
  const t = useAppStore((s) => s.t);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Animations
  const logoScale = useSharedValue(0.5);
  const logoRotate = useSharedValue(10);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    logoRotate.value = withSpring(0, { damping: 10, stiffness: 60 });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleRegister = async () => {
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    btnScale.value = withSequence(withSpring(0.95), withSpring(1));
    const result = await signUp(email.trim(), password, t);
    if (result.error) {
      setError(result.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Password strength indicator
  const passwordStrength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', '#EF4444', '#F59E0B', '#10B981'];
  const strengthLabels = ['', t('low'), t('medium'), t('high')];

  const c = {
    bg: isDark ? '#0B0D12' : '#F4F5FA',
    card: isDark ? '#14161C' : '#FFFFFF',
    cardBorder: isDark ? '#1E2028' : '#ECEDF2',
    text: isDark ? '#EAEBEF' : '#1A1B1F',
    textSecondary: isDark ? '#6B7080' : '#8A8D97',
    errorBg: isDark ? '#1F1215' : '#FEF2F2',
    errorBorder: isDark ? '#3D1A1E' : '#FECACA',
    errorText: '#EF4444',
    accent: '#10B981',
    accentLight: '#34D399',
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Full screen gradient background */}
      <LinearGradient
        colors={isDark ? ['#0B0D12', '#0D1A15', '#0B0D12'] : ['#ECFDF5', '#E0FBF0', '#F4F5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative floating orbs - green tones */}
      <FloatingOrb
        size={110}
        color={isDark ? '#10B98118' : '#10B98112'}
        x={-20}
        y={height * 0.12}
        delay={0}
      />
      <FloatingOrb
        size={70}
        color={isDark ? '#34D39915' : '#34D39910'}
        x={width - 50}
        y={height * 0.18}
        delay={400}
      />
      <FloatingOrb
        size={90}
        color={isDark ? '#10B98112' : '#10B98108'}
        x={width * 0.2}
        y={height * 0.78}
        delay={700}
      />

      {/* Back button */}
      <Animated.View
        entering={FadeIn.delay(400).duration(400)}
        style={{
          position: 'absolute',
          top: insets.top + 10,
          left: 16,
          zIndex: 10,
        }}>
        <Pressable
          onPress={() => router.replace('/(auth)/login')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(20,22,28,0.8)' : 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            borderColor: isDark ? '#1E2028' : '#E8E9EE',
          }}>
          <Ionicons name="arrow-back" size={20} color={c.text} />
        </Pressable>
      </Animated.View>

      {/* Language selector - top right */}
      <Animated.View
        entering={FadeIn.delay(600).duration(400)}
        style={{
          position: 'absolute',
          top: insets.top + 10,
          right: 16,
          flexDirection: 'row',
          gap: 4,
          zIndex: 10,
          backgroundColor: isDark ? 'rgba(20,22,28,0.8)' : 'rgba(255,255,255,0.8)',
          borderRadius: 20,
          padding: 3,
          borderWidth: 1,
          borderColor: isDark ? '#1E2028' : '#E8E9EE',
        }}>
        {(['uz', 'ru', 'en'] as const).map((lang) => {
          const flag = lang === 'uz' ? '🇺🇿' : lang === 'ru' ? '🇷🇺' : '🇺🇸';
          const active = language === lang;
          return (
            <Pressable
              key={lang}
              onPress={() => {
                Haptics.selectionAsync();
                setLanguage(lang);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: active ? c.accent : 'transparent',
              }}>
              <ThemedText style={{ fontSize: 14 }}>{flag}</ThemedText>
              {active && (
                <ThemedText style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>
                  {lang.toUpperCase()}
                </ThemedText>
              )}
            </Pressable>
          );
        })}
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: isSmall ? 20 : 28,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Logo & Title */}
          <Animated.View style={[{ alignItems: 'center', marginBottom: 36 }, logoStyle]}>
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={{
                width: isSmall ? 72 : 84,
                height: isSmall ? 72 : 84,
                borderRadius: isSmall ? 22 : 26,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                shadowColor: c.accent,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 15,
              }}>
              <LinearGradient
                colors={['#10B981', '#34D399']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: isSmall ? 22 : 26,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="person-add" size={isSmall ? 34 : 40} color="#fff" />
              </LinearGradient>
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(150).duration(500)}
              style={{
                fontSize: isSmall ? 26 : 30,
                fontWeight: '800',
                color: c.text,
                letterSpacing: -0.5,
              }}>
              {t('registerTitle')}
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(250).duration(500)}
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: c.textSecondary,
                marginTop: 6,
              }}>
              {t('registerSubtitle')}
            </Animated.Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500).springify()}
            style={{
              backgroundColor: isDark ? 'rgba(20,22,28,0.7)' : 'rgba(255,255,255,0.85)',
              borderRadius: 24,
              padding: isSmall ? 20 : 24,
              borderWidth: 1,
              borderColor: c.cardBorder,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 24,
              elevation: 8,
            }}>
            {/* Input fields */}
            <View style={{ gap: 14, marginBottom: 4 }}>
              <AuthInput
                icon="mail-outline"
                label={t('emailLabel')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                isDark={isDark}
                delay={400}
                accentColor="#10B981"
              />
              <AuthInput
                icon="lock-closed-outline"
                label={t('passwordLabel')}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="new-password"
                isDark={isDark}
                delay={500}
                accentColor="#10B981"
              />
            </View>

            {/* Password strength */}
            {password.length > 0 && (
              <Animated.View
                entering={FadeIn.duration(200)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 8,
                  marginBottom: 8,
                  paddingHorizontal: 4,
                }}>
                <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
                  {[1, 2, 3].map((level) => (
                    <View
                      key={level}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        backgroundColor:
                          passwordStrength >= level
                            ? strengthColors[passwordStrength]
                            : isDark
                              ? '#1E2028'
                              : '#E5E7EB',
                      }}
                    />
                  ))}
                </View>
                <ThemedText
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: strengthColors[passwordStrength],
                  }}>
                  {strengthLabels[passwordStrength]}
                </ThemedText>
              </Animated.View>
            )}

            {/* Error */}
            {error && (
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: c.errorBg,
                  borderRadius: 12,
                  padding: 12,
                  marginTop: 8,
                  marginBottom: 4,
                  borderWidth: 1,
                  borderColor: c.errorBorder,
                }}>
                <Ionicons name="alert-circle" size={18} color={c.errorText} />
                <ThemedText
                  style={{ flex: 1, fontSize: 13, fontWeight: '500', color: c.errorText }}>
                  {error}
                </ThemedText>
              </Animated.View>
            )}

            {/* Register Button */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(400)}
              style={[btnStyle, { marginTop: 12 }]}>
              <Pressable
                onPress={handleRegister}
                disabled={loading || !email || !password}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: !email || !password ? 0.4 : 1,
                }}>
                <LinearGradient
                  colors={['#10B981', '#34D399']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                  }}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <ThemedText style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                        {t('registerButton')}
                      </ThemedText>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Divider */}
            <Animated.View
              entering={FadeIn.delay(700).duration(400)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 16,
                gap: 12,
              }}>
              <View
                style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: c.cardBorder }}
              />
              <ThemedText style={{ fontSize: 11, fontWeight: '600', color: c.textSecondary }}>
                {t('haveAccount')}
              </ThemedText>
              <View
                style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: c.cardBorder }}
              />
            </Animated.View>

            {/* Login link */}
            <Animated.View entering={FadeInDown.delay(750).duration(400)}>
              <Pressable
                onPress={() => router.replace('/(auth)/login')}
                style={{
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  borderWidth: 1.5,
                  borderColor: isDark ? '#10B98130' : '#10B98125',
                  backgroundColor: isDark ? '#10B98108' : '#10B98106',
                }}>
                <Ionicons name="log-in-outline" size={16} color={c.accent} />
                <ThemedText style={{ fontSize: 14, fontWeight: '700', color: c.accent }}>
                  {t('login')}
                </ThemedText>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
