import { useState, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTodos } from '@/hooks/useTodos';

type ThemeMode = 'light' | 'dark' | 'system';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mini progress ring for header
function MiniRing({ rate, size, strokeWidth, color, trackColor }: {
  rate: number; size: number; strokeWidth: number; color: string; trackColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (rate / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${circumference}`} strokeDashoffset={progress}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

// Animated menu row item
function MenuRow({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  onPress,
  isLast,
  borderColor,
  textColor,
  secondaryColor,
  delay = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  borderColor: string;
  textColor: string;
  secondaryColor: string;
  delay?: number;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 4,
            borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: borderColor,
          },
          animStyle,
        ]}
      >
        <View style={{
          width: 36, height: 36, borderRadius: 10,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: iconBg,
        }}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <ThemedText style={{ flex: 1, marginLeft: 14, fontSize: 15, fontWeight: '600', color: textColor }}>
          {label}
        </ThemedText>
        {value && (
          <ThemedText style={{ fontSize: 13, fontWeight: '500', color: secondaryColor, marginRight: 6 }}>
            {value}
          </ThemedText>
        )}
        {onPress && (
          <Ionicons name="chevron-forward" size={16} color={secondaryColor} />
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const t = useAppStore((s) => s.t);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const { todos } = useTodos();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [showSaved, setShowSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const avatarScale = useSharedValue(1);
  const headerGlow = useSharedValue(0);

  // Stats for header
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((td) => td.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, rate };
  }, [todos]);

  useEffect(() => {
    headerGlow.value = withDelay(400, withTiming(1, { duration: 800 }));
  }, [headerGlow]);

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
  }, [profile.firstName, profile.lastName, profile.email]);

  const hasChanges =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    email !== profile.email;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveProfile(user.id, { firstName, lastName, email });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSaved(true);
      setEditMode(false);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setUploadingAvatar(true);
      try {
        const localUri = result.assets[0].uri;
        await saveProfile(user.id, { imageUri: localUri });
        Haptics.selectionAsync();
      } catch (err) {
        console.error('Failed to save avatar:', err);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await signOut();
  };

  const handleTheme = (mode: ThemeMode) => {
    Haptics.selectionAsync();
    setThemeMode(mode);
  };

  const handleLanguage = (lang: 'uz' | 'ru' | 'en') => {
    Haptics.selectionAsync();
    setLanguage(lang);
  };

  const avatarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(headerGlow.value, [0, 1], [0, 0.6]),
    transform: [{ scale: interpolate(headerGlow.value, [0, 1], [0.8, 1]) }],
  }));

  const onAvatarPressIn = () => { avatarScale.value = withSpring(0.9); };
  const onAvatarPressOut = () => { avatarScale.value = withSpring(1); };

  const avatarSize = isSmall ? 80 : 96;

  const c = {
    bg: isDark ? '#0B0D11' : '#F2F3F8',
    card: isDark ? '#16181D' : '#FFFFFF',
    cardBorder: isDark ? '#1F2228' : '#ECEDF2',
    inputBg: isDark ? '#1C1E24' : '#F5F6FA',
    inputBorder: isDark ? '#2A2D35' : '#E2E3EA',
    text: isDark ? '#EAEBEF' : '#1A1B1F',
    textSecondary: isDark ? '#6B7080' : '#8A8D97',
    placeholder: isDark ? '#40444D' : '#B5B8C2',
    accent: '#6C5CE7',
    accentSoft: isDark ? '#A29BFE' : '#6C5CE7',
    accentBg: isDark ? '#1A1530' : '#F0EDFF',
    success: '#10B981',
    successBg: isDark ? '#0D2818' : '#ECFDF5',
    danger: '#EF4444',
    dangerBg: isDark ? '#1F1215' : '#FEF2F2',
    dangerBorder: isDark ? '#2D1A1E' : '#FECACA',
    warm: '#F59E0B',
    warmBg: isDark ? '#1F1A0F' : '#FFFBEB',
  };

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase();

  const currentThemeLabel = themeMode === 'light' ? t('lightTheme') : themeMode === 'dark' ? t('darkTheme') : t('systemTheme');
  const currentLangLabel = language === 'uz' ? t('uzbek') : language === 'ru' ? t('russian') : t('english');

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* ─── Premium Header ─── */}
      <LinearGradient
        colors={isDark ? ['#1E1145', '#160E30', '#0B0D11'] : ['#6C5CE7', '#8B7CF7', '#A29BFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        {/* Glow effect behind avatar */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: insets.top + 20,
              alignSelf: 'center',
              width: avatarSize * 2,
              height: avatarSize * 2,
              borderRadius: avatarSize,
              backgroundColor: isDark ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.15)',
            },
            glowStyle,
          ]}
        />

        <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center' }}>
          {/* Avatar */}
          <AnimatedPressable
            onPress={handlePickImage}
            onPressIn={onAvatarPressIn}
            onPressOut={onAvatarPressOut}
            disabled={uploadingAvatar}
            style={[{ marginBottom: 14, position: 'relative' }, avatarAnimStyle]}
          >
            {profile.imageUri ? (
              <Image
                source={{ uri: profile.imageUri }}
                style={{
                  width: avatarSize, height: avatarSize,
                  borderRadius: avatarSize / 2,
                  borderWidth: 3.5, borderColor: 'rgba(255,255,255,0.25)',
                }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <LinearGradient
                colors={isDark ? ['#2D1B69', '#4A3399'] : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={{
                  width: avatarSize, height: avatarSize,
                  borderRadius: avatarSize / 2,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 3, borderColor: 'rgba(255,255,255,0.15)',
                }}
              >
                {initials ? (
                  <ThemedText style={{ fontSize: avatarSize * 0.3, fontWeight: '800', color: '#fff', letterSpacing: 2 }}>
                    {initials}
                  </ThemedText>
                ) : (
                  <Ionicons name="person" size={avatarSize * 0.38} color="rgba(255,255,255,0.8)" />
                )}
              </LinearGradient>
            )}

            {/* Camera badge */}
            <View style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 32, height: 32, borderRadius: 16,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#6C5CE7',
              borderWidth: 3, borderColor: isDark ? '#1E1145' : '#8B7CF7',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
            }}>
              {uploadingAvatar ? (
                <ActivityIndicator size={12} color="#fff" />
              ) : (
                <Ionicons name="camera" size={14} color="#fff" />
              )}
            </View>
          </AnimatedPressable>

          {/* Name & email */}
          <ThemedText style={{
            fontSize: isSmall ? 20 : 24, fontWeight: '700', color: '#fff',
            letterSpacing: 0.3,
          }} numberOfLines={1}>
            {displayName || t('profile')}
          </ThemedText>
          {profile.email ? (
            <ThemedText style={{
              fontSize: 13, fontWeight: '500',
              color: 'rgba(255,255,255,0.55)', marginTop: 4,
            }} numberOfLines={1}>
              {profile.email}
            </ThemedText>
          ) : null}

          {/* Stats pills */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={{
              flexDirection: 'row', gap: 10, marginTop: 18,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16,
            }}
          >
            <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
                {stats.total}
              </ThemedText>
              <ThemedText style={{ fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {t('total')}
              </ThemedText>
            </View>
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 }} />
            <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
              <ThemedText style={{ fontSize: 18, fontWeight: '800', color: '#7DFFB3' }}>
                {stats.completed}
              </ThemedText>
              <ThemedText style={{ fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {t('done')}
              </ThemedText>
            </View>
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 }} />
            <View style={{ alignItems: 'center', paddingHorizontal: 10, position: 'relative' }}>
              <View style={{ position: 'absolute', top: -2, right: -4 }}>
                <MiniRing rate={stats.rate} size={28} strokeWidth={2.5} color="#A29BFE" trackColor="rgba(255,255,255,0.1)" />
              </View>
              <ThemedText style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
                {stats.rate}%
              </ThemedText>
              <ThemedText style={{ fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {t('completionRate')}
              </ThemedText>
            </View>
          </Animated.View>
        </Animated.View>
      </LinearGradient>

      {/* ─── Content ─── */}
      <ScrollView
        contentContainerStyle={{
          padding: isSmall ? 14 : 18,
          gap: 14,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : Math.max(insets.bottom, 16) + 76,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Personal Info Card ─── */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(450)}
          style={{
            backgroundColor: c.card, borderRadius: 22,
            borderWidth: 1, borderColor: c.cardBorder,
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: 18, paddingTop: 16, paddingBottom: 14,
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: c.accentBg,
            }}>
              <Ionicons name="person-circle" size={18} color={c.accentSoft} />
            </View>
            <ThemedText style={{ flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '700', color: c.text }}>
              {t('personalInfo')}
            </ThemedText>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setEditMode(!editMode);
              }}
              hitSlop={10}
              style={{
                paddingHorizontal: 12, paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: editMode ? c.accentSoft : c.inputBg,
              }}
            >
              <ThemedText style={{ fontSize: 12, fontWeight: '700', color: editMode ? '#fff' : c.accentSoft }}>
                {editMode ? t('cancel') : t('edit')}
              </ThemedText>
            </Pressable>
          </View>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.cardBorder }} />

          {/* Fields */}
          {editMode ? (
            <Animated.View entering={FadeIn.duration(300)} style={{ padding: 18, gap: 10 }}>
              {[
                { icon: 'person-outline' as const, value: firstName, setter: setFirstName, ph: t('firstNamePlaceholder') },
                { icon: 'text-outline' as const, value: lastName, setter: setLastName, ph: t('lastNamePlaceholder') },
                { icon: 'mail-outline' as const, value: email, setter: setEmail, ph: t('emailPlaceholder'), kb: 'email-address' as const },
              ].map((f, i) => (
                <Animated.View
                  key={i}
                  entering={FadeInDown.delay(i * 80).duration(300)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                    paddingHorizontal: 14, borderRadius: 14,
                    borderWidth: 1.5,
                    backgroundColor: c.inputBg,
                    borderColor: f.value ? c.accentSoft + '40' : c.inputBorder,
                  }}
                >
                  <Ionicons name={f.icon} size={17} color={f.value ? c.accentSoft : c.placeholder} />
                  <TextInput
                    style={{ flex: 1, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: c.text }}
                    value={f.value}
                    onChangeText={f.setter}
                    placeholder={f.ph}
                    placeholderTextColor={c.placeholder}
                    keyboardType={f.kb ?? 'default'}
                    autoCapitalize={f.kb ? 'none' : 'words'}
                  />
                </Animated.View>
              ))}

              {/* Save button */}
              {hasChanges && (
                <Animated.View entering={FadeIn.duration(250)}>
                  <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    style={{ borderRadius: 14, overflow: 'hidden', marginTop: 4, opacity: saving ? 0.6 : 1 }}
                  >
                    <LinearGradient
                      colors={['#6C5CE7', '#8B7CF7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ paddingVertical: 14, alignItems: 'center', borderRadius: 14, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="checkmark-circle" size={18} color="#fff" />
                          <ThemedText style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{t('save')}</ThemedText>
                        </>
                      )}
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              )}
              {showSaved && (
                <Animated.View entering={FadeIn.duration(250)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                  <Ionicons name="checkmark-circle" size={16} color={c.success} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '600', color: c.success }}>{t('saved')}</ThemedText>
                </Animated.View>
              )}
            </Animated.View>
          ) : (
            <View style={{ paddingHorizontal: 18, paddingVertical: 6 }}>
              {[
                { icon: 'person-outline' as const, label: t('firstName'), value: profile.firstName || '—' },
                { icon: 'text-outline' as const, label: t('lastName'), value: profile.lastName || '—' },
                { icon: 'mail-outline' as const, label: t('email'), value: profile.email || '—' },
              ].map((f, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    paddingVertical: 14,
                    borderBottomWidth: i < 2 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: c.cardBorder,
                  }}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 10,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: c.inputBg,
                  }}>
                    <Ionicons name={f.icon} size={16} color={c.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontSize: 11, fontWeight: '600', color: c.textSecondary, marginBottom: 2 }}>
                      {f.label}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 15, fontWeight: '600', color: c.text }} numberOfLines={1}>
                      {f.value}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* ─── Appearance Card ─── */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(450)}
          style={{
            backgroundColor: c.card, borderRadius: 22,
            borderWidth: 1, borderColor: c.cardBorder,
            padding: 18,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: c.warmBg,
            }}>
              <Ionicons name="color-palette" size={18} color={c.warm} />
            </View>
            <ThemedText style={{ fontSize: 16, fontWeight: '700', color: c.text }}>{t('appearance')}</ThemedText>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              const label = mode === 'light' ? t('lightTheme') : mode === 'dark' ? t('darkTheme') : t('systemTheme');
              const icon = mode === 'light' ? 'sunny' : mode === 'dark' ? 'moon' : 'phone-portrait';
              const iconOutline = mode === 'light' ? 'sunny-outline' : mode === 'dark' ? 'moon-outline' : 'phone-portrait-outline';
              return (
                <Pressable
                  key={mode}
                  onPress={() => handleTheme(mode)}
                  style={{
                    flex: 1, alignItems: 'center',
                    paddingVertical: 14, borderRadius: 16, gap: 6,
                    backgroundColor: active ? c.accentBg : c.inputBg,
                    borderWidth: 1.5,
                    borderColor: active ? c.accentSoft + '50' : 'transparent',
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: active ? c.accentSoft + '18' : 'transparent',
                  }}>
                    <Ionicons
                      name={active ? icon as any : iconOutline as any}
                      size={20}
                      color={active ? c.accentSoft : c.textSecondary}
                    />
                  </View>
                  <ThemedText style={{
                    fontSize: isSmall ? 10 : 11, fontWeight: '700',
                    color: active ? c.accentSoft : c.textSecondary,
                  }}>
                    {label}
                  </ThemedText>
                  {active && (
                    <View style={{
                      width: 5, height: 5, borderRadius: 2.5,
                      backgroundColor: c.accentSoft,
                    }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ─── Language Card ─── */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(450)}
          style={{
            backgroundColor: c.card, borderRadius: 22,
            borderWidth: 1, borderColor: c.cardBorder,
            padding: 18,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: c.successBg,
            }}>
              <Ionicons name="globe" size={18} color={c.success} />
            </View>
            <ThemedText style={{ fontSize: 16, fontWeight: '700', color: c.text }}>{t('language')}</ThemedText>
          </View>

          <View style={{ gap: 6 }}>
            {([
              { lang: 'uz' as const, flag: '\u{1F1FA}\u{1F1FF}', label: t('uzbek') },
              { lang: 'ru' as const, flag: '\u{1F1F7}\u{1F1FA}', label: t('russian') },
              { lang: 'en' as const, flag: '\u{1F1FA}\u{1F1F8}', label: t('english') },
            ]).map(({ lang, flag, label }) => {
              const active = language === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => handleLanguage(lang)}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    gap: 12, paddingVertical: 12, paddingHorizontal: 14,
                    borderRadius: 14,
                    backgroundColor: active ? c.successBg : c.inputBg,
                    borderWidth: 1.5,
                    borderColor: active ? c.success + '40' : 'transparent',
                  }}
                >
                  <ThemedText style={{ fontSize: 22 }}>{flag}</ThemedText>
                  <ThemedText style={{
                    flex: 1, fontSize: 14, fontWeight: '600',
                    color: active ? c.success : c.text,
                  }}>
                    {label}
                  </ThemedText>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11,
                    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
                    borderColor: active ? c.success : (isDark ? '#333' : '#D1D5DB'),
                    backgroundColor: active ? c.success : 'transparent',
                  }}>
                    {active && <Ionicons name="checkmark" size={13} color="#fff" />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ─── Sign Out ─── */}
        <Animated.View entering={FadeInDown.delay(400).duration(450)}>
          <Pressable
            onPress={handleSignOut}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 8, paddingVertical: 15, borderRadius: 18,
              backgroundColor: c.dangerBg,
              borderWidth: 1, borderColor: c.dangerBorder,
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={c.danger} />
            <ThemedText style={{ fontSize: 14, fontWeight: '700', color: c.danger }}>
              {t('signOut')}
            </ThemedText>
          </Pressable>
        </Animated.View>

        {/* Version */}
        <ThemedText style={{
          textAlign: 'center', fontSize: 11, fontWeight: '500',
          color: c.placeholder, marginTop: 4,
        }}>
          Todo App v1.0.0
        </ThemedText>
      </ScrollView>
    </View>
  );
}
