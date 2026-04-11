import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";

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

  // ✅ SUPABASE AUTH LISTENER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 LOGIN (EMAIL - WORKING VERSION)
 const handleLogin = async () => {
  const email = prompt("Enter email:");
  const password = prompt("Enter password:");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("User not found. Creating account...");

    await supabase.auth.signUp({
      email,
      password
    });
  }
};

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveView("landing");
  };

  return (
    <>
      <Preloader>
        <div className="app-root-animate">
          {activeView === "engine" ? (
            <CodeIntegrityEngine
              user={user}
              onBack={() => setActiveView("landing")}
            />
          ) : (
            <div className="site-shell">
              <TopNavigation
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />

              <main>
                <Hero onLaunch={() => setActiveView("engine")} />

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