import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Confirm from "./components/shared/confirmation.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Profile from "./pages/Profile.jsx";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route path="/about" element={<App />} />
      <Route path="/dashboard" element={<App />} />
    </Routes>

  </BrowserRouter>
);