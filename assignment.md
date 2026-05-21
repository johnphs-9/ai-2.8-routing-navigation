# Optional Assignment: Task Manager

## Overview

- **Lesson:** Routing and Navigation with React Router / 2.8
- **Type:** Optional Take-Home Assignment
- **Estimated Time:** 2–3 hours
- **Due:** Before next lesson
- **Submission:** GitHub repository link or ZIP file

## Learning Objectives Covered

This assignment reinforces:

- Declaring routes with `BrowserRouter`, `Routes`, and `Route`
- Navigating between pages with `Link`, `NavLink`, and `useNavigate`
- Reading URL parameters with `useParams` to load detail views
- Protecting routes with a `ProtectedRoute` component
- Redirecting back to the original destination after login using `useLocation`

## Assignment Description

Build a **Task Manager**: a small productivity app where users can view a list of tasks, open a detail page for each task, and add new tasks. Two user roles have different capabilities — a manager can add and delete tasks, while a member can only view them.

This project is intentionally separate from the CRM so you can practise applying routing patterns to a different domain without copying the lab code directly.

### What You Will Build

A multi-page React application that:

- Shows a login screen with two mock users (manager and member)
- Lists all tasks at `/tasks` with a task name, status badge, and "View" button
- Shows a detail page at `/tasks/:id` with the full task description and assignee
- Allows manager users to add new tasks at `/tasks/new`
- Redirects unauthenticated users to `/login` and back to their original destination after login
- Shows a 404 page for unrecognised URLs

## Requirements

### Core Requirements

#### 1. Project Setup

- [ ] Create a new React app using Vite: `npm create vite@latest task-manager -- --template react`
- [ ] Install React Router: `npm install react-router-dom`
- [ ] No other libraries — use only React and `react-router-dom`

#### 2. Mock Data

Use the following hardcoded task list as your initial data (no server required):

```js
const TASKS = [
  { id: 1, title: 'Design login screen',   status: 'done',        assignee: 'Alice', description: 'Create wireframes and final designs for the login and registration screens.' },
  { id: 2, title: 'Set up CI pipeline',    status: 'in-progress', assignee: 'Bob',   description: 'Configure GitHub Actions to run tests and linting on every pull request.' },
  { id: 3, title: 'Write API docs',        status: 'todo',        assignee: 'Carol', description: 'Document all REST endpoints using OpenAPI 3.0 format in the project wiki.' },
  { id: 4, title: 'Fix mobile nav bug',    status: 'in-progress', assignee: 'Alice', description: 'The hamburger menu does not close after a link is tapped on iOS Safari.' },
  { id: 5, title: 'Upgrade dependencies',  status: 'todo',        assignee: 'Bob',   description: 'Run npm outdated, review breaking changes, and update to latest stable versions.' },
];
```

Store this in a context (see below) so components can read it without prop drilling.

#### 3. Mock Users

```js
const USERS = [
  { id: 1, username: 'manager', password: 'manager', name: 'Alice (Manager)', role: 'manager' },
  { id: 2, username: 'member',  password: 'member',  name: 'Bob (Member)',   role: 'member'  },
];
```

#### 4. Routes to Create

| Path | Component | Access |
|------|-----------|--------|
| `/login` | `Login` | Public |
| `/tasks` | `TaskList` | Authenticated |
| `/tasks/new` | `AddTask` | Manager only |
| `/tasks/:id` | `TaskDetail` | Authenticated |
| `*` | `NotFound` | Everyone |

#### 5. Components to Create

**a) `AuthContext`** — provides `user`, `login`, `logout`, and `hasRole`; uses `localStorage` to persist the session

**b) `TaskContext`** — provides `tasks`, `addTask`, and `deleteTask` using `useState` or `useReducer`

**c) `ProtectedRoute`** — wraps routes that require authentication; redirects to `/login` with `state={{ from: location }}`; optionally accepts a `requiredRole` prop

**d) `Navbar`** — uses `NavLink` for active styling; shows "Tasks" link when logged in; shows "Add Task" only for managers; includes a Logout button

**e) `TaskList`** — renders all tasks; each row has a "View" button that calls `useNavigate` to go to `/tasks/:id`

**f) `TaskDetail`** — uses `useParams` to get the task ID; finds the matching task from context; displays full title, description, status, and assignee; includes a "← Back to Tasks" link; manager users see a Delete button that deletes the task and navigates back to `/tasks`

**g) `AddTask`** — controlled form with title (text), description (textarea), status (select: todo / in-progress / done), and assignee (text); on submit, calls `addTask` and navigates to the new task's detail page

**h) `Login`** — validates credentials against the mock user list; on success, calls `login` and redirects to `location.state?.from?.pathname || '/tasks'`; uses `replace: true`

**i) `NotFound`** — displays the attempted path using `useLocation`; includes a link back to `/tasks`

#### 6. Authentication Flow

When an unauthenticated user visits `/tasks/3`:

1. `ProtectedRoute` redirects to `/login` with `state={{ from: { pathname: '/tasks/3' } }}`
2. The user logs in
3. `Login` reads `location.state.from.pathname` and navigates to `/tasks/3` with `{ replace: true }`
4. The user lands on the task detail page they originally wanted

Verify this flow works end to end.

### Stretch Goals

- [ ] Add a status filter to `TaskList` so users can show only `todo`, `in-progress`, or `done` tasks — store the active filter in the URL as a query parameter (`/tasks?status=todo`) using `useSearchParams`
- [ ] Add an edit task page at `/tasks/:id/edit` that pre-fills the form with the task's current data and updates it on submit
- [ ] Add breadcrumb navigation to `TaskDetail`: `Tasks > Fix mobile nav bug` where "Tasks" links back to `/tasks`
- [ ] Persist the task list in `localStorage` so tasks added during a session survive a page reload

## Deliverables

- GitHub repository link (or ZIP file) submitted to the course platform
- A `README.md` in the root that explains how to install and run the project (`npm install` and `npm run dev`)
- Screenshots or a short screen recording demonstrating:
  - Navigating to a protected route without being logged in (redirected to `/login`)
  - Logging in and being sent back to the original destination
  - The manager role seeing "Add Task" in the navbar; the member role not seeing it
  - A 404 page for an invalid URL

## AI and Tools

If you use an AI coding assistant:

- Document which parts were AI-assisted in your `README.md`
- Review and understand any generated code before submitting — you may be asked to explain your implementation choices
- Validate the application manually against the authentication flow checklist above

## References

- [React Router — Official Documentation](https://reactrouter.com/en/main)
- [React Router — useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
- [React Router — useParams](https://reactrouter.com/en/main/hooks/use-params)
- [React Router — useLocation](https://reactrouter.com/en/main/hooks/use-location)
