# 2.8 Routing and Navigation with React Router

## Lesson Overview

This lesson adds multi-page routing to the CRM application built in previous lessons, splitting the app into a public area (`WelcomePage`, `LoginPage`) and an authenticated area under a nested `/app` prefix. Learners build one route at a time, from a `DashboardPage` and `CustomersPage` through dedicated `NewCustomerPage`, `CustomerDetailPage`, and `EditCustomerPage` pages, before locking the `/app` tree down with a single `ProtectedRoute`. The lesson covers URL parameters with `useParams`, programmatic navigation with `useNavigate`, reading location state with `useLocation`, and nested routes with relative paths, `index` routes, and `<Outlet />`.

## Dependencies

- [Self Studies](./studies.md)
- [Lesson](./lesson.md)
- [Assignment](./assignment.md)

## Lesson Objectives

- Explain how routing works in single-page applications using React Router
- Construct routes, nested routes, and route parameters for the CRM application
- Implement protected routes with authentication guards

## Lesson Plan

| Duration  | What                                             | How or Why                                                                                                                                                 |
| --------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10 min    | Warm up and recap                                | Recap Lesson 2.6: AuthContext and CustomerContext; show the single-page, selectedId-driven CRM as motivation for adding routes                              |
| 15 min    | SPAs and React Router concepts                   | Slides: traditional vs SPA navigation, BrowserRouter/Routes/Route, public vs authenticated URL space (`/` vs `/app`), "build open, then lock down" approach |
| 10 min    | Navigation components and nesting                | Slides: Link vs NavLink with active styling, nested routes, relative paths, `index` routes, and `<Outlet />`                                                |
| 5 min     | Break                                             |                                                                                                                                                                |
| 10 min    | Code-along: minimal route skeleton and WelcomePage | Install react-router; download and wire the provided WelcomePage at `/`; add a `/login` placeholder to App.jsx; verify no-reload navigation in browser     |
| 15 min    | Code-along: Sidebar and RootLayout               | Replace Header with Sidebar (NavLink active styling, temporary hardcoded dummy user so learners can preview the app before login exists); build RootLayout with `path="app"` and `<Outlet />`; wire the nested `app` route |
| 10 min    | Code-along: DashboardPage                        | Build a minimal dashboard reading customers from CustomerContext; wire as the `index` route under `app`                                                     |
| 15 min    | Code-along: CustomersPage                        | Move list, search, and filter out of App.jsx into a list-only page; "Add Customer" as a Link, not a form toggle; wire relative `path="customers"`           |
| 5 min     | Break                                             |                                                                                                                                                                |
| 15 min    | Code-along: NewCustomerPage                      | Extract the add-customer form to its own page and route; fix addCustomer to return the created customer; navigate to the new detail page                   |
| 20 min    | Code-along: CustomerDetailPage (view only)       | useParams for dynamic routes; explain the id dependency in useEffect; Edit becomes a Link, no inline edit state                                             |
| 15 min    | Activity: Delete from the detail page            | Learners add a Delete button to CustomerDetailPage using deleteCustomer from CustomerContext, shown unconditionally for now since AuthContext has no real user yet |
| 15 min    | Code-along: EditCustomerPage                     | useParams + fetch to pre-fill a controlled form; Cancel as a Link; useNavigate back to the detail page on save                                              |
| 20 min    | Code-along: ProtectedRoute, LoginPage, 404       | Build a single ProtectedRoute wrapping the whole `/app` tree with redirect-back flow; move LoginPage into pages/ (default redirect now `/app`); swap Sidebar's dummy user for real AuthContext now that a real user is guaranteed; build NotFoundPage |
| 10 min    | Wrap up and Q&A                                  | Common pitfalls (relative vs absolute paths, route ordering only when routes tie for specificity), replace vs push, preview Bonus Challenge 1 (restoring admin-only UI gating and route guards), preview Lesson 2.9 |
| **Total** |                                                    | **170 min — allows ~10 min buffer for questions and pacing**                                                                                                 |
