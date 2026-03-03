import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';

export function EmptyState() {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';

  return (
    <Animated.View
      entering={FadeIn.delay(200).duration(500)}
      className="flex-1 items-center justify-center py-20 px-10"
    >
      <View className="w-20 h-20 rounded-3xl bg-[#6C5CE715] dark:bg-[#A29BFE15] items-center justify-center mb-5">
        <Ionicons name="clipboard-outline" size={36} color={isDark ? '#A29BFE' : '#6C5CE7'} />
      </View>
      <ThemedText className="text-xl font-bold mb-2">{t('noTasks')}</ThemedText>
      <ThemedText className="text-sm text-[#9CA3AF] dark:text-[#9BA1A6] text-center leading-[22px]">
        {t('noTasksHint')}
      </ThemedText>
    </Animated.View>
  );
}
