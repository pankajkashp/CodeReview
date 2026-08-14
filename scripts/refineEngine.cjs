const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../src/components/CodeIntegrityEngine.jsx');
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

// 1. Refine the JSX Structure
const oldUIStart = `<main className="engine-main workspace-main">`;
const oldUIEnd = `{/* 📡 Live Intelligence Horizontal Bar */}`;

const newUI = `<main className="engine-main workspace-main">
            {activePanel === "dashboard" && (
              <>
                <section className="workspace-page-header">
                  <div className="workspace-status-eyebrow">
                    <span>AI CODE ANALYSIS</span>
                    <span className="workspace-status-dot">● SYSTEM READY</span>
                  </div>
                  <h1 className="workspace-headline">
                    <span className="workspace-headline-accent">Deep Logic</span> Review.
                  </h1>
                  <p className="workspace-subtitle">
                    Initialize the neural engine to analyze your code for structural integrity, security vulnerabilities, and logic optimizations.
                  </p>
                </section>

                <div className="workspace-label">SOURCE CODE</div>

                <section className="analysis-workspace">
                  <div className="workspace-editor-header">
                    <div className="weh-left">
                      <span className="weh-dot">●</span>
                      <span className="weh-filename">{selectedLanguage.fileName.toUpperCase()}</span>
                    </div>
                    <div className="weh-center">
                      <span className="weh-language">{selectedLanguage.label.toUpperCase()}</span>
                    </div>
                    <div className="weh-right">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                      />
                      <button className="weh-import-btn" onClick={handleImportClick}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        IMPORT FILE
                      </button>
                    </div>
                  </div>

                  <div className="workspace-tabs-container">
                    <div className="workspace-tabs">
                      {languageOptions.map(lang => (
                        <button 
                          key={lang.id}
                          className={selectedLanguage.id === lang.id ? "workspace-tab active" : "workspace-tab"}
                          onClick={() => handleLanguageUpdate(lang)}
                        >
                          {lang.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="workspace-editor-body">
                    <CodeMirror
                      value={code}
                      theme={vscodeDark}
                      extensions={[
                        selectedLanguage.id === 'javascript' ? javascript({ jsx: true }) :
                        selectedLanguage.id === 'python' ? python() :
                        (selectedLanguage.id === 'cpp' || selectedLanguage.id === 'c') ? cpp() :
                        selectedLanguage.id === 'java' ? java() : javascript()
                      ]}
                      onChange={handleCodeChange}
                      className="workspace-codemirror"
                    />
                  </div>

                  <div className="workspace-editor-footer">
                    <div className="wef-left">
                      <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
                      <span className="wef-separator">|</span>
                      <span>{selectedLanguage.label}</span>
                    </div>
                    <div className="wef-center">
                      <span>UTF-8</span>
                      <span className="wef-separator">|</span>
                      <span>LF</span>
                    </div>
                    <div className="wef-right">
                      <span className="wef-status">● READY</span>
                      
                      <button 
                        className="workspace-analyze-btn"
                        onClick={analyzeCode} 
                        disabled={status === "loading" || !code.trim()}
                      >
                        {status === "loading" ? (
                          <div className="tire-loader" style={{ width: '14px', height: '14px', border: '2px solid rgba(0,229,255,0.3)', borderTop: '2px solid #00E5FF', animation: 'tire-spin 1s linear infinite' }}></div>
                        ) : (
                          <span className="wab-icon">✦</span>
                        )}
                        {status === "loading" ? "ANALYZING..." : "RUN AI ANALYSIS"}
                      </button>

                    </div>
                  </div>
                </section>

                <section className="workspace-actions">
                  <div className="workspace-capabilities">
                    <span className="wcap-item"><span className="wcap-dot wcap-logic">●</span> LOGIC</span>
                    <span className="wcap-item"><span className="wcap-dot wcap-arch">●</span> ARCHITECTURE</span>
                    <span className="wcap-item"><span className="wcap-dot wcap-sec">●</span> SECURITY</span>
                    <span className="wcap-item"><span className="wcap-dot wcap-comp">●</span> COMPLEXITY</span>
                  </div>
                </section>

                `;

const startIdx = jsxContent.indexOf(oldUIStart);
const endIdx = jsxContent.indexOf(oldUIEnd);

if (startIdx !== -1 && endIdx !== -1) {
  jsxContent = jsxContent.substring(0, startIdx) + newUI + jsxContent.substring(endIdx);
  fs.writeFileSync(jsxPath, jsxContent);
  console.log("Successfully updated CodeIntegrityEngine.jsx layout.");
} else {
  console.error("Could not find JSX layout bounds.");
}

// 2. Refine the CSS in global.css
const cssPath = path.join(__dirname, '../src/styles/global.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const refinedCSS = `
/* ==========================================================================
   WORKSPACE REDESIGN (Code Integrity Engine)
   ========================================================================== */

.workspace-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

/* Page Header */
.workspace-page-header {
  text-align: left;
  margin-bottom: 32px;
  width: 100%;
}

.workspace-status-eyebrow {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  font-size: clamp(2.5rem, 5vw, 3.5rem);
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
  font-size: 1rem;
  max-width: 600px;
  margin: 0;
  line-height: 1.6;
}

.workspace-label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0, 229, 255, 0.6);
  font-weight: 800;
  margin-bottom: 12px;
  margin-top: 10px;
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
  margin-bottom: 24px;
  transition: box-shadow 0.3s ease;
}

.analysis-workspace:hover {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 229, 255, 0.08);
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

/* Tabs */
.workspace-tabs-container {
  padding: 12px 20px;
  background: rgba(2, 4, 6, 0.5);
  border-bottom: 1px solid rgba(74, 109, 156, 0.15);
  display: flex;
}

.workspace-tabs {
  display: flex;
  background: rgba(4, 7, 12, 0.8);
  border: 1px solid rgba(74, 109, 156, 0.3);
  border-radius: 8px;
  padding: 4px;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.3), 0 0 15px rgba(0, 229, 255, 0.05);
}

.workspace-tab {
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(220, 235, 255, 0.5);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.workspace-tab:hover {
  color: rgba(220, 235, 255, 0.9);
  background: rgba(255, 255, 255, 0.03);
}

.workspace-tab.active {
  color: #00E5FF;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  background: rgba(0, 229, 255, 0.08);
  box-shadow: inset 0 -2px 0 #00E5FF;
}

/* Editor Body */
.workspace-editor-body {
  flex: 1;
  min-height: 400px;
  background: #0d1117;
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
  padding: 8px 12px 8px 20px;
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
  align-items: flex-start;
  width: 100%;
}

.workspace-analyze-btn {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(138, 114, 255, 0.15));
  border: 1px solid rgba(0, 229, 255, 0.6);
  color: #00E5FF;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.2), inset 0 0 15px rgba(0, 229, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-left: 12px;
}

.workspace-analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
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
  font-size: 0.9rem;
}

/* Capabilities Row */
.workspace-capabilities {
  display: flex;
  gap: 24px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: rgba(220, 235, 255, 0.5);
  flex-wrap: wrap;
  justify-content: flex-start;
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

const cssStartToken = `/* ==========================================================================
   WORKSPACE REDESIGN (Code Integrity Engine)
   ========================================================================== */`;

const startCSSIdx = cssContent.indexOf(cssStartToken);
if (startCSSIdx !== -1) {
  cssContent = cssContent.substring(0, startCSSIdx) + refinedCSS;
  fs.writeFileSync(cssPath, cssContent);
  console.log("Successfully refined workspace CSS in global.css.");
} else {
  console.error("Could not find CSS layout bounds in global.css.");
}
