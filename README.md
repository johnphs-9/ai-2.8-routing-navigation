# 2.8 Routing and Navigation with React Router

## Lesson Overview

This lesson adds multi-page routing to the CRM application built in previous lessons. Learners install React Router, declare a route map for the CRM, and build page components for the customer list, customer detail, add-customer form, login, and 404 views. The lesson covers URL parameters with `useParams`, programmatic navigation with `useNavigate`, and reading location state with `useLocation`. It closes by building a `ProtectedRoute` wrapper that redirects unauthenticated users to the login page and returns them to their original destination after sign-in.

## Dependencies

- [Self Studies](./studies.md)
- [Lesson](./lesson.md)
- [Assignment](./assignment.md)

## Lesson Objectives

- Explain how routing works in single-page applications using React Router
- Construct routes, nested routes, and route parameters for the CRM application
- Implement protected routes with authentication guards

## Lesson Plan

| Duration  | What                                        | How or Why                                                                                                                      |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 10 min    | Warm up and recap                           | Recap Lesson 2.6: AuthContext and CustomerContext; show the single-page CRM as motivation for adding routes                     |
| 20 min    | SPAs and React Router concepts              | Slides: traditional vs SPA navigation, BrowserRouter/Routes/Route, route map for the CRM, project structure                    |
| 15 min    | Navigation components and hooks             | Slides: Link vs NavLink with active styling, useParams for dynamic routes, useNavigate for programmatic navigation              |
| 5 min     | Break                                       |                                                                                                                                 |
| 10 min    | Code-along: project setup and route skeleton| Install react-router-dom; create pages/ folder; add BrowserRouter and placeholder routes to App.jsx; verify in browser         |
| 15 min    | Code-along: Navbar                          | Build Navbar with NavLink active styling and conditional admin link; wire into App.jsx                                          |
| 15 min    | Code-along: CustomerList page               | Move customer list logic to a page component; add useNavigate for the "View" button                                             |
| 5 min     | Break                                       |                                                                                                                                 |
| 20 min    | Code-along: CustomerDetail page             | Build CustomerDetail with useParams; explain the id dependency in useEffect; add delete with navigate('/') after success        |
| 15 min    | Code-along: AddCustomer page                | Build AddCustomer form with navigate to new customer's detail page on submit                                                    |
| 20 min    | Code-along: ProtectedRoute, Login, NotFound | Build ProtectedRoute with redirect-back flow; build Login page that reads location.state.from; build NotFound with useLocation  |
| 15 min    | Wrap up and Q&A                             | Common pitfalls, route ordering, replace vs push, deployment 404 issue, preview Lesson 2.9                                     |
| **Total** |                                             | **165 min — allows ~15 min buffer for questions and pacing**                                                                    |
