import { useEffect, useState } from "react";
import "../styles/preloader.css";

export function Preloader({ children }) {
  const [phase, setPhase] = useState("circle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("rotate"), 200);
    const t2 = setTimeout(() => setPhase("explode"), 1400);
    const t3 = setTimeout(() => setPhase("reveal"), 2000); // 👈 pause + reveal
    const t4 = setTimeout(() => setPhase("end"), 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const symbols = ["{}", "()", "=>", ";", "</>", "[]", "&&", "||", "==", "+", "-", "*", "/"];

  return (
    <>
      {/* 🟢 LANDING PAGE */}
      <div className={`main-content ${phase}`}>
        {children}
      </div>

      {/* 🔵 PRELOADER */}
      {phase !== "end" && (
        <div className={`preloader-overlay ${phase}`}>
          <div className="syntax-container">
            {symbols.map((sym, i) => (
              <span
                key={i}
                className="syntax"
                style={{
                  "--i": i,
                  "--total": symbols.length
                }}
              >
                {sym}
              </span>
            ))}
          </div>

          <div className="preloader-brand">
            <div className="tire-loader">
              <div className="tire-center"></div>
            </div>
            <div style={{ marginTop: '20px' }}>CODESAGE</div>
          </div>
        </div>
      )}
    </>
  );
}