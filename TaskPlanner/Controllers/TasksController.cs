using Microsoft.AspNetCore.Mvc;
using TaskPlanner.Data;
using TaskPlanner.Models;

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
        public ActionResult<IEnumerable<TaskItem>> GetAll() => _repository.GetAll();

        [HttpGet("{id}")]
        public ActionResult<TaskItem> Get(Guid id)
        {
            var task = _repository.GetAll().FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        public IActionResult Create(TaskItem task)
        {
            _repository.Add(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
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
    }
} 