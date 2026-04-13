import { useState, useEffect } from "react";
import { supabase } from "./supabaseclient.js";
import { useNavigate } from "react-router-dom";

import { Capabilities } from "./components/Capabilities.jsx";
import { CodeIntegrityEngine } from "./components/CodeIntegrityEngine.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { IntelligenceSection } from "./components/IntelligenceSection.jsx";
import { ReviewInterface } from "./components/ReviewInterface.jsx";
import { TopNavigation } from "./components/TopNavigation.jsx";
import { Preloader } from "./components/Preloader.jsx";

export default function App() {
  const [activeView, setActiveView] = useState("landing");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ SUPABASE AUTH LISTENER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (!session?.user && activeView === "engine") {
            setActiveView("landing");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [activeView]);

  // 🔥 NAVIGATION HANDLERS
  const handleLogin = () => navigate("/login");
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/logout");
  };

  const handleLaunchEngine = () => {
    if (user) {
      setActiveView("engine");
    } else {
      navigate("/login");
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
            <div className="site-shell">
              <TopNavigation
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />

              <main>
                <Hero onLaunch={handleLaunchEngine} />

                <ReviewInterface user={user} />

                <Capabilities />
                <IntelligenceSection />
              </main>

              <Footer />
            </div>
          )}
        </div>
      </Preloader>
    </>
  );
}