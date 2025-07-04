## FEATURE:  
Implement a sort feature in the Task Planner app that allows users to sort tasks by key fields: `Name`, `Due Date`, `Priority`, and `Status`. Sorting should be available in both ascending and descending order, with default sorting by `Due Date (ascending)` if no preference is selected.

**Requirements:**
- Add sort parameters to the API (e.g., `sortField` and `sortDirection`)
- Support sorting by: `Name`, `Due Date`, `Priority`, and `Status`
- Sorting must be stable (preserve order when values are equal)
- On the frontend, allow users to click column headers to sort
- Display current sort direction with appropriate UI indicators (e.g., ↑ ↓)
- Retain sort state during pagination and filtering

## EXAMPLES:  
- `examples/api_sort_query.json`: Example API requests showing valid combinations like `?sortField=priority&sortDirection=desc`
- `examples/react_sort_state.tsx`: React component with local state for current sort field and direction
- `examples/sorted_response.json`: Example of server response sorted by due date descending

## DOCUMENTATION:  
- [.NET Core: Sorting with LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/sorting-data)  
- [React Table Sorting Docs](https://react-table.tanstack.com/docs/api/useSortBy)  
- Internal API Spec: `GET /api/tasks` should support `?sortField` and `?sortDirection` query params

## OTHER CONSIDERATIONS:  
- Ensure sorting logic in backend uses consistent culture and casing (e.g., ordinal comparison for strings)  
- Handle `null` values gracefully—decide whether they appear first or last  
- Sorting should integrate cleanly with pagination and filtering logic  
- Consider debounce or request batching for frontend sorting to avoid excessive API calls  
- Validate sort fields on the server to avoid injection or invalid queries  
