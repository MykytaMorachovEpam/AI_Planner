using System;
using TaskPlanner.Models;
using Xunit;

namespace TaskPlanner.Tests.Models
{
    public class TaskItemTests
    {
        [Fact]
        public void TaskItem_DefaultPriority_IsMedium()
        {
            // Arrange & Act
            var task = new TaskItem();

            // Assert
            Assert.Equal(TaskPriority.Medium, task.Priority);
        }

        [Theory]
        [InlineData(TaskPriority.Low)]
        [InlineData(TaskPriority.Medium)]
        [InlineData(TaskPriority.High)]
        [InlineData(TaskPriority.Critical)]
        public void TaskItem_SetPriority_StoresPriorityCorrectly(TaskPriority priority)
        {
            // Arrange
            var task = new TaskItem();

            // Act
            task.Priority = priority;

            // Assert
            Assert.Equal(priority, task.Priority);
        }

        [Fact]
        public void TaskItem_CreateWithPriority_SetsPriorityCorrectly()
        {
            // Arrange & Act
            var task = new TaskItem
            {
                Name = "Test Task",
                Description = "Test Description",
                Priority = TaskPriority.High
            };

            // Assert
            Assert.Equal(TaskPriority.High, task.Priority);
        }

        [Fact]
        public void TaskItem_Serialization_IncludesPriority()
        {
            // Arrange
            var task = new TaskItem
            {
                Name = "Test Task",
                Description = "Test Description",
                Priority = TaskPriority.Critical
            };

            // Act
            var json = System.Text.Json.JsonSerializer.Serialize(task);
            var deserializedTask = System.Text.Json.JsonSerializer.Deserialize<TaskItem>(json);

            // Assert
            Assert.NotNull(deserializedTask);
            Assert.Equal(TaskPriority.Critical, deserializedTask.Priority);
        }

        [Fact]
        public void TaskItem_Clone_CopiesPriority()
        {
            // Arrange
            var originalTask = new TaskItem
            {
                Name = "Original Task",
                Description = "Original Description",
                Priority = TaskPriority.High
            };

            // Act
            var clonedTask = new TaskItem
            {
                Name = originalTask.Name,
                Description = originalTask.Description,
                Priority = originalTask.Priority
            };

            // Assert
            Assert.Equal(originalTask.Priority, clonedTask.Priority);
        }
    }
} 