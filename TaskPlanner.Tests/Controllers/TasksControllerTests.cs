using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Testing;
using TaskPlanner.Models;
using TaskPlanner.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace TaskPlanner.Tests.Controllers
{
    public class TasksControllerTests : IClassFixture<WebApplicationFactory<TaskPlanner.Startup>>
    {
        private readonly WebApplicationFactory<TaskPlanner.Startup> _factory;
        private readonly TaskRepository _repository;

        public TasksControllerTests(WebApplicationFactory<TaskPlanner.Startup> factory)
        {
            _factory = factory;
            _repository = _factory.Services.GetRequiredService<TaskRepository>();
            _repository.ClearTasks(); // Clear tasks before each test
        }

        [Fact]
        public async Task CanCreateTaskWithPriority()
        {
            // Arrange
            var client = _factory.CreateClient();
            var newTask = new TaskItem 
            { 
                Name = "Priority Test", 
                Description = "Test Priority Feature",
                Priority = TaskPriority.High 
            };

            // Act
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            postResp.EnsureSuccessStatusCode();
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();

            // Assert
            Assert.NotNull(created);
            Assert.Equal(TaskPriority.High, created.Priority);
        }

        [Fact]
        public async Task DefaultPriorityIsMedium()
        {
            // Arrange
            var client = _factory.CreateClient();
            var newTask = new TaskItem 
            { 
                Name = "Default Priority", 
                Description = "Test Default Priority" 
            };

            // Act
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();

            // Assert
            Assert.NotNull(created);
            Assert.Equal(TaskPriority.Medium, created.Priority);
        }

        [Fact]
        public async Task CanUpdateTaskPriority()
        {
            // Arrange
            var client = _factory.CreateClient();
            var newTask = new TaskItem 
            { 
                Name = "Update Priority", 
                Description = "Test Priority Update" 
            };
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();
            Assert.NotNull(created);

            // Act
            created.Priority = TaskPriority.Critical;
            var putResp = await client.PutAsJsonAsync($"/api/tasks/{created.Id}", created);
            putResp.EnsureSuccessStatusCode();
            var getResp = await client.GetAsync($"/api/tasks/{created.Id}");
            var updated = await getResp.Content.ReadFromJsonAsync<TaskItem>();

            // Assert
            Assert.NotNull(updated);
            Assert.Equal(TaskPriority.Critical, updated.Priority);
        }

        [Fact]
        public async Task CanFilterByPriority()
        {
            // Arrange
            var client = _factory.CreateClient();
            var tasks = new[]
            {
                new TaskItem { Name = "High1", Priority = TaskPriority.High },
                new TaskItem { Name = "Low1", Priority = TaskPriority.Low },
                new TaskItem { Name = "High2", Priority = TaskPriority.High }
            };

            foreach (var task in tasks)
            {
                await client.PostAsJsonAsync("/api/tasks", task);
            }

            // Act
            var response = await client.GetAsync("/api/tasks?priority=High");
            response.EnsureSuccessStatusCode();
            var filteredTasks = await response.Content.ReadFromJsonAsync<IEnumerable<TaskItem>>();

            // Assert
            Assert.NotNull(filteredTasks);
            Assert.All(filteredTasks, task => Assert.Equal(TaskPriority.High, task.Priority));
            Assert.Equal(2, filteredTasks.Count());
        }

        [Theory]
        [InlineData("asc")]
        [InlineData("desc")]
        public async Task CanSortByPriority(string order)
        {
            // Arrange
            var client = _factory.CreateClient();
            var tasks = new[]
            {
                new TaskItem { Name = "Task1", Priority = TaskPriority.Medium },
                new TaskItem { Name = "Task2", Priority = TaskPriority.High },
                new TaskItem { Name = "Task3", Priority = TaskPriority.Low }
            };

            foreach (var task in tasks)
            {
                await client.PostAsJsonAsync("/api/tasks", task);
            }

            // Act
            var response = await client.GetAsync($"/api/tasks?sortBy=priority&order={order}");
            response.EnsureSuccessStatusCode();
            var sortedTasks = await response.Content.ReadFromJsonAsync<IEnumerable<TaskItem>>();

            // Assert
            Assert.NotNull(sortedTasks);
            var taskList = sortedTasks.ToList();
            if (order == "asc")
            {
                Assert.True(taskList[0].Priority <= taskList[1].Priority);
                Assert.True(taskList[1].Priority <= taskList[2].Priority);
            }
            else
            {
                Assert.True(taskList[0].Priority >= taskList[1].Priority);
                Assert.True(taskList[1].Priority >= taskList[2].Priority);
            }
        }

        [Fact]
        public async Task CanCreateAndGetTask()
        {
            var client = _factory.CreateClient();
            var newTask = new TaskItem { Name = "Test", Description = "Desc" };
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            postResp.EnsureSuccessStatusCode();
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();
            Assert.NotNull(created);
            var getResp = await client.GetAsync($"/api/tasks/{created.Id}");
            getResp.EnsureSuccessStatusCode();
            var fetched = await getResp.Content.ReadFromJsonAsync<TaskItem>();
            Assert.Equal("Test", fetched.Name);
        }

        [Fact]
        public async Task CanUpdateTask()
        {
            var client = _factory.CreateClient();
            var newTask = new TaskItem { Name = "ToUpdate", Description = "Desc" };
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();
            created.Name = "Updated";
            var putResp = await client.PutAsJsonAsync($"/api/tasks/{created.Id}", created);
            putResp.EnsureSuccessStatusCode();
            var getResp = await client.GetAsync($"/api/tasks/{created.Id}");
            var updated = await getResp.Content.ReadFromJsonAsync<TaskItem>();
            Assert.Equal("Updated", updated.Name);
        }

        [Fact]
        public async Task CanDeleteTask()
        {
            var client = _factory.CreateClient();
            var newTask = new TaskItem { Name = "ToDelete", Description = "Desc" };
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();
            var delResp = await client.DeleteAsync($"/api/tasks/{created.Id}");
            delResp.EnsureSuccessStatusCode();
            var getResp = await client.GetAsync($"/api/tasks/{created.Id}");
            Assert.Equal(HttpStatusCode.NotFound, getResp.StatusCode);
        }

        [Fact]
        public async Task CanToggleComplete()
        {
            var client = _factory.CreateClient();
            var newTask = new TaskItem { Name = "Toggle", Description = "Desc" };
            var postResp = await client.PostAsJsonAsync("/api/tasks", newTask);
            var created = await postResp.Content.ReadFromJsonAsync<TaskItem>();
            Assert.False(created.IsCompleted);
            var toggleResp = await client.PostAsync($"/api/tasks/{created.Id}/toggle-complete", null);
            toggleResp.EnsureSuccessStatusCode();
            var getResp = await client.GetAsync($"/api/tasks/{created.Id}");
            var toggled = await getResp.Content.ReadFromJsonAsync<TaskItem>();
            Assert.True(toggled.IsCompleted);
        }
    }
} 