const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../src/components/Analytics.jsx');
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

// Replace the return statement
const oldReturnStart = `  return (`;
const newReturn = `  const getScoreStatus = (score) => {
    if (score >= 90) return { label: "EXCELLENT", color: "var(--semantic-success)" };
    if (score >= 75) return { label: "GOOD", color: "var(--color-accent-primary)" };
    if (score >= 50) return { label: "NEEDS IMPROVEMENT", color: "var(--semantic-warning)" };
    return { label: "CRITICAL", color: "var(--semantic-danger)" };
  };
  const scoreStatus = getScoreStatus(model.score || 0);

  return (
    <div className="analytics-view">
      <div className="analytics-backdrop" aria-hidden="true">
        <span className="backdrop-orb backdrop-orb-a" />
        <span className="backdrop-orb backdrop-orb-b" />
        <span className="backdrop-grid" />
      </div>

      <main className="analytics-shell">
        <header className="analytics-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="hero-badge">
                <i />
                AI REVIEW COMPLETE
              </span>
            </div>

            <h1>
              Actionable review for <span>smarter refactors</span>.
            </h1>

            <p className="hero-ai-summary">
              {model.summaryText}
            </p>

            <div className="hero-actions">
              <button type="button" className="ghost-button" onClick={onBackToDashboard}>
                BACK TO DASHBOARD
              </button>
              <button 
                type="button" 
                className={\`primary-button \${copyState === "Optimized copied" ? "copied" : ""}\`} 
                onClick={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
              >
                {copyState === "Optimized copied" ? "COPIED!" : "COPY OPTIMIZED CODE"}
              </button>
            </div>
          </div>

          <div className="hero-score-card">
            <div 
              className="score-ring" 
              style={{ 
                "--score": model.score,
                "--score-color": scoreStatus.color
              }}
            >
              <div className="score-ring-inner">
                <span>OVERALL SCORE</span>
                <strong>{model.score || "—"}</strong>
                <small>/ 100</small>
              </div>
            </div>
            <div className="hero-score-status" style={{ color: scoreStatus.color }}>
              {scoreStatus.label}
            </div>
          </div>
        </header>

        <SummaryStrip model={model} />

        <CodeDiffViewer
          model={model}
          copyState={copyState}
          onCopyOriginal={() => copyToClipboard(originalCode, "Original copied")}
          onCopyOptimized={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
        />
      </main>
    </div>
  );`;

const returnIdx = jsxContent.indexOf(oldReturnStart);
const fileEnd = jsxContent.lastIndexOf('}');
if (returnIdx !== -1) {
  jsxContent = jsxContent.substring(0, returnIdx) + newReturn + "\n}\n";
  fs.writeFileSync(jsxPath, jsxContent);
  console.log("Successfully refactored Analytics.jsx.");
} else {
  console.error("Could not find return block in Analytics.jsx.");
}
