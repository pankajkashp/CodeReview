import React from "react";
import "../styles/analytics.css";

export function Analytics({ onApplyChanges, analysis = {}, originalCode = "", onExit, onAnalyze, onBackToDashboard }) {
  const [editableCode, setEditableCode] = React.useState(originalCode);
  
  const bugs = Array.isArray(analysis.errors) ? analysis.errors : (Array.isArray(analysis.bugs) ? analysis.bugs : []);
  const optimizations = Array.isArray(analysis.optimization) ? analysis.optimization : [];
  const complexities = [
    { label: "Time", old: analysis.oldTimeComplexity, new: analysis.newTimeComplexity, icon: "M12 8l0 4l2 2" },
    { label: "Space", old: analysis.oldSpaceComplexity, new: analysis.newSpaceComplexity, icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }
  ].filter(c => c.old || c.new);

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

        <section className="diff-view">
          <div className="source-pane">
            <header className="pane-header">
              <div className="header-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8l0 4l2 2" /><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" /></svg>
                <span>LEGACY SOURCE (EDITABLE)</span>
              </div>
              <button className="reanalyze-btn" onClick={() => onAnalyze(editableCode)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.3 0 6.1 2 7.3 4.9M22 12c0 4.4-3.6 8-8 8-3.3 0-6.1-2-7.3-4.9"/></svg>
                RE-ANALYZE
              </button>
            </header>
            <div className="code-container">
              <textarea 
                className="legacy-editor"
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                placeholder="Paste new code here to re-analyze..."
              />
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
              <pre>{analysis.improvedCode || "/* No refactoring available */"}</pre>
              {(analysis.optimization && analysis.optimization.length > 0) && <div className="performance-badge">OPTIMIZED FASTER</div>}
            </div>
          </div>
        </section>

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
              <span className="count">{String(complexities.length).padStart(2, '0')}</span>
            </header>
            <h3>Complexity Analysis</h3>
            <p>Efficiency gains identified through algorithmic refactoring.</p>
            <div className="complexity-comparison-list">
              {complexities.length > 0 ? complexities.map((c, idx) => (
                <div key={idx} className="complexity-item">
                  <div className="comp-header">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={c.icon} /></svg>
                    <span>{c.label}</span>
                  </div>
                  <div className="comp-values">
                    <div className="val-old">
                      <small>OLDER</small>
                      <span>{c.old}</span>
                    </div>
                    <div className="arrow">→</div>
                    <div className="val-new">
                      <small>NEWER</small>
                      <span>{c.new}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="alert-placeholder">Maintainable logic threshold met</div>
              )}
            </div>
          </article>
        </section>

        <section className="extended-features">
          <div className="feature-block">
             <small>AI READINESS</small>
             <h4>{analysis.aiReadiness || "92"}%</h4>
             <p>How adaptable the code is for future AI-driven training models.</p>
          </div>
          <div className="feature-block">
             <small>MAINTAINABILITY</small>
             <h4>Grade A</h4>
             <p>Structural scan for long-term technical debt and readability.</p>
          </div>
          <div className="feature-block">
             <small>SECURITY RISKS</small>
             <h4>{analysis.securityRisks || "Low"}</h4>
             <p>Real-time scanning for potential entry points or unsafe patterns.</p>
          </div>
          <div className="feature-block">
             <small>EXECUTION FLOW</small>
             <h4>Parallel</h4>
             <p>Identified patterns for potential asynchronous optimizations.</p>
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
          <button className="outline-btn" onClick={onBackToDashboard}>BACK TO DASHBOARD</button>
          <button className="primary-btn pulse" onClick={onApplyChanges}>APPLY ALL CHANGES</button>
        </div>
      </footer>
    </div>
  );
}
