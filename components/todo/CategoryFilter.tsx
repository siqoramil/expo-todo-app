import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import type { Category } from '@/types/todo';
import { CATEGORIES } from '@/types/todo';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import { CATEGORY_COLORS, CATEGORY_EMOJI } from '@/i18n/translations';
import type { TranslationKey } from '@/i18n/translations';

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  personal: 'personal',
  work: 'work',
  shopping: 'shopping',
  health: 'health',
  study: 'study',
  other: 'other',
};

interface Props {
  selected: Category | null;
  onSelect: (cat: Category | null) => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ selected, onSelect, counts }: Props) {
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Pressable
        onPress={() => {
          onSelect(null);
          Haptics.selectionAsync();
        }}
        style={[
          styles.chip,
          isDark ? styles.chipDark : styles.chipLight,
          selected === null && styles.chipActive,
        ]}
      >
        <ThemedText style={[styles.chipLabel, selected === null && styles.chipLabelActive]}>
          {t('all')}
        </ThemedText>
        <View style={[styles.badge, isDark && styles.badgeDark, selected === null && styles.badgeActive]}>
          <ThemedText style={[styles.badgeText, isDark && styles.badgeTextDark, selected === null && styles.badgeTextActive]}>
            {Object.values(counts).reduce((a, b) => a + b, 0)}
          </ThemedText>
        </View>
      </Pressable>

      {CATEGORIES.map((cat) => {
        const color = CATEGORY_COLORS[cat];
        const isSelected = selected === cat;
        const count = counts[cat] ?? 0;
        return (
          <Pressable
            key={cat}
            onPress={() => {
              onSelect(isSelected ? null : cat);
              Haptics.selectionAsync();
            }}
            style={[
              styles.chip,
              isDark ? styles.chipDark : styles.chipLight,
              isSelected && { backgroundColor: color },
            ]}
          >
            <ThemedText style={[styles.chipLabel, isSelected && styles.chipLabelActive]}>
              {CATEGORY_EMOJI[cat]} {t(CATEGORY_KEYS[cat])}
            </ThemedText>
            {count > 0 && (
              <View style={[styles.badge, isDark && styles.badgeDark, isSelected && styles.badgeActive]}>
                <ThemedText style={[styles.badgeText, isDark && styles.badgeTextDark, isSelected && styles.badgeTextActive]}>
                  {count}
                </ThemedText>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flexGrow: 0 },
  container: { paddingHorizontal: 16, paddingVertical: 6, gap: 6, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  chipLight: { backgroundColor: '#F3F4F6' },
  chipDark: { backgroundColor: '#2A2D30' },
  chipActive: { backgroundColor: '#6C5CE7' },
  chipLabel: { fontSize: 12, fontWeight: '600' },
  chipLabelActive: { color: '#fff' },
  badge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeDark: {
    backgroundColor: '#3A3D40',
  },
  badgeActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#6B7280' },
  badgeTextDark: { color: '#9BA1A6' },
  badgeTextActive: { color: '#fff' },
});
