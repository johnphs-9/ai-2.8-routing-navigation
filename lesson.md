# Lesson 2.8: Routing and Navigation with React Router

## Overview

- **Duration:** ~2 hours (hands-on lab)
- **Prerequisites:** Lesson 2.6 — Advanced State Management: Context API and Reducers

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Explain** how routing works in single-page applications using React Router
2. **Construct** routes, nested routes, and route parameters for the CRM application
3. **Implement** protected routes with authentication guards

## Introduction

At the end of Lesson 2.6, your CRM renders everything in a single view: customers, the add-customer form, and the header all live on one page with no distinct URLs. That works for a small prototype, but a real CRM needs separate pages: a customer list, a detail page for each customer, a form for adding new customers, and a login page that guards the rest.

In this lesson you will add React Router to the CRM so that each view has its own URL. You will use URL parameters to load individual customer records, use programmatic navigation to redirect after form submissions, and build a `ProtectedRoute` component that redirects unauthenticated users to the login page.

By the end of the lab, navigating to `/customers/3` will show that customer's full details, navigating to `/customers/new` will open the add-customer form (for admins only), and navigating to any protected route without being logged in will redirect you to `/login` and then back to your original destination after you sign in.

---

## Part 1: Setup (10 minutes)

### Install React Router

Make sure your CRM development server is running:

```bash
npm run dev
```

Install React Router in the project:

```bash
npm install react-router-dom
```

### Create the Folder Structure

You will create a `pages/` folder alongside `components/`. The distinction is intentional: **components** are reusable UI pieces (`CustomerCard`, `Navbar`), while **pages** are top-level views that map to a URL route.

```
simple-crm-web/src/
├── components/
│   ├── CustomerCard.jsx
│   ├── CustomerStats.jsx
│   ├── Navbar.jsx              ← NEW
│   └── ProtectedRoute.jsx      ← NEW
├── pages/
│   ├── CustomerList.jsx        ← NEW
│   ├── CustomerDetail.jsx      ← NEW
│   ├── AddCustomer.jsx         ← NEW
│   ├── Login.jsx               ← NEW
│   └── NotFound.jsx            ← NEW
├── contexts/
│   ├── AuthContext.jsx
│   └── CustomerContext.jsx
└── App.jsx                     ← UPDATE
```

Create the new folders now:

```bash
mkdir -p src/pages
```

---

## Part 2: Setting Up Routes in App.jsx (15 minutes)

### Wrapping the App in BrowserRouter

`BrowserRouter` provides the routing context that all React Router hooks and components depend on. It must be an ancestor of every component that uses routing. We place it in `App.jsx` so it wraps the entire application.

Update `src/App.jsx` with a minimal routing skeleton. You will fill in the page components over the course of this lab:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';

function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <BrowserRouter>
          <div className="simple-crm">
            {/* Navbar goes here — added in Part 3 */}
            <main className="container">
              <Routes>
                <Route path="/login"          element={<div>Login page coming soon</div>} />
                <Route path="/"               element={<div>Customer list coming soon</div>} />
                <Route path="/customers/new"  element={<div>Add customer coming soon</div>} />
                <Route path="/customers/:id"  element={<div>Customer detail coming soon</div>} />
                <Route path="*"               element={<div>404 — page not found</div>} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CustomerProvider>
    </AuthProvider>
  );
}

export default App;
```

**Browser check:** Open `http://localhost:5173`. You should see "Customer list coming soon". Try navigating manually to `http://localhost:5173/login` — the URL changes without a page reload and you see "Login page coming soon". Try `http://localhost:5173/nonsense` — you should see the 404 placeholder.

> **Route order matters:** `/customers/new` is declared before `/customers/:id`. React Router tries routes in order and stops at the first match. If the dynamic route came first, the string `"new"` would be treated as a customer ID.

### The CRM Route Map

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | `Login` | Public |
| `/` | `CustomerList` | Authenticated |
| `/customers/new` | `AddCustomer` | Admin only |
| `/customers/:id` | `CustomerDetail` | Authenticated |
| `*` | `NotFound` | Everyone |

---

## Part 3: The Navbar (15 minutes)

### Link vs NavLink

React Router provides two navigation components:

- **`Link`** is a basic navigation link. It prevents the browser from doing a full page reload and lets React Router handle the URL change instead. Use it anywhere you need a link that does not need to know whether it is currently active.
- **`NavLink`** does everything `Link` does, but also knows when its `to` path matches the current URL. It passes an `isActive` boolean into the `className` function so you can apply active styling to the current page's link.

