import { Pressable, ScrollView, Text, View } from 'react-native';
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
      className="grow-0"
      contentContainerClassName="px-4 py-1.5 gap-1.5 items-center"
    >
      <Pressable
        onPress={() => {
          onSelect(null);
          Haptics.selectionAsync();
        }}
        className="flex-row items-center px-3 py-1.5 rounded-2xl gap-[5px] bg-[#F3F4F6] dark:bg-[#2A2D30]"
        style={selected === null && { backgroundColor: '#6C5CE7' }}
      >
        <ThemedText
          className={`text-xs font-semibold ${selected === null ? 'text-white' : ''}`}
        >
          {t('all')}
        </ThemedText>
        <View
          className="rounded-lg min-w-[18px] px-[5px] py-[2px] bg-[#E5E7EB] dark:bg-[#3A3D40]"
          style={selected === null && { backgroundColor: 'rgba(255,255,255,0.3)' }}
        >
          <Text
            className="text-[10px] font-bold text-center text-[#6B7280] dark:text-[#9BA1A6]"
            style={selected === null && { color: '#fff' }}
          >
            {Object.values(counts).reduce((a, b) => a + b, 0)}
          </Text>
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
            className="flex-row items-center px-3 py-1.5 rounded-2xl gap-[5px] bg-[#F3F4F6] dark:bg-[#2A2D30]"
            style={isSelected && { backgroundColor: color }}
          >
            <ThemedText
              className={`text-xs font-semibold ${isSelected ? 'text-white' : ''}`}
            >
              {CATEGORY_EMOJI[cat]} {t(CATEGORY_KEYS[cat])}
            </ThemedText>
            {count > 0 && (
              <View
                className="rounded-lg min-w-[18px] px-[5px] py-[2px] bg-[#E5E7EB] dark:bg-[#3A3D40]"
                style={isSelected && { backgroundColor: 'rgba(255,255,255,0.3)' }}
              >
                <Text
                  className="text-[10px] font-bold text-center text-[#6B7280] dark:text-[#9BA1A6]"
                  style={isSelected && { color: '#fff' }}
                >
                  {count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
