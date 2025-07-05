import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleComplete, 
  updateTaskPriority, 
  TaskItem 
} from './taskApi';

describe('taskApi', () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  const mockTask: TaskItem = {
    id: '1',
    name: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-01-01',
    isCompleted: false,
    priority: 'High',
  };

  const mockTaskWithoutId: Omit<TaskItem, 'id'> = {
    name: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-01-01',
    isCompleted: false,
    priority: 'High',
  };

  describe('getTasks', () => {
    const mockTasks: TaskItem[] = [mockTask];

    it('fetches tasks without priority filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const tasks = await getTasks();

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks');
      expect(tasks).toEqual(mockTasks);
    });

    it('fetches tasks with priority filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      await getTasks('High');

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks?priority=High');
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(getTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  describe('getTask', () => {
    it('fetches a single task by id', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask,
      } as Response);

      const task = await getTask('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1');
      expect(task).toEqual(mockTask);
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(getTask('1')).rejects.toThrow('Failed to fetch task');
    });
  });

  describe('createTask', () => {
    it('creates a new task', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask,
      } as Response);

      const createdTask = await createTask(mockTaskWithoutId);

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockTaskWithoutId),
      });
      expect(createdTask).toEqual(mockTask);
    });

    it('throws error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(createTask(mockTaskWithoutId)).rejects.toThrow('Failed to create task');
    });
  });

  describe('updateTask', () => {
    it('updates an existing task', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await updateTask('1', mockTask);

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockTask),
      });
    });

    it('throws error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(updateTask('1', mockTask)).rejects.toThrow('Failed to update task');
    });
  });

  describe('deleteTask', () => {
    it('deletes a task', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await deleteTask('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'DELETE',
      });
    });

    it('throws error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(deleteTask('1')).rejects.toThrow('Failed to delete task');
    });
  });

  describe('toggleComplete', () => {
    it('toggles task completion status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await toggleComplete('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1/toggle-complete', {
        method: 'POST',
      });
    });

    it('throws error when toggle fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(toggleComplete('1')).rejects.toThrow('Failed to toggle complete');
    });
  });

  describe('updateTaskPriority', () => {
    it('updates task priority', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await updateTaskPriority('1', 'High');

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1/priority', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: 'High' }),
      });
    });

    it('throws error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(updateTaskPriority('1', 'High')).rejects.toThrow(
        'Failed to update task priority'
      );
    });

    it('handles all priority values', async () => {
      const priorities: TaskItem['priority'][] = ['Low', 'Medium', 'High', 'Critical'];
      
      for (const priority of priorities) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
        } as Response);

        await updateTaskPriority('1', priority);

        expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1/priority', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority }),
        });
      }
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getTasks()).rejects.toThrow('Network error');
    });

    it('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      await expect(getTasks()).rejects.toThrow('Invalid JSON');
    });
  });
}); 