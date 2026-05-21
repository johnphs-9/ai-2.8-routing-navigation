# Pre-Reading: Lesson 2.8, Routing and Navigation with React Router

Timebox **1.5–2 hours** across these resources before the lesson. You do not need to memorise API details; focus on understanding how client-side routing works and why it is different from following a normal hyperlink.

---

## 1. How the Browser History API Works

**Read (10 min)**

- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API): Read the overview and the "Adding and modifying history entries" section. Focus on `pushState` and `replaceState` — these are the two browser functions that React Router uses under the hood to change the URL without triggering a page reload.

**Key idea to take away:** A browser navigation normally tells the server to send a new HTML page. `pushState` changes the URL silently without making any server request. React Router intercepts navigation events and uses this API so that URL changes are handled entirely in JavaScript.

---

## 2. React Router — Getting Started

**Read (20 min)**

- [React Router — Feature Overview](https://reactrouter.com/en/main/start/overview): Read the full overview page. It introduces `BrowserRouter`, `Routes`, `Route`, `Link`, and `useNavigate` in a compact format that previews what you will build in the lab.

**Key ideas:**

- Routes are declarative: you describe which URL maps to which component
- `<Link>` is a drop-in replacement for `<a>` that prevents full page reloads
- Hooks like `useParams` and `useNavigate` give components access to routing information

**Quick check:** After reading, can you write a minimal `App.jsx` that shows a `HomePage` component at `/` and an `AboutPage` component at `/about`?

---

## 3. URL Parameters and Dynamic Routes

**Read (15 min)**

- [React Router — useParams](https://reactrouter.com/en/main/hooks/use-params): Read the full page — it is short. Focus on how the `:paramName` syntax in the route path maps to a key in the object returned by `useParams`.

**Key idea to take away:** Dynamic routes let you use a single route definition to handle many URLs. `/customers/:id` handles `/customers/1`, `/customers/2`, and so on. The value is always a string, even when it looks like a number.

---

## 4. Programmatic Navigation

**Read (10 min)**

- [React Router — useNavigate](https://reactrouter.com/en/main/hooks/use-navigate): Read the full page.

**Key ideas:**

- `navigate('/path')` is the equivalent of the user clicking a `<Link>` — it adds a new entry to the browser history
- `navigate('/path', { replace: true })` overwrites the current history entry instead of adding a new one — useful after login so the user cannot press Back to return to the login page
- `navigate(-1)` goes back one step in history, like the browser's Back button

---

## 5. Protected Routes and Authentication Flows

**Watch (15 min)**

- Search YouTube for **"React Router protected routes"** and watch any tutorial under 15 minutes that shows a `ProtectedRoute` (or `RequireAuth`) wrapper component. There are many good options; pick one published in 2023 or later to ensure it uses React Router v6 syntax.

**What to look for:**

- The wrapper checks whether a user is authenticated
- If not authenticated, it renders `<Navigate to="/login" state={{ from: location }} replace />`
- After login, the login page reads `location.state.from` and redirects the user back

**Key idea to take away:** A protected route is just a component that renders either its children or a redirect — no special React Router API is required.

---

## 6. SPAs and the URL: Why This Matters

**Read (10 min)**

- [web.dev: Navigation and resource timing](https://web.dev/articles/navigation-and-resource-timing): Skim the first two sections. This gives you a mental model of what a normal browser navigation costs — a full round trip to the server — compared to what a client-side route change costs (nothing, except a JavaScript function call).

**Key idea to take away:** The whole point of client-side routing is that navigation feels instantaneous because no server round-trip is needed. The trade-off is that you have to manage routing yourself using a library like React Router.

---

## Reflection (5 min)

Before the lesson, write down answers to these three questions:

1. What is one advantage and one disadvantage of single-page applications compared to traditional multi-page applications?
2. Why do you think `<Link>` is preferred over `<a>` in React Router applications?
3. What is one thing you are still unclear about after the pre-reading?

Bring question 3 to class.
