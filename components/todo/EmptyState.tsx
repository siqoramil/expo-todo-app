import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';

export function EmptyState() {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';

  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.container}>
      <View style={styles.emojiContainer}>
        <ThemedText style={styles.emoji}>📝</ThemedText>
      </View>
      <ThemedText style={styles.title}>{t('noTasks')}</ThemedText>
      <ThemedText style={[styles.subtitle, isDark && styles.subtitleDark]}>
        {t('noTasksHint')}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#6C5CE720',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emoji: { fontSize: 36 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  subtitleDark: { color: '#9BA1A6' },
});
