import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from '@/stores/useTodoStore';
import { clearMockStorage } from './setup';

function resetStore() {
  useTodoStore.setState({ todos: [], loading: true });
}

describe('useTodoStore', () => {
  beforeEach(() => {
    clearMockStorage();
    resetStore();
  });

  describe('addTodo', () => {
    it('yangi todo qo\'shishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Test todo', 'personal', 'medium');

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Test todo');
      expect(todos[0].user_id).toBe('user1');
      expect(todos[0].category).toBe('personal');
      expect(todos[0].priority).toBe('medium');
      expect(todos[0].completed).toBe(false);
    });

    it('title ni trim qilishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', '  Spaces around  ', 'work', 'high');

      const { todos } = useTodoStore.getState();
      expect(todos[0].title).toBe('Spaces around');
    });

    it('yangi todo ro\'yxatning boshiga qo\'shilishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'First', 'personal', 'low');
      await addTodo('user1', 'Second', 'work', 'high');

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe('Second');
      expect(todos[1].title).toBe('First');
    });

    it('har bir todo uchun unikal id yaratishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Todo 1', 'personal', 'low');
      await addTodo('user1', 'Todo 2', 'work', 'medium');

      const { todos } = useTodoStore.getState();
      expect(todos[0].id).not.toBe(todos[1].id);
    });

    it('createdAt timestamp bo\'lishi kerak', async () => {
      const before = Date.now();
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Todo', 'personal', 'low');
      const after = Date.now();

      const { todos } = useTodoStore.getState();
      expect(todos[0].createdAt).toBeGreaterThanOrEqual(before);
      expect(todos[0].createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe('editTodo', () => {
    it('todo ni tahrirlashi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Original', 'personal', 'low');

      const { todos } = useTodoStore.getState();
      const id = todos[0].id;

      useTodoStore.getState().editTodo(id, 'Updated', 'work', 'high');

      const updated = useTodoStore.getState().todos[0];
      expect(updated.title).toBe('Updated');
      expect(updated.category).toBe('work');
      expect(updated.priority).toBe('high');
    });

    it('title ni trim qilishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Original', 'personal', 'low');

      const id = useTodoStore.getState().todos[0].id;
      useTodoStore.getState().editTodo(id, '  Trimmed  ', 'personal', 'low');

      expect(useTodoStore.getState().todos[0].title).toBe('Trimmed');
    });

    it('mavjud bo\'lmagan id bilan hech narsa o\'zgarmaydi', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Original', 'personal', 'low');

      useTodoStore.getState().editTodo('nonexistent', 'Changed', 'work', 'high');

      expect(useTodoStore.getState().todos[0].title).toBe('Original');
    });
  });

  describe('toggleTodo', () => {
    it('completed holatini o\'zgartirishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Toggle me', 'personal', 'low');

      const id = useTodoStore.getState().todos[0].id;
      expect(useTodoStore.getState().todos[0].completed).toBe(false);

      useTodoStore.getState().toggleTodo(id);
      expect(useTodoStore.getState().todos[0].completed).toBe(true);

      useTodoStore.getState().toggleTodo(id);
      expect(useTodoStore.getState().todos[0].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('todo ni o\'chirishi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Delete me', 'personal', 'low');
      await addTodo('user1', 'Keep me', 'work', 'medium');

      const idToDelete = useTodoStore.getState().todos.find(
        (t) => t.title === 'Delete me',
      )!.id;

      useTodoStore.getState().deleteTodo(idToDelete);

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Keep me');
    });
  });

  describe('clearCompleted', () => {
    it('bajarilgan todolarni tozalashi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Done 1', 'personal', 'low');
      await addTodo('user1', 'Not done', 'work', 'medium');
      await addTodo('user1', 'Done 2', 'shopping', 'high');

      const todos = useTodoStore.getState().todos;
      useTodoStore.getState().toggleTodo(todos[0].id); // Done 2
      useTodoStore.getState().toggleTodo(todos[2].id); // Done 1

      useTodoStore.getState().clearCompleted('user1');

      const remaining = useTodoStore.getState().todos;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].title).toBe('Not done');
    });

    it('bajarilgan todo bo\'lmasa hech narsa o\'zgarmasligi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Todo 1', 'personal', 'low');
      await addTodo('user1', 'Todo 2', 'work', 'medium');

      useTodoStore.getState().clearCompleted('user1');

      expect(useTodoStore.getState().todos).toHaveLength(2);
    });
  });

  describe('loadTodos', () => {
    it('AsyncStorage dan todolarni yuklashi kerak', async () => {
      const { addTodo } = useTodoStore.getState();
      await addTodo('user1', 'Saved todo', 'personal', 'low');

      // Reset store state (simulating app restart)
      resetStore();
      expect(useTodoStore.getState().todos).toHaveLength(0);

      // Load from storage
      await useTodoStore.getState().loadTodos('user1');

      const { todos, loading } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Saved todo');
      expect(loading).toBe(false);
    });

    it('bo\'sh storage dan bo\'sh array qaytarishi kerak', async () => {
      await useTodoStore.getState().loadTodos('new_user');

      const { todos, loading } = useTodoStore.getState();
      expect(todos).toHaveLength(0);
      expect(loading).toBe(false);
    });
  });
});
