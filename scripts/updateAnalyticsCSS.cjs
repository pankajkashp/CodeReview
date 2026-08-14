const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/styles/analytics.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Add Semantic Variables
css = css.replace(
  /\.analytics-view\s*{([\s\S]*?)color:\s*var\(--text\);/,
  `.analytics-view {
  --semantic-primary: #00E5FF;
  --semantic-ai: #8A72FF;
  --semantic-success: #00E676;
  --semantic-warning: #FF9100;
  --semantic-danger: #FF1744;
  --semantic-info: #18FFFF;

  --primary: var(--semantic-primary);
  --primary-2: #00B8D4;
  --accent: var(--semantic-ai);
  --accent-2: #B388FF;
  --danger: var(--semantic-danger);
  --panel: rgba(4, 7, 12, 0.6);
  --panel-strong: rgba(4, 7, 12, 0.85);
  --line: rgba(74, 109, 156, 0.3);
  --line-strong: rgba(74, 109, 156, 0.6);
  --text: var(--color-text-primary);
  --muted: rgba(220, 235, 255, 0.7);
  --shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
  --soft-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);

  color: var(--text);`
);

// 2. .hero-copy (Review Summary)
css = css.replace(
  /\.hero-copy\s*{([\s\S]*?)min-width:\s*0;\n}/,
  `.hero-copy {
  background: var(--panel);
  border-top: 1px solid var(--semantic-ai);
  border-radius: 28px;
  padding: 30px;
  position: relative;
  overflow: hidden;
  min-width: 0;
  box-shadow: 0 0 40px rgba(138, 114, 255, 0.1);
}`
);

// .hero-copy h1 span
css = css.replace(
  /\.hero-copy h1 span\s*{([\s\S]*?)}/,
  `.hero-copy h1 span {
  color: var(--semantic-ai);
  text-shadow: 0 0 12px rgba(138, 114, 255, 0.5);
}`
);

// 3. .hero-score-card
css = css.replace(
  /\.hero-score-card\s*{([\s\S]*?)min-width:\s*0;\n}/,
  `.hero-score-card {
  background: var(--panel);
  border: 1px solid var(--semantic-info);
  border-radius: 28px;
  display: grid;
  gap: 18px;
  padding: 24px;
  place-items: center;
  min-width: 0;
  box-shadow: 0 0 60px rgba(24, 255, 255, 0.08);
}`
);

// .score-ring
css = css.replace(
  /\.score-ring\s*{([\s\S]*?)animation: floatRing 7s ease-in-out infinite;\n}/,
  `.score-ring {
  align-items: center;
  border-radius: 999px;
  display: grid;
  height: 260px;
  padding: 14px;
  place-items: center;
  position: relative;
  width: 260px;
  animation: floatRing 7s ease-in-out infinite;
  background: conic-gradient(
    from 0deg,
    var(--score-color, var(--semantic-primary)) calc(var(--score) * 1%),
    rgba(255, 255, 255, 0.05) 0
  );
  box-shadow: 0 0 30px var(--score-color, var(--semantic-primary));
}`
);

// .score-ring::before
css = css.replace(
  /\.score-ring::before\s*{([\s\S]*?)position:\s*absolute;\n}/,
  `.score-ring::before {
  content: "";
  inset: 14px;
  border-radius: inherit;
  background: var(--panel-strong);
  position: absolute;
}`
);

// 4. Metric Cards
css = css.replace(
  /\.metric-card\s*{([\s\S]*?)transition:([^\n]+);\n}/,
  `.metric-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 22px;
  overflow: hidden;
  padding: 18px 18px 20px;
  position: relative;
  transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
}`
);

css = css.replace(
  /\.metric-card:hover\s*{([\s\S]*?)}/,
  `.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}`
);

// Replace semantic metric accents
css = css.replace(
  /\.metric-card-primary\s*{[\s\S]*?\.metric-card-neutral\s*{[\s\S]*?}/,
  `.metric-card-primary { border-top: 1px solid var(--semantic-primary); }
.metric-card-primary:hover { box-shadow: 0 10px 40px rgba(0, 229, 255, 0.15); border-top-color: #00FFFF; }

.metric-card-ai { border-top: 1px solid var(--semantic-ai); }
.metric-card-ai:hover { box-shadow: 0 10px 40px rgba(138, 114, 255, 0.15); border-top-color: #A48EFF; }

.metric-card-warning { border-top: 1px solid var(--semantic-warning); }
.metric-card-warning:hover { box-shadow: 0 10px 40px rgba(255, 145, 0, 0.15); border-top-color: #FFAB40; }

.metric-card-info { border-top: 1px solid var(--semantic-info); }
.metric-card-info:hover { box-shadow: 0 10px 40px rgba(24, 255, 255, 0.15); border-top-color: #84FFFF; }

.metric-card-success { border-top: 1px solid var(--semantic-success); }
.metric-card-success:hover { box-shadow: 0 10px 40px rgba(0, 230, 118, 0.15); border-top-color: #69F0AE; }

.metric-card-primary .metric-value { color: var(--semantic-primary); text-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }
.metric-card-ai .metric-value { color: var(--semantic-ai); text-shadow: 0 0 10px rgba(138, 114, 255, 0.3); }
.metric-card-warning .metric-value { color: var(--semantic-warning); text-shadow: 0 0 10px rgba(255, 145, 0, 0.3); }
.metric-card-info .metric-value { color: var(--semantic-info); text-shadow: 0 0 10px rgba(24, 255, 255, 0.3); }
.metric-card-success .metric-value { color: var(--semantic-success); text-shadow: 0 0 10px rgba(0, 230, 118, 0.3); }`
);

// 5. Code Comparison Workspace
css = css.replace(
  /\.diff-pane\s*{([\s\S]*?)min-width:\s*0;\n}/,
  `.diff-pane {
  background: rgba(2, 4, 6, 0.85);
  border: 1px solid var(--line);
  border-top: 2px solid var(--semantic-info);
  border-radius: 22px;
  overflow: hidden;
  min-width: 0;
}`
);

css = css.replace(
  /\.code-row-removed \.code-line-content\s*{([\s\S]*?)}/,
  `.code-row-removed .code-line-content {
  background: rgba(255, 23, 68, 0.1);
  color: var(--semantic-danger);
  text-decoration: none;
}`
);

css = css.replace(
  /\.code-row-added \.code-line-content\s*{([\s\S]*?)}/,
  `.code-row-added .code-line-content {
  background: rgba(0, 230, 118, 0.1);
  color: var(--semantic-success);
}`
);

// 6. Buttons
css = css.replace(
  /\.primary-button\s*{\s*\n\s*border:\s*1px solid var\(--color-border-subtle\);\n\s*color:\s*var\(--color-text-primary\);\n\s*\n\s*}/,
  `.primary-button {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(138, 114, 255, 0.1));
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: #00E5FF;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
}
.primary-button:hover {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(138, 114, 255, 0.2));
  border-color: #00E5FF;
  box-shadow: 0 0 25px rgba(0, 229, 255, 0.4);
}`
);

css = css.replace(
  /\.ghost-button\s*{\s*background:\s*var\(--color-bg-surface-raised\);\s*border:\s*1px solid var\(--line\);\s*color:\s*var\(--text\);\s*}/,
  `.ghost-button {
  background: var(--panel);
  border: 1px solid var(--semantic-info);
  color: var(--semantic-info);
}
.ghost-button:hover {
  background: rgba(24, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(24, 255, 255, 0.2);
}`
);


// 7. Typography
css = css.replace(
  /\.summary-eyebrow\s*{([\s\S]*?)text-transform:\s*uppercase;\n}/,
  `.summary-eyebrow {
  color: var(--semantic-ai);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}`
);

fs.writeFileSync(cssPath, css);
console.log("analytics.css successfully updated.");
