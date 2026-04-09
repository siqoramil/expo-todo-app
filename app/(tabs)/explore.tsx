import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/hooks/useTodos';
import { useAppStore } from '@/stores/useAppStore';
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

const PRIORITY_ICONS: Record<string, string> = {
  high: 'flame-outline',
  medium: 'flash-outline',
  low: 'leaf-outline',
};

function ProgressRing({
  rate,
  size,
  strokeWidth,
  color,
}: {
  rate: number;
  size: number;
  strokeWidth: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (rate / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <ThemedText className="text-[28px] font-extrabold text-white">{rate}%</ThemedText>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const t = useAppStore((s) => s.t);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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

    const byPriority = (['high', 'medium', 'low'] as const)
      .map((p) => {
        const pTodos = todos.filter((td) => td.priority === p);
        return {
          priority: p,
          total: pTodos.length,
          completed: pTodos.filter((td) => td.completed).length,
        };
      })
      .filter((p) => p.total > 0);

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

  const c = {
    bg: isDark ? '#0F1115' : '#F4F5F9',
    card: isDark ? '#191B1F' : '#FFFFFF',
    cardBorder: isDark ? '#252830' : '#EBEBEF',
    text: isDark ? '#E8E9ED' : '#1A1B1F',
    textSecondary: isDark ? '#7A7E87' : '#8E919A',
    barBg: isDark ? '#252830' : '#F0F1F5',
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c.bg }}>
      {/* Header with progress ring */}
      <LinearGradient
        colors={isDark ? ['#2D1B69', '#1E2022'] : ['#6C5CE7', '#A29BFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: isSmall ? 16 : 20,
          paddingBottom: isSmall ? 16 : 20,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}>
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="flex-row justify-between items-center mb-5">
          <View className="flex-1 mr-4">
            <ThemedText
              style={{
                fontSize: isSmall ? 24 : 28,
                fontWeight: '800',
                color: '#fff',
                marginBottom: 4,
              }}>
              {t('statistics')}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: isSmall ? 12 : 14,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: '500',
              }}>
              {t('statsSubtitle')}
            </ThemedText>
          </View>
          <ProgressRing
            rate={stats.rate}
            size={isSmall ? 72 : 88}
            strokeWidth={isSmall ? 6 : 8}
            color="#fff"
          />
        </Animated.View>

        {/* Summary pills inside header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          className="flex-row bg-white/[0.12] rounded-2xl py-3.5 px-2 items-center">
          <View className="flex-1 items-center gap-1">
            <Ionicons name="layers-outline" size={18} color="rgba(255,255,255,0.85)" />
            <ThemedText className="text-[22px] font-extrabold text-white">{stats.total}</ThemedText>
            <ThemedText className="text-[11px] text-white/60 font-semibold">
              {t('total')}
            </ThemedText>
          </View>
          <View className="w-px h-8 bg-white/15" />
          <View className="flex-1 items-center gap-1">
            <Ionicons name="checkmark-done-circle-outline" size={18} color="#7DFFB3" />
            <ThemedText className="text-[22px] font-extrabold text-white">
              {stats.completed}
            </ThemedText>
            <ThemedText className="text-[11px] text-white/60 font-semibold">{t('done')}</ThemedText>
          </View>
          <View className="w-px h-8 bg-white/15" />
          <View className="flex-1 items-center gap-1">
            <Ionicons name="hourglass-outline" size={18} color="#FFD07A" />
            <ThemedText className="text-[22px] font-extrabold text-white">
              {stats.pending}
            </ThemedText>
            <ThemedText className="text-[11px] text-white/60 font-semibold">
              {t('pending')}
            </ThemedText>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          padding: isSmall ? 12 : 16,
          gap: 12,
          paddingBottom:
            Platform.OS === 'ios' ? insets.bottom + 16 : Math.max(insets.bottom, 16) + 70,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Rate message card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="rounded-2xl border items-center py-4 px-5"
          style={{ backgroundColor: c.card, borderColor: c.cardBorder }}>
          <ThemedText className="text-[15px] font-semibold text-center" style={{ color: c.text }}>
            {getRateMessage()}
          </ThemedText>
        </Animated.View>

        {/* By Category */}
        {stats.byCategory.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="rounded-[20px] p-[18px] border"
            style={{ backgroundColor: c.card, borderColor: c.cardBorder }}>
            <View className="flex-row items-center gap-2.5 mb-[18px]">
              <View
                className="w-8 h-8 rounded-[10px] items-center justify-center"
                style={{ backgroundColor: isDark ? '#1E1535' : '#F0EDFF' }}>
                <Ionicons name="apps" size={16} color="#6C5CE7" />
              </View>
              <ThemedText className="text-base font-bold" style={{ color: c.text }}>
                {t('byCategory')}
              </ThemedText>
            </View>
            {stats.byCategory.map((item, idx) => {
              const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
              return (
                <View
                  key={item.category}
                  className={`flex-row items-center gap-3 py-2.5 ${idx > 0 ? 'border-t' : ''}`}
                  style={idx > 0 ? { borderTopColor: c.cardBorder } : undefined}>
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] + '20' }}>
                    <ThemedText className="text-lg">{CATEGORY_EMOJI[item.category]}</ThemedText>
                  </View>
                  <View className="flex-1 gap-1.5">
                    <View className="flex-row justify-between items-center">
                      <ThemedText className="text-sm font-semibold" style={{ color: c.text }}>
                        {t(CATEGORY_KEYS[item.category])}
                      </ThemedText>
                      <ThemedText className="text-xs font-bold" style={{ color: c.textSecondary }}>
                        {item.completed}/{item.total}
                      </ThemedText>
                    </View>
                    <View
                      className="h-1.5 rounded-[3px] overflow-hidden"
                      style={{ backgroundColor: c.barBg }}>
                      <View
                        className="h-full rounded-[3px]"
                        style={{
                          backgroundColor: CATEGORY_COLORS[item.category],
                          width: `${pct}%`,
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </Animated.View>
        )}

        {/* By Priority */}
        {stats.byPriority.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="rounded-[20px] p-[18px] border"
            style={{ backgroundColor: c.card, borderColor: c.cardBorder }}>
            <View className="flex-row items-center gap-2.5 mb-[18px]">
              <View
                className="w-8 h-8 rounded-[10px] items-center justify-center"
                style={{ backgroundColor: isDark ? '#2A1E1E' : '#FFF0ED' }}>
                <Ionicons name="ribbon" size={16} color="#E17055" />
              </View>
              <ThemedText className="text-base font-bold" style={{ color: c.text }}>
                {t('byPriority')}
              </ThemedText>
            </View>
            <View className="flex-row gap-2.5">
              {stats.byPriority.map((item) => {
                const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                return (
                  <View
                    key={item.priority}
                    className="flex-1 items-center py-4 px-2 rounded-2xl border gap-1.5"
                    style={{
                      backgroundColor: isDark ? '#13151A' : '#FAFBFC',
                      borderColor: c.cardBorder,
                    }}>
                    <View
                      className="w-[38px] h-[38px] rounded-xl items-center justify-center"
                      style={{ backgroundColor: PRIORITY_COLORS[item.priority] + '18' }}>
                      <Ionicons
                        name={PRIORITY_ICONS[item.priority] as any}
                        size={18}
                        color={PRIORITY_COLORS[item.priority]}
                      />
                    </View>
                    <ThemedText className="text-xs font-semibold" style={{ color: c.text }}>
                      {t(PRIORITY_KEYS[item.priority])}
                    </ThemedText>
                    <ThemedText
                      className="text-[22px] font-extrabold"
                      style={{ color: PRIORITY_COLORS[item.priority] }}>
                      {pct}%
                    </ThemedText>
                    <ThemedText
                      className="text-[11px] font-semibold"
                      style={{ color: c.textSecondary }}>
                      {item.completed}/{item.total}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Clear completed */}
        {stats.completed > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <Pressable
              onPress={handleClearCompleted}
              className="flex-row items-center justify-center gap-2 py-[15px] rounded-2xl border"
              style={{
                backgroundColor: isDark ? '#1A1315' : '#FEF5F3',
                borderColor: isDark ? '#2D2025' : '#FDE8E4',
              }}>
              <Ionicons name="trash-outline" size={18} color="#E17055" />
              <ThemedText className="text-sm font-bold text-[#E17055]">
                {t('clearCompleted')} ({stats.completed})
              </ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
