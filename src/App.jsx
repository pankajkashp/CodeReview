import { Capabilities } from "./components/Capabilities.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { IntelligenceSection } from "./components/IntelligenceSection.jsx";
import { ReviewInterface } from "./components/ReviewInterface.jsx";
import { TopNavigation } from "./components/TopNavigation.jsx";

export default function App() {
  return (
    <div className="site-shell">
      <TopNavigation />
      <main>
        <Hero />
        <ReviewInterface />
        <Capabilities />
        <IntelligenceSection />
      </main>
      <Footer />
    </div>
  );
}
