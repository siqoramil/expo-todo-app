import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import type { Category, Priority } from '@/types/todo';
import { CATEGORIES, PRIORITIES } from '@/types/todo';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { CATEGORY_COLORS, CATEGORY_EMOJI, PRIORITY_COLORS } from '@/i18n/translations';
import type { TranslationKey } from '@/i18n/translations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  personal: 'personal',
  work: 'work',
  shopping: 'shopping',
  health: 'health',
  study: 'study',
  other: 'other',
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  personal: 'person-outline',
  work: 'briefcase-outline',
  shopping: 'cart-outline',
  health: 'heart-outline',
  study: 'book-outline',
  other: 'ellipsis-horizontal-circle-outline',
};

const PRIORITY_KEYS: Record<string, TranslationKey> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

const PRIORITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  low: 'leaf-outline',
  medium: 'flash-outline',
  high: 'flame-outline',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, category: Category, priority: Priority) => void;
}

export function AddTodoModal({ visible, onClose, onAdd }: Props) {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const addBtnScale = useSharedValue(1);

  const handleAdd = () => {
    if (!title.trim()) return;
    addBtnScale.value = withSpring(0.92, {}, () => {
      addBtnScale.value = withSpring(1);
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd(title.trim(), category, priority);
    setTitle('');
    setCategory('personal');
    setPriority('medium');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setCategory('personal');
    setPriority('medium');
    onClose();
  };

  const addBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addBtnScale.value }],
  }));

  const charCount = title.length;
  const maxChars = 200;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Pressable style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={handleClose} />
        <View
          className="rounded-t-[28px] px-5 pt-3 bg-white dark:bg-[#1A1C20]"
          style={{ paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}
        >
          {/* Invisible focusable view to prevent auto-focus on TextInput */}
          <View accessible={false} focusable importantForAccessibility="no">
            <TextInput style={{ width: 0, height: 0, position: 'absolute' }} editable={false} />
          </View>

          {/* Handle bar */}
          <View className="w-10 h-1 rounded-sm self-center mb-4 bg-[#D1D5DB] dark:bg-[#3A3D45]" />

          {/* Header */}
          <View className="flex-row items-center mb-5">
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-[#F0EDFF] dark:bg-[#2D1B69]">
              <Ionicons name="add-circle-outline" size={22} color={isDark ? '#A29BFE' : '#6C5CE7'} />
            </View>
            <View className="flex-1 ml-3">
              <ThemedText className="text-xl font-bold text-app-text-primary dark:text-app-text-primary-dark">
                {t('newTask')}
              </ThemedText>
              <ThemedText className="text-xs font-medium mt-0.5 text-app-text-secondary dark:text-app-text-secondary-dark">
                {charCount}/{maxChars}
              </ThemedText>
            </View>
            <Pressable
              onPress={handleClose}
              hitSlop={10}
              className="w-8 h-8 rounded-[10px] items-center justify-center bg-app-surface dark:bg-app-surface-dark"
            >
              <Ionicons name="close" size={18} color={isDark ? '#7A7E87' : '#8E919A'} />
            </Pressable>
          </View>

          {/* Input */}
          <View>
            <View
              className="flex-row items-start rounded-2xl border-[1.5px] px-3.5 py-1 mb-1 bg-app-input-bg dark:bg-app-input-bg-dark"
              style={{ borderColor: title.length > 0 ? (isDark ? '#A29BFE' : '#6C5CE7') : (isDark ? '#2D3038' : '#E4E5EA') }}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={isDark ? '#7A7E87' : '#8E919A'}
                className="mt-3.5 mr-2.5"
              />
              <TextInput
                className="flex-1 text-[15px] font-medium min-h-[48px] max-h-[100px] py-3 text-app-text-primary dark:text-app-text-primary-dark"
                placeholder={t('writeTask')}
                placeholderTextColor={isDark ? '#4A4E57' : '#B0B3BA'}
                value={title}
                onChangeText={setTitle}
                multiline
                maxLength={maxChars}
              />
            </View>
          </View>

          {/* Category section */}
          <View>
            <View className="flex-row items-center gap-1.5 mt-4 mb-2.5">
              <Ionicons name="apps-outline" size={15} color={isDark ? '#7A7E87' : '#8E919A'} />
              <ThemedText className="text-[13px] font-semibold text-app-text-secondary dark:text-app-text-secondary-dark">
                {t('category')}
              </ThemedText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0">
              <View className="flex-row gap-2">
                {CATEGORIES.map((cat) => {
                  const color = CATEGORY_COLORS[cat];
                  const selected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        setCategory(cat);
                        Haptics.selectionAsync();
                      }}
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          paddingHorizontal: 14,
                          paddingVertical: 9,
                          borderRadius: 12,
                          borderWidth: 1.5,
                          backgroundColor: selected ? color : (isDark ? '#22252A' : '#F5F6FA'),
                          borderColor: selected ? color : (isDark ? '#2D3038' : '#EBEBEF'),
                        },
                      ]}
                    >
                      <Ionicons
                        name={CATEGORY_ICONS[cat]}
                        size={16}
                        color={selected ? '#fff' : color}
                      />
                      <ThemedText
                        className="text-[13px] font-semibold"
                        style={{ color: selected ? '#fff' : (isDark ? '#E8E9ED' : '#1A1B1F') }}
                      >
                        {t(CATEGORY_KEYS[cat])}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Priority section */}
          <View>
            <View className="flex-row items-center gap-1.5 mt-4 mb-2.5">
              <Ionicons name="flag-outline" size={15} color={isDark ? '#7A7E87' : '#8E919A'} />
              <ThemedText className="text-[13px] font-semibold text-app-text-secondary dark:text-app-text-secondary-dark">
                {t('priority')}
              </ThemedText>
            </View>
            <View className="flex-row gap-2">
              {PRIORITIES.map((p) => {
                const color = PRIORITY_COLORS[p];
                const selected = priority === p;
                return (
                  <Pressable
                    key={p}
                    onPress={() => {
                      setPriority(p);
                      Haptics.selectionAsync();
                    }}
                    style={[
                      {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        paddingVertical: 12,
                        borderRadius: 14,
                        borderWidth: 1.5,
                        backgroundColor: selected ? color + '18' : (isDark ? '#22252A' : '#F5F6FA'),
                        borderColor: selected ? color : (isDark ? '#2D3038' : '#EBEBEF'),
                      },
                    ]}
                  >
                    <Ionicons
                      name={PRIORITY_ICONS[p]}
                      size={18}
                      color={selected ? color : (isDark ? '#7A7E87' : '#8E919A')}
                    />
                    <ThemedText
                      className="text-xs font-bold"
                      style={{ color: selected ? color : (isDark ? '#E8E9ED' : '#1A1B1F') }}
                    >
                      {t(PRIORITY_KEYS[p])}
                    </ThemedText>
                    {selected && (
                      <View
                        style={{ backgroundColor: color }}
                        className="w-[5px] h-[5px] rounded-full mt-0.5"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-2.5 mt-6">
            <Pressable
              onPress={handleClose}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-3.5 rounded-[14px] border bg-app-surface dark:bg-app-surface-dark border-app-border dark:border-app-border-dark"
            >
              <Ionicons name="close-outline" size={20} color={isDark ? '#7A7E87' : '#8E919A'} />
              <ThemedText className="text-[15px] font-semibold text-app-text-secondary dark:text-app-text-secondary-dark">
                {t('cancel')}
              </ThemedText>
            </Pressable>

            <AnimatedPressable
              onPress={handleAdd}
              disabled={!title.trim()}
              style={[
                { flex: 2, borderRadius: 14, overflow: 'hidden' },
                !title.trim() && { opacity: 0.35 },
                addBtnStyle,
              ]}
            >
              <LinearGradient
                colors={['#6C5CE7', '#A29BFE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center gap-2 py-3.5 rounded-[14px]"
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Animated.Text className="text-[15px] font-bold text-white">
                  {t('add')}
                </Animated.Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
