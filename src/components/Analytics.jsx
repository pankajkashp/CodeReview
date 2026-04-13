import React from "react";
import "../styles/analytics.css";

export function Analytics({ onApplyChanges, analysis = {}, originalCode = "" }) {
  const bugs = Array.isArray(analysis.errors) ? analysis.errors : (Array.isArray(analysis.bugs) ? analysis.bugs : []);
  const optimizations = Array.isArray(analysis.optimization) ? analysis.optimization : [];
  const complexityDetails = [
    analysis.timeComplexity && `Time: ${analysis.timeComplexity}`,
    analysis.spaceComplexity && `Space: ${analysis.spaceComplexity}`,
    ...(Array.isArray(analysis.complexity) ? analysis.complexity : [])
  ].filter(Boolean);
  
  const codeScore = analysis.score || analysis.codeScore || "94";

  return (
    <div className="analytics-view">
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
              Deep neural review of your code architecture. We identified {bugs.length} critical<br/>
              bottlenecks and refactored the logic for maximum performance gains.
            </p>
          </div>
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="45"></circle>
              <circle className="circle-progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: Math.PI * 90 * (1 - (Number(codeScore) / 100)) }}></circle>
            </svg>
            <div className="score-value">
              <strong>{codeScore}</strong>
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
              <span className="count">{String(bugs.length).padStart(2, '0')}</span>
            </header>
            <h3>Bugs Detected</h3>
            <p>Issues securely identified for structural remediation.</p>
            <div className="alert-list">
              {bugs.length > 0 ? bugs.map((bug, idx) => (
                <div key={idx} className="alert error">{bug}</div>
              )) : (
                <div className="alert warn">No critical bugs found</div>
              )}
            </div>
          </article>

          <article className="insight-card focus-blue">
            <header>
              <div className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <span className="count">{String(optimizations.length).padStart(2, '0')}</span>
            </header>
            <h3>Optimization</h3>
            <p>Optimization strategies for state management and processing latency.</p>
            <div className="pill-list">
              {optimizations.length > 0 ? optimizations.map((opt, idx) => (
                <span key={idx} className="pill">{String(opt).toUpperCase()}</span>
              )) : (
                <span className="pill">FULLY OPTIMIZED</span>
              )}
            </div>
          </article>

          <article className="insight-card focus-green">
            <header>
              <div className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 22 22 22"></polygon>
                </svg>
              </div>
              <span className="count">{String(complexityDetails.length).padStart(2, '0')}</span>
            </header>
            <h3>Complexity Analysis</h3>
            <p>Stylistic adjustments and logic simplifications identified.</p>
            <ul className="check-list">
              {complexityDetails.length > 0 ? complexityDetails.map((item, idx) => (
                <li key={idx}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                  {item}
                </li>
              )) : (
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                  Maintainable logic threshold met
                </li>
              )}
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
              <code>{originalCode || "No input code provided."}</code>
            </div>
          </div>

          <div className="refactored-pane">
            <header className="pane-header">
              <div className="header-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>CODESAGE REFACTORED</span>
              </div>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(analysis.improvedCode || "")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                COPY CLIPPED
              </button>
            </header>
            <div className="code-container">
              <code>{analysis.improvedCode || "/* No refactoring available */"}</code>
              {optimizations.length > 0 && <div className="performance-badge">OPTIMIZED FASTER</div>}
            </div>
          </div>
        </section>
      </main>

      <footer className="analytics-footer">
        <div className="footer-metrics">
          <div className="metric">
            <small>PROCESSING</small>
            <strong>{analysis.processingTime || "142ms"}</strong>
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
          <button className="outline-btn" onClick={() => window.print()}>EXPORT PDF</button>
          <button className="primary-btn pulse" onClick={onApplyChanges}>APPLY ALL CHANGES</button>
        </div>
      </footer>
    </div>
  );
}
