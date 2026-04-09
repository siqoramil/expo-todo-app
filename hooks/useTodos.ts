import { useCallback, useEffect } from 'react';
import type { Category, Priority } from '@/types/todo';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTodoStore } from '@/stores/useTodoStore';

export function useTodos() {
  const user = useAuthStore((s) => s.user);
  const todos = useTodoStore((s) => s.todos);
  const loading = useTodoStore((s) => s.loading);
  const loadTodos = useTodoStore((s) => s.loadTodos);
  const addTodoAction = useTodoStore((s) => s.addTodo);
  const editTodoAction = useTodoStore((s) => s.editTodo);
  const toggleTodoAction = useTodoStore((s) => s.toggleTodo);
  const deleteTodoAction = useTodoStore((s) => s.deleteTodo);
  const clearCompletedAction = useTodoStore((s) => s.clearCompleted);

  useEffect(() => {
    if (user) {
      loadTodos(user.id);
    }
  }, [user, loadTodos]);

  const addTodo = useCallback(
    async (title: string, category: Category, priority: Priority) => {
      if (!user) return;
      await addTodoAction(user.id, title, category, priority);
    },
    [user, addTodoAction],
  );

  const editTodo = useCallback(
    (id: string, title: string, category: Category, priority: Priority) => {
      editTodoAction(id, title, category, priority);
    },
    [editTodoAction],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      toggleTodoAction(id);
    },
    [toggleTodoAction],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      deleteTodoAction(id);
    },
    [deleteTodoAction],
  );

  const clearCompleted = useCallback(() => {
    if (!user) return;
    clearCompletedAction(user.id);
  }, [user, clearCompletedAction]);

  return { todos, loading, addTodo, editTodo, toggleTodo, deleteTodo, clearCompleted };
}
