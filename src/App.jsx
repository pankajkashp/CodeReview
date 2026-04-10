import { useState } from "react";
import { Capabilities } from "./components/Capabilities.jsx";
import { CodeIntegrityEngine } from "./components/CodeIntegrityEngine.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { IntelligenceSection } from "./components/IntelligenceSection.jsx";
import { ReviewInterface } from "./components/ReviewInterface.jsx";
import { TopNavigation } from "./components/TopNavigation.jsx";

export default function App() {
  const [activeView, setActiveView] = useState("landing");

  if (activeView === "engine") {
    return <CodeIntegrityEngine onBack={() => setActiveView("landing")} />;
  }

  return (
    <div className="site-shell">
      <TopNavigation />
      <main>
        <Hero onLaunch={() => setActiveView("engine")} />
        <ReviewInterface />
        <Capabilities />
        <IntelligenceSection />
      </main>
      <Footer />
    </div>
  );
}
