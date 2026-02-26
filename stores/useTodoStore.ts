import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, Priority, Todo } from '@/types/todo';

const TODOS_KEY = '@todos';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  loadTodos: (userId: string) => Promise<void>;
  addTodo: (userId: string, title: string, category: Category, priority: Priority) => Promise<void>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: (userId: string) => void;
}

function todosKey(userId: string): string {
  return `${TODOS_KEY}_${userId}`;
}

async function persistTodos(userId: string, todos: Todo[]): Promise<void> {
  await AsyncStorage.setItem(todosKey(userId), JSON.stringify(todos));
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: true,

  loadTodos: async (userId) => {
    set({ loading: true });
    try {
      const raw = await AsyncStorage.getItem(todosKey(userId));
      const todos: Todo[] = raw ? JSON.parse(raw) : [];
      set({ todos, loading: false });
    } catch {
      set({ todos: [], loading: false });
    }
  },

  addTodo: async (userId, title, category, priority) => {
    const newTodo: Todo = {
      id: generateId(),
      user_id: userId,
      title: title.trim(),
      completed: false,
      category,
      priority,
      createdAt: Date.now(),
    };
    const updated = [newTodo, ...get().todos];
    set({ todos: updated });
    await persistTodos(userId, updated);
  },

  toggleTodo: (id) => {
    const todos = get().todos;
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    set({ todos: updated });
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      persistTodos(todo.user_id, updated);
    }
  },

  deleteTodo: (id) => {
    const todos = get().todos;
    const todo = todos.find((t) => t.id === id);
    const updated = todos.filter((t) => t.id !== id);
    set({ todos: updated });
    if (todo) {
      persistTodos(todo.user_id, updated);
    }
  },

  clearCompleted: (userId) => {
    const updated = get().todos.filter((t) => !t.completed);
    set({ todos: updated });
    persistTodos(userId, updated);
  },
}));
