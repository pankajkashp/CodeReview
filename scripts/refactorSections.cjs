const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../src/components/analysis/AnalysisSections.jsx');
let content = fs.readFileSync(jsxPath, 'utf8');

// 1. Refactor MetricCard
const oldMetricCard = `function MetricCard({ label, value, hint, accent = "primary", size = "md" }) {
  return (
    <article className={\`metric-card metric-card-\${accent} metric-card-\${size}\`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </article>
  );
}`;

const newMetricCard = `function MetricCard({ label, value, status, accent = "primary", icon }) {
  return (
    <article className={\`metric-card metric-card-\${accent}\`}>
      <span className="metric-label">{icon && <span className="metric-icon">{icon}</span>}{label}</span>
      <strong className="metric-value">{value}</strong>
      {status && <span className="metric-status">{status}</span>}
    </article>
  );
}`;
content = content.replace(oldMetricCard, newMetricCard);

// 2. Refactor SummaryStrip
const oldSummaryStripRegex = /function SummaryStrip.*?\{[\s\S]*?\}\n\n/m;
const newSummaryStrip = `function SummaryStrip({ model }) {
  const getComplexityStatus = (complexity) => {
    if (!complexity) return "";
    const c = complexity.toLowerCase();
    if (c.includes("1") || c.includes("log")) return "EXCELLENT";
    if (c.includes("n") && !c.includes("^2")) return "GOOD";
    if (c.includes("^2") || c.includes("^3")) return "NEEDS IMPROVEMENT";
    return "CRITICAL";
  };
  const getScoreStatus = (score) => {
    if (score >= 90) return "EXCELLENT";
    if (score >= 75) return "GOOD";
    if (score >= 50) return "NEEDS IMPROVEMENT";
    return "CRITICAL";
  };

  return (
    <div className="summary-grid">
      <MetricCard
        label="OVERALL SCORE"
        value={model.score || "—"}
        status={getScoreStatus(model.score || 0)}
        accent="primary"
      />
      <MetricCard
        label="TIME COMPLEXITY"
        value={model.timeComplexity || "Unknown"}
        status={getComplexityStatus(model.timeComplexity)}
        accent="warning"
      />
      <MetricCard
        label="SPACE COMPLEXITY"
        value={model.spaceComplexity || "Unknown"}
        status={getComplexityStatus(model.spaceComplexity)}
        accent="info"
      />
      <MetricCard
        label="READABILITY"
        value={model.readabilityScore || "—"}
        status={getScoreStatus(model.readabilityScore || 0)}
        accent="success"
      />
      <MetricCard
        label="MAINTAINABILITY"
        value={model.maintainabilityScore || "—"}
        status={getScoreStatus(model.maintainabilityScore || 0)}
        accent="success"
      />
      <MetricCard
        label="PATTERN DETECTED"
        value={model.pattern.title}
        icon="✦ "
        accent="ai"
      />
    </div>
  );
}

`;
// Replace carefully using indexOf since regex might fail across many lines
const startSummaryIdx = content.indexOf('function SummaryStrip({ model }) {');
if (startSummaryIdx !== -1) {
  const endSummaryIdx = content.indexOf('function ReanalyzePanel', startSummaryIdx);
  if (endSummaryIdx !== -1) {
    content = content.substring(0, startSummaryIdx) + newSummaryStrip + content.substring(endSummaryIdx);
  }
}

// 3. Refactor CodeDiffViewer header
const oldDiffShellRegex = /<SectionShell[\s\S]*?className="diff-section"[\s\S]*?>/;
const newDiffShell = `<SectionShell
      eyebrow="CODE COMPARISON"
      title="BEFORE VS AFTER"
      description="See exactly what CodeSage recommends changing."
      className="diff-section"
    >`;
content = content.replace(oldDiffShellRegex, newDiffShell);

fs.writeFileSync(jsxPath, content);
console.log("Successfully refactored AnalysisSections.jsx.");
