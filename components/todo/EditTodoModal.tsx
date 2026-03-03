import { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import type { Category, Priority, Todo } from '@/types/todo';
import { CATEGORIES, PRIORITIES } from '@/types/todo';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { CATEGORY_COLORS, CATEGORY_EMOJI, PRIORITY_COLORS } from '@/i18n/translations';
import type { TranslationKey } from '@/i18n/translations';

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  personal: 'personal',
  work: 'work',
  shopping: 'shopping',
  health: 'health',
  study: 'study',
  other: 'other',
};

const PRIORITY_KEYS: Record<string, TranslationKey> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

interface Props {
  visible: boolean;
  todo: Todo | null;
  onClose: () => void;
  onSave: (id: string, title: string, category: Category, priority: Priority) => void;
}

export function EditTodoModal({ visible, todo, onClose, onSave }: Props) {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setCategory(todo.category);
      setPriority(todo.priority);
    }
  }, [todo]);

  const handleSave = () => {
    if (!title.trim() || !todo) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(todo.id, title, category, priority);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Pressable className="absolute inset-0 bg-black/50" onPress={handleClose} />
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          className="rounded-t-[28px] px-6 pt-3 bg-white dark:bg-[#1E2022]"
          style={{ paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}
        >
          <View className="w-10 h-1 rounded-full bg-[#D1D5DB] dark:bg-[#444] self-center mb-5" />
          <ThemedText className="text-[22px] font-bold mb-5">{t('editTask')}</ThemedText>

          <TextInput
            className="rounded-[14px] p-4 text-base min-h-[56px] max-h-[120px] border-[1.5px] bg-[#F9FAFB] dark:bg-[#2A2D30] border-[#E5E7EB] dark:border-[#333] text-[#111] dark:text-[#eee]"
            placeholder={t('writeTask')}
            placeholderTextColor={isDark ? '#666' : '#aaa'}
            value={title}
            onChangeText={setTitle}
            autoFocus
            multiline
            maxLength={200}
          />

          <ThemedText className="text-sm font-semibold mt-5 mb-2.5 text-[#888] dark:text-[#9BA1A6]">
            {t('category')}
          </ThemedText>
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
                    className="px-3.5 py-2 rounded-xl border-[1.5px]"
                    style={[
                      { borderColor: color },
                      selected && { backgroundColor: color },
                    ]}
                  >
                    <ThemedText className={`text-[13px] font-semibold ${selected ? 'text-white' : ''}`}>
                      {CATEGORY_EMOJI[cat]} {t(CATEGORY_KEYS[cat])}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <ThemedText className="text-sm font-semibold mt-5 mb-2.5 text-[#888] dark:text-[#9BA1A6]">
            {t('priority')}
          </ThemedText>
          <View className="flex-row gap-2.5">
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
                  className="flex-1 py-2.5 rounded-xl border-[1.5px] items-center"
                  style={[
                    { borderColor: color },
                    selected && { backgroundColor: color },
                  ]}
                >
                  <ThemedText className={`text-[13px] font-bold ${selected ? 'text-white' : ''}`}>
                    {t(PRIORITY_KEYS[p])}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View className="flex-row gap-3 mt-7">
            <Pressable
              onPress={handleClose}
              className="flex-1 py-4 rounded-[14px] items-center bg-[#F3F4F6] dark:bg-[#2A2D30]"
            >
              <ThemedText className="text-base font-semibold text-[#6B7280] dark:text-[#9BA1A6]">
                {t('cancel')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className={`flex-[2] py-4 rounded-[14px] items-center bg-[#6C5CE7] ${!title.trim() ? 'opacity-40' : ''}`}
              disabled={!title.trim()}
            >
              <Animated.Text entering={FadeIn} className="text-base font-bold text-white">
                {t('save')}
              </Animated.Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

