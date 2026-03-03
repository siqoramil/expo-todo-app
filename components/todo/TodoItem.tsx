import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import type { Todo } from '@/types/todo';
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

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const scale = useSharedValue(1);
  const catColor = CATEGORY_COLORS[todo.category];
  const prioColor = PRIORITY_COLORS[todo.priority];
  const [expanded, setExpanded] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggle = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(todo.id);
  };

  const handleEdit = () => {
    setExpanded(false);
    Haptics.selectionAsync();
    onEdit(todo);
  };

  const handleDelete = () => {
    setExpanded(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      t('delete'),
      t('deleteConfirm'),
      [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
          style: 'destructive',
          onPress: () => onDelete(todo.id),
        },
      ],
    );
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExpanded((prev) => !prev);
  };

  const timeAgo = getTimeAgo(todo.createdAt, t);

  const c = {
    card: isDark ? '#1E2022' : '#fff',
    actionBg: isDark ? '#252830' : '#F5F5F7',
  };

  return (
    <AnimatedPressable
      onPress={handleToggle}
      onLongPress={handleLongPress}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify()}
      className="rounded-2xl mx-4 my-[5px] overflow-hidden flex-row shadow-sm"
      style={[
        { backgroundColor: c.card, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
        todo.completed && { opacity: isDark ? 0.6 : 0.7 },
        animatedStyle,
      ]}
    >
      <View className="w-1 self-stretch" style={{ backgroundColor: prioColor }} />

      <View className="flex-1">
        <View className="flex-row items-center">
          <Pressable onPress={handleToggle} className="p-3.5 pr-1">
            <View
              className="w-[26px] h-[26px] rounded-lg items-center justify-center"
              style={[
                { borderWidth: 2.5 },
                isDark ? { borderColor: '#444' } : { borderColor: '#D1D5DB' },
                todo.completed && { backgroundColor: catColor, borderColor: catColor },
              ]}
            >
              {todo.completed && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </Animated.View>
              )}
            </View>
          </Pressable>

          <View className="flex-1 py-3.5 px-2">
            <ThemedText
              className="text-[15px] font-semibold leading-5"
              style={[
                todo.completed && { textDecorationLine: 'line-through' as const, color: isDark ? '#555' : '#aaa' },
              ]}
              numberOfLines={2}
            >
              {todo.title}
            </ThemedText>
            <View className="flex-row items-center mt-1.5 gap-2">
              <View className="px-2 py-0.5 rounded-md" style={{ backgroundColor: catColor + '20' }}>
                <ThemedText className="text-[11px] font-semibold" style={{ color: catColor }}>
                  {CATEGORY_EMOJI[todo.category]} {t(CATEGORY_KEYS[todo.category])}
                </ThemedText>
              </View>
              <ThemedText className={`text-[11px] ${isDark ? 'text-[#9BA1A6]' : 'text-[#9CA3AF]'}`}>
                {timeAgo}
              </ThemedText>
            </View>
          </View>

          <Pressable onPress={() => setExpanded((prev) => !prev)} className="p-3.5 pl-1" hitSlop={8}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'ellipsis-horizontal'}
              size={18}
              color={isDark ? '#666' : '#B0B3BA'}
            />
          </Pressable>
        </View>

        {/* Action buttons */}
        {expanded && (
          <Animated.View
            entering={FadeInDown.duration(200)}
            className="flex-row mt-0.5"
            style={{ backgroundColor: c.actionBg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' }}
          >
            <Pressable onPress={handleEdit} className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5">
              <Ionicons name="pencil-outline" size={17} color="#6C5CE7" />
              <ThemedText className="text-[13px] font-semibold" style={{ color: '#6C5CE7' }}>{t('edit')}</ThemedText>
            </Pressable>
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: isDark ? '#333' : '#E5E5EA', marginVertical: 6 }} />
            <Pressable onPress={handleDelete} className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5">
              <Ionicons name="trash-bin-outline" size={17} color="#E17055" />
              <ThemedText className="text-[13px] font-semibold" style={{ color: '#E17055' }}>{t('delete')}</ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </AnimatedPressable>
  );
}

function getTimeAgo(timestamp: number, t: (key: TranslationKey) => string): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t('now');
  if (minutes < 60) return `${minutes} ${t('minutesShort')}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t('hoursShort')}`;
  const days = Math.floor(hours / 24);
  return `${days} ${t('daysShort')}`;
}

