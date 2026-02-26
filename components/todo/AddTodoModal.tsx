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
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import type { Category, Priority } from '@/types/todo';
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

  const handleAdd = () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd(title, category, priority);
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          style={[styles.sheet, isDark ? styles.sheetDark : styles.sheetLight]}
        >
          <View style={[styles.handle, isDark && styles.handleDark]} />
          <ThemedText style={styles.sheetTitle}>{t('newTask')}</ThemedText>

          <TextInput
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            placeholder={t('writeTask')}
            placeholderTextColor={isDark ? '#666' : '#aaa'}
            value={title}
            onChangeText={setTitle}
            autoFocus
            multiline
            maxLength={200}
          />

          <ThemedText style={[styles.label, isDark && styles.labelDark]}>{t('category')}</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <View style={styles.chipRow}>
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
                      styles.chip,
                      { borderColor: color },
                      selected && { backgroundColor: color },
                    ]}
                  >
                    <ThemedText style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {CATEGORY_EMOJI[cat]} {t(CATEGORY_KEYS[cat])}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <ThemedText style={[styles.label, isDark && styles.labelDark]}>{t('priority')}</ThemedText>
          <View style={styles.priorityRow}>
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
                    styles.priorityChip,
                    { borderColor: color },
                    selected && { backgroundColor: color },
                  ]}
                >
                  <ThemedText style={[styles.priorityText, selected && styles.chipTextSelected]}>
                    {t(PRIORITY_KEYS[p])}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable onPress={handleClose} style={[styles.cancelBtn, isDark && styles.cancelBtnDark]}>
              <ThemedText style={[styles.cancelText, isDark && styles.cancelTextDark]}>{t('cancel')}</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
              disabled={!title.trim()}
            >
              <Animated.Text entering={FadeIn} style={styles.addBtnText}>
                {t('add')}
              </Animated.Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
  },
  sheetLight: { backgroundColor: '#fff' },
  sheetDark: { backgroundColor: '#1E2022' },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  handleDark: {
    backgroundColor: '#444',
  },
  sheetTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  input: {
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    minHeight: 56,
    maxHeight: 120,
    borderWidth: 1.5,
  },
  inputLight: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#111' },
  inputDark: { backgroundColor: '#2A2D30', borderColor: '#333', color: '#eee' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#888' },
  labelDark: { color: '#9BA1A6' },
  chipScroll: { flexGrow: 0 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityText: { fontSize: 13, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 28 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelBtnDark: {
    backgroundColor: '#2A2D30',
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  cancelTextDark: { color: '#9BA1A6' },
  addBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
  },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
