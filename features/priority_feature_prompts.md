# Priority Feature - Product Requirement Prompts

## Backend Development Prompts

### 1. Task Priority Enum Implementation
```prompt
Implement a TaskPriority enum in C# with the following requirements:

Implementation Steps:
1. Create TaskPriority.cs in Models directory
2. Define enum values with XML documentation
3. Add extension methods for validation and conversion
4. Implement ToString() override for display

Validation:
- Ensure enum values are consecutive
- Validate string to enum conversions
- Implement IsDefined checks for enum values

Error Handling:
- Handle invalid enum value conversions
- Provide meaningful error messages for invalid values
- Implement custom exception types if needed

Test Requirements:
- Unit test all enum value conversions
- Test extension methods
- Verify XML documentation completeness
- Test error cases and exception handling
```

### 2. Task Model Update
```prompt
Update the TaskItem model to include priority with these requirements:

Implementation Steps:
1. Add Priority property to TaskItem class
2. Implement validation attributes
3. Update model constructor
4. Add migration for database changes
5. Update model mapping profiles

Validation:
- Required field validation
- Enum value validation
- Business rule validation (if any)
- Model state validation in controller

Error Handling:
- Handle null values
- Validate priority changes
- Log validation failures
- Return appropriate error responses

Test Requirements:
- Unit test model validation
- Test model state errors
- Verify default value assignment
- Test serialization/deserialization
- Test backward compatibility
```

### 3. Database Migration
```prompt
Create a database migration for task priority with these requirements:

Implementation Steps:
1. Create new migration file
2. Define Up() method with column addition
3. Define Down() method for rollback
4. Add data seeding for existing records
5. Create database indexes

Validation:
- Verify column constraints
- Validate default values
- Check index effectiveness
- Ensure data integrity

Error Handling:
- Handle migration failures
- Implement rollback procedures
- Log migration errors
- Handle concurrent migrations

Test Requirements:
- Test migration Up() and Down()
- Verify data integrity after migration
- Test performance with large datasets
- Validate index effectiveness
- Test rollback scenarios
```

### 4. API Endpoint Updates
```prompt
Update TasksController endpoints to support priority with these requirements:

Implementation Steps:
1. Update DTO models
2. Modify controller actions
3. Add validation logic
4. Update API documentation
5. Implement filtering logic

Validation:
- Request model validation
- Priority value validation
- Authorization validation
- Business rule validation

Error Handling:
- Return appropriate HTTP status codes
- Implement error response model
- Log API errors
- Handle concurrent updates

Test Requirements:
- Unit test all endpoints
- Test authorization scenarios
- Verify error responses
- Test concurrent requests
- Performance test with large datasets
```

## Frontend Development Prompts

### 5. Priority Selection Component
```prompt
Create a reusable priority selection component with these requirements:

Implementation Steps:
1. Create component file structure
2. Implement component logic
3. Add styling and animations
4. Implement form integration
5. Add accessibility features

Validation:
- Input validation
- Form state validation
- Required field validation
- Custom validation rules

Error Handling:
- Display validation errors
- Handle network errors
- Show loading states
- Handle edge cases

Test Requirements:
- Unit test component logic
- Test user interactions
- Verify accessibility
- Test error states
- Test form integration
```

### 6. Task List Priority Features
```prompt
Update the task list view to support priority with these requirements:

Implementation Steps:
1. Add priority column
2. Implement sorting logic
3. Add filter components
4. Update list item component
5. Implement priority indicators

Validation:
- Sort order validation
- Filter criteria validation
- Data consistency checks
- Performance validation

Error Handling:
- Handle empty states
- Show loading indicators
- Handle filter errors
- Manage sorting errors

Test Requirements:
- Test sorting functionality
- Verify filter behavior
- Test performance with large lists
- Test responsive design
- Test accessibility features
```

### 7. Priority Localization
```prompt
Implement priority level localization with these requirements:

Implementation Steps:
1. Add translation keys
2. Create translation files
3. Implement translation hooks
4. Add fallback handling
5. Update components

Validation:
- Verify all translations
- Check fallback behavior
- Validate string formatting
- Test RTL support

Error Handling:
- Handle missing translations
- Manage loading states
- Handle locale changes
- Log translation errors

Test Requirements:
- Test all supported locales
- Verify fallback behavior
- Test dynamic language switching
- Validate translation completeness
```

