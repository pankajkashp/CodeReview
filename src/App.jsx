import { useState, useEffect } from "react";
import { supabase } from "../supabaseclient.js";

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

  // Check session on load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // LOGIN via Google OAuth
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error("Error logging in:", error.message);
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <Preloader>
        <div className="app-root-animate">
          {activeView === "engine" ? (
            <CodeIntegrityEngine onBack={() => setActiveView("landing")} />
          ) : (
            <div className="site-shell">
              <TopNavigation user={user} onLogin={handleLogin} onLogout={handleLogout} />
              <main>
                <Hero onLaunch={() => setActiveView("engine")} />
                <ReviewInterface />
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