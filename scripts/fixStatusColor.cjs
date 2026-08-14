const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../src/components/analysis/AnalysisSections.jsx');
let content = fs.readFileSync(jsxPath, 'utf8');

// Update MetricCard to accept and use statusColor
const oldMetricCard = `function MetricCard({ label, value, status, accent = "primary", icon }) {
  return (
    <article className={\`metric-card metric-card-\${accent}\`}>
      <span className="metric-label">{icon && <span className="metric-icon">{icon}</span>}{label}</span>
      <strong className="metric-value">{value}</strong>
      {status && <span className="metric-status">{status}</span>}
    </article>
  );
}`;

const newMetricCard = `function MetricCard({ label, value, status, statusColor, accent = "primary", icon }) {
  return (
    <article className={\`metric-card metric-card-\${accent}\`}>
      <span className="metric-label">{icon && <span className="metric-icon">{icon}</span>}{label}</span>
      <strong className="metric-value">{value}</strong>
      {status && <span className="metric-status" style={{ color: statusColor }}>{status}</span>}
    </article>
  );
}`;
content = content.replace(oldMetricCard, newMetricCard);

// Update SummaryStrip to pass statusColor
const getComplexityStatus = `const getComplexityStatus = (complexity) => {
    if (!complexity) return { label: "", color: "" };
    const c = complexity.toLowerCase();
    if (c.includes("1") || c.includes("log")) return { label: "EXCELLENT", color: "var(--semantic-success)" };
    if (c.includes("n") && !c.includes("^2")) return { label: "GOOD", color: "#00E5FF" };
    if (c.includes("^2") || c.includes("^3")) return { label: "NEEDS IMPROVEMENT", color: "var(--semantic-warning)" };
    return { label: "CRITICAL", color: "var(--semantic-danger)" };
  };`;

const getScoreStatus = `const getScoreStatus = (score) => {
    if (score >= 90) return { label: "EXCELLENT", color: "var(--semantic-success)" };
    if (score >= 75) return { label: "GOOD", color: "#00E5FF" };
    if (score >= 50) return { label: "NEEDS IMPROVEMENT", color: "var(--semantic-warning)" };
    return { label: "CRITICAL", color: "var(--semantic-danger)" };
  };`;

// Replace the old status functions with the new ones returning objects
content = content.replace(/const getComplexityStatus = [\s\S]*?};/, getComplexityStatus);
content = content.replace(/const getScoreStatus = [\s\S]*?};/, getScoreStatus);

// Now update the MetricCard usages
content = content.replace(/status={getScoreStatus\(model\.score \|\| 0\)}/g, 'status={getScoreStatus(model.score || 0).label} statusColor={getScoreStatus(model.score || 0).color}');
content = content.replace(/status={getComplexityStatus\(model\.timeComplexity\)}/g, 'status={getComplexityStatus(model.timeComplexity).label} statusColor={getComplexityStatus(model.timeComplexity).color}');
content = content.replace(/status={getComplexityStatus\(model\.spaceComplexity\)}/g, 'status={getComplexityStatus(model.spaceComplexity).label} statusColor={getComplexityStatus(model.spaceComplexity).color}');
content = content.replace(/status={getScoreStatus\(model\.readabilityScore \|\| 0\)}/g, 'status={getScoreStatus(model.readabilityScore || 0).label} statusColor={getScoreStatus(model.readabilityScore || 0).color}');
content = content.replace(/status={getScoreStatus\(model\.maintainabilityScore \|\| 0\)}/g, 'status={getScoreStatus(model.maintainabilityScore || 0).label} statusColor={getScoreStatus(model.maintainabilityScore || 0).color}');

fs.writeFileSync(jsxPath, content);
console.log("Fixed status color in AnalysisSections.jsx");
