# Lesson 2.8: Routing and Navigation with React Router

## Overview

- **Duration:** ~2 hours (hands-on lab)
- **Prerequisites:** Lesson 2.6, Advanced State Management: Context API and Reducers

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Explain** how routing works in single-page applications using React Router
2. **Construct** routes, nested routes, and route parameters for the CRM application
3. **Implement** protected routes with authentication guards

## Introduction

At the end of Lesson 2.6, the CRM renders everything on one page. `App.jsx` decides what to show, a customer list sits on the left, and clicking a card sets a `selectedId` in `CustomerContext` so `CustomerDetail` renders the chosen customer on the right. Nothing about this state lives in the URL: the address bar always reads `http://localhost:5173/`, no matter which customer is selected, whether the add-customer form is open, or whether anyone is logged in at all.

That works for a small prototype, but it breaks down as the CRM grows. A colleague cannot send a teammate a link to a specific customer's record. The browser's Back button does nothing useful, because there is only ever one "page" to go back to. There is no way to bookmark the add-customer form.

In this lesson you will add React Router to the CRM so that each view has its own URL, one route at a time, building each page fully before moving to the next. The CRM's URL space splits into two halves: a small public area (`/` and `/login`) that anyone can see, and an authenticated area behind `/app` (the dashboard, the customer list, and everything else) that only signed-in users can reach. Only once every page inside `/app` works, wide open to anyone who knows the URL, will you add a `ProtectedRoute` guard and lock the whole thing down. Building it open first, then securing it, makes it obvious exactly what the guard is protecting.

By the end of the lab, visiting `/` will show a public welcome page with a link to log in, navigating to `/app/customers/c3` will show that customer's full details, navigating to `/app/customers/new` will open the add-customer form, and navigating to any page under `/app` without being logged in will redirect you to `/login` and then back to your original destination after you sign in.

---

## Part 1: Setup (10 minutes)

### Install React Router

Make sure your CRM development server and json-server are both running:

```bash
npm run dev
```

```bash
npm run server
```

Install React Router in the project:

```bash
npm install react-router@7
```

### Where This Lesson Is Headed

By the end of this lesson, `pages/` and `layouts/` folders will sit alongside `components/`. The distinction matters: **components** are reusable UI pieces (`CustomerCard`, `Sidebar`), **layouts** describe a page shell that wraps multiple routes (the sidebar plus a content area), and **pages** are top-level views that map to a URL route.

Each folder appears later in this lab, at the point where the first file that belongs in it is created: `pages/` when you build `WelcomePage` in Part 2, and `layouts/` when you build `RootLayout` in Part 3. The tree below is a preview of the destination, not a setup step.

```
simple-crm-web/src/
├── components/
│   ├── CustomerCard.jsx
│   ├── CustomerCard.module.css
│   ├── SearchBar.jsx
│   ├── SearchBar.module.css
│   ├── Spinner.jsx
│   ├── Spinner.module.css
│   ├── Sidebar.jsx              ← NEW (replaces Header)
│   ├── Sidebar.module.css       ← NEW
│   └── ProtectedRoute.jsx       ← NEW
├── layouts/
│   ├── RootLayout.jsx           ← NEW
│   └── RootLayout.module.css    ← NEW
├── pages/
│   ├── WelcomePage.jsx          ← NEW
│   ├── WelcomePage.module.css   ← NEW
│   ├── DashboardPage.jsx        ← NEW
│   ├── DashboardPage.module.css ← NEW
│   ├── CustomersPage.jsx        ← NEW
│   ├── NewCustomerPage.jsx      ← NEW
│   ├── CustomerDetailPage.jsx   ← NEW
│   ├── EditCustomerPage.jsx     ← NEW
│   ├── EditCustomerPage.module.css ← NEW
│   ├── LoginPage.jsx            ← MOVED from components/
│   ├── LoginPage.module.css     ← MOVED from components/
│   └── NotFoundPage.jsx         ← NEW
├── contexts/
│   ├── AuthContext.jsx
│   └── CustomerContext.jsx      ← UPDATE
└── App.jsx                      ← UPDATE
```

`components/Header.jsx` and `components/Header.module.css` are removed once `Sidebar` replaces them.

---

## Part 2: A Minimal Route Skeleton (10 minutes)

### Public vs Authenticated URL Space

Before writing any routes, it helps to see the shape of where this lesson is headed. The CRM's URLs split into two groups:

- **Public**: `/` (a welcome page anyone can see) and `/login` (the sign-in form)
- **Authenticated**: everything else, grouped under `/app` — the dashboard at `/app`, the customer list at `/app/customers`, and so on

Grouping every authenticated page under one `/app` prefix means a single guard, built in Part 9, can protect all of them at once, rather than checking authentication page by page.

### Wrapping the App in BrowserRouter

`BrowserRouter` provides the routing context that all React Router hooks and components depend on. It must be an ancestor of every component that uses routing. `AuthProvider` and `CustomerProvider` already wrap the whole tree in `main.jsx`, so `BrowserRouter` slots in around `App`'s returned JSX.

Replace `src/App.jsx` with the smallest possible routing skeleton, just two public routes. You will fill in the authenticated `/app` pages one at a time over the rest of this lab:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";

