using System;
using System.ComponentModel;
using TaskPlanner.Models;
using Xunit;

namespace TaskPlanner.Tests.Models
{
    public class TaskPriorityTests
    {
        [Fact]
        public void TaskPriority_HasCorrectValues()
        {
            // Arrange & Act & Assert
            Assert.Equal(0, (int)TaskPriority.Low);
            Assert.Equal(1, (int)TaskPriority.Medium);
            Assert.Equal(2, (int)TaskPriority.High);
            Assert.Equal(3, (int)TaskPriority.Critical);
        }

        [Fact]
        public void TaskPriority_HasCorrectDefaultValue()
        {
            // Arrange
            var defaultPriority = default(TaskPriority);

            // Act & Assert
            Assert.Equal(TaskPriority.Low, defaultPriority);
        }

        [Theory]
        [InlineData(TaskPriority.Low, "Low")]
        [InlineData(TaskPriority.Medium, "Medium")]
        [InlineData(TaskPriority.High, "High")]
        [InlineData(TaskPriority.Critical, "Critical")]
        public void TaskPriority_ToStringReturnsCorrectValue(TaskPriority priority, string expected)
        {
            // Act
            string result = priority.ToString();

            // Assert
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("Low", TaskPriority.Low)]
        [InlineData("Medium", TaskPriority.Medium)]
        [InlineData("High", TaskPriority.High)]
        [InlineData("Critical", TaskPriority.Critical)]
        [InlineData("LOW", TaskPriority.Low)]
        [InlineData("MEDIUM", TaskPriority.Medium)]
        [InlineData("HIGH", TaskPriority.High)]
        [InlineData("CRITICAL", TaskPriority.Critical)]
        public void TaskPriority_ParseValidValue(string input, TaskPriority expected)
        {
            // Act
            var success = Enum.TryParse<TaskPriority>(input, true, out var result);

            // Assert
            Assert.True(success);
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("")]
        [InlineData("Invalid")]
        [InlineData("NotAPriority")]
        public void TaskPriority_ParseInvalidValue_ReturnsFalse(string input)
        {
            // Act
            var success = Enum.TryParse<TaskPriority>(input, true, out var result);

            // Assert
            Assert.False(success);
        }

        [Theory]
        [InlineData(TaskPriority.Low)]
        [InlineData(TaskPriority.Medium)]
        [InlineData(TaskPriority.High)]
        [InlineData(TaskPriority.Critical)]
        public void TaskPriority_IsDefinedValue_ReturnsTrue(TaskPriority priority)
        {
            // Act & Assert
            Assert.True(Enum.IsDefined(typeof(TaskPriority), priority));
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(4)]
        [InlineData(100)]
        public void TaskPriority_IsUndefinedValue_ReturnsFalse(int invalidValue)
        {
            // Act & Assert
            Assert.False(Enum.IsDefined(typeof(TaskPriority), invalidValue));
        }
    }
} 