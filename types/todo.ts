export type Priority = 'low' | 'medium' | 'high';

export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'study' | 'other';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  createdAt: number;
}

export const CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'health', 'study', 'other'];
export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
