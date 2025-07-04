import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as api from './api/taskApi';

jest.mock('./api/taskApi');

const mockTasks = [
  {
    id: '1',
    name: 'Test Task',
    description: 'Test Desc',
    dueDate: '2024-12-31',
    isCompleted: false,
    priority: 'High' as const,
  },
  {
    id: '2',
    name: 'Done Task',
    description: 'Done Desc',
    dueDate: null,
    isCompleted: true,
    priority: 'Low' as const,
  },
];

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getTasks as jest.Mock).mockResolvedValue([...mockTasks]);
    (api.createTask as jest.Mock).mockResolvedValue({ ...mockTasks[0], id: '3' });
    (api.deleteTask as jest.Mock).mockResolvedValue(undefined);
    (api.toggleComplete as jest.Mock).mockResolvedValue(undefined);
    (api.updateTaskPriority as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders tasks and handles loading', async () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  it('can add a task', async () => {
    render(<App />);
    await screen.findByText('Test Task');
    await userEvent.type(screen.getByPlaceholderText('Task name'), 'New Task');
    await userEvent.type(screen.getByPlaceholderText('Description'), 'New Desc');
    await userEvent.type(screen.getByLabelText(/due date/i), '2024-11-11');

    // Select Critical priority
    const prioritySelect = screen.getAllByLabelText(/priority/i)[0];
    await userEvent.selectOptions(prioritySelect, 'Critical');

    (api.getTasks as jest.Mock).mockResolvedValueOnce([
      ...mockTasks,
      {
        id: '3',
        name: 'New Task',
        description: 'New Desc',
        dueDate: '2024-11-11',
        isCompleted: false,
        priority: 'Critical',
      },
    ]);

    userEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(api.createTask).toHaveBeenCalled());
    expect(api.createTask).toHaveBeenCalledWith({
      name: 'New Task',
      description: 'New Desc',
      dueDate: '2024-11-11',
      isCompleted: false,
      priority: 'Critical',
    });
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('can delete a task', async () => {
    render(<App />);
    await screen.findByText('Test Task');
    userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    await waitFor(() => expect(api.deleteTask).toHaveBeenCalledWith('1'));
  });

  it('can toggle complete', async () => {
    render(<App />);
    await screen.findByText('Test Task');
    userEvent.click(screen.getAllByRole('checkbox')[0]);
    await waitFor(() => expect(api.toggleComplete).toHaveBeenCalledWith('1'));
  });

  it('can update task priority', async () => {
    render(<App />);
<<<<<<< HEAD
    await screen.findByText('Test Task');
    const testTaskRow = screen.getByText('Test Task').closest('li');
    const prioritySelect = within(testTaskRow!).getByLabelText(/priority/i);
    await userEvent.selectOptions(prioritySelect, 'Critical');
    await waitFor(() => {
      expect(api.updateTaskPriority).toHaveBeenCalledWith('1', 'Critical');
    });
  });

  it('can filter tasks by priority', async () => {
    render(<App />);
    await screen.findByText('Test Task');
    
    const filterSelect = screen.getByLabelText(/filter by priority/i);
    await userEvent.selectOptions(filterSelect, 'High');
    
    await waitFor(() => expect(api.getTasks).toHaveBeenCalledWith('High'));
  });

  it('shows error on fetch failure', async () => {
    (api.getTasks as jest.Mock).mockRejectedValueOnce(new Error('Failed to load tasks'));
    render(<App />);
    expect(await screen.findByText((content) => content.includes('Failed to load tasks'))).toBeInTheDocument();
=======
    expect(await screen.findByText((content) => content.includes('Error') && content.includes('fail'))).toBeInTheDocument();
>>>>>>> 7984ed8 (Add README with project structure and instructions. Add and fix tests for full React app coverage, including localization and language switcher.)
  });

  it('shows error on add failure', async () => {
    (api.createTask as jest.Mock).mockRejectedValueOnce(new Error('Failed to create task'));
    render(<App />);
    await screen.findByText('Test Task');
<<<<<<< HEAD
    await userEvent.type(screen.getByPlaceholderText('Task name'), 'New Task');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(await screen.findByText((content) => content.includes('Failed to create task'))).toBeInTheDocument();
  });

  it('shows error on priority update failure', async () => {
    (api.updateTaskPriority as jest.Mock).mockRejectedValueOnce(new Error('Failed to update task priority'));
    render(<App />);
    await screen.findByText('Test Task');
    const testTaskRow = screen.getByText('Test Task').closest('li');
    const prioritySelect = within(testTaskRow!).getByLabelText(/priority/i);
    await userEvent.selectOptions(prioritySelect, 'Critical');
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Failed to update task priority'))).toBeInTheDocument();
    });
  });

  describe('Task List with Priorities', () => {
    it('displays task priorities correctly', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      const testTaskRow = screen.getByText('Test Task').closest('li');
      const doneTaskRow = screen.getByText('Done Task').closest('li');
      const testTaskPrioritySelect = within(testTaskRow!).getByLabelText(/priority/i);
      const doneTaskPrioritySelect = within(doneTaskRow!).getByLabelText(/priority/i);
      await waitFor(() => {
        expect(testTaskPrioritySelect).toHaveValue('High');
        expect(doneTaskPrioritySelect).toHaveValue('Low');
      });
    });

    it('shows priority filter dropdown', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      
      const filterSelect = screen.getByLabelText(/filter by priority/i);
      expect(filterSelect).toBeInTheDocument();
      expect(screen.getByText('All priorities')).toBeInTheDocument();
    });

    it('filters tasks by priority', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      
      const filterSelect = screen.getByLabelText(/filter by priority/i);
      await userEvent.selectOptions(filterSelect, 'High');
      
      await waitFor(() => {
        expect(api.getTasks).toHaveBeenCalledWith('High');
      });
    });

    it('clears priority filter', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      
      const filterSelect = screen.getByLabelText(/filter by priority/i);
      await userEvent.selectOptions(filterSelect, 'High');
      await userEvent.selectOptions(filterSelect, '');
      
      await waitFor(() => {
        expect(api.getTasks).toHaveBeenLastCalledWith(undefined);
      });
    });
  });

  describe('Task Creation with Priority', () => {
    it('shows priority select in create form', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      const priorityLabels = screen.getAllByText(/priority/i);
      expect(priorityLabels.length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText(/priority/i)[0]).toBeInTheDocument();
    });

    it('creates task with selected priority', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      // Fill form
      await userEvent.type(screen.getByPlaceholderText('Task name'), 'New Task');
      await userEvent.type(screen.getByPlaceholderText('Description'), 'New Desc');
      await userEvent.type(screen.getByLabelText(/due date/i), '2024-11-11');
      await userEvent.selectOptions(screen.getAllByLabelText(/priority/i)[0], 'Critical');
      // Mock the response for the new task
      (api.getTasks as jest.Mock).mockResolvedValueOnce([
        ...mockTasks,
        {
          id: '3',
          name: 'New Task',
          description: 'New Desc',
          dueDate: '2024-11-11',
          isCompleted: false,
          priority: 'Critical',
        },
      ]);
      // Submit form
      await userEvent.click(screen.getByRole('button', { name: /add task/i }));
      // Verify API call
      await waitFor(() => {
        expect(api.createTask).toHaveBeenCalledWith({
          name: 'New Task',
          description: 'New Desc',
          dueDate: '2024-11-11',
          isCompleted: false,
          priority: 'Critical',
        });
      });
    });

    it('defaults to Medium priority for new tasks', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      const prioritySelect = screen.getAllByLabelText(/priority/i)[0];
      expect(prioritySelect).toHaveValue('Medium');
    });
  });

  describe('Task Priority Updates', () => {
    it('updates task priority', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      const testTaskRow = screen.getByText('Test Task').closest('li');
      const prioritySelect = within(testTaskRow!).getByLabelText(/priority/i);
      await userEvent.selectOptions(prioritySelect, 'Critical');
      await waitFor(() => {
        expect(api.updateTaskPriority).toHaveBeenCalledWith('1', 'Critical');
      });
    });

    it('shows error when priority update fails', async () => {
      (api.updateTaskPriority as jest.Mock).mockRejectedValueOnce(new Error('Failed to update task priority'));
      render(<App />);
      await screen.findByText('Test Task');
      const testTaskRow = screen.getByText('Test Task').closest('li');
      const prioritySelect = within(testTaskRow!).getByLabelText(/priority/i);
      await userEvent.selectOptions(prioritySelect, 'Critical');
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('Failed to update task priority'))).toBeInTheDocument();
      });
    });

    it('refreshes task list after priority update', async () => {
      render(<App />);
      await screen.findByText('Test Task');
      const prioritySelect = screen.getAllByLabelText(/priority/i)[1];
      await userEvent.selectOptions(prioritySelect, 'Critical');
      await waitFor(() => {
        expect(api.getTasks).toHaveBeenCalledTimes(2); // Initial load + refresh
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error on tasks fetch failure', async () => {
      (api.getTasks as jest.Mock).mockRejectedValueOnce(new Error('Failed to load tasks'));
      render(<App />);
      expect(await screen.findByText((content) => content.includes('Failed to load tasks'))).toBeInTheDocument();
    });

    it('shows error on task creation failure', async () => {
      (api.createTask as jest.Mock).mockRejectedValueOnce(new Error('Failed to create task'));
      render(<App />);
      await screen.findByText('Test Task');
      
      await userEvent.type(screen.getByPlaceholderText('Task name'), 'New Task');
      await userEvent.click(screen.getByRole('button', { name: /add task/i }));
      
      expect(await screen.findByText((content) => content.includes('Failed to create task'))).toBeInTheDocument();
    });
=======
    userEvent.type(screen.getByPlaceholderText('Task name'), 'New Task');
    userEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(screen.getByText((content) => content.includes('Error') && content.includes('fail'))).toBeInTheDocument());
  });
});

