import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "./lib/supabaseClient.js";

import { Hero } from "./components/layout/Hero.jsx";
import { TopNavigation } from "./components/layout/TopNavigation.jsx";
import { Preloader } from "./components/layout/Preloader.jsx";
import { About } from "./pages/About.jsx";

const CodeIntegrityEngine = lazy(() =>
  import("./components/dashboard/CodeIntegrityEngine.jsx").then((m) => ({ default: m.CodeIntegrityEngine }))
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ AUTH INITIALIZATION & SINGLE LISTENER (Part 3 & Part 4)
  useEffect(() => {
    let isMounted = true;

    // 1. Initial session restoration
    supabase.auth.getSession().then(({ data, error }) => {
      if (error && typeof window !== "undefined" && window.location.hostname === "localhost") {
        console.warn("[App] Session restoration error:", error);
      }
      if (isMounted) {
        setUser(data?.session?.user || null);
        setAuthLoading(false);
      }
    }).catch((err) => {
      console.error("[App] Failed to restore auth session:", err);
      if (isMounted) {
        setUser(null);
        setAuthLoading(false);
      }
    });

    // 2. Auth state change listener (single subscription)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user || null);
          setAuthLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Run ONCE on mount! NOT on location changes.

  // ✅ PROTECTED ROUTE REDIRECTION (Only when authLoading is completely done!)
  useEffect(() => {
    if (!authLoading && !user && location.pathname === "/dashboard") {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, location.pathname, navigate]);

  // 🔐 LOGIN → REDIRECT
  const handleLogin = () => {
    navigate("/login");
  };

  // 🚀 ENGINE ACCESS
  const handleLaunchEngine = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // If on /dashboard and session is still resolving, show clean loading state instead of bouncing to landing
  if (authLoading && location.pathname === "/dashboard") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080c14",
        color: "#00E5FF",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.85rem",
        letterSpacing: "0.1em"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "2px solid rgba(0, 229, 255, 0.2)",
            borderTop: "2px solid #00E5FF",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }} />
          <span>RESTORING SECURITY SESSION...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Preloader>
        <div className="app-root-animate">

          {location.pathname === "/dashboard" && user ? (
            <Suspense fallback={
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
                    width: "32px",
                    height: "32px",
                    border: "2px solid rgba(0, 229, 255, 0.2)",
                    borderTop: "2px solid #00E5FF",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 16px"
                  }} />
                  <span>INITIALIZING CODE ENGINE...</span>
                </div>
              </div>
            }>
              <CodeIntegrityEngine
                user={user}
                onBack={() => navigate("/")}
                onLogout={() => navigate("/logout")}
              />
            </Suspense>
          ) : (
            <div className="site-shell" style={{ 
              minHeight: "100vh", 
              height: location.pathname === "/about" ? "auto" : "100vh",
              overflowY: location.pathname === "/about" ? "auto" : "hidden", 
              position: 'relative' 
            }}>
              {/* 🌌 BACKGROUND STARS FOR LANDING */}
                            

              <TopNavigation
                user={user}
                onLoginClick={handleLogin}
                onLogout={() => navigate("/logout")}
              />

              {location.pathname === "/about" ? (
                <About onBack={() => navigate("/")} />
              ) : (
                <Hero onLaunch={handleLaunchEngine} />
              )}
            </div>
          )}

        </div>
      </Preloader>
    </>
  );
}