### 8. Priority TypeScript Integration
```prompt
Create TypeScript definitions for priority with these requirements:

Implementation Steps:
1. Define Priority enum
2. Create interface definitions
3. Implement type guards
4. Add utility types
5. Update API types

Validation:
- Type checking
- Interface compliance
- Generic constraints
- Runtime type checking

Error Handling:
- Handle type mismatches
- Validate type conversions
- Manage undefined states
- Handle null values

Test Requirements:
- Test type definitions
- Verify type guards
- Test utility functions
- Validate API types
```

## Testing Prompts

### 9. Backend Testing
```prompt
Implement backend tests for priority feature with these requirements:

Implementation Steps:
1. Set up test environment
2. Create test data
3. Implement test cases
4. Add integration tests
5. Set up CI pipeline

Test Coverage Requirements:
- Unit Tests:
  * Enum validation
  * Model validation
  * Controller actions
  * Service methods
- Integration Tests:
  * API endpoints
  * Database operations
  * Authentication
- Performance Tests:
  * Query performance
  * Concurrent operations
  * Load testing

Error Scenarios to Test:
- Invalid priority values
- Unauthorized access
- Concurrent updates
- Database constraints
- Network failures
```

### 10. Frontend Testing
```prompt
Implement frontend tests for priority feature with these requirements:

Implementation Steps:
1. Set up test environment
2. Create test utilities
3. Implement component tests
4. Add E2E test suite
5. Configure test reporting

Test Coverage Requirements:
- Unit Tests:
  * Component rendering
  * State management
  * Event handlers
  * Utility functions
- Integration Tests:
  * Component interactions
  * API integration
  * State updates
- E2E Tests:
  * User workflows
  * Error scenarios
  * Performance

Error Scenarios to Test:
- Form validation errors
- API failures
- Loading states
- Edge cases
- Browser compatibility
```

## UI/UX Prompts

### 11. Priority Visual Design
```prompt
Implement priority visual design with these requirements:

Implementation Steps:
1. Create design tokens
2. Implement base styles
3. Add interactive states
4. Create animations
5. Implement themes

Validation:
- Color contrast checks
- Responsive design testing
- Animation performance
- Browser compatibility

Error Handling:
- Fallback styles
- Loading states
- Error states
- Edge cases

Test Requirements:
- Visual regression tests
- Accessibility compliance
- Performance metrics
- Cross-browser testing
```

### 12. Priority Accessibility
```prompt
Implement priority accessibility features with these requirements:

Implementation Steps:
1. Add ARIA attributes
2. Implement keyboard navigation
3. Add screen reader support
4. Create focus management
5. Add voice control

Validation:
- WCAG compliance
- Keyboard navigation
- Screen reader testing
- Voice control testing

Error Handling:
- Focus trap handling
- Keyboard event errors
- Screen reader fallbacks
- Input method failures

Test Requirements:
- Accessibility audit
- Keyboard navigation
- Screen reader testing
- Voice control testing
```

## Documentation Prompts

### 13. API Documentation
```prompt
Create API documentation for priority feature with these requirements:

Implementation Steps:
1. Document endpoints
2. Create examples
3. Document error codes
4. Add validation rules
5. Create migration guide

Validation:
- API spec compliance
- Example accuracy
- Documentation completeness
- Link validation

Error Documentation:
- Error codes
- Error messages
- Troubleshooting guides
- Common issues

Test Requirements:
- Validate examples
- Test documentation links
- Verify error codes
- Test code snippets
```

### 14. Frontend Documentation
```prompt
Create frontend documentation for priority feature with these requirements:

Implementation Steps:
1. Document components
2. Create usage examples
3. Add prop documentation
4. Document hooks
5. Add storybook stories

Validation:
- Component API accuracy
- Example completeness
- Props documentation
- Hook usage examples

Error Documentation:
- Common issues
- Troubleshooting
- Known limitations
- Edge cases

Test Requirements:
- Test code examples
- Verify documentation
- Test storybook stories
- Validate prop types
```

## Performance Prompts

### 15. Performance Optimization
```prompt
Implement performance optimizations for priority feature with these requirements:

Implementation Steps:
1. Implement caching
2. Optimize queries
3. Add indexing
4. Implement lazy loading
5. Add performance monitoring

Validation:
- Response time metrics
- Resource usage
- Cache hit rates
- Query performance

Error Handling:
- Cache invalidation
- Query timeouts
- Resource limits
- Fallback strategies

Test Requirements:
- Performance benchmarks
- Load testing
- Stress testing
- Monitoring validation
``` 