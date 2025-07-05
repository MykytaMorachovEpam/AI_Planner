## FEATURE:
Implement a priority system for tasks in the Task Planner app that allows users to assign and manage task priorities. Each task should have a priority level that helps users identify and focus on their most important tasks.

**Requirements:**

### Data Model
- Add `TaskPriority` enum with levels:
  ```csharp
  public enum TaskPriority
  {
      Low = 0,
      Medium = 1,
      High = 2,
      Critical = 3
  }
  ```
- Add `Priority` property to `TaskItem` class with `Medium` as default
- Ensure priority is required (non-nullable)

### API Changes
- Update `TasksController` endpoints:
  - POST `/api/tasks`: Accept priority in task creation
  - PUT `/api/tasks/{id}`: Allow priority updates
  - GET `/api/tasks`: Include priority in response
  - GET `/api/tasks`: Add priority-based filtering
- Add validation for priority values
- Maintain backward compatibility (default priority for existing tasks)

### Database Updates
- Add Priority column to Tasks table
- Create database migration for:
  - Adding Priority column
  - Setting default values for existing records
  - Adding appropriate indexes

### Frontend Implementation
- Task Creation/Edit:
  - Add priority selection dropdown
  - Visual indicators for different priorities
  - Validation feedback
- Task List View:
  - Display priority indicators
  - Add priority-based filtering
  - Enable priority-based sorting
  - Add priority column to task table
- TypeScript Updates:
  - Add Priority enum
  - Update task interfaces
- Localization:
  - Add priority level translations for:
    - English (en)
    - Ukrainian (ua, uk)

### Testing Requirements
- Unit Tests:
  - Priority validation
  - Default priority assignment
  - Priority updates
- Integration Tests:
  - API endpoints with priority
  - Priority filtering/sorting
- E2E Tests:
  - Priority selection in forms
  - Priority display
  - Priority filtering/sorting
  - Priority updates

### UI/UX Guidelines
- Visual Hierarchy:
  - Critical: Red or prominent indicator
  - High: Orange/Yellow indicator
  - Medium: Blue/Green indicator
  - Low: Gray/Neutral indicator
- Accessibility:
  - Color + symbol combinations for priority indicators
  - Screen reader support for priority levels
  - Keyboard shortcuts for priority changes
- Tooltips explaining priority levels
- Clear visual feedback on priority changes

## DOCUMENTATION:
- Update API documentation with priority field
- Document priority levels and use cases
- Update frontend component documentation
- Document new filtering/sorting capabilities
- Add migration guide for existing tasks

## OTHER CONSIDERATIONS:
- Performance impact of priority-based queries
- Bulk priority updates for multiple tasks
- Priority statistics and reporting
- Default priority for imported tasks
- Priority inheritance for subtasks (future feature)
- Priority-based notifications (future feature) 