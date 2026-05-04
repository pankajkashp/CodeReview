import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "./supabaseClient.js";

import { CodeIntegrityEngine } from "./components/CodeIntegrityEngine.jsx";
import { Hero } from "./components/Hero.jsx";
import { TopNavigation } from "./components/TopNavigation.jsx";
import { Preloader } from "./components/Preloader.jsx";
import { About } from "./components/About.jsx";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState("landing");
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
  }, [location.pathname]);

  // 🔐 LOGIN → REDIRECT
  const handleLogin = () => {
    navigate("/login");
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveView("landing");
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
              <div className="stars"></div>
              <div className="shooting-stars">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
              </div>


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