```jsx
// Link — no active state
<Link to="/">Customers</Link>

// NavLink — applies a different class when active
<NavLink
  to="/"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  Customers
</NavLink>
```

### Create the Navbar Component

Create `src/components/Navbar.jsx`:

```jsx
// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const navLinkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Simple CRM</Link>

      <div className="navbar-menu">
        {user ? (
          <>
            <NavLink to="/" end className={navLinkClass}>
              Customers
            </NavLink>

            {user.role === 'admin' && (
              <NavLink to="/customers/new" className={navLinkClass}>
                Add Customer
              </NavLink>
            )}

            <span className="navbar-user">Welcome, {user.name}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

The `end` prop on the Customers `NavLink` is important. Without it, the `/` route would match every URL (since every path starts with `/`), and the Customers link would appear active on every page. The `end` prop tells `NavLink` to only apply the active class when the path matches exactly.

Add the Navbar to `App.jsx`. Replace the `{/* Navbar goes here */}` comment:

```jsx
import Navbar from './components/Navbar';
// ...
<BrowserRouter>
  <div className="simple-crm">
    <Navbar />
    <main className="container">
      {/* routes */}
    </main>
  </div>
</BrowserRouter>
```

**Browser check:** The navbar should now appear. Clicking "Customers" should stay on `/`; the link should be visually active. Log in and verify that "Add Customer" only appears for the admin role. Log out and confirm the navbar shows only "Login".

---

## Part 4: The CustomerList Page (15 minutes)

### Moving the Customer List to a Page Component

In Lesson 2.6, the customer list logic lived in `App.jsx`. Now we move it into a dedicated page component. The page reads from `CustomerContext` and `AuthContext` directly — no props needed.

Create `src/pages/CustomerList.jsx`:

```jsx
// src/pages/CustomerList.jsx
import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerContext } from '../contexts/CustomerContext';
import { AuthContext } from '../contexts/AuthContext';
import CustomerCard from '../components/CustomerCard';

