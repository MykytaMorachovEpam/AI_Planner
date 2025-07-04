import React, { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  deleteTask,
  toggleComplete,
  updateTaskPriority,
  TaskItem,
} from './api/taskApi';
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl';
import { PrioritySelect } from './components/PrioritySelect';
import enMessages from './locales/en/translation.json';
import uaMessages from './locales/ua/translation.json';

const messages: Record<string, Record<string, string>> = {
  en: enMessages,
  ua: uaMessages,
};

const emptyTask = {
  name: '',
  description: '',
  dueDate: '',
  isCompleted: false,
  priority: 'Medium' as TaskItem['priority'],
};

function TaskPlannerApp() {
  const intl = useIntl();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [form, setForm] = useState<typeof emptyTask>(emptyTask);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<TaskItem['priority'] | ''>('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      setTasks(await getTasks(priorityFilter || undefined));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [priorityFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({ ...form, dueDate: form.dueDate || null });
      setForm(emptyTask);
      loadTasks();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleToggle = async (id: string) => {
    await toggleComplete(id);
    loadTasks();
  };

  const handlePriorityChange = async (id: string, priority: TaskItem['priority']) => {
    try {
      await updateTaskPriority(id, priority);
      loadTasks();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1><FormattedMessage id="title" /></h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'taskName' })}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'description' })}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            aria-label={intl.formatMessage({ id: 'dueDate' })}
            style={{ flex: 1 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label><FormattedMessage id="priority" />:</label>
            <PrioritySelect
              value={form.priority}
              onChange={(priority) => setForm({ ...form, priority })}
            />
          </div>
        </div>
        <button type="submit"><FormattedMessage id="addTask" /></button>
      </form>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}><FormattedMessage id="priority.filter" />:</label>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskItem['priority'] | '')}
          style={{ padding: '4px 8px' }}
          aria-label={intl.formatMessage({ id: 'priority.filter' })}
        >
          <option value=""><FormattedMessage id="priority.all" /></option>
          <option value="Low">{intl.formatMessage({ id: 'priority.low' })}</option>
          <option value="Medium">{intl.formatMessage({ id: 'priority.medium' })}</option>
          <option value="High">{intl.formatMessage({ id: 'priority.high' })}</option>
          <option value="Critical">{intl.formatMessage({ id: 'priority.critical' })}</option>
        </select>
      </div>

      {error && <div style={{ color: 'red' }}><FormattedMessage id="error" />: {error}</div>}
      {loading ? (
        <div><FormattedMessage id="loading" /></div>
      ) : tasks.length === 0 ? (
        <div><FormattedMessage id="noTasks" /></div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: 12, border: '1px solid #ccc', padding: 12, borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggle(task.id)}
                  aria-label={intl.formatMessage({ id: 'completed' })}
                />
                <strong style={{ textDecoration: task.isCompleted ? 'line-through' : undefined, flex: 1 }}>
                  {task.name}
                </strong>
                <PrioritySelect
                  value={task.priority}
                  onChange={(priority) => handlePriorityChange(task.id, priority)}
                />
              </div>
              <div style={{ marginBottom: 4 }}>{task.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {task.dueDate && (
                  <span style={{ color: '#888' }}>
                    <FormattedMessage id="dueDate" />: {task.dueDate}
                  </span>
                )}
                <button onClick={() => handleDelete(task.id)}><FormattedMessage id="delete" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en');
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div style={{ position: 'fixed', left: '50%', bottom: 32, transform: 'translateX(-50%)', zIndex: 1000, background: 'white', padding: '8px 16px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <select
          value={locale}
          onChange={e => setLocale(e.target.value)}
          style={{ fontWeight: 'bold', padding: '4px 8px', borderRadius: 4 }}
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="ua">Українська</option>
        </select>
      </div>
      <TaskPlannerApp />
    </IntlProvider>
  );
}

export default App;
