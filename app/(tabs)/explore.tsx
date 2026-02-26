import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/hooks/useTodos';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { CATEGORIES } from '@/types/todo';
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

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const { todos, clearCompleted } = useTodos();

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((td) => td.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byCategory = CATEGORIES.map((cat) => {
      const catTodos = todos.filter((td) => td.category === cat);
      return {
        category: cat,
        total: catTodos.length,
        completed: catTodos.filter((td) => td.completed).length,
      };
    }).filter((c) => c.total > 0);

    const byPriority = (['high', 'medium', 'low'] as const).map((p) => {
      const pTodos = todos.filter((td) => td.priority === p);
      return {
        priority: p,
        total: pTodos.length,
        completed: pTodos.filter((td) => td.completed).length,
      };
    }).filter((p) => p.total > 0);

    return { total, completed, pending, rate, byCategory, byPriority };
  }, [todos]);

  const handleClearCompleted = () => {
    if (stats.completed === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    clearCompleted();
  };

  const getRateMessage = () => {
    if (stats.rate === 100) return t('rateExcellent');
    if (stats.rate >= 75) return t('rateGood');
    if (stats.rate >= 50) return t('rateOkay');
    if (stats.total === 0) return t('rateNoTasks');
    return t('rateKeepGoing');
  };

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <LinearGradient
        colors={isDark ? ['#1B3A4B', '#1E2022'] : ['#0984E3', '#74B9FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <ThemedText style={styles.headerTitle}>{t('statistics')}</ThemedText>
          <ThemedText style={styles.headerSubtitle}>{t('statsSubtitle')}</ThemedText>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.summaryRow}>
          <View style={[styles.summaryCard, isDark && styles.cardDark]}>
            <ThemedText style={styles.summaryEmoji}>📋</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: '#6C5CE7' }]}>{stats.total}</ThemedText>
            <ThemedText style={[styles.summaryLabel, isDark && styles.labelDark]}>{t('total')}</ThemedText>
          </View>
          <View style={[styles.summaryCard, isDark && styles.cardDark]}>
            <ThemedText style={styles.summaryEmoji}>✅</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: '#00B894' }]}>{stats.completed}</ThemedText>
            <ThemedText style={[styles.summaryLabel, isDark && styles.labelDark]}>{t('done')}</ThemedText>
          </View>
          <View style={[styles.summaryCard, isDark && styles.cardDark]}>
            <ThemedText style={styles.summaryEmoji}>⏳</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: '#E17055' }]}>{stats.pending}</ThemedText>
            <ThemedText style={[styles.summaryLabel, isDark && styles.labelDark]}>{t('pending')}</ThemedText>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={[styles.card, isDark && styles.cardDark]}
        >
          <ThemedText style={styles.cardTitle}>{t('completionRate')}</ThemedText>
          <View style={styles.rateContainer}>
            <View style={[styles.circleOuter, { borderColor: stats.rate >= 50 ? '#00B894' : '#E17055' }]}>
              <ThemedText style={[styles.rateValue, { color: stats.rate >= 50 ? '#00B894' : '#E17055' }]}>
                {stats.rate}%
              </ThemedText>
            </View>
            <View style={styles.rateInfo}>
              <ThemedText style={[styles.rateText, isDark && styles.rateTextDark]}>{getRateMessage()}</ThemedText>
            </View>
          </View>
        </Animated.View>

        {stats.byCategory.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={[styles.card, isDark && styles.cardDark]}
          >
            <ThemedText style={styles.cardTitle}>{t('byCategory')}</ThemedText>
            {stats.byCategory.map((item) => (
              <View key={item.category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[item.category] }]} />
                  <ThemedText style={styles.catName}>
                    {CATEGORY_EMOJI[item.category]} {t(CATEGORY_KEYS[item.category])}
                  </ThemedText>
                </View>
                <View style={styles.categoryProgress}>
                  <View style={[styles.catBarBg, isDark && styles.catBarBgDark]}>
                    <View
                      style={[
                        styles.catBarFill,
                        {
                          backgroundColor: CATEGORY_COLORS[item.category],
                          width: item.total > 0 ? `${(item.completed / item.total) * 100}%` : '0%',
                        },
                      ]}
                    />
                  </View>
                  <ThemedText style={[styles.catCount, isDark && styles.labelDark]}>
                    {item.completed}/{item.total}
                  </ThemedText>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {stats.byPriority.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            style={[styles.card, isDark && styles.cardDark]}
          >
            <ThemedText style={styles.cardTitle}>{t('byPriority')}</ThemedText>
            {stats.byPriority.map((item) => (
              <View key={item.priority} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.catDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
                  <ThemedText style={styles.catName}>{t(PRIORITY_KEYS[item.priority])}</ThemedText>
                </View>
                <View style={styles.categoryProgress}>
                  <View style={[styles.catBarBg, isDark && styles.catBarBgDark]}>
                    <View
                      style={[
                        styles.catBarFill,
                        {
                          backgroundColor: PRIORITY_COLORS[item.priority],
                          width: item.total > 0 ? `${(item.completed / item.total) * 100}%` : '0%',
                        },
                      ]}
                    />
                  </View>
                  <ThemedText style={[styles.catCount, isDark && styles.labelDark]}>
                    {item.completed}/{item.total}
                  </ThemedText>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {stats.completed > 0 && (
          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <Pressable onPress={handleClearCompleted} style={[styles.clearBtn, isDark && styles.clearBtnDark]}>
              <ThemedText style={styles.clearBtnText}>
                {t('clearCompleted')} ({stats.completed})
              </ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgLight: { backgroundColor: '#F7F8FC' },
  bgDark: { backgroundColor: '#151718' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  scrollContent: { padding: 16, gap: 14 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardDark: { backgroundColor: '#1E2022' },
  summaryEmoji: { fontSize: 24, marginBottom: 8 },
  summaryValue: { fontSize: 28, fontWeight: '800' },
  summaryLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  labelDark: { color: '#9BA1A6' },
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
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  rateContainer: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  circleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateValue: { fontSize: 26, fontWeight: '800' },
  rateInfo: { flex: 1 },
  rateText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  rateTextDark: { color: '#9BA1A6' },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 14, fontWeight: '600' },
  categoryProgress: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  catBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  catBarBgDark: { backgroundColor: '#2A2D30' },
  catBarFill: { height: '100%', borderRadius: 4 },
  catCount: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', minWidth: 30, textAlign: 'right' },
  clearBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearBtnDark: {
    backgroundColor: '#3D2020',
  },
  clearBtnText: { fontSize: 15, fontWeight: '700', color: '#E17055' },
});
