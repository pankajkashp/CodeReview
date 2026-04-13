import { useEffect, useState } from "react";
import "../styles/preloader.css";

export function Preloader({ children }) {
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Stage 1: Stop the loading state to trigger fade out
    const tStart = setTimeout(() => {
      setLoading(false);
    }, 2200);

    // Stage 2: Completely remove from DOM after CSS transition (800ms)
    const tEnd = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    return () => {
      clearTimeout(tStart);
      clearTimeout(tEnd);
    };
  }, []);

  return (
    <>
      {showOverlay && (
        <div className={`preloader-overlay ${!loading ? "exit" : ""}`}>
          <div className="engine-core">
            <div className="core-ring"></div>
            <div className="core-ring delay"></div>

            <div className="core-symbol">
              &lt;./&gt;
            </div>
          </div>

          <p className="loader-text">Initializing Engine...</p>
        </div>
      )}

      {/* WEBSITE */}
      <div className={`main-content ${!loading ? "show" : ""}`}>
        {children}
      </div>
    </>
  );
}