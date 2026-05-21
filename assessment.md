# Assessment / Quiz

## Overview

- **Lesson:** Routing and Navigation with React Router / 2.8
- **Format:** 30 questions (mix MCQ / True-False)
- **Time:** ~30 minutes
- **Scoring:** 1 point each

## Questions

### Q1 (True/False)

A single-page application (SPA) reloads the entire HTML page every time the user navigates to a new view.

A - True

B - False

---

### Q2

Which of the following best describes how React Router handles navigation in a single-page application?

A - It sends a request to the server for each new route and replaces the entire page

B - It intercepts navigation events, updates the URL using the History API, and renders the matching component without a page reload

C - It pre-renders all routes into separate HTML files at build time

D - It uses iframes to show different views at different URLs

---

### Q3

A developer runs `npm install react-router`. Will this work for a React web application?

A - Yes, `react-router` is the correct package for web applications

B - No, the correct package for web applications is `react-router-dom`

C - Yes, both packages are interchangeable

D - No, React Router must be installed through the React CLI, not npm

---

### Q4

Which React Router component must wrap the entire application to provide routing context?

A - `Routes`

B - `Router`

C - `BrowserRouter`

D - `Route`

---

### Q5 (True/False)

In React Router, the `<Routes>` component renders all matching `<Route>` components simultaneously when a URL matches more than one path.

A - True

B - False

---

### Q6

The CRM has these two routes declared in this order:

```jsx
<Route path="/customers/:id"  element={<CustomerDetail />} />
<Route path="/customers/new"  element={<AddCustomer />} />
```

What happens when the user navigates to `/customers/new`?

A - Both components render at the same time

B - `AddCustomer` renders because static routes always take priority over dynamic ones

C - `CustomerDetail` renders with `id = "new"` because the dynamic route matches first

D - React Router throws an error about ambiguous routes

---

### Q7

In the CRM route configuration, which of the following correctly declares a route that catches all unmatched URLs?

A - `<Route path="/" element={<NotFound />} />`

B - `<Route path="**" element={<NotFound />} />`

C - `<Route path="*" element={<NotFound />} />`

D - `<Route path="/404" element={<NotFound />} />`

---

### Q8 (True/False)

The `<Link>` component in React Router performs a full page reload when navigating, which is why it is preferred over a standard `<a>` tag.

A - True

B - False

---

### Q9

What is the key difference between `<Link>` and `<NavLink>` in React Router?

A - `<NavLink>` can only navigate to relative paths; `<Link>` can navigate to absolute paths

B - `<NavLink>` receives an `isActive` boolean in its `className` function and can apply active styling when its path matches the current URL; `<Link>` does not

C - `<Link>` is for internal navigation; `<NavLink>` is for navigating to external URLs

D - `<NavLink>` prevents the default browser navigation; `<Link>` does not

---

### Q10

A `NavLink` for the root path `/` appears active on every page, including `/customers/5`. Which prop fixes this?

A - `exact`

B - `strict`

C - `end`

D - `default`

---

### Q11

A developer wants to read the dynamic segment from the URL `/customers/42`. Which hook provides this?

A - `useLocation`

B - `useRouteMatch`

C - `useParams`

D - `useNavigate`

---

### Q12

Given the route `<Route path="/customers/:id" element={<CustomerDetail />} />`, what does `useParams()` return when the URL is `/customers/7`?

A - `7` (number)

B - `{ id: "7" }` (object with a string value)

C - `{ id: 7 }` (object with a number value)

D - `"customers/7"` (the full path segment)

---

### Q13

A `CustomerDetail` component fetches data using `useEffect`. The `id` from `useParams` is used in the fetch URL. What happens if `id` is NOT included in the `useEffect` dependency array?

A - The component throws an error on every render

B - The component fetches the correct data but caches it for performance

C - The component does not re-fetch when the user navigates from one customer to another, so stale data is displayed

D - React automatically detects the missing dependency and re-fetches on each render

---

### Q14 (True/False)

When a user navigates from `/customers/5` to `/customers/10`, the `CustomerDetail` component unmounts and a completely new instance mounts with the new ID.

A - True

B - False

---

### Q15

Which hook is used for programmatic navigation — for example, redirecting to the customer detail page after a form submission?

A - `useLocation`

B - `useRedirect`

C - `useHistory`

D - `useNavigate`

---

### Q16

After an admin successfully adds a new customer, the code calls `navigate(`/customers/${newCustomer.id}`)`. What does this do?

A - It reloads the page and renders the customer detail at the new URL

B - It updates the URL and renders `CustomerDetail` with the new customer's ID, without a page reload

C - It appends the new URL to the browser history but does not navigate

D - It sends a GET request to the server for the new URL

---

### Q17

In the `AddCustomer` page, the Cancel button calls `navigate('/')`. A user fills in a form, clicks Cancel, then presses the browser Back button. Where do they end up?

A - Back on the Add Customer form (the previous history entry)

B - On the customer list page (they navigate back twice)

