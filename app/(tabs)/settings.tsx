import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
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
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const isDark = effectiveTheme === 'dark';

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

  const handleLanguage = (lang: 'uz' | 'ru') => {
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
    accent: '#7C6CF0',
    accentLight: isDark ? '#2A2450' : '#EDEAFF',
  };

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.profileCard, { backgroundColor: c.card, borderColor: c.cardBorder }]}
        >
          <AnimatedPressable
            onPress={handlePickImage}
            onPressIn={onAvatarPressIn}
            onPressOut={onAvatarPressOut}
            disabled={uploadingAvatar}
            style={[styles.avatarWrap, avatarAnimStyle]}
          >
            {profile.imageUri ? (
              <Image
                source={{ uri: profile.imageUri }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <LinearGradient
                colors={['#7C6CF0', '#A594FD']}
                style={styles.avatarFallback}
              >
                {initials ? (
                  <ThemedText style={styles.avatarInitials}>{initials}</ThemedText>
                ) : (
                  <Ionicons name="person" size={32} color="rgba(255,255,255,0.85)" />
                )}
              </LinearGradient>
            )}
            <View style={[styles.cameraBadge, uploadingAvatar && { backgroundColor: '#A594FD' }]}>
              {uploadingAvatar ? (
                <ActivityIndicator size={11} color="#fff" />
              ) : (
                <Ionicons name="camera" size={13} color="#fff" />
              )}
            </View>
          </AnimatedPressable>

          <View style={styles.profileInfo}>
            <ThemedText style={[styles.profileName, { color: c.text }]} numberOfLines={1}>
              {displayName || t('profile')}
            </ThemedText>
            {profile.email ? (
              <ThemedText style={[styles.profileEmail, { color: c.textSecondary }]} numberOfLines={1}>
                {profile.email}
              </ThemedText>
            ) : null}
          </View>
        </Animated.View>

        {/* Edit Profile */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(500)}
          style={[styles.section, { backgroundColor: c.card, borderColor: c.cardBorder }]}
        >
          <View style={styles.sectionRow}>
            <View style={[styles.sectionDot, { backgroundColor: c.accentLight }]}>
              <Ionicons name="create-outline" size={16} color={c.accent} />
            </View>
            <ThemedText style={[styles.sectionLabel, { color: c.text }]}>{t('personalInfo')}</ThemedText>
          </View>

          <View style={styles.fields}>
            {[
              { icon: 'person-outline' as const, value: firstName, setter: setFirstName, ph: t('firstNamePlaceholder') },
              { icon: 'text-outline' as const, value: lastName, setter: setLastName, ph: t('lastNamePlaceholder') },
              { icon: 'mail-outline' as const, value: email, setter: setEmail, ph: t('emailPlaceholder'), kb: 'email-address' as const },
            ].map((f, i) => (
              <View key={i} style={[styles.field, { backgroundColor: c.inputBg, borderColor: c.inputBorder }]}>
                <Ionicons name={f.icon} size={17} color={c.placeholder} />
                <TextInput
                  style={[styles.fieldInput, { color: c.text }]}
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
                style={[styles.saveBtn, saving && { opacity: 0.55 }]}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.saveBtnText}>{t('save')}</ThemedText>
                )}
              </Pressable>
            </Animated.View>
          )}
          {showSaved && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.savedRow}>
              <Ionicons name="checkmark-circle" size={15} color="#34D399" />
              <ThemedText style={styles.savedLabel}>{t('saved')}</ThemedText>
            </Animated.View>
          )}
        </Animated.View>

        {/* Theme */}
        <Animated.View
          entering={FadeInDown.delay(160).duration(500)}
          style={[styles.section, { backgroundColor: c.card, borderColor: c.cardBorder }]}
        >
          <View style={styles.sectionRow}>
            <View style={[styles.sectionDot, { backgroundColor: isDark ? '#2A2520' : '#FFF5E6' }]}>
              <Ionicons name="sunny-outline" size={16} color="#F59E0B" />
            </View>
            <ThemedText style={[styles.sectionLabel, { color: c.text }]}>{t('appearance')}</ThemedText>
          </View>

          <View style={styles.themeStrip}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              const label = mode === 'light' ? t('lightTheme') : mode === 'dark' ? t('darkTheme') : t('systemTheme');
              const icon = mode === 'light' ? 'sunny' : mode === 'dark' ? 'moon' : 'phone-portrait-outline';
              return (
                <Pressable
                  key={mode}
                  onPress={() => handleTheme(mode)}
                  style={[
                    styles.themePill,
                    { backgroundColor: active ? c.accent : (isDark ? '#13151A' : '#F0F1F5') },
                  ]}
                >
                  <Ionicons
                    name={icon as any}
                    size={16}
                    color={active ? '#fff' : c.textSecondary}
                  />
                  <ThemedText style={[
                    styles.themePillLabel,
                    { color: active ? '#fff' : c.textSecondary },
                  ]}>
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Language */}
        <Animated.View
          entering={FadeInDown.delay(240).duration(500)}
          style={[styles.section, { backgroundColor: c.card, borderColor: c.cardBorder }]}
        >
          <View style={styles.sectionRow}>
            <View style={[styles.sectionDot, { backgroundColor: isDark ? '#152525' : '#E6FAF4' }]}>
              <Ionicons name="globe-outline" size={16} color="#34D399" />
            </View>
            <ThemedText style={[styles.sectionLabel, { color: c.text }]}>{t('language')}</ThemedText>
          </View>

          <View style={styles.langGroup}>
            {([
              { lang: 'uz' as const, flag: '🇺🇿', label: t('uzbek') },
              { lang: 'ru' as const, flag: '🇷🇺', label: t('russian') },
            ]).map(({ lang, flag, label }) => {
              const active = language === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => handleLanguage(lang)}
                  style={[
                    styles.langItem,
                    { backgroundColor: isDark ? '#13151A' : '#F0F1F5', borderColor: active ? c.accent : 'transparent' },
                  ]}
                >
                  <ThemedText style={styles.langFlag}>{flag}</ThemedText>
                  <ThemedText style={[styles.langName, { color: active ? c.accent : c.text }]}>
                    {label}
                  </ThemedText>
                  {active && <Ionicons name="checkmark-circle" size={20} color={c.accent} />}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Sign out */}
        <Animated.View entering={FadeInDown.delay(320).duration(500)}>
          <Pressable onPress={handleSignOut} style={[styles.signOutRow, { backgroundColor: isDark ? '#1A1315' : '#FEF5F3' }]}>
            <Ionicons name="log-out-outline" size={18} color="#EF6C57" />
            <ThemedText style={styles.signOutLabel}>{t('signOut')}</ThemedText>
          </Pressable>
        </Animated.View>

        <ThemedText style={[styles.version, { color: c.placeholder }]}>Todo App v1.0.0</ThemedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 12 },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 20, fontWeight: '700' },
  profileEmail: { fontSize: 13, fontWeight: '500' },

  // Section
  section: { borderRadius: 20, padding: 18, borderWidth: 1 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionDot: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 15, fontWeight: '700' },

  // Fields
  fields: { gap: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  fieldInput: { flex: 1, paddingVertical: 13, fontSize: 14, fontWeight: '500' },

  // Save
  saveBtn: {
    marginTop: 12,
    backgroundColor: '#7C6CF0',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  savedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 },
  savedLabel: { color: '#34D399', fontSize: 13, fontWeight: '600' },

  // Theme
  themeStrip: { flexDirection: 'row', gap: 8 },
  themePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
  },
  themePillLabel: { fontSize: 12, fontWeight: '600' },

  // Language
  langGroup: { gap: 8 },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  langFlag: { fontSize: 24 },
  langName: { flex: 1, fontSize: 14, fontWeight: '600' },

  // Sign Out
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  signOutLabel: { color: '#EF6C57', fontSize: 14, fontWeight: '700' },

  // Version
  version: { textAlign: 'center', fontSize: 11, fontWeight: '500', marginTop: 4 },
});
