# Pre-Reading: Lesson 2.8, Routing and Navigation with React Router

Timebox **1–1.5 hours** across these resources before the lesson. You do not need to memorise API details; focus on understanding how client-side routing works and why it is different from following a normal hyperlink.

---

## 1. How the Browser History API Works

**Read (10 min)**

- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API): Read the overview and the "Adding and modifying history entries" section. Focus on `pushState` and `replaceState` — these are the two browser functions that React Router uses under the hood to change the URL without triggering a page reload.

**Key idea to take away:** A browser navigation normally tells the server to send a new HTML page. `pushState` changes the URL silently without making any server request. React Router intercepts navigation events and uses this API so that URL changes are handled entirely in JavaScript.

---

## 2. React Router — Getting Started

**Read (20 min)**

- [React Router — Routing](https://reactrouter.com/start/declarative/routing): Read the full page. It introduces `BrowserRouter`, `Routes`, `Route`, and `Link` in a compact format that previews what you will build in the lab.

**Key ideas:**

- Routes are declarative: you describe which URL maps to which component
- `<Link>` is a drop-in replacement for `<a>` that prevents full page reloads
- Hooks like `useParams` and `useNavigate` give components access to routing information

**Quick check:** After reading, can you write a minimal `App.jsx` that shows a `HomePage` component at `/` and an `AboutPage` component at `/about`?

---

## 3. URL Parameters and Dynamic Routes

**Read (15 min)**

- [React Router — useParams](https://reactrouter.com/api/hooks/useParams): Read the full page, it is short. Focus on how the `:paramName` syntax in the route path maps to a key in the object returned by `useParams`.

**Key idea to take away:** Dynamic routes let you use a single route definition to handle many URLs. `/customers/:id` handles `/customers/1`, `/customers/2`, and so on. The value is always a string, even when it looks like a number.

---

## 4. Programmatic Navigation

**Read (10 min)**

- [React Router — useNavigate](https://reactrouter.com/api/hooks/useNavigate): Read the full page.

**Key ideas:**

- `navigate('/path')` is the equivalent of the user clicking a `<Link>` — it adds a new entry to the browser history
- `navigate('/path', { replace: true })` overwrites the current history entry instead of adding a new one — useful after login so the user cannot press Back to return to the login page
- `navigate(-1)` goes back one step in history, like the browser's Back button

---

## 5. Protected Routes and Authentication Flows

**Read (10 min)**

- [React Router — Navigate](https://reactrouter.com/api/components/Navigate): Read the full page, it is short. This is the component used to redirect a user away from a page they should not see.

**Key idea to take away:** A protected route is just a component that checks whether a user is authenticated, then renders either its children or a `<Navigate to="/login" replace />` redirect, no special React Router API is required beyond this one component. You will build this wrapper yourself in the lab.

---

## Reflection (5 min)

Before the lesson, write down answers to these three questions:

1. What is one advantage and one disadvantage of single-page applications compared to traditional multi-page applications?
2. Why do you think `<Link>` is preferred over `<a>` in React Router applications?
3. What is one thing you are still unclear about after the pre-reading?

Bring question 3 to class.
