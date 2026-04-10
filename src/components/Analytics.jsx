import React from "react";
import "../styles/analytics.css";

export function Analytics({ onApplyChanges }) {
  return (
    <div className="analytics-view">
      <header className="analytics-topbar">
        <div className="analytics-brand">KINETIC VOID</div>
        <nav className="analytics-nav">
          <a href="#" className="active">Analysis</a>
          <a href="#">Documentation</a>
          <a href="#">Enterprise</a>
        </nav>
        <div className="analytics-actions">
          <label className="analytics-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="search" placeholder="Search insights..." />
          </label>
          <button className="icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button className="user-avatar" aria-label="User Profile">
            <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&rounded=true" alt="User avatar" />
          </button>
        </div>
      </header>

      <main className="analytics-body">
        <header className="hero-metrics">
          <div className="hero-text">
            <div className="badges">
              <span className="badge-primary">
                <span className="pulse-dot"></span>
                AI ANALYSIS COMPLETE
              </span>
              <span className="badge-secondary">/ BATCH #6821-X</span>
            </div>
            <h1>Structural Optimization<br/>Results.</h1>
            <p>
              Deep neural review of your code architecture. We identified 4 critical<br/>
              bottlenecks and refactored the logic for 3.2x performance gains.
            </p>
          </div>
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="45"></circle>
              <circle className="circle-progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: Math.PI * 90 * (1 - 0.94) }}></circle>
            </svg>
            <div className="score-value">
              <strong>94</strong>
              <span>CODE SCORE</span>
            </div>
          </div>
        </header>

        <section className="insights-grid">
          <article className="insight-card focus-red">
            <header>
              <div className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 12h-5"></path>
                  <path d="M14.5 16h-5"></path>
                  <path d="M14.5 8h-5"></path>
                  <path d="M12 2v20"></path>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                </svg>
              </div>
              <span className="count">02</span>
            </header>
            <h3>Bugs Detected</h3>
            <p>Race conditions identified in asynchronous fetch operations.</p>
            <div className="alert-list">
              <div className="alert error">Critical: Unhandled Promise Rejection</div>
              <div className="alert warn">Warning: Memory leak in useEffect</div>
            </div>
          </article>

          <article className="insight-card focus-blue">
            <header>
              <div className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <span className="count">04</span>
            </header>
            <h3>Improvements</h3>
            <p>Optimization strategies for state management and tree shaking.</p>
            <div className="pill-list">
              <span className="pill">MEMOIZATION APPLIED</span>
              <span className="pill">HOOK REFACTOR</span>
              <span className="pill">REDUX TO ZUSTAND</span>
            </div>
          </article>

          <article className="insight-card focus-green">
            <header>
              <div className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 22 22 22"></polygon>
                </svg>
              </div>
              <span className="count">07</span>
            </header>
            <h3>Clean Code Suggestions</h3>
            <p>Stylistic adjustments to maintain industry-standard readability.</p>
            <ul className="check-list">
               <li>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                 Extract complex logic to utils.ts
               </li>
               <li>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                 Standardize naming conventions
               </li>
               <li>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                 Remove dead console.log calls
               </li>
            </ul>
          </article>
        </section>

        <section className="diff-view">
          <div className="source-pane">
            <header className="pane-header">
              <div className="header-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8l0 4l2 2" /><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" /></svg>
                <span>LEGACY SOURCE</span>
              </div>
              <span className="hash">SHA-7721</span>
            </header>
            <div className="code-container">
              <code>{`async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === "ok") {
    setResults(data.payload);
  }
  // Missing error handling
  // No caching logic
  return data;
}`}</code>
            </div>
          </div>

          <div className="refactored-pane">
            <header className="pane-header">
              <div className="header-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55e7ff" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>KINETIC REFACTORED</span>
              </div>
              <button className="copy-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                COPY CLIPPED
              </button>
            </header>
            <div className="code-container">
              <code>{`/** Optimized fetch with retry & cache */
export const fetchData = async (url: string) => {
  try {
    const cached = await cacheManager.get(url);
    if (cached) return cached;

    const response = await fetch(url, {
      headers: API_HEADERS,
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) throw new Error(\`HTTP_\${response.status}\`);

    const { payload } = await response.json();
    await cacheManager.set(url, payload);

    return payload;
  } catch (err) {
    Logger.error("FETCH_FAIL", { url, err });
    throw err;
  }
};`}</code>
              <div className="performance-badge">3.2X FASTER</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="analytics-footer">
        <div className="footer-metrics">
          <div className="metric">
            <small>PROCESSING TIME</small>
            <strong>142ms</strong>
          </div>
          <div className="metric">
            <small>MODELS USED</small>
            <strong>K-Core v4.2</strong>
          </div>
          <div className="metric">
            <small>SECURITY AUDIT</small>
            <strong className="verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Verified
            </strong>
          </div>
        </div>
        <div className="footer-actions">
          <button className="outline-btn">EXPORT PDF</button>
          <button className="primary-btn pulse" onClick={onApplyChanges}>APPLY ALL CHANGES</button>
        </div>
      </footer>
    </div>
  );
}
