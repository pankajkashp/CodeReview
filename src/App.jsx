import { useState, useEffect } from "react";
import { supabase } from "./supabaseclient.js";
import AuthModal from "./components/AuthModal";

import { CodeIntegrityEngine } from "./components/CodeIntegrityEngine.jsx";
import { Hero } from "./components/Hero.jsx";
import { TopNavigation } from "./components/TopNavigation.jsx";
import { Preloader } from "./components/Preloader.jsx";

export default function App() {
  const [activeView, setActiveView] = useState("landing");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // ✅ AUTH LISTENER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        if (session?.user && activeView === "landing") {
          setActiveView("engine");
        }

        if (!session?.user && activeView === "engine") {
          setActiveView("landing");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [activeView]);

  // 🔐 LOGIN → OPEN MODAL
  const handleLogin = () => {
    setShowAuth(true);
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
      setActiveView("engine");
    } else {
      setShowAuth(true); // 👈 open modal instead of navigate
    }
  };

  return (
    <>
      <Preloader>
        <div className="app-root-animate">

          {activeView === "engine" && user ? (
            <CodeIntegrityEngine
              user={user}
              onBack={() => setActiveView("landing")}
              onLogout={handleLogout}
            />
          ) : (
            <div className="site-shell" style={{ height: "100vh", overflow: "hidden" }}>
              <TopNavigation
                user={user}
                onLoginClick={handleLogin}   // 👈 IMPORTANT CHANGE
                onLogout={handleLogout}
              />

              <Hero onLaunch={handleLaunchEngine} />
            </div>
          )}

          {/* 🔥 AUTH MODAL */}
          {showAuth && (
            <AuthModal
              supabase={supabase}
              onClose={() => setShowAuth(false)}
            />
          )}

        </div>
      </Preloader>
    </>
  );
}