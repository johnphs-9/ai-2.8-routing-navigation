# Assessment / Quiz

## Overview

- **Lesson:** Routing and Navigation with React Router / 2.8
- **Format:** 10 questions (mix MCQ / True-False)
- **Time:** ~10–15 minutes
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
