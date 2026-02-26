import { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { TodoItem } from '@/components/todo/TodoItem';
import { AddTodoModal } from '@/components/todo/AddTodoModal';
import { CategoryFilter } from '@/components/todo/CategoryFilter';
import { EmptyState } from '@/components/todo/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import { useAppStore, selectEffectiveTheme } from '@/stores/useAppStore';
import type { Category, Todo } from '@/types/todo';

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const t = useAppStore((s) => s.t);
  const effectiveTheme = useAppStore(selectEffectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const todo of todos) {
      counts[todo.category] = (counts[todo.category] ?? 0) + 1;
    }
    return counts;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let result = todos;
    if (filterCategory) {
      result = result.filter((todo) => todo.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((todo) => todo.title.toLowerCase().includes(q));
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
      return b.createdAt - a.createdAt;
    });
  }, [todos, filterCategory, search]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.bgDark]}>
        <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <LinearGradient
        colors={isDark ? ['#2D1B69', '#1E2022'] : ['#6C5CE7', '#A29BFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <ThemedText style={styles.greeting}>{t('greeting')}</ThemedText>
          <ThemedText style={styles.headerTitle}>{t('myTasks')}</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <ThemedText style={styles.progressLabel}>{t('todayResult')}</ThemedText>
            <ThemedText style={styles.progressCount}>
              {completedCount}/{totalCount} {t('completed')}
            </ThemedText>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View style={styles.searchContainer}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <ThemedText style={styles.clearSearch}>✕</ThemedText>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </LinearGradient>

      <CategoryFilter
        selected={filterCategory}
        onSelect={setFilterCategory}
        counts={categoryCounts}
      />

      <FlatList
        data={filteredTodos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.fab, { bottom: Platform.OS === 'ios' ? insets.bottom + 90 : 24 }]}
      >
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedText style={styles.fabIcon}>+</ThemedText>
        </LinearGradient>
      </Pressable>

      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgLight: { backgroundColor: '#F7F8FC' },
  bgDark: { backgroundColor: '#151718' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: '#888' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
    marginBottom: 18,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  progressCount: { fontSize: 13, color: '#fff', fontWeight: '700' },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#00D2FF', borderRadius: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: '#fff', height: '100%' },
  clearSearch: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  flatList: { flex: 1 },
  list: { paddingVertical: 8, paddingBottom: 120 },
  fab: {
    position: 'absolute',
    right: 20,
    elevation: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { fontSize: 32, color: '#fff', fontWeight: '300', marginTop: -2 },
});
