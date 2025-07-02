using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using TaskPlanner.Models;

namespace TaskPlanner.Data
{
    public class TaskRepository
    {
        private readonly string _filePath = "tasks.json";
        private List<TaskItem> _tasks;

        public TaskRepository()
        {
            _tasks = LoadTasks();
        }

        private List<TaskItem> LoadTasks()
        {
            if (!File.Exists(_filePath))
                return new List<TaskItem>();
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<TaskItem>>(json) ?? new List<TaskItem>();
        }

        private void SaveTasks()
        {
            var json = JsonSerializer.Serialize(_tasks);
            File.WriteAllText(_filePath, json);
        }

        public List<TaskItem> GetAll() => _tasks;

        public void Add(TaskItem task)
        {
            _tasks.Add(task);
            SaveTasks();
        }

        public void Delete(Guid id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task != null)
            {
                _tasks.Remove(task);
                SaveTasks();
            }
        }

        public void ToggleComplete(Guid id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task != null)
            {
                task.IsCompleted = !task.IsCompleted;
                SaveTasks();
            }
        }

        public void Save()
        {
            SaveTasks();
        }
    }
} 