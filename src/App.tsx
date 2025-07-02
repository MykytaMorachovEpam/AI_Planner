import React, { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  deleteTask,
  toggleComplete,
  TaskItem,
} from './api/taskApi';
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl';
import enMessages from './locales/en/messages.json';
import uaMessages from './locales/ua/messages.json';

const messages: Record<string, Record<string, string>> = {
  en: enMessages,
  ua: uaMessages,
};

const emptyTask = { name: '', description: '', dueDate: '', isCompleted: false };

function TaskPlannerApp() {
  const intl = useIntl();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [form, setForm] = useState<typeof emptyTask>(emptyTask);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      setTasks(await getTasks());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

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

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1><FormattedMessage id="title" /></h1>
      </div>
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
        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          aria-label={intl.formatMessage({ id: 'dueDate' })}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit"><FormattedMessage id="addTask" /></button>
      </form>
      {error && <div style={{ color: 'red' }}><FormattedMessage id="error" />: {error}</div>}
      {loading ? (
        <div><FormattedMessage id="loading" /></div>
      ) : tasks.length === 0 ? (
        <div><FormattedMessage id="noTasks" /></div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: 12, border: '1px solid #ccc', padding: 12, borderRadius: 4 }}>
              <div>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggle(task.id)}
                  style={{ marginRight: 8 }}
                  aria-label={intl.formatMessage({ id: 'completed' })}
                />
                <strong style={{ textDecoration: task.isCompleted ? 'line-through' : undefined }}>{task.name}</strong>
                {task.dueDate && <span style={{ marginLeft: 8, color: '#888' }}><FormattedMessage id="dueDate" />: {task.dueDate}</span>}
              </div>
              <div>{task.description}</div>
              <button onClick={() => handleDelete(task.id)} style={{ marginTop: 8 }}><FormattedMessage id="delete" /></button>
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