export const API_BASE = "http://localhost:3001";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="login" element={<div>Login page coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

`API_BASE` stays exported from `App.jsx` exactly as it was in Lesson 2.6, because `CustomerContext.jsx` already imports it from here (`import { API_BASE } from "../App"`). You are not moving it.

`index` and `path="login"` are both relative, no leading slash, and that convention holds for every `<Route>` declaration in this lesson, not just nested ones. `index` marks `WelcomePage` as the default route rendered when nothing more specific matches, the equivalent of `path=""`. `Link`, `NavLink`, and `navigate()` are different: those you will write with full, absolute paths throughout, for reasons covered when `Link` is introduced in Part 3.

### Create the WelcomePage

`WelcomePage` is a small, public page: a heading, a tagline, and a link to `/login`. It is provided as an asset rather than built step by step, this lesson is about routing, not marketing-page UI, and the component itself has no routing concepts worth walking through.

`WelcomePage` is the first file in the `pages/` folder, create the folder now.

Download [`assets/WelcomePage.jsx`](assets/WelcomePage.jsx) and [`assets/WelcomePage.module.css`](assets/WelcomePage.module.css), and copy both to `src/pages/`.

**Browser check:** Open `http://localhost:5173`. You should see the welcome page, with a "Log In" button. Click it, the URL changes to `/login` and you see "Login page coming soon", with no full page reload (watch the browser tab, it does not flicker or show a loading spinner).

Nothing else exists yet, only these two routes. You will add the `/app` routes one at a time as you build each page, rather than declaring the whole route map up front.

### The CRM Route Map (so far)

| Route    | Page          | Access |
| -------- | ------------- | ------ |
| `/`      | `WelcomePage` | Public |
| `/login` | placeholder   | —      |

This table grows through the lesson. By the end it will list every real page and who can access it.

---

## Part 3: The Sidebar and RootLayout (15 minutes)

### Replacing Header with Sidebar

Lesson 2.6's `Header` sits across the top of the page and only shows the signed-in user's name and a sign-out button. As the CRM grows into a multi-page app, a persistent sidebar with navigation links works better than a header with none. You will build `Sidebar` to replace `Header`, and a `RootLayout` component that arranges the sidebar next to the page content. `RootLayout` will also anchor the entire `/app` section of the route tree, more on that shortly.

### NavLink vs Link

React Router provides two navigation components:

- **`Link`** is a basic navigation link. It prevents the browser from doing a full page reload and lets React Router handle the URL change instead. Use it anywhere you need a link that does not need to know whether it is currently active.
- **`NavLink`** does everything `Link` does, but also knows when its `to` path matches the current URL. It passes an `isActive` boolean into the `className` function so you can apply active styling to the current page's link.

```jsx
// Link — no active state
<Link to="/app/customers">Customers</Link>

// NavLink — applies a different class when active
<NavLink
  to="/app/customers"
  className={({ isActive }) => (isActive ? styles.navItemActive : styles.navItem)}
>
  Customers
</NavLink>
```

Both examples use an **absolute** `to`, starting with `/`. This is deliberate, and different from the relative paths you will use inside `<Route>` declarations later in this lesson. A `<Route>`'s relative path is resolved against its parent route in the route tree. A `<Link>` or `navigate()`'s relative path, by contrast, is resolved against the current URL in the address bar, so the same `<Link to="customers/5">` would go somewhere different depending on whether it renders while the user is on `/app` or `/app/customers`. That is easy to get wrong, so this lesson always writes full, absolute paths for `Link`, `NavLink`, and `navigate()`, and saves relative paths for `<Route>` declarations, where they are safe because the parent–child relationship is fixed at compile time.

### Create the Sidebar Component

Create `src/components/Sidebar.jsx`. It has two navigation links: **Dashboard** at `/app` and **Customers** at `/app/customers`.

`AuthContext`'s `user` starts out `null`, and stays `null` until someone actually logs in through a working `LoginPage`, which does not exist until Part 9. If `Sidebar` read `user` from `AuthContext` right now, `{initials(user.name)}` would crash the moment you opened the app, since `.name` cannot be read off `null`, and you would have no way to preview anything you build for the rest of this lesson. Instead, `Sidebar` uses a hardcoded dummy user for now, and switches to the real `AuthContext` in Part 9, once `ProtectedRoute` and a working `LoginPage` together guarantee a real, logged-in user is always present by the time `Sidebar` renders.

```jsx
// src/components/Sidebar.jsx
import { NavLink } from "react-router";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import styles from "./Sidebar.module.css";

// Temporary stand-in for AuthContext's user, replaced in Part 9
const DUMMY_USER = {
  name: "Daniel Goh",
  email: "daniel@simplesystems.io",
  role: "admin",
};

function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function navLinkClass({ isActive }) {
  return styles.navItem + (isActive ? " " + styles.navItemActive : "");
}

function Sidebar() {
  const user = DUMMY_USER;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className={styles.logoText}>Simple CRM</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>Workspace</div>
        <NavLink to="/app" end className={navLinkClass}>
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/app/customers" className={navLinkClass}>
          <Users size={17} />
          <span>Customers</span>
        </NavLink>
      </nav>

      <div className={styles.foot}>
        <div className={styles.footAvatar}>{initials(user.name)}</div>
        <div className={styles.footWho}>
          <div className={styles.footName}>{user.name}</div>
          <span
            className={`${styles.roleBadge} ${user.role === "admin" ? styles.roleBadgeAdmin : styles.roleBadgeUser}`}
          >
            {user.role}
          </span>
        </div>
        <button
          className={styles.signOutBtn}
          onClick={() => alert("Wired up to real logout in Part 9")}
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
```

`Sidebar` renders the role badge from Lesson 2.6's `Header` (the "Role Badge in the Header" activity), showing `admin` or `user` next to the signed-in person's name, using the same `.roleBadge`/`.roleBadgeAdmin`/`.roleBadgeUser` classes. `DUMMY_USER` has `role: "admin"` so the badge shows something realistic while you preview the app.

The `end` prop on the Dashboard `NavLink` matters. By default, `NavLink` treats its `to` path as a prefix match rather than an exact match, so `/app` is considered active whenever the current URL starts with `/app`, including `/app/customers` or `/app/customers/42`. Adding `end` tells `NavLink` to only apply the active state when the current URL matches `/app` exactly. Without it, the Dashboard link would appear active on every page under `/app`, not just the dashboard itself.

Download [`assets/Sidebar.module.css`](assets/Sidebar.module.css) and copy it to `src/components/Sidebar.module.css`. It is adapted directly from the CRM's later sidebar-based lessons; scan the class names before moving on, you will see them used in the JSX above.

`src/components/Header.jsx` and `src/components/Header.module.css` are no longer used anywhere, `Sidebar` replaces them, but there is no need to delete them. Nothing imports an unused file, so it costs nothing to keep around as a reference while you compare `Header`'s JSX to `Sidebar`'s.

### Nested Routes and Outlet

So far every route in this lesson has been a flat, top-level entry in `<Routes>`. React Router also supports **nested routes**: a parent `<Route>` renders a shared layout, and its child routes render inside that layout wherever it places an `<Outlet />`. The parent does not need to know which child is active; `<Outlet />` is simply "whichever child route matched, render it here."

This is exactly the CRM's situation. Every page under `/app` shares the same sidebar. Rather than importing `RootLayout` into every page and wrapping each one by hand, you declare `RootLayout` once as a parent route with `path="app"`, and every authenticated page becomes a child route nested inside it.

```jsx
// The shape you are building toward:
<Route path="app" element={<RootLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="customers" element={<CustomersPage />} />
</Route>
```

Notice the child paths are **relative**, `"customers"`, not `"/app/customers"`. Once a route is nested under a parent with `path="app"`, React Router automatically joins the parent's path with each child's path to build the full URL. Writing an absolute path here would be a mistake, it would replace the whole URL instead of extending it. `index` is a special child route that renders when the URL matches the parent exactly, `/app`, with no further segments, that is how `DashboardPage` becomes the default view for `/app`.

`RootLayout` renders once. Navigating between `/app` and `/app/customers` swaps only the `<Outlet />` content; the sidebar does not re-render.

### Create the RootLayout

`RootLayout` is the first file in the `layouts/` folder, create the folder now.

Create `src/layouts/RootLayout.jsx`:

```jsx
// src/layouts/RootLayout.jsx
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import styles from "./RootLayout.module.css";

function RootLayout() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
```

Download [`assets/RootLayout.module.css`](assets/RootLayout.module.css) and copy it to `src/layouts/RootLayout.module.css`.

`.shell` is a fixed `height: 100vh`, not `min-height`, and `.content` has `overflow-y: auto`. This means only the content area scrolls when a page has more to show than fits on screen, for example a long customer list, while the sidebar stays fixed in place instead of scrolling away with it.

`<Outlet />` is React Router's placeholder for "render the matched child route here," filled in automatically based on the current URL. `RootLayout` itself never changes; only what appears inside `<Outlet />` does.

Wire `RootLayout` into `App.jsx` with `path="app"`, and add a temporary placeholder `index` route so you can see the shell appear before building a real dashboard:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import RootLayout from "./layouts/RootLayout";

export const API_BASE = "http://localhost:3001";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="login" element={<div>Login page coming soon</div>} />

        <Route path="app" element={<RootLayout />}>
          <Route index element={<div>Dashboard coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Browser check:** Navigate to `http://localhost:5173/app` directly in the address bar. The sidebar should appear on the left, with "Dashboard coming soon" in the content area. Clicking the Dashboard link should keep you on `/app` (it is already active). The Customers link goes nowhere useful yet, that is next.

---

## Part 4: The DashboardPage (10 minutes)

### A Real Home Page for /app

`/app` currently shows a placeholder. Give it a real page: a small dashboard that greets the user and shows a few stats pulled from data the CRM already has, no new data model needed. It reads `customers` directly from `CustomerContext` (not `filteredCustomers`, which only exists on `CustomersPage`'s search view) and counts by status.

Create `src/pages/DashboardPage.jsx`:

```jsx
// src/pages/DashboardPage.jsx
import { useContext } from "react";
import { CustomerContext } from "../contexts/CustomerContext";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const { customers } = useContext(CustomerContext);

  const activeCount = customers.filter((c) => c.status === "active").length;
  const inactiveCount = customers.filter((c) => c.status === "inactive").length;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subtitle}>Overview of your workspace</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Customers</div>
          <div className={styles.statValue}>{customers.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active</div>
          <div className={`${styles.statValue} ${styles.statSuccess}`}>
            {activeCount}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Inactive</div>
          <div className={`${styles.statValue} ${styles.statMuted}`}>
            {inactiveCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
```

Download [`assets/DashboardPage.module.css`](assets/DashboardPage.module.css) and copy it to `src/pages/DashboardPage.module.css`.

`customers` on `CustomerContext` still populates from the same `useEffect` fetch you built in Lesson 2.6, `DashboardPage` does not add any new fetching logic, it just reads state that is already there.

Wire `DashboardPage` into `App.jsx`, replacing the placeholder `index` route:

```jsx
// src/App.jsx
import DashboardPage from "./pages/DashboardPage";
// ...
<Route path="app" element={<RootLayout />}>
  <Route index element={<DashboardPage />} />
</Route>;
```

**Browser check:** `/app` should now show "Dashboard" with a subtitle and three stat cards: Total Customers, Active, and Inactive. The counts should match whatever customers currently exist in `db.json`.

---

## Part 5: The CustomersPage (15 minutes)

### Programmatic Navigation with useNavigate

`Link` and `NavLink`, from Part 3, are for navigation the user triggers by clicking something rendered on screen. Sometimes navigation needs to happen as the _result_ of an action instead, after a card is clicked, after a form submits, after a delete succeeds, where there is no natural place to put a `<Link>`. `useNavigate` covers that case: it returns a function you call from inside event handlers or `async` functions.

```jsx
import { useNavigate } from "react-router";

function SomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/app/customers/c3"); // changes the URL, same as clicking a <Link>
  };
}
```

Calling `navigate(path)` changes the URL exactly the way clicking a `<Link to={path}>` would, no full page reload, React Router intercepts it the same way. The difference is only when it happens: `useNavigate` lets you decide that in code, in response to something other than a click on the link itself.

### Moving the Customer List Out of App.jsx

In Lesson 2.6, the search bar, filter buttons, and customer grid all lived inline in `App.jsx`, gated by `if (!user) return <LoginPage />`. Now that routing decides which page renders, that logic moves into a dedicated page component. Unlike Lesson 2.6, this page does not also render an add-customer form, adding a customer gets its own route and its own page in Part 6.

`CustomersPage` uses `useNavigate` for exactly this reason: clicking a `CustomerCard` should navigate to that customer's detail page, but the click handler lives on `CustomerCard`, not on a `<Link>` you could put directly around it without restructuring the card's own click-to-select behavior.

Create `src/pages/CustomersPage.jsx`:

```jsx
// src/pages/CustomersPage.jsx
import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { CustomerContext } from "../contexts/CustomerContext";
import CustomerCard from "../components/CustomerCard";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";

function CustomersPage() {
  const {
    filteredCustomers,
    loading,
    error,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
  } = useContext(CustomerContext);

  const navigate = useNavigate();

  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/app/customers/new" className="btn-primary-link">
          Add Customer
        </Link>
      </div>

      <div className="filter-bar">
        {["all", "active", "inactive"].map((f) => (
          <button
            key={f}
            className={`filter-btn${statusFilter === f ? " filter-btn-active" : ""}`}
            onClick={() => setStatusFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="customer-list">
        <h2>Customers ({filteredCustomers.length})</h2>
        {filteredCustomers.length === 0 ? (
          <p className="empty-state">
            {searchTerm
              ? "No customers match your search."
              : "No customers yet."}
          </p>
        ) : (
          <div className="customers">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onSelect={(id) => navigate(`/app/customers/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
```

Two things changed from the Lesson 2.6 version, beyond the move itself:

- There is no `showForm` state and no inline `<form>` here at all. "Add Customer" is a plain `<Link to="/app/customers/new">`, with no role check for now. `AuthContext`'s real `user` is `null` until Part 9, before that a `hasRole("admin")` check here would always be `false` and the link would never render, so this lesson leaves every `/app` route open to any signed-in user until Part 9, then restricting add and edit to admins only becomes Bonus Challenge 1.
- `onSelect` no longer calls `setSelectedId`. It calls `navigate(`/app/customers/${id}`)`, which changes the URL instead of local state.

Add the two new classes this page introduces, `.page-header` and `.btn-primary-link`, to `src/App.css` alongside the existing global classes:

```css
/* src/App.css — add near the other layout classes */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.btn-primary-link {
  padding: var(--space-2) var(--space-5);
  background: var(--action-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-standard);
}

.btn-primary-link:hover {
  background: var(--action-primary-hover);
}
```

### Update CustomerCard

`CustomerCard.jsx` needs two small changes before it fits this lesson.

`CustomerCard.jsx` already calls `onSelect(customer.id)` on click, that still works identically, it just now receives a navigation function instead of a state setter. `isSelected`, however, is dead weight now: it only ever existed to highlight the card whose customer was showing in Lesson 2.6's side panel, driven by `selectedId`. There is no side panel anymore, the detail view is a separate page at its own URL, so no card is ever "the one currently shown next to the list." Remove `isSelected` from `CustomerCard.jsx` entirely, both the prop and the class it toggled:

```jsx
// src/components/CustomerCard.jsx

// Before
function CustomerCard({ customer, onSelect, isSelected }) {
  // ...
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      onClick={() => onSelect(customer.id)}
    >

// After
function CustomerCard({ customer, onSelect }) {
  // ...
  return (
    <div className={styles.card} onClick={() => onSelect(customer.id)}>
```

`.cardSelected` in `CustomerCard.module.css` is now unused too; there is no need to delete it, but nothing applies it anymore.

`CustomerCard`'s Delete button is also gated by `hasRole("admin")` from `AuthContext`. That check would always evaluate to `false` right now, same as "Add Customer" on this page, `AuthContext`'s real `user` is `null` until Part 9, so the Delete button would be silently missing from every card in the browser with no explanation. Remove the role check for now, and call `deleteCustomer` unconditionally:

```jsx
// src/components/CustomerCard.jsx

// Before
{
  hasRole("admin") && (
    <button
      className={styles.deleteButton}
      onClick={(e) => {
        e.stopPropagation();
        deleteCustomer(customer.id);
      }}
    >
      Delete
    </button>
  );
}

// After
<button
  className={styles.deleteButton}
  onClick={(e) => {
    e.stopPropagation();
    deleteCustomer(customer.id);
  }}
>
  Delete
</button>;
```

The `useContext(AuthContext)` line that reads `hasRole` in `CustomerCard.jsx` can be removed too, nothing else in the component uses it.

### Wire CustomersPage into App.jsx

Add `customers` as a relative sibling of the `index` route, inside the same `RootLayout` parent:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import RootLayout from "./layouts/RootLayout";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import "./App.css";

export const API_BASE = "http://localhost:3001";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="login" element={<div>Login page coming soon</div>} />

        <Route path="app" element={<RootLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

`App.css` is imported here for the first time in this lesson. `CustomersPage` is the first page that relies on its global classes (`.page-header`, `.filter-bar`, `.customer-list`, and the ones you are about to add below), so this is the point where it actually needs to be loaded. Every `App.jsx` snippet from here on keeps this import.

**Browser check:** Click "Customers" in the sidebar. The URL should change to `/app/customers` and the search bar, filter buttons, and customer grid should render. Search and filter should work exactly as they did in Lesson 2.6. Clicking "Add Customer" navigates to `/app/customers/new`, which does not exist yet, you will see React Router's fallback (a blank page or a console warning), that is expected until Part 6.

### The CRM Route Map (so far)

| Route            | Page            | Access        |
| ---------------- | --------------- | ------------- |
| `/`              | `WelcomePage`   | Public        |
| `/login`         | placeholder     | —             |
| `/app`           | `DashboardPage` | Authenticated |
| `/app/customers` | `CustomersPage` | Authenticated |

---

## Part 6: The NewCustomerPage (15 minutes)

### A Dedicated Page for Adding a Customer

Rather than toggling a form open inside `CustomersPage`, adding a customer gets its own route and its own page, `/app/customers/new`. This keeps `CustomersPage` focused on listing and searching, and gives the add-customer flow its own URL that can be linked to directly.

Create `src/pages/NewCustomerPage.jsx`:

```jsx
// src/pages/NewCustomerPage.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { CustomerContext } from "../contexts/CustomerContext";

const ALL_TAGS = ["VIP", "Lead", "Referral"];

function NewCustomerPage() {
  const { addCustomer, submitting } = useContext(CustomerContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    tags: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCustomer = await addCustomer({
      ...form,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    });
    navigate(`/app/customers/${newCustomer.id}`);
  };

  return (
    <div>
      <Link to="/app/customers" className="back-link">
        ← Back to Customers
      </Link>
      <h1>Add New Customer</h1>

      <form onSubmit={handleSubmit} className="add-customer-form">
        <div className="form-field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            placeholder="e.g. Sarah"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            placeholder="e.g. Chen"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. sarah.chen@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            placeholder="e.g. +65 9123 4567"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Tags</label>
          <div className="tag-options">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
}

export default NewCustomerPage;
```

Add the `.back-link` class this page introduces to `src/App.css`, alongside `.page-header` and `.btn-primary-link` from Part 5:

```css
/* src/App.css — add near the other layout classes */
.back-link {
  display: inline-block;
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-decoration: none;
}

.back-link:hover {
  color: var(--text-strong);
}
```

### Returning the Created Customer from addCustomer

`navigate(`/app/customers/${newCustomer.id}`)` needs the server-assigned ID of the customer that was just created, but Lesson 2.6's `addCustomer` in `CustomerContext.jsx` dispatches the result into the reducer and never gives it back to the caller. Add one line so it does:

```jsx
// src/contexts/CustomerContext.jsx
const addCustomer = async (customerData) => {
  dispatch({ type: "ADD_START" });
  try {
    const response = await fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const createdCustomer = await response.json();
    dispatch({ type: "ADD_CUSTOMER", payload: createdCustomer });
    return createdCustomer; // ← ADD THIS LINE
  } catch (err) {
    dispatch({ type: "ADD_ERROR" });
    alert(`Failed to add customer: ${err.message}`);
  }
};
```

Without this line, `newCustomer` inside `NewCustomerPage` would be `undefined`, and `newCustomer.id` would throw.

### Wire NewCustomerPage into App.jsx

`customers/new` is a **relative sibling** of `customers`, not nested under it, both render inside `RootLayout`:

```jsx
// src/App.jsx
import NewCustomerPage from "./pages/NewCustomerPage";
// ...
<Route path="app" element={<RootLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="customers" element={<CustomersPage />} />
  <Route path="customers/new" element={<NewCustomerPage />} />
</Route>;
```

> **A routing question is coming.** In Part 7 you will add `customers/:id`, a dynamic route that could also match the literal word `new`. You might expect that whichever route is declared first "wins", it does not work that way in React Router. The real rule is spelled out in Common Pitfalls once `customers/:id` exists to demonstrate it against.

**Browser check:** Click "Add Customer" from `/app/customers`. The form should appear at `/app/customers/new`. Fill it in and submit, you should be redirected to `/app/customers/<new-id>`, which does not have a real page yet (Part 7 builds it, so expect a blank result or console warning for now). Go back to `/app/customers` and confirm the new customer appears in the list.

---

## Part 7: The CustomerDetailPage and useParams (20 minutes)

### Reading URL Parameters with useParams

When the user navigates to `/app/customers/c3`, React Router stores `"c3"` as the `:id` parameter. The `useParams` hook reads it back out:

```jsx
// src/pages/CustomerDetailPage.jsx
import { useParams } from "react-router";

function CustomerDetailPage() {
  const { id } = useParams();
  // id === "c3" when the URL is /app/customers/c3
}
```

Customer IDs in this CRM's `db.json` are strings like `"c1"`, `"c2"`, not numbers, so there is no need to parse `id` for the fetch call. Include `id` in the `useEffect` dependency array so the component re-fetches when the user navigates from one customer to another. React Router reuses the same component instance across `/app/customers/c3` and `/app/customers/c7`; it does not unmount and remount, so a missing dependency means the old customer stays on screen.

### Create the CustomerDetailPage

This page is read-only. Editing a customer moves to its own page, `/app/customers/:id/edit`, built in Part 8. There is no `isEditing` state and no inline edit form here, only the customer's details and links to Edit and back to the list.

Create `src/pages/CustomerDetailPage.jsx`:

```jsx
// src/pages/CustomerDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { API_BASE } from "../App";
import Spinner from "../components/Spinner";
import styles from "./CustomerDetailPage.module.css";

function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/customers/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]); // re-fetch whenever the id in the URL changes

  if (loading) {
    return (
      <div className={styles.panel}>
        <Spinner size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Error: {error}</p>
        <Link to="/app/customers">Back to Customers</Link>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <Link to="/app/customers" className={styles.backLink}>
        ← Back to Customers
      </Link>

      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.name}>
            {customer.firstName} {customer.lastName}
          </h2>
          {customer.company && (
            <p className={styles.company}>{customer.company}</p>
          )}
        </div>
        <Link to={`/app/customers/${id}/edit`} className={styles.editButton}>
          Edit
        </Link>
      </div>

      <div>
        <p className={styles.contactRow}>{customer.email}</p>
        {customer.phone && (
          <p className={styles.contactRow}>{customer.phone}</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Status and tags</p>
        <div className={styles.tags}>
          <span
            className={`${styles.badge} ${customer.status === "active" ? styles.badgeActive : styles.badgeInactive}`}
          >
            {customer.status}
          </span>
          {customer.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Notes</p>
        {customer.notes ? (
          <p className={styles.notes}>{customer.notes}</p>
        ) : (
          <p className={styles.notesEmpty}>No notes yet.</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Customer since</p>
        <p className={styles.contactRow}>{customer.createdAt}</p>
      </div>
    </div>
  );
}

export default CustomerDetailPage;
```

Download [`assets/CustomerDetailPage.module.css`](assets/CustomerDetailPage.module.css) and copy it to `src/pages/CustomerDetailPage.module.css`. It carries over the view-only classes from Lesson 2.6's `CustomerDetail.module.css`. The edit-form classes (`.editField`, `.input`, `.editActions`, `.saveButton`, `.cancelButton`) are not in this file, they belong to `EditCustomerPage` instead, built in Part 8.

Once `CustomerDetailPage` works, `src/components/CustomerDetail.jsx` and `src/components/CustomerDetail.module.css` are no longer used anywhere. There is no need to delete them, they can stay as a reference; nothing imports an unused file.

### Wire It Up in App.jsx

```jsx
// src/App.jsx
import CustomerDetailPage from "./pages/CustomerDetailPage";
// ...
<Route path="app" element={<RootLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="customers" element={<CustomersPage />} />
  <Route path="customers/new" element={<NewCustomerPage />} />
  <Route path="customers/:id" element={<CustomerDetailPage />} />
</Route>;
```

**Browser check:** Click a customer card from `/app/customers`. The URL should change to `/app/customers/<id>` and the detail page should render. Click "← Back to Customers" to return to `/app/customers`. Click "Edit", it goes to `/app/customers/<id>/edit`, which does not exist yet (built in Part 8). Also revisit Part 6's flow: submit the add-customer form again and confirm you now land on a real, populated detail page instead of a blank result.

---

## Activity: Delete from the Detail Page (15 minutes)

Lesson 2.6's `CustomerCard` has a Delete button, gated by `hasRole("admin")`, that calls `deleteCustomer` from `CustomerContext`. The detail page has no equivalent yet.

**Task:** Add a Delete button to `CustomerDetailPage` that navigates back to `/app/customers` after a successful delete.

There is no role check on this button yet. `AuthContext`'s real `user` is still `null` at this point in the lesson, no working login exists until Part 9, so a `hasRole("admin")` check here would always evaluate to `false` and the button would never appear at all. Show it unconditionally for now; restricting destructive actions like this to admins only is worth revisiting once real authentication exists, as part of Bonus Challenge 1.

**Hints:**

1. Import `useNavigate` from `react-router` and `useContext` for `CustomerContext` (for `deleteCustomer`)
2. `deleteCustomer` already shows a `window.confirm` dialog internally, so you do not need to add your own
3. `assets/CustomerDetailPage.module.css` already includes a `.deleteButton` class you can use

<details>
<summary>Reference solution</summary>

In `CustomerDetailPage.jsx`, add the imports and read the context:

```jsx
// src/pages/CustomerDetailPage.jsx
import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { CustomerContext } from "../contexts/CustomerContext";
```

Inside `CustomerDetailPage`:

```jsx
// src/pages/CustomerDetailPage.jsx
const navigate = useNavigate();
const { deleteCustomer } = useContext(CustomerContext);

const handleDelete = async () => {
  await deleteCustomer(id);
  navigate("/app/customers");
};
```

Render the button after the "Customer since" section:

```jsx
// src/pages/CustomerDetailPage.jsx
<button className={styles.deleteButton} onClick={handleDelete}>
  Delete Customer
</button>
```

Notice that `deleteCustomer` already calls `window.confirm` and updates `CustomerContext`'s state internally; `handleDelete` only needs to call it and then navigate away.

</details>

---

## Part 8: The EditCustomerPage and Pre-filled Forms (20 minutes)

### A Page That Loads Data Into a Form

`EditCustomerPage` looks similar to `CustomerDetailPage`, it also reads `:id` from the URL and fetches the customer, but instead of displaying the data, it loads the data into a controlled form so the user can change it. This is the pattern from Lesson 2.5's `CustomerEditForm`, now living on its own route instead of being toggled inline.

Create `src/pages/EditCustomerPage.jsx`:

```jsx
// src/pages/EditCustomerPage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { API_BASE } from "../App";
import { CustomerContext } from "../contexts/CustomerContext";
import Spinner from "../components/Spinner";
import styles from "./EditCustomerPage.module.css";

function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCustomer } = useContext(CustomerContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/customers/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customer = await response.json();
        // Pre-fill the form with the fetched customer's data.
        // Fields that might be missing get a fallback so inputs stay controlled.
        setForm({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || "",
          company: customer.company || "",
          notes: customer.notes || "",
          status: customer.status,
          tags: customer.tags,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCustomer(id, form);
      navigate(`/app/customers/${id}`);
    } catch (err) {
      alert(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.panel}>
        <Spinner size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p>Error: {error}</p>
        <Link to="/app/customers">Back to Customers</Link>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <Link to={`/app/customers/${id}`} className={styles.backLink}>
        ← Back to Customer
      </Link>
      <h2 className={styles.name}>Edit customer</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              className={styles.input}
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              className={styles.input}
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              className={styles.input}
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              className={styles.input}
              value={form.company}
              onChange={handleChange}
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className={styles.input}
              value={form.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.sectionLabel} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className={styles.input}
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.editActions}>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <Link to={`/app/customers/${id}`} className={styles.cancelButton}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditCustomerPage;
```

Download [`assets/EditCustomerPage.module.css`](assets/EditCustomerPage.module.css) and copy it to `src/pages/EditCustomerPage.module.css`. These are the same edit-form classes Lesson 2.6's `CustomerEditForm` used, now living in their own file since editing has its own page.

`Cancel` is a `<Link>`, not a button with a click handler. Since the form only lives in local `form` state and nothing has been saved yet, navigating away is enough to discard the changes, there is no need to reset any state first.

### Wire EditCustomerPage into App.jsx

```jsx
// src/App.jsx
import EditCustomerPage from "./pages/EditCustomerPage";
// ...
<Route path="app" element={<RootLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="customers" element={<CustomersPage />} />
  <Route path="customers/new" element={<NewCustomerPage />} />
  <Route path="customers/:id" element={<CustomerDetailPage />} />
  <Route path="customers/:id/edit" element={<EditCustomerPage />} />
</Route>;
```

**Browser check:** Click "Edit" on a customer's detail page. The URL should change to `/app/customers/<id>/edit` and the form should appear pre-filled with that customer's current data. Change a field and click Save, you should land back on `/app/customers/<id>` with the update visible. Click Edit again, change a field, and click Cancel instead, the change should be discarded and you should land back on the detail page unchanged.

---

## Part 9: Locking It Down with ProtectedRoute (20 minutes)

### Everything Under /app Is Currently Public

Every page from Parts 4 through 8 works, but nothing stops a signed-out visitor from typing `/app/customers/c1` directly into the browser and seeing customer data. `Sidebar` already assumes `user` exists, and every action inside `/app`, including add, edit, and delete, is currently open to anyone who gets past the front door. This part closes the login gap in one place, rather than scattering `if (!user)` checks across every page. Role-based restrictions on top of that, admin-only add and edit, are Bonus Challenge 1, once a real `user` exists for `hasRole` to check.

### Creating a ProtectedRoute Layout Route

`ProtectedRoute` checks authentication before rendering whatever is nested inside it. If the user is not logged in, it redirects to `/login` and passes the current location as state so the login page can send the user back after they sign in. Like `RootLayout`, it is a **layout route**: it has no page content of its own, it renders `<Outlet />` for whichever child route matched, once the auth check passes.

Create `src/components/ProtectedRoute.jsx`:

```jsx
// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ requiredRole }) {
  const { user, hasRole } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redirect to login. Pass the current location so LoginPage can send the user back.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="status-message error">
        You do not have permission to view this page.
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
```

`ProtectedRoute` accepts an optional `requiredRole` prop, this lesson only wires up the plain, login-only check for now. Restricting specific routes to admins as well is a Bonus Challenge, once you have seen the basic guard working end to end.

`AuthContext` from Lesson 2.6 only ever exposes `{ user, login, logout, hasRole }`, there is no `loading` flag on it, so `ProtectedRoute` does not need to handle a loading state the way an app backed by a real authentication server might.

`<Navigate>` is not the same thing as the `navigate` function `useNavigate` returns, even though the two names differ only in capitalization. `useNavigate` gives you a function to call from inside an event handler, after a click or a form submission, as seen from Part 5 onward. `Navigate` is a component: you return it directly from a component's render logic, the way `ProtectedRoute` does here, and React Router redirects as soon as it renders. `ProtectedRoute` runs during render, not in response to a click, so returning `<Navigate>` is the correct tool, calling `useNavigate` would not work in this position.

The `replace` prop on `<Navigate>` removes the current entry from the browser history stack rather than adding a new one. This prevents the user from pressing the Back button and landing on the redirect target instead of the page they originally came from.

### Move LoginPage into pages/ with Redirect-Back Behaviour

Move `src/components/LoginPage.jsx` and `src/components/LoginPage.module.css` into `src/pages/`. The component itself is almost unchanged from Lesson 2.6; it now redirects to wherever the visitor was originally headed, using `useLocation` and `useNavigate`, instead of relying on `App.jsx` to notice `user` has changed. The default destination, when there is no `location.state.from` to return to, is `/app`:

```jsx
// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { USERS } from "../../data/users";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const match = USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (match) {
      const userData = { ...match };
      delete userData.password;
      login(userData);
      // Go back to the page the visitor was trying to reach, or the app's home
      const from = location.state?.from?.pathname || "/app";
      navigate(from, { replace: true });
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <h1 className={styles.heading}>Sign in</h1>
        <p className={styles.lead}>Welcome back to Simple CRM.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@simplesystems.io"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Sign in
          </button>
        </form>

        <p className={styles.hint}>
          Try: daniel@simplesystems.io / password123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
```

The only real change from Lesson 2.6 is the `handleSubmit` redirect: instead of `login(userData)` alone (which relied on `App.jsx` re-rendering and swapping `LoginPage` out for the CRM once `user` changed), it now reads `location.state.from` and calls `navigate(from, { replace: true })`, falling back to `/app` rather than `/`, since `/` is now the public welcome page, not the authenticated dashboard.

> **Do not add a check for an already-logged-in user inside `WelcomePage` or `LoginPage`.** Neither is wrapped in `ProtectedRoute`, so a signed-in user can still visit either directly. Handling that edge case is one of the bonus challenges.

### Create the NotFoundPage

Create `src/pages/NotFoundPage.jsx`:

```jsx
// src/pages/NotFoundPage.jsx
import { Link, useLocation } from "react-router";

function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="status-message">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page <code>{location.pathname}</code> does not exist in the CRM.
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default NotFoundPage;
```

`*` is React Router's catch-all path, it matches any URL not already matched by an earlier route. It will be declared last in `Routes`, outside both `ProtectedRoute` and `RootLayout`, since a 404 page needs to be reachable no matter who is logged in. Its "Back to Home" link points at `/`, the public welcome page, since `NotFoundPage` has no way to know whether the visitor is logged in without reading `AuthContext`, and a single, unconditional link keeps it simple.

### Nesting ProtectedRoute Around the /app Tree

`ProtectedRoute` and `RootLayout` are both layout routes, so they nest the same way `RootLayout` and its pages already do. `ProtectedRoute` becomes the outermost parent, wrapping the entire `path="app"` route: it checks the user is logged in, then `<Outlet />` renders `RootLayout`, whose own `<Outlet />` renders whichever page under `/app` matched.

This is also the moment to settle a question you have probably been wondering about since Part 6: `customers/new` and `customers/:id` both exist now under the same `app` parent, and `customers/:id` could technically match the URL `/app/customers/new` too, treating `"new"` as an `:id` value. Which one actually renders?

Assemble the final `App.jsx`:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import RootLayout from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import NewCustomerPage from "./pages/NewCustomerPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import EditCustomerPage from "./pages/EditCustomerPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export const API_BASE = "http://localhost:3001";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route index element={<WelcomePage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<RootLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/new" element={<NewCustomerPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="customers/:id/edit" element={<EditCustomerPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

`customers/new` renders for the URL `/app/customers/new`, and `customers/:id` never gets a chance to treat `"new"` as an ID, regardless of which order the two are declared in.

React Router does not pick a match by walking through `<Route>` elements in order and stopping at the first one that fits. It collects every route that _could_ match the current URL, scores each one by how specific its path is, and renders whichever scores highest. A static segment like `new` scores higher than a dynamic segment like `:id` at the same position, `customers/new` is a better match for the URL `/app/customers/new` than `customers/:id` is, full stop. Declaration order only comes into play as a tiebreaker, and only when two routes score exactly the same.

You can verify this yourself: temporarily delete the `<Route path="customers/new" ...>` line and reload `/app/customers/new`. You should now see `CustomerDetailPage` render with `id="new"`, since `customers/:id` is the only remaining route that matches. Put the line back afterward.

Two layout routes are at work in the final tree, each solving a different problem:

1. The outer `<Route element={<ProtectedRoute />}>` gates every route beneath it, the whole `/app` tree, behind "is anyone logged in?"
2. `<Route path="app" element={<RootLayout />}>` gives every route beneath it both the `/app` URL prefix and the sidebar shell

Neither layout route knows about the other, and neither knows which page ends up rendering.

### Swapping Sidebar's Dummy User for AuthContext

Back in Part 3, `Sidebar` used a hardcoded `DUMMY_USER` because `AuthContext`'s real `user` was always `null`, there was no working login flow yet, and reading `user.name` off `null` would have crashed the app before you had anything to preview. `ProtectedRoute` now guards every route that renders `Sidebar`, and `LoginPage` can log a real user in, so `user` is guaranteed to be real by the time `Sidebar` runs. It is safe to read from `AuthContext` for real.

Update `src/components/Sidebar.jsx`:

```jsx
// src/components/Sidebar.jsx

// Before — Part 3's temporary stand-in
// const DUMMY_USER = { name: "Daniel Goh", email: "daniel@simplesystems.io", role: "admin" };
// function Sidebar() {
//   const user = DUMMY_USER;

// After — Part 9, ProtectedRoute and LoginPage guarantee a real user
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  // ...rest of the component is unchanged
```

Remove the `DUMMY_USER` constant entirely, and change the sign-out button's `onClick` from the placeholder `alert(...)` back to the real `logout` you just destructured:

```jsx
<button className={styles.signOutBtn} onClick={logout} title="Sign out">
  <LogOut size={16} />
</button>
```

Nothing else in `Sidebar` changes, the JSX that reads `user.name`, `user.role`, and `user.email` is identical to what you already wrote in Part 3, it just now reads a real value instead of a hardcoded one.

**Browser check:** Log in as `daniel@simplesystems.io` / `password123`. The sidebar should show the same name and admin badge as before, now backed by real auth state. Click Sign out, you should be logged out and redirected to `/login`.

### Remove selectedId, showForm, and toggleForm from CustomerContext

Two pieces of state from Lesson 2.6 are dead code by this point, and it is worth clearing them out now rather than leaving unused state sitting in the reducer.

`selectedId` and `setSelectedId` drove the old master-detail layout; the URL now plays that role. Open `src/contexts/CustomerContext.jsx` and remove both:

```jsx
// src/contexts/CustomerContext.jsx — remove this line
const [selectedId, setSelectedId] = useState(null);

// and remove selectedId / setSelectedId from the value object,
// and from the place deleteCustomer referenced setSelectedId(null)
```

`showForm` and `toggleForm` drove the old inline add-customer form toggle inside `App.jsx`. `CustomersPage` stopped reading `showForm` back in Part 5, since adding a customer got its own page and route instead, so nothing has called `toggleForm` since. Remove all of it:

```jsx
// src/reducers/customerReducer.js

// Remove showForm from initialState:
export const initialState = {
  customers: [],
  loading: false,
  error: null,
  submitting: false,
  // showForm: false,  ← remove this line
};

// Remove the TOGGLE_FORM case entirely:
// case "TOGGLE_FORM":
//   return { ...state, showForm: !state.showForm };

// And remove showForm: false from inside the ADD_CUSTOMER case,
// it no longer means anything without the inline form it used to hide:
case "ADD_CUSTOMER":
  return {
    ...state,
    submitting: false,
    customers: [...state.customers, action.payload],
  };
```

```jsx
// src/contexts/CustomerContext.jsx

// Remove showForm from the destructured state:
const { customers, loading, error, submitting } = state;

// Remove the toggleForm function entirely:
// const toggleForm = () => dispatch({ type: "TOGGLE_FORM" });

// And remove both showForm and toggleForm from the value object
```

### The CRM Route Map (final)

| Route                     | Page                 | Access        |
| ------------------------- | -------------------- | ------------- |
| `/`                       | `WelcomePage`        | Public        |
| `/login`                  | `LoginPage`          | Public        |
| `/app`                    | `DashboardPage`      | Authenticated |
| `/app/customers`          | `CustomersPage`      | Authenticated |
| `/app/customers/new`      | `NewCustomerPage`    | Authenticated |
| `/app/customers/:id`      | `CustomerDetailPage` | Authenticated |
| `/app/customers/:id/edit` | `EditCustomerPage`   | Authenticated |
| `*`                       | `NotFoundPage`       | Everyone      |

Every page under `/app` currently requires only a login, not a specific role. Any signed-in user can see "Add Customer," add customers, edit them, and delete them, admin or not. Restricting add, edit, and delete to admins only, both in the UI and at the route level, is Bonus Challenge 1.

**Browser check — full flow:**

1. Log out (or open a private browser window).
2. Navigate directly to `http://localhost:5173/app/customers/c1`, you should be redirected to `/login`.
3. Log in as `alice@simplesystems.io` / `password123`. You should be sent back to `/app/customers/c1`, not to `/app`.
4. Log out, log in as `daniel@simplesystems.io` / `password123`. Navigate to `/app/customers/new`, the add-customer form should load. Navigate to `/app/customers/c1/edit`, the edit form should load too.
5. Navigate to `http://localhost:5173/does-not-exist`, the 404 page should appear.
6. Navigate to `http://localhost:5173/`, you should see the public welcome page, whether or not you are logged in.

---

## Bonus Challenges

These challenges have no provided solution. They are for learners who finish the lab early.

### Challenge 1: Restrict Add and Edit to Admins Only

Right now, any signed-in user can add, edit, and delete customers, admin or not, whether by clicking a link or button or by typing a URL directly. This challenge has two parts.

**Part A — hide the UI for non-admins.** Now that real authentication exists, `hasRole("admin")` from `AuthContext` finally has a real `user` to check. Re-add role checks to:

- `CustomersPage`'s "Add Customer" `<Link>`
- `CustomerCard`'s Delete button
- `CustomerDetailPage`'s Delete button (from the earlier activity)

**Part B — block the routes, not just the links.** Hiding a link does not stop someone from typing the URL directly. Add a second, nested `ProtectedRoute` around just the add and edit routes, configured with `requiredRole="admin"`:

```jsx
<Route path="customers" element={<CustomersPage />} />

<Route element={<ProtectedRoute requiredRole="admin" />}>
  <Route path="customers/new" element={<NewCustomerPage />} />
  <Route path="customers/:id/edit" element={<EditCustomerPage />} />
</Route>

<Route path="customers/:id" element={<CustomerDetailPage />} />
```

`ProtectedRoute` already supports `requiredRole`, you built that support in Part 9, it was just never exercised by a second nested instance. After adding this, log in as `alice@simplesystems.io` (a regular user) and confirm that navigating directly to `/app/customers/new` shows the "You do not have permission" message instead of the form.

### Challenge 2: Redirect Already-Logged-In Users Away From / and /login

If a signed-in user navigates directly to `/` or `/login`, they see the welcome page or the login form again instead of being sent into the app. Add a check inside `WelcomePage` and `LoginPage` that redirects to `/app` (using `useNavigate` and `useEffect`, or a `<Navigate>` element) when `user` is already set.

### Challenge 3: Search with Query Parameters

Currently, `searchTerm` lives only in React state and resets on reload. Move it into the URL as `/app/customers?search=alice` so that results are bookmarkable and shareable.

**Hint:** Look up `useSearchParams` from `react-router`.

### Challenge 4: Breadcrumb Navigation

Add a breadcrumb trail to `CustomerDetailPage`: `Customers > Alice Chen`. The current page (the customer name) should not be a link.

### Challenge 5: Extract a Shared CustomerForm

`NewCustomerPage` and `EditCustomerPage` share almost every field (first name, last name, email, phone, tags or status). Extract a shared `CustomerForm` component that both pages render, configured with an `initialValues` prop and an `onSubmit` callback.

### Challenge 6: Pagination with Query Parameters

Add pagination to `CustomersPage` so that only 5 customers are shown per page. The current page number should be stored in the URL as `/app/customers?page=2`. Include "Previous" and "Next" buttons and show a "Page 2 of 6" indicator.

---

## Common Pitfalls

**Missing `id` in `useEffect` dependencies**

```jsx
// src/pages/CustomerDetailPage.jsx

// Wrong — data does not update when navigating from customer c1 to c2
useEffect(() => {
  fetchCustomer();
}, []);

// Correct — re-fetches whenever id changes
useEffect(() => {
  fetchCustomer();
}, [id]);
```

**Mixing absolute and relative paths inside a nested route**

```jsx
// src/App.jsx

// Wrong — "/customers" replaces the whole URL instead of extending it,
// this route would actually live at /customers, not /app/customers
<Route path="app" element={<RootLayout />}>
  <Route path="/customers" element={<CustomersPage />} />
</Route>

// Correct — relative paths join onto the parent's path
<Route path="app" element={<RootLayout />}>
  <Route path="customers" element={<CustomersPage />} />
</Route>
```

Once a route is nested inside a parent with its own `path`, children should use relative segments, no leading slash, unless you deliberately want to break out of the parent's URL space.

**Assuming route order decides static vs. dynamic matches**

```jsx
// src/App.jsx

// This looks risky, but it is actually fine either way:
<Route path="customers/:id"  element={<CustomerDetailPage />} />
<Route path="customers/new"  element={<NewCustomerPage />} />
```

Some older routing libraries match the first route in the list that fits the URL, so declaring a dynamic route before a static one used to matter. React Router does not work that way. It scores every route that could match a URL by how specific it is, static segments score higher than dynamic ones at the same position, and renders whichever route scores highest. `customers/new` scores higher than `customers/:id` for the URL `/app/customers/new` regardless of which one is written first, or how deeply either one is nested inside pathless layout routes like `ProtectedRoute`. Declaration order only breaks a genuine tie, two routes that score identically, which is rare in practice. You do not need to sequence static and dynamic routes in any particular order to be safe.

**Using `<a>` instead of `<Link>`**

```jsx
// Wrong — causes a full page reload; Context state is lost
<a href="/app/customers/c1">View</a>

// Correct — client-side navigation; state is preserved
<Link to="/app/customers/c1">View</Link>
```

**Forgetting `replace` after login**

```jsx
// Wrong — the user can press Back and return to the login page
navigate("/app");

// Correct — the login page is removed from the history stack
navigate("/app", { replace: true });
```

---

## Summary

| Concept                      | What it does                                                                              | When to use it                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `BrowserRouter`              | Provides routing context to the component tree                                            | Once, at the root of the application                                                |
| `Routes` + `Route`           | Declares which component renders for which URL                                            | In `App.jsx` to define the route map                                                |
| `Link`                       | Client-side navigation without a page reload                                              | Static links in UI                                                                  |
| `NavLink`                    | Like `Link`, but applies an active class on the current route                             | Navigation sidebars and menus                                                       |
| `useNavigate`                | Returns a function for programmatic navigation                                            | After form submissions, after delete, after login                                   |
| `useParams`                  | Reads dynamic segments from the URL                                                       | Detail pages and edit pages that load data by ID                                    |
| `useLocation`                | Reads the current URL and its state                                                       | Login redirect-back, 404 messages                                                   |
| `Navigate`                   | Renders an immediate redirect                                                             | Inside `ProtectedRoute`, guarded routes                                             |
| Nested routes + `<Outlet />` | Lets a parent route render a shared layout once, with child routes filling in the rest    | URL prefixes like `/app`, sidebars and shells, stacked guards like `ProtectedRoute` |
| `index` routes               | Renders a child route when the URL matches the parent exactly, with no extra segment      | The default view for a section, e.g. `DashboardPage` at exactly `/app`              |
| `ProtectedRoute`             | A layout route that redirects unauthenticated users instead of rendering its `<Outlet />` | Any route (or group of nested routes) that requires a login or role                 |

The routing architecture you have built in this lesson is the standard pattern for React SPAs: a small public area (`/`, `/login`) sits outside any guard, the entire authenticated product lives under one URL prefix (`/app`), and a single nested layout route protects all of it at once. URL parameters drive data fetching so that every view is bookmarkable and shareable. You built every page under `/app` first, fully open, before adding the one guard that locks all of them down at once. The CRM's data layer, `AuthContext` and `CustomerContext`, did not need to change its core shape; routing only changed how pages get selected and how data flows into them.

---

## Additional Resources

- [React Router — Official Documentation](https://reactrouter.com/en/main)
- [React Router — Tutorial](https://reactrouter.com/en/main/start/tutorial)
