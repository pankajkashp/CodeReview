import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";

const Confirm = lazy(() => import("./components/shared/confirmation.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Logout = lazy(() => import("./pages/Logout.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

function RouteShellFallback() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#080c14",
      color: "#00E5FF",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.82rem",
      letterSpacing: "0.1em"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "28px",
          height: "28px",
          border: "2px solid rgba(0, 229, 255, 0.2)",
          borderTop: "2px solid #00E5FF",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px"
        }} />
        <span>LOADING INTERFACE...</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Suspense fallback={<RouteShellFallback />}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/about" element={<App />} />
        <Route path="/dashboard" element={<App />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);