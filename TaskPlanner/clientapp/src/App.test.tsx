import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
  },
  {
    id: '2',
    name: 'Done Task',
    description: 'Done Desc',
    dueDate: null,
    isCompleted: true,
  },
];

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getTasks as jest.Mock).mockResolvedValue([...mockTasks]);
    (api.createTask as jest.Mock).mockResolvedValue({ ...mockTasks[0], id: '3' });
    (api.deleteTask as jest.Mock).mockResolvedValue(undefined);
    (api.toggleComplete as jest.Mock).mockResolvedValue(undefined);
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
    (api.getTasks as jest.Mock).mockResolvedValueOnce([
      ...mockTasks,
      {
        id: '3',
        name: 'New Task',
        description: 'New Desc',
        dueDate: '2024-11-11',
        isCompleted: false,
      },
    ]);
    userEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(api.createTask).toHaveBeenCalled());
    expect(api.createTask).toHaveBeenCalledWith({ name: 'New Task', description: 'New Desc', dueDate: '2024-11-11', isCompleted: false });
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

  it('shows error on fetch failure', async () => {
    (api.getTasks as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    render(<App />);
    expect(await screen.findByText((content) => content.includes('Error') && content.includes('fail'))).toBeInTheDocument();
  });

  it('shows error on add failure', async () => {
    (api.createTask as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    render(<App />);
    await screen.findByText('Test Task');
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
  });
});
