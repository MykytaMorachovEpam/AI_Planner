import { getTasks, updateTaskPriority, TaskItem } from './taskApi';

describe('taskApi', () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  describe('getTasks', () => {
    const mockTasks: TaskItem[] = [
      {
        id: '1',
        name: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-01-01',
        isCompleted: false,
        priority: 'High',
      },
    ];

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
  });
}); 