function CustomerList() {
  const {
    filteredCustomers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchCustomers,
  } = useContext(CustomerContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <p className="status-message">Loading customers...</p>;
  if (error)   return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="customer-list-page">
      <div className="page-header">
        <h1>Customers</h1>
        {user?.role === 'admin' && (
          <Link to="/customers/new" className="btn btn-primary">
            Add New Customer
          </Link>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="customer-grid">
        {filteredCustomers.length === 0 ? (
          <p className="no-results">No customers found.</p>
        ) : (
          filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onView={() => navigate(`/customers/${customer.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerList;
```

### Update CustomerCard to Accept an onView Prop

Open `src/components/CustomerCard.jsx` and add a "View" button that calls `onView` when clicked:

```jsx
function CustomerCard({ customer, onView }) {
  // ... existing code ...

  return (
    <div className="customer-card">
      <p className="customer-name">{customer.firstName} {customer.lastName}</p>
      <p>{customer.email}</p>
      <p>Phone: {customer.contactNo || 'N/A'}</p>
      <p>Job: {customer.jobTitle || 'N/A'}</p>
      <div className="card-actions">
        <button onClick={onView} className="btn btn-secondary">View</button>
        {hasRole('admin') && (
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
}
```

Now wire up the `CustomerList` page in `App.jsx`. Replace the placeholder `<div>Customer list coming soon</div>` with the real component:

```jsx
import CustomerList from './pages/CustomerList';
// ...
<Route path="/" element={<CustomerList />} />
```

**Browser check:** The customer list should now render at `/`. Clicking "View" on a card should navigate to `/customers/5` (or whatever that customer's ID is). The page shows "Customer detail coming soon" for now — you will build it in the next part.

---

## Part 5: The CustomerDetail Page and useParams (20 minutes)

### Reading URL Parameters with useParams

When the user navigates to `/customers/5`, React Router stores `"5"` as the `:id` parameter. The `useParams` hook reads it back out:

```jsx
import { useParams } from 'react-router-dom';

function CustomerDetail() {
  const { id } = useParams();
  // id === "5" when the URL is /customers/5
}
```

The parameter is always a string, even if the value looks like a number. Include `id` in the `useEffect` dependency array so the component re-fetches when the user navigates from one customer to another — the component is reused rather than remounted in that case.

### Create the CustomerDetail Page

Create `src/pages/CustomerDetail.jsx`:

```jsx
// src/pages/CustomerDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:3001';

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useContext(AuthContext);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadCustomer() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/customers/${id}`);
        if (!res.ok) throw new Error('Customer not found');
        setCustomer(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCustomer();
  }, [id]); // re-run whenever the id in the URL changes

  async function handleDelete() {
    if (!window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) return;
    setDeleting(true);
    try {
      await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch {
      alert('Failed to delete customer. Please try again.');
      setDeleting(false);
    }
  }

  if (loading) return <p className="status-message">Loading customer details...</p>;
  if (error) return (
    <div className="error-page">
      <h2>Error: {error}</h2>
      <Link to="/">Back to Customers</Link>
    </div>
  );

  return (
    <div className="customer-detail-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Customers</Link>
        <h1>Customer Details</h1>
      </div>

      <div className="customer-info-card">
        <h2>{customer.firstName} {customer.lastName}</h2>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.contactNo || 'N/A'}</p>
        <p><strong>Job Title:</strong> {customer.jobTitle || 'N/A'}</p>
        <p><strong>Year of Birth:</strong> {customer.yearOfBirth || 'N/A'}</p>

        {hasRole('admin') && (
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Customer'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomerDetail;
```

Wire it up in `App.jsx`:

```jsx
import CustomerDetail from './pages/CustomerDetail';
// ...
<Route path="/customers/:id" element={<CustomerDetail />} />
```

**Browser check:** Click "View" on any customer card. The URL should change to `/customers/:id` and you should see that customer's details. Click "← Back to Customers" to return to the list. Log in as admin and verify the Delete button appears; delete a customer and confirm you are redirected back to `/`.

---

## Activity: Navigate Between Customers (10 minutes)

Your customer detail page currently only loads via the "View" button in the list. Make it possible to navigate directly from one customer's detail page to the next customer's.

**Task:** Add "Previous" and "Next" links to `CustomerDetail.jsx` that navigate to `/customers/:id` for the previous and next customer IDs.

**Hints:**

1. The current customer's `id` is available from `useParams()` — remember it is a string, so you will need `parseInt(id)` for arithmetic
2. Use `<Link to={...}>` to generate the links — do not use `navigate()` here since these are static navigation targets, not actions
3. You can use a simple `id - 1` and `id + 1` approach; no need to fetch the full list

<details>
<summary>Reference solution</summary>

In `CustomerDetail.jsx`, add the following inside the return block, below the customer info card:

```jsx
<div className="customer-nav">
  <Link to={`/customers/${parseInt(id) - 1}`} className="btn btn-secondary">
    ← Previous
  </Link>
  <Link to={`/customers/${parseInt(id) + 1}`} className="btn btn-secondary">
    Next →
  </Link>
</div>
```

Notice that clicking "Previous" or "Next" does not remount the component — the URL changes, `useParams()` returns the new ID, and the `useEffect` dependency on `id` causes the data to re-fetch automatically. This is the key behaviour that makes the `[id]` dependency essential.

</details>

---

## Part 6: The AddCustomer Page (15 minutes)

### Programmatic Navigation After a Form Submission

After a user successfully adds a customer, the best UX is to send them directly to the new customer's detail page rather than leaving them on the empty form. You accomplish this by calling `navigate()` with the new customer's ID after the POST request resolves.

Create `src/pages/AddCustomer.jsx`:

```jsx
// src/pages/AddCustomer.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CustomerContext } from '../contexts/CustomerContext';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  jobTitle: '',
  yearOfBirth: '',
};

function AddCustomer() {
  const navigate = useNavigate();
  const { addCustomer } = useContext(CustomerContext);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newCustomer = await addCustomer({
        ...formData,
        yearOfBirth: formData.yearOfBirth ? parseInt(formData.yearOfBirth) : null,
      });
      navigate(`/customers/${newCustomer.id}`);
    } catch {
      alert('Failed to add customer. Please try again.');
      setSubmitting(false);
    }
  }

  function handleCancel() {
    if (window.confirm('Discard changes and go back?')) {
      navigate('/');
    }
  }

  return (
    <div className="add-customer-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Customers</Link>
        <h1>Add New Customer</h1>
      </div>

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input id="firstName" name="firstName" type="text"
            value={formData.firstName} onChange={handleChange} required disabled={submitting} />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input id="lastName" name="lastName" type="text"
            value={formData.lastName} onChange={handleChange} required disabled={submitting} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email"
            value={formData.email} onChange={handleChange} required disabled={submitting} />
        </div>

        <div className="form-group">
          <label htmlFor="contactNo">Phone</label>
          <input id="contactNo" name="contactNo" type="tel"
            value={formData.contactNo} onChange={handleChange} disabled={submitting} />
        </div>

        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input id="jobTitle" name="jobTitle" type="text"
            value={formData.jobTitle} onChange={handleChange} disabled={submitting} />
        </div>

        <div className="form-group">
          <label htmlFor="yearOfBirth">Year of Birth</label>
          <input id="yearOfBirth" name="yearOfBirth" type="number"
            min="1900" max={new Date().getFullYear()}
            value={formData.yearOfBirth} onChange={handleChange} disabled={submitting} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Customer'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomer;
```

Wire it up in `App.jsx`:

```jsx
import AddCustomer from './pages/AddCustomer';
// ...
<Route path="/customers/new" element={<AddCustomer />} />
```

**Browser check:** Log in as admin. Click "Add New Customer" in the navbar or on the list page. Fill in the form and submit. You should be redirected to the new customer's detail page. Click Cancel — a confirmation dialog should appear, and confirming should take you back to `/`.

---

## Part 7: Protected Routes (20 minutes)

### The Problem

Right now, nothing stops an unauthenticated user from typing `/customers/1` directly into the browser and seeing customer data. We need to intercept those requests and redirect to `/login`.

### Creating a ProtectedRoute Component

A `ProtectedRoute` is a wrapper component that checks authentication before rendering its children. If the user is not logged in, it redirects to `/login` and passes the current location as state so the login page can send the user back after they sign in.

Create `src/components/ProtectedRoute.jsx`:

```jsx
// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <p className="status-message">Checking authentication...</p>;
  }

  if (!user) {
    // Redirect to login. Pass current location so Login can redirect back.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="unauthorized">
        <h2>Unauthorised</h2>
        <p>You do not have permission to view this page.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
```

The `replace` prop on `<Navigate>` removes the current entry from the browser history stack rather than adding a new one. This prevents the user from pressing the Back button and landing on the redirect target instead of the page they originally came from.

### Updating App.jsx with Protected Routes

Replace the route configuration in `App.jsx` with the final version:

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import AddCustomer from './pages/AddCustomer';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <BrowserRouter>
          <div className="simple-crm">
            <Navbar />
            <main className="container">
              <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />

                {/* Authenticated */}
                <Route path="/" element={
                  <ProtectedRoute><CustomerList /></ProtectedRoute>
                } />
                <Route path="/customers/:id" element={
                  <ProtectedRoute><CustomerDetail /></ProtectedRoute>
                } />

                {/* Admin only */}
                <Route path="/customers/new" element={
                  <ProtectedRoute requiredRole="admin"><AddCustomer /></ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CustomerProvider>
    </AuthProvider>
  );
}

export default App;
```

### Create the Login Page with Redirect-Back Behaviour

Create `src/pages/Login.jsx`. After a successful login it reads `location.state.from` to redirect the user back to wherever they originally wanted to go:

```jsx
// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin', name: 'Admin User', role: 'admin' },
  { id: 2, username: 'user',  password: 'user',  name: 'Regular User', role: 'user' },
];

function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // If already logged in, send to home
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const match = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    if (match) {
      const { password: _omit, ...userData } = match;
      login(userData);
      // Go back to the page they were trying to reach, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Simple CRM</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username" type="text"
              value={username} onChange={e => setUsername(e.target.value)}
              autoFocus required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>

        <p className="login-hint">Hint: admin / admin or user / user</p>
      </div>
    </div>
  );
}

export default Login;
```

### Create the NotFound Page

Create `src/pages/NotFound.jsx`:

```jsx
// src/pages/NotFound.jsx
import { Link, useLocation } from 'react-router-dom';

function NotFound() {
  const location = useLocation();

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page <code>{location.pathname}</code> does not exist in the CRM.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

export default NotFound;
```

**Browser check — full flow:**

1. Log out (or open a private window).
2. Navigate directly to `http://localhost:5173/customers/1` — you should be redirected to `/login`.
3. Log in as `user`. You should be sent back to `/customers/1`, not to `/`.
4. Try navigating to `/customers/new` — you should be redirected away (you are not an admin).
5. Log out, log in as `admin`. Navigate to `/customers/new` — the add-customer form should load.
6. Navigate to `http://localhost:5173/does-not-exist` — the 404 page should appear.

---

## Activity: Restrict the Delete Button by Role in CustomerDetail (10 minutes)

The `CustomerDetail` page already has a Delete button guarded by `hasRole('admin')`. However, a regular user who navigates directly to `/customers/5` still sees the full detail page — just without the button. This is correct, but confirm it works end to end.

**Task:** Verify and, if necessary, fix the following behaviours:

1. Log in as `user`. Navigate to any customer detail page. The Delete button should not be visible.
2. Log in as `admin`. The Delete button should appear.
3. As admin, delete a customer. Confirm you are redirected to `/` and the customer no longer appears in the list.

If the Delete button is visible to non-admin users, trace back through `CustomerDetail.jsx` and verify the `hasRole('admin')` condition wraps the button correctly.

<details>
<summary>What to check</summary>

In `CustomerDetail.jsx`, the Delete button should be inside this conditional:

```jsx
{hasRole('admin') && (
  <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
    {deleting ? 'Deleting...' : 'Delete Customer'}
  </button>
)}
```

If `hasRole` is not imported or `AuthContext` is not wired up, the button will always render. Confirm the import at the top of the file and the `useContext(AuthContext)` call.

</details>

---

## Bonus Challenges

These challenges have no provided solution. They are for learners who finish the lab early.

### Challenge 1: Search with Query Parameters

Add a search bar to the customer list that updates the URL as the user types. The search query should be reflected in the URL as `/customers?search=alice` so that users can bookmark and share search results.

**Hint:** Look up `useSearchParams` from `react-router-dom`.

### Challenge 2: Breadcrumb Navigation

Add a breadcrumb trail to the customer detail page: `Home > Customers > Alice Chen`. Each segment should be a clickable link back to that level. The current page (the customer name) should not be a link.

### Challenge 3: Edit Customer Page

Add an Edit button to `CustomerDetail.jsx` that navigates to `/customers/:id/edit`. Create an `EditCustomer` page that pre-fills a form with the customer's existing data and sends a `PUT` request to `http://localhost:3001/customers/:id` on submit. After a successful edit, redirect back to the customer's detail page.

**Hint:** The `EditCustomer` page is very similar to `AddCustomer`. Both share the same form fields — consider whether you can extract a shared `CustomerForm` component.

### Challenge 4: Pagination with Query Parameters

Add pagination to the customer list so that only 5 customers are shown per page. The current page number should be stored in the URL as `/customers?page=2`. Include "Previous" and "Next" buttons and show a "Page 2 of 6" indicator.

---

## Common Pitfalls

**Missing `id` in `useEffect` dependencies**

```jsx
// Wrong — data does not update when navigating from customer 5 to customer 10
useEffect(() => { loadCustomer(id); }, []);

// Correct — re-fetches whenever id changes
useEffect(() => { loadCustomer(id); }, [id]);
```

**Dynamic route declared before static route**

```jsx
// Wrong — "new" is matched as an id parameter
<Route path="/customers/:id"  element={<CustomerDetail />} />
<Route path="/customers/new"  element={<AddCustomer />} />

// Correct — static route comes first
<Route path="/customers/new"  element={<AddCustomer />} />
<Route path="/customers/:id"  element={<CustomerDetail />} />
```

**Using `<a>` instead of `<Link>`**

```jsx
// Wrong — causes a full page reload; React context and state are lost
<a href="/customers/5">View</a>

// Correct — client-side navigation; state is preserved
<Link to="/customers/5">View</Link>
```

**Forgetting `replace` after login**

```jsx
// Wrong — the user can press Back and return to the login page
navigate('/');

// Correct — the login page is removed from the history stack
navigate('/', { replace: true });
```

**Protecting the login route itself**

```jsx
// Wrong — creates an infinite redirect loop
<Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />

// Correct — login is always public
<Route path="/login" element={<Login />} />
```

---

## Summary

| Concept | What it does | When to use it |
|---------|-------------|----------------|
| `BrowserRouter` | Provides routing context to the component tree | Once, at the root of the application |
| `Routes` + `Route` | Declares which component renders for which URL | In `App.jsx` to define the route map |
| `Link` | Client-side navigation without a page reload | Static links in UI |
| `NavLink` | Like `Link`, but applies an active class on the current route | Navigation bars |
| `useNavigate` | Returns a function for programmatic navigation | After form submissions, after delete |
| `useParams` | Reads dynamic segments from the URL | Detail pages that load data by ID |
| `useLocation` | Reads the current URL and its state | Login redirect-back, 404 messages |
| `Navigate` | Renders an immediate redirect | Inside `ProtectedRoute`, guarded routes |
| `ProtectedRoute` | Wraps a route and redirects unauthenticated users | Any route that requires a login or role |

The routing architecture you have built in this lesson is the standard pattern for React SPAs: public routes are open, authenticated routes are guarded by a wrapper component, and URL parameters drive data fetching so that every view is bookmarkable and shareable.

---

## Additional Resources

- [React Router — Official Documentation](https://reactrouter.com/en/main)
- [React Router — Tutorial](https://reactrouter.com/en/main/start/tutorial)
