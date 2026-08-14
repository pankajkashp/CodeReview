const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/styles/global.css');
let content = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
/* ==========================================================================
   WORKSPACE REDESIGN (Code Integrity Engine)
   ========================================================================== */

.workspace-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

/* Page Header */
.workspace-page-header {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

.workspace-status-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.workspace-status-dot {
  color: #00E5FF;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
  background: rgba(0, 229, 255, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.workspace-headline {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.workspace-headline-accent {
  color: #8A72FF;
  text-shadow: 0 0 25px rgba(138, 114, 255, 0.5);
}

.workspace-subtitle {
  color: rgba(220, 235, 255, 0.6);
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Workspace Container */
.analysis-workspace {
  width: 100%;
  background: rgba(4, 7, 12, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(74, 109, 156, 0.4);
  border-top: 2px solid rgba(0, 229, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 229, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 30px;
  transition: box-shadow 0.3s ease;
}

.analysis-workspace:hover {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 229, 255, 0.08);
}

/* Tabs */
.workspace-tabs {
  display: flex;
  background: rgba(2, 4, 6, 0.8);
  border-bottom: 1px solid rgba(74, 109, 156, 0.2);
  padding: 0 16px;
  overflow-x: auto;
}

.workspace-tab {
  background: transparent;
  border: none;
  color: rgba(220, 235, 255, 0.5);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 16px 20px;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.workspace-tab:hover {
  color: rgba(220, 235, 255, 0.9);
}

.workspace-tab.active {
  color: #00E5FF;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
}

.workspace-tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #00E5FF;
  box-shadow: 0 -2px 10px rgba(0, 229, 255, 0.6);
}

/* Editor Header */
.workspace-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(10, 15, 25, 0.4);
  border-bottom: 1px solid rgba(74, 109, 156, 0.15);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
}

.weh-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(220, 235, 255, 0.9);
  font-weight: 700;
}

.weh-dot {
  color: #8A72FF;
  font-size: 0.6rem;
}

.weh-center {
  color: rgba(220, 235, 255, 0.4);
  font-weight: 600;
}

.weh-right {
  display: flex;
}

.weh-import-btn {
  background: transparent;
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: rgba(0, 229, 255, 0.8);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.weh-import-btn:hover {
  background: rgba(0, 229, 255, 0.1);
  border-color: #00E5FF;
  color: #00E5FF;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
}

/* Editor Body */
.workspace-editor-body {
  flex: 1;
  min-height: 400px;
  background: #0d1117; /* GitHub Dark style or similar deep dark */
}

.workspace-codemirror .cm-editor {
  height: 400px;
}

.workspace-codemirror .cm-scroller {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.6;
}

/* Editor Footer */
.workspace-editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background: rgba(2, 4, 6, 0.8);
  border-top: 1px solid rgba(74, 109, 156, 0.2);
  font-size: 0.65rem;
  color: rgba(220, 235, 255, 0.5);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.wef-left, .wef-center, .wef-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wef-separator {
  opacity: 0.3;
}

.wef-status {
  color: #00E676;
}

/* Actions Section */
.workspace-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.workspace-action-hint {
  font-size: 0.85rem;
  color: rgba(220, 235, 255, 0.6);
  margin-bottom: 20px;
  text-align: center;
}

.workspace-analyze-btn {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(138, 114, 255, 0.15));
  border: 1px solid rgba(0, 229, 255, 0.6);
  color: #00E5FF;
  border-radius: 12px;
  padding: 16px 40px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.2), inset 0 0 15px rgba(0, 229, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.workspace-analyze-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(138, 114, 255, 0.25));
  box-shadow: 0 0 45px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.2);
  border-color: #00E5FF;
}

.workspace-analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.wab-icon {
  font-size: 1.2rem;
}

/* Capabilities Row */
.workspace-capabilities {
  display: flex;
  gap: 24px;
  margin-top: 40px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: rgba(220, 235, 255, 0.5);
  flex-wrap: wrap;
  justify-content: center;
}

.wcap-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wcap-dot { font-size: 0.8rem; }
.wcap-logic { color: #00E5FF; text-shadow: 0 0 8px #00E5FF; }
.wcap-arch { color: #8A72FF; text-shadow: 0 0 8px #8A72FF; }
.wcap-sec { color: #FF9100; text-shadow: 0 0 8px #FF9100; }
.wcap-comp { color: #00E676; text-shadow: 0 0 8px #00E676; }

/* Responsive */
@media (max-width: 768px) {
  .workspace-headline {
    font-size: 2rem;
  }
  
  .workspace-editor-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .weh-center {
    display: none;
  }
  
  .workspace-capabilities {
    gap: 16px;
  }
}
`;

if (!content.includes('WORKSPACE REDESIGN')) {
  fs.appendFileSync(cssPath, newCSS);
  console.log("Successfully appended workspace CSS to global.css.");
} else {
  console.log("Workspace CSS already exists in global.css.");
}
