import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "./lib/supabaseClient.js";

import { CodeIntegrityEngine } from "./components/dashboard/CodeIntegrityEngine.jsx";
import { Hero } from "./components/layout/Hero.jsx";
import { TopNavigation } from "./components/layout/TopNavigation.jsx";
import { Preloader } from "./components/layout/Preloader.jsx";
import { About } from "./pages/About.jsx";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ✅ AUTH LISTENER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        if (!session?.user && location.pathname === "/dashboard") {
          navigate("/");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

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

  return (
    <>
      <Preloader>
        <div className="app-root-animate">

          {location.pathname === "/dashboard" && user ? (
            <CodeIntegrityEngine
              user={user}
              onBack={() => navigate("/")}
              onLogout={() => navigate("/logout")}
            />
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
