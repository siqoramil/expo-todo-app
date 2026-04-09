import { useCallback, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, TextInput, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { TodoItem } from '@/components/todo/TodoItem';
import { AddTodoModal } from '@/components/todo/AddTodoModal';
import { EditTodoModal } from '@/components/todo/EditTodoModal';
import { CategoryFilter } from '@/components/todo/CategoryFilter';
import { EmptyState } from '@/components/todo/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import { useAppStore } from '@/stores/useAppStore';
import type { Category, Priority, Todo } from '@/types/todo';

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const t = useAppStore((s) => s.t);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { todos, loading, addTodo, editTodo, toggleTodo, deleteTodo } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
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

  const handleEdit = useCallback((todo: Todo) => {
    setEditingTodo(todo);
  }, []);

  const handleSaveEdit = useCallback(
    (id: string, title: string, category: Category, priority: Priority) => {
      editTodo(id, title, category, priority);
    },
    [editTodo],
  );

  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={handleEdit} />
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg dark:bg-app-bg-dark">
        <ThemedText className="text-base text-[#888]">{t('loading')}</ThemedText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg dark:bg-app-bg-dark">
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
        <Animated.View entering={FadeInDown.duration(600)}>
          <ThemedText
            style={{
              fontSize: isSmall ? 13 : 15,
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '500',
            }}>
            {t('greeting')}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: isSmall ? 24 : 28,
              fontWeight: '800',
              color: '#fff',
              marginTop: 4,
              marginBottom: isSmall ? 14 : 18,
            }}>
            {t('myTasks')}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          className="bg-white/15 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2.5">
            <ThemedText className="text-[13px] text-white/70 font-medium">
              {t('todayResult')}
            </ThemedText>
            <ThemedText className="text-[13px] text-white font-bold">
              {completedCount}/{totalCount} {t('completed')}
            </ThemedText>
          </View>
          <View className="h-2 bg-white/20 rounded overflow-hidden">
            <View className="h-full bg-[#00D2FF] rounded" style={{ width: `${progress * 100}%` }} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View className="flex-row items-center bg-white/15 rounded-[14px] px-3.5 h-[46px] gap-2">
            <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.6)" />
            <TextInput
              className="flex-1 text-[15px] text-white h-full"
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
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
        className="flex-1"
        contentContainerStyle={{
          paddingVertical: 8,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 100 : 90,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          right: isSmall ? 16 : 20,
          bottom: Platform.OS === 'ios' ? insets.bottom + 80 : Math.max(insets.bottom, 16) + 16,
          shadowColor: '#6C5CE7',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 10,
        }}>
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: isSmall ? 52 : 60,
            height: isSmall ? 52 : 60,
            borderRadius: isSmall ? 16 : 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="add" size={isSmall ? 26 : 30} color="#fff" />
        </LinearGradient>
      </Pressable>

      <AddTodoModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={addTodo} />

      <EditTodoModal
        visible={editingTodo !== null}
        todo={editingTodo}
        onClose={() => setEditingTodo(null)}
        onSave={handleSaveEdit}
      />
    </View>
  );
}
