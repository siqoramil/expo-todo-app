import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const scale = useSharedValue(1);
  const catColor = CATEGORY_COLORS[todo.category];
  const prioColor = PRIORITY_COLORS[todo.priority];

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

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(todo.id);
  };

  const timeAgo = getTimeAgo(todo.createdAt, t);

  return (
    <AnimatedPressable
      onPress={handleToggle}
      onLongPress={handleDelete}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify()}
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        todo.completed && (isDark ? styles.completedDark : styles.completedLight),
        animatedStyle,
      ]}
    >
      <View style={[styles.priorityBar, { backgroundColor: prioColor }]} />

      <Pressable onPress={handleToggle} style={styles.checkboxArea}>
        <Animated.View
          style={[
            styles.checkbox,
            isDark ? styles.checkboxDark : styles.checkboxLight,
            todo.completed && { backgroundColor: catColor, borderColor: catColor },
          ]}
        >
          {todo.completed && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.checkmark}>
              ✓
            </Animated.Text>
          )}
        </Animated.View>
      </Pressable>

      <View style={styles.content}>
        <ThemedText
          style={[
            styles.title,
            todo.completed && styles.titleCompleted,
            todo.completed && { color: isDark ? '#555' : '#aaa' },
          ]}
          numberOfLines={2}
        >
          {todo.title}
        </ThemedText>
        <View style={styles.meta}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
            <ThemedText style={[styles.categoryText, { color: catColor }]}>
              {CATEGORY_EMOJI[todo.category]} {t(CATEGORY_KEYS[todo.category])}
            </ThemedText>
          </View>
          <ThemedText style={[styles.time, isDark && styles.timeDark]}>{timeAgo}</ThemedText>
        </View>
      </View>

      <Pressable onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
        <ThemedText style={styles.deleteIcon}>×</ThemedText>
      </Pressable>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  containerLight: { backgroundColor: '#fff' },
  containerDark: { backgroundColor: '#1E2022' },
  completedLight: { opacity: 0.7 },
  completedDark: { opacity: 0.6 },
  priorityBar: { width: 4, alignSelf: 'stretch' },
  checkboxArea: { padding: 14, paddingRight: 4 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLight: { borderColor: '#D1D5DB' },
  checkboxDark: { borderColor: '#444' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  content: { flex: 1, paddingVertical: 14, paddingHorizontal: 8 },
  title: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  titleCompleted: { textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  time: { fontSize: 11, color: '#9CA3AF' },
  timeDark: { color: '#9BA1A6' },
  deleteBtn: { padding: 14, paddingLeft: 4 },
  deleteIcon: { fontSize: 22, color: '#E17055', fontWeight: '300' },
});
