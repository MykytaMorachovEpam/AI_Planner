using System;
using System.Text.Json.Serialization;

namespace TaskPlanner.Models
{
    /// <summary>
    /// Represents the priority level of a task.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TaskPriority
    {
        /// <summary>
        /// Low priority tasks that are not time-sensitive and can be completed when convenient.
        /// </summary>
        Low = 0,

        /// <summary>
        /// Medium priority tasks that should be completed in a reasonable timeframe.
        /// </summary>
        Medium = 1,

        /// <summary>
        /// High priority tasks that require prompt attention and should be completed soon.
        /// </summary>
        High = 2,

        /// <summary>
        /// Critical priority tasks that require immediate attention and should be completed as soon as possible.
        /// </summary>
        Critical = 3
    }
} 