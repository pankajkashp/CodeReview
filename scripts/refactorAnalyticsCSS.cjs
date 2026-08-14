const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/styles/analytics.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
/* ==========================================================================
   DASHBOARD CLEANUP OVERRIDES
   ========================================================================== */

/* Hero Redesign */
.analytics-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px 20px 20px;
  gap: 40px;
}

.hero-copy {
  flex: 1;
  max-width: 600px;
}

.hero-ai-summary {
  font-size: 1.1rem;
  color: rgba(220, 235, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Actions in Hero */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.primary-button {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(138, 114, 255, 0.15));
  border: 1px solid #00E5FF;
  color: #00E5FF;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.2), inset 0 0 10px rgba(0, 229, 255, 0.1);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
}
.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 35px rgba(0, 229, 255, 0.4), inset 0 0 15px rgba(0, 229, 255, 0.2);
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(138, 114, 255, 0.25));
}
.primary-button.copied {
  border-color: var(--semantic-success);
  color: var(--semantic-success);
  box-shadow: 0 0 20px rgba(0, 230, 118, 0.3);
}

.ghost-button {
  background: rgba(2, 4, 6, 0.5);
  border: 1px solid rgba(74, 109, 156, 0.3);
  color: rgba(220, 235, 255, 0.6);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.2s ease;
  cursor: pointer;
}
.ghost-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(220, 235, 255, 0.9);
}

/* Score Card */
.hero-score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(4, 7, 12, 0.6);
  border: 1px solid rgba(74, 109, 156, 0.3);
  border-radius: 16px;
  padding: 24px;
  min-width: 250px;
}

.score-ring {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(
    var(--score-color, #00E5FF) calc(var(--score) * 1%),
    rgba(255, 255, 255, 0.05) calc(var(--score) * 1%)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}
.score-ring::before {
  content: "";
  position: absolute;
  inset: 10px;
  background: #060913;
  border-radius: 50%;
}
.score-ring-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}
.score-ring-inner span {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(220, 235, 255, 0.5);
  margin-bottom: 4px;
}
.score-ring-inner strong {
  font-size: 3rem;
  font-weight: 800;
  color: var(--score-color, #fff);
  line-height: 1;
}
.score-ring-inner small {
  font-size: 0.75rem;
  color: rgba(220, 235, 255, 0.3);
}

.hero-score-status {
  margin-top: 16px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Metric Cards Refinement */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin: 20px 20px 40px;
}

.metric-card {
  background: rgba(4, 7, 12, 0.6);
  border: 1px solid rgba(74, 109, 156, 0.2);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;
}

.metric-card-primary { border-top: 2px solid #00E5FF; }
.metric-card-warning { border-top: 2px solid var(--semantic-warning, #FF9100); }
.metric-card-info { border-top: 2px solid #00E5FF; }
.metric-card-success { border-top: 2px solid var(--semantic-success, #00E676); }
.metric-card-ai { border-top: 2px solid #8A72FF; }

.metric-card:hover {
  transform: translateY(-2px);
  background: rgba(4, 7, 12, 0.8);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.metric-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(220, 235, 255, 0.5);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.metric-icon {
  color: #8A72FF;
  font-size: 0.8rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
}
.metric-card-ai .metric-value {
  color: #8A72FF;
  font-size: 1rem;
}

.metric-status {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin-top: 4px;
}
.metric-status:contains("EXCELLENT") { color: var(--semantic-success); }
.metric-status:contains("GOOD") { color: #00E5FF; }
.metric-status:contains("NEEDS IMPROVEMENT") { color: var(--semantic-warning); }
.metric-status:contains("CRITICAL") { color: var(--semantic-danger); }

/* Diff Viewer Refinement */
.diff-section {
  margin: 0 20px 40px;
}
.diff-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.diff-pane-header {
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: rgba(10, 15, 25, 0.8);
  border-bottom: 1px solid rgba(74, 109, 156, 0.2);
}
.diff-pane-original .diff-pane-header { color: rgba(255, 82, 82, 0.8); border-top: 2px solid rgba(255, 82, 82, 0.4); }
.diff-pane-optimized .diff-pane-header { color: rgba(0, 230, 118, 0.8); border-top: 2px solid rgba(0, 230, 118, 0.4); }

.diff-pane-body {
  background: #0d1117;
  padding: 16px;
  overflow-x: auto;
}
.diff-pane-original .diff-pane-body { background: rgba(255, 82, 82, 0.02); }
.diff-pane-optimized .diff-pane-body { background: rgba(0, 230, 118, 0.02); }

/* Hide redundant descriptions */
.metric-hint { display: none; }
`;

if (!cssContent.includes('DASHBOARD CLEANUP OVERRIDES')) {
  fs.appendFileSync(cssPath, newCSS);
  console.log("Successfully appended dashboard cleanup CSS to analytics.css.");
} else {
  console.log("Cleanup CSS already exists.");
}
