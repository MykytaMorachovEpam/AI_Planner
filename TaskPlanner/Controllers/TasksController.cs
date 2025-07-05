using Microsoft.AspNetCore.Mvc;
using TaskPlanner.Data;
using TaskPlanner.Models;
using System.Collections.Generic;
using System.Linq;

namespace TaskPlanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskRepository _repository;
        public TasksController(TaskRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetAll(
            [FromQuery] string? priority = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? order = null)
        {
            var tasks = _repository.GetAll();

            // Apply priority filter
            if (!string.IsNullOrEmpty(priority) && Enum.TryParse<TaskPriority>(priority, true, out var priorityEnum))
            {
                tasks = tasks.Where(t => t.Priority == priorityEnum).ToList();
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(sortBy) && sortBy.Equals("priority", StringComparison.OrdinalIgnoreCase))
            {
                tasks = (order?.ToLower() == "desc")
                    ? tasks.OrderByDescending(t => t.Priority).ToList()
                    : tasks.OrderBy(t => t.Priority).ToList();
            }

            return tasks;
        }

        [HttpGet("{id}")]
        public ActionResult<TaskItem> Get(Guid id)
        {
            var task = _repository.GetAll().FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        public IActionResult Create(CreateTaskRequest request)
        {
            var task = new TaskItem
            {
                Name = request.Name,
                Description = request.Description,
                DueDate = request.DueDate,
                IsCompleted = request.IsCompleted,
                Priority = ParsePriority(request.Priority)
            };
            
            _repository.Add(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        private TaskPriority ParsePriority(string? priorityString)
        {
            if (string.IsNullOrEmpty(priorityString))
                return TaskPriority.Medium;
                
            return Enum.TryParse<TaskPriority>(priorityString, true, out var priority) 
                ? priority 
                : TaskPriority.Medium;
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, TaskItem updated)
        {
            var task = _repository.GetAll().FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();
            
            task.Name = updated.Name;
            task.Description = updated.Description;
            task.DueDate = updated.DueDate;
            task.IsCompleted = updated.IsCompleted;
            task.Priority = updated.Priority;
            
            _repository.Save();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _repository.Delete(id);
            return NoContent();
        }

        [HttpPost("{id}/toggle-complete")]
        public IActionResult ToggleComplete(Guid id)
        {
            _repository.ToggleComplete(id);
            return NoContent();
        }

        [HttpPut("{id}/priority")]
        public IActionResult UpdatePriority(Guid id, [FromBody] PriorityUpdateRequest request)
        {
            var task = _repository.GetAll().FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();
            
            if (Enum.TryParse<TaskPriority>(request.Priority, true, out var priority))
            {
                task.Priority = priority;
                _repository.Save();
                return NoContent();
            }
            
            return BadRequest("Invalid priority value");
        }
    }

    public class PriorityUpdateRequest
    {
        public string Priority { get; set; } = string.Empty;
    }

    public class CreateTaskRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public string? Priority { get; set; }
    }
} 