describe('Localization and Language Switcher', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (api.getTasks as jest.Mock).mockResolvedValue([...mockTasks]);
  });

  it('renders in English by default', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Task Planner' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('switches to Ukrainian when selected', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: 'Task Planner' });
    userEvent.selectOptions(screen.getByLabelText('Select language'), 'ua');
    expect(await screen.findByRole('heading', { name: 'Планувальник Завдань' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Додати завдання/i })).toBeInTheDocument();
  });

  it('persists selected language in localStorage', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: 'Task Planner' });
    userEvent.selectOptions(screen.getByLabelText('Select language'), 'ua');
    await waitFor(() => expect(localStorage.getItem('locale')).toBe('ua'));
>>>>>>> 7984ed8 (Add README with project structure and instructions. Add and fix tests for full React app coverage, including localization and language switcher.)
  });

  describe('Localization and Language Switcher', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
      (api.getTasks as jest.Mock).mockResolvedValue([...mockTasks]);
    });

    it('renders in English by default', async () => {
      render(<App />);
      expect(await screen.findByRole('heading', { name: 'Task Planner' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('switches to Ukrainian when selected', async () => {
      render(<App />);
      await screen.findByRole('heading', { name: 'Task Planner' });
      userEvent.selectOptions(screen.getByLabelText('Select language'), 'ua');
      expect(await screen.findByRole('heading', { name: 'Планувальник Завдань' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Додати завдання/i })).toBeInTheDocument();
    });

    it('persists selected language in localStorage', async () => {
      render(<App />);
      await screen.findByRole('heading', { name: 'Task Planner' });
      userEvent.selectOptions(screen.getByLabelText('Select language'), 'ua');
      await waitFor(() => expect(localStorage.getItem('locale')).toBe('ua'));
    });
  });
});