C - An error occurs because `navigate` does not work with the browser Back button

D - They are sent to the login page

---

### Q18 (True/False)

`useLocation` returns an object that includes the current `pathname`, `search`, and `hash` values, as well as any `state` that was passed during navigation.

A - True

B - False

---

### Q19

In the CRM, `ProtectedRoute` redirects unauthenticated users to `/login` and passes the current location as state:

```jsx
<Navigate to="/login" state={{ from: location }} replace />
```

After a successful login, how does the `Login` page know where to redirect the user?

A - React Router stores the original URL in a cookie and reads it automatically

B - The login page reads `location.state?.from?.pathname` using `useLocation` and passes it to `navigate`

C - The server sends back the original URL in the response headers

D - The original URL is stored in `localStorage` by `ProtectedRoute` and read by `Login`

---

### Q20

What is the effect of passing `replace` as a prop to `<Navigate>`, or `{ replace: true }` as an option to `navigate()`?

A - It replaces the current browser tab with a new one at the target URL

B - It replaces the current entry in the browser history stack instead of adding a new one, preventing the user from pressing Back to return to the redirected page

C - It forces a full server-side navigation instead of a client-side route change

D - It removes all previous history entries and starts a fresh navigation stack

---

### Q21

Which of the following correctly protects the `/customers/new` route so that only admin users can access it?

A -
```jsx
<Route path="/customers/new" element={<AddCustomer role="admin" />} />
```

B -
```jsx
<Route path="/customers/new" element={
  <ProtectedRoute requiredRole="admin"><AddCustomer /></ProtectedRoute>
} />
```

C -
```jsx
<Route path="/customers/new" role="admin" element={<AddCustomer />} />
```

D -
```jsx
<Route path="/customers/new" element={<AddCustomer />} protected />
```

---

### Q22 (True/False)

The login page (`/login`) should be wrapped in `<ProtectedRoute>` like other pages so that unauthenticated users can access it.

A - True

B - False

---

### Q23

A `ProtectedRoute` component checks `if (loading) return <p>Checking...</p>` before the `if (!user)` check. Why is the `loading` check necessary?

A - React Router requires all components to show a loading state before rendering

B - Without it, the component would redirect to `/login` during the brief moment between mount and when `localStorage` has been checked, logging out users who are already signed in

C - The `useAuth` hook is asynchronous and needs time to connect to the server

D - Checking `loading` prevents the `user` value from being `null` after logout

---

### Q24

In the CRM's `Navbar`, the `Add Customer` link is rendered conditionally:

```jsx
{user.role === 'admin' && (
  <NavLink to="/customers/new">Add Customer</NavLink>
)}
```

A regular user knows the URL and types `/customers/new` directly into the browser. What happens?

A - The `AddCustomer` component renders because the Navbar check was bypassed

B - `ProtectedRoute` catches the attempt and redirects the user away from the page

C - React Router blocks the navigation because the `NavLink` is hidden

D - The browser sends a 403 Forbidden response

---

### Q25

Which of the following is a valid reason to use `<a href="...">` instead of `<Link to="...">` in a React Router application?

A - When linking to an external URL outside the application

B - When navigating to a route that requires authentication

C - When the target page has a large amount of data to load

D - When the link appears inside a form element

---

### Q26 (True/False)

`BrowserRouter` uses the HTML5 History API to manipulate the browser's URL without triggering a full page reload.

A - True

B - False

---

### Q27

A developer creates a `NotFound` page and registers it as the last route:

```jsx
<Route path="*" element={<NotFound />} />
```

Inside `NotFound`, they want to display the URL the user tried to access. Which hook provides this?

A - `useParams`

B - `useNavigate`

C - `useLocation`

D - `useRoute`

---

### Q28

A learner writes the following and wonders why clicking the link causes a full page reload:

```jsx
function CustomerCard({ customer }) {
  return (
    <div>
      <p>{customer.firstName} {customer.lastName}</p>
      <a href={`/customers/${customer.id}`}>View Details</a>
    </div>
  );
}
```

What is the fix?

A - Replace `href` with `to` on the `<a>` tag

B - Replace `<a href="...">` with `<Link to="...">`  and import `Link` from `react-router-dom`

C - Wrap the `<a>` tag in a `<Routes>` component

D - Add `event.preventDefault()` to an `onClick` handler on the `<a>` tag

---

### Q29 (True/False)

In a React Router application, each `<Route>` component must be a direct child of a `<Routes>` component; nesting routes inside other JSX is not supported.

A - True

B - False

---

### Q30

A learner's CRM application works correctly in development at `http://localhost:5173`, but after deploying to a static host, navigating directly to `http://crm.example.com/customers/5` returns a 404 error from the server. What is the most likely cause?

A - React Router is not compatible with production builds

B - The static host is not configured to serve `index.html` for all routes; it looks for a real file at `/customers/5`, which does not exist

C - `BrowserRouter` must be replaced with `HashRouter` in production

D - The `<Route path="/customers/:id">` definition is missing the `production` prop

---
