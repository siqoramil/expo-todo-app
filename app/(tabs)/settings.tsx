import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

type ThemeMode = 'light' | 'dark' | 'system';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
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

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [showSaved, setShowSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const avatarScale = useSharedValue(1);

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
    Haptics.selectionAsync();
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

  const onAvatarPressIn = () => {
    avatarScale.value = withSpring(0.93);
  };
  const onAvatarPressOut = () => {
    avatarScale.value = withSpring(1);
  };

  const c = {
    bg: isDark ? '#0F1115' : '#F4F5F9',
    card: isDark ? '#191B1F' : '#FFFFFF',
    cardBorder: isDark ? '#252830' : '#EBEBEF',
    inputBg: isDark ? '#13151A' : '#F0F1F5',
    inputBorder: isDark ? '#252830' : '#E4E5EA',
    text: isDark ? '#E8E9ED' : '#1A1B1F',
    textSecondary: isDark ? '#7A7E87' : '#8E919A',
    placeholder: isDark ? '#4A4E57' : '#B0B3BA',
    accent: '#6C5CE7',
    accentSoft: isDark ? '#A29BFE' : '#6C5CE7',
  };

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase();

  return (
    <View className="flex-1" style={{ backgroundColor: c.bg }}>
      {/* Gradient header with avatar */}
      <LinearGradient
        colors={isDark ? ['#2D1B69', '#1E2022'] : ['#6C5CE7', '#A29BFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 pb-7 rounded-b-[28px] items-center"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Animated.View entering={FadeInDown.duration(600)} className="items-center gap-2">
          <AnimatedPressable
            onPress={handlePickImage}
            onPressIn={onAvatarPressIn}
            onPressOut={onAvatarPressOut}
            disabled={uploadingAvatar}
            className="relative mb-1"
            style={avatarAnimStyle}
          >
            {profile.imageUri ? (
              <Image
                source={{ uri: profile.imageUri }}
                style={{ width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View
                className="items-center justify-center"
                style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                {initials ? (
                  <ThemedText className="text-[28px] font-extrabold text-white tracking-wider">{initials}</ThemedText>
                ) : (
                  <Ionicons name="person-outline" size={36} color="rgba(255,255,255,0.85)" />
                )}
              </View>
            )}
            <View
              className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-[15px] items-center justify-center"
              style={{ backgroundColor: uploadingAvatar ? '#A29BFE' : '#6C5CE7', borderWidth: 3, borderColor: 'rgba(108,92,231,0.3)' }}
            >
              {uploadingAvatar ? (
                <ActivityIndicator size={12} color="#fff" />
              ) : (
                <Ionicons name="camera-outline" size={14} color="#fff" />
              )}
            </View>
          </AnimatedPressable>

          <ThemedText className="text-[22px] font-bold text-white" numberOfLines={1}>
            {displayName || t('profile')}
          </ThemedText>
          {profile.email ? (
            <ThemedText className="text-[13px] font-medium text-white/[0.65]" numberOfLines={1}>
              {profile.email}
            </ThemedText>
          ) : null}
        </Animated.View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Profile */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="rounded-[20px] p-[18px] border"
          style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
        >
          <View className="flex-row items-center gap-2.5 mb-4">
            <View
              className="w-8 h-8 rounded-[10px] items-center justify-center"
              style={{ backgroundColor: isDark ? '#1E1535' : '#F0EDFF' }}
            >
              <Ionicons name="person-circle-outline" size={16} color={c.accentSoft} />
            </View>
            <ThemedText className="text-[15px] font-bold" style={{ color: c.text }}>{t('personalInfo')}</ThemedText>
          </View>

          <View className="gap-2">
            {[
              { icon: 'person-outline' as const, value: firstName, setter: setFirstName, ph: t('firstNamePlaceholder') },
              { icon: 'text-outline' as const, value: lastName, setter: setLastName, ph: t('lastNamePlaceholder') },
              { icon: 'mail-outline' as const, value: email, setter: setEmail, ph: t('emailPlaceholder'), kb: 'email-address' as const },
            ].map((f, i) => (
              <View
                key={i}
                className="flex-row items-center gap-2.5 px-3.5 rounded-[14px] border"
                style={{ backgroundColor: c.inputBg, borderColor: c.inputBorder }}
              >
                <Ionicons name={f.icon} size={17} color={c.placeholder} />
                <TextInput
                  className="flex-1 py-[13px] text-sm font-medium"
                  style={{ color: c.text }}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.ph}
                  placeholderTextColor={c.placeholder}
                  keyboardType={f.kb ?? 'default'}
                  autoCapitalize={f.kb ? 'none' : 'words'}
                />
              </View>
            ))}
          </View>

          {hasChanges && (
            <Animated.View entering={FadeIn.duration(250)}>
              <Pressable
                onPress={handleSave}
                disabled={saving}
                className="mt-3 rounded-[14px] overflow-hidden"
                style={saving ? { opacity: 0.55 } : undefined}
              >
                <LinearGradient
                  colors={['#6C5CE7', '#A29BFE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-[13px] items-center rounded-[14px]"
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <ThemedText className="text-sm font-bold text-white">{t('save')}</ThemedText>
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>
          )}
          {showSaved && (
            <Animated.View entering={FadeIn.duration(250)} className="flex-row items-center justify-center gap-[5px] mt-2.5">
              <Ionicons name="checkmark-circle" size={15} color="#34D399" />
              <ThemedText className="text-[13px] font-semibold text-success">{t('saved')}</ThemedText>
            </Animated.View>
          )}
        </Animated.View>

        {/* Appearance */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="rounded-[20px] p-[18px] border"
          style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
        >
          <View className="flex-row items-center gap-2.5 mb-4">
            <View
              className="w-8 h-8 rounded-[10px] items-center justify-center"
              style={{ backgroundColor: isDark ? '#2A2520' : '#FFF5E6' }}
            >
              <Ionicons name="contrast-outline" size={16} color="#F59E0B" />
            </View>
            <ThemedText className="text-[15px] font-bold" style={{ color: c.text }}>{t('appearance')}</ThemedText>
          </View>

          <View className="flex-row gap-2">
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              const label = mode === 'light' ? t('lightTheme') : mode === 'dark' ? t('darkTheme') : t('systemTheme');
              const icon = mode === 'light' ? 'sunny-outline' : mode === 'dark' ? 'moon-outline' : 'phone-portrait-outline';
              return (
                <Pressable
                  key={mode}
                  onPress={() => handleTheme(mode)}
                  className="flex-1 items-center py-3.5 rounded-[14px] gap-2"
                  style={{
                    backgroundColor: active ? (isDark ? '#2D1B69' : '#F0EDFF') : (isDark ? '#13151A' : '#F0F1F5'),
                    borderColor: active ? c.accentSoft : 'transparent',
                    borderWidth: 1.5,
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: active ? c.accentSoft + '20' : 'transparent' }}
                  >
                    <Ionicons
                      name={icon as any}
                      size={20}
                      color={active ? c.accentSoft : c.textSecondary}
                    />
                  </View>
                  <ThemedText
                    className="text-xs font-semibold"
                    style={{ color: active ? c.accentSoft : c.textSecondary }}
                  >
                    {label}
                  </ThemedText>
                  {active && (
                    <View
                      className="w-1.5 h-1.5 rounded-full mt-0.5"
                      style={{ backgroundColor: c.accentSoft }}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Language */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className="rounded-[20px] p-[18px] border"
          style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
        >
          <View className="flex-row items-center gap-2.5 mb-4">
            <View
              className="w-8 h-8 rounded-[10px] items-center justify-center"
              style={{ backgroundColor: isDark ? '#152525' : '#E6FAF4' }}
            >
              <Ionicons name="language-outline" size={16} color="#34D399" />
            </View>
            <ThemedText className="text-[15px] font-bold" style={{ color: c.text }}>{t('language')}</ThemedText>
          </View>

          <View className="gap-2">
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
                  className="flex-row items-center gap-3 py-[13px] px-3.5 rounded-[14px]"
                  style={{
                    backgroundColor: active ? (isDark ? '#152525' : '#E6FAF4') : (isDark ? '#13151A' : '#F0F1F5'),
                    borderColor: active ? '#34D399' : 'transparent',
                    borderWidth: 1.5,
                  }}
                >
                  <ThemedText className="text-2xl">{flag}</ThemedText>
                  <ThemedText
                    className="flex-1 text-sm font-semibold"
                    style={{ color: active ? (isDark ? '#6EE7B7' : '#059669') : c.text }}
                  >
                    {label}
                  </ThemedText>
                  {active && <Ionicons name="radio-button-on" size={20} color="#34D399" />}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Sign out */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Pressable
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 py-[15px] rounded-2xl border"
            style={{ backgroundColor: isDark ? '#1A1315' : '#FEF5F3', borderColor: isDark ? '#2D2025' : '#FDE8E4' }}
          >
            <Ionicons name="exit-outline" size={18} color="#EF6C57" />
            <ThemedText className="text-sm font-bold text-signout">{t('signOut')}</ThemedText>
          </Pressable>
        </Animated.View>

        <ThemedText className="text-center text-[11px] font-medium mt-1" style={{ color: c.placeholder }}>Todo App v1.0.0</ThemedText>
      </ScrollView>
    </View>
  );
}
