using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using TaskPlanner.Models;
using Xunit;

namespace TaskPlanner.Tests
{
    public class TasksControllerTests : IClassFixture<WebApplicationFactory<TaskPlanner.Startup>>
    {
        private readonly WebApplicationFactory<TaskPlanner.Startup> _factory;
        public TasksControllerTests(WebApplicationFactory<TaskPlanner.Startup> factory)
        {
            _factory = factory;
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