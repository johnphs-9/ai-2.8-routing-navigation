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
