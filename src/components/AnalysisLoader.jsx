import { useState, useEffect } from "react";
import "../styles/analysis-loader.css";

const statusMessages = [
  "Initializing neural core...",
  "Parsing code structure...",
  "Running static analysis...",
  "Checking for vulnerabilities...",
  "Calculating complexity scores...",
  "Optimizing logic patterns...",
  "Finalizing integrity report..."
];

export function AnalysisLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analysis-loader-overlay">
      <div className="orbit orbit-1"></div>
      <div className="orbit orbit-2"></div>
      
      <div className="analysis-loader-content">
        <div className="hexagon-wrapper">
          <div className="hexagon"></div>
          <div className="hexagon-inner"></div>
          <div className="scan-line"></div>
        </div>
        
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <div className="loader-status-text">
            {statusMessages[messageIndex]}
          </div>
          <div className="loader-sub-text">
            DO NOT CLOSE OR REFRESH
          </div>
        </div>
      </div>
    </div>
  );
}
