export interface TaskItem {
  id: string;
  name: string;
  description: string;
  dueDate: string | null;
  isCompleted: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

const API_BASE = '/api/tasks';

export async function getTasks(priority?: TaskItem['priority']): Promise<TaskItem[]> {
  const url = priority ? `${API_BASE}?priority=${priority}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function getTask(id: string): Promise<TaskItem> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
}

export async function createTask(task: Omit<TaskItem, 'id'>): Promise<TaskItem> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id: string, task: TaskItem): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to update task');
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}

export async function toggleComplete(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}/toggle-complete`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle complete');
}

export async function updateTaskPriority(id: string, priority: TaskItem['priority']): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}/priority`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority }),
  });
  if (!res.ok) throw new Error('Failed to update task priority');
} 