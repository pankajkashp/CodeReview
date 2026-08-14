const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../src/components/CodeIntegrityEngine.jsx');
let content = fs.readFileSync(jsxPath, 'utf8');

// 1. Replace languageOptions
const newLanguageOptions = `const languageOptions = [
  {
    id: "javascript",
    label: "JavaScript",
    fileName: "analysis.js",
    template: \`function analyzeData(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (items[i] === items[j]) {
        console.log(items[i]);
      }
    }
  }
}\`
  },
  {
    id: "python",
    label: "Python",
    fileName: "main.py",
    template: \`def analyze_data(items):
    for i in range(len(items)):
        for j in range(len(items)):
            if items[i] == items[j]:
                print(items[i])\`
  },
  {
    id: "cpp",
    label: "C++",
    fileName: "main.cpp",
    template: \`#include <iostream>
#include <vector>

void analyzeData(const std::vector<int>& items) {
    for (size_t i = 0; i < items.size(); i++) {
        for (size_t j = 0; j < items.size(); j++) {
            if (items[i] == items[j]) {
                std::cout << items[i] << std::endl;
            }
        }
    }
}\`
  },
  {
    id: "c",
    label: "C",
    fileName: "main.c",
    template: \`#include <stdio.h>

void analyze_data(int items[], int size) {
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            if (items[i] == items[j]) {
                printf("%d\\\\n", items[i]);
            }
        }
    }
}\`
  },
  {
    id: "java",
    label: "Java",
    fileName: "Main.java",
    template: \`public class Main {
    public static void analyzeData(int[] items) {
        for (int i = 0; i < items.length; i++) {
            for (int j = 0; j < items.length; j++) {
                if (items[i] == items[j]) {
                    System.out.println(items[i]);
                }
            }
        }
    }
}\`
  }
];`;

content = content.replace(/const languageOptions = \[[\s\S]*?\];/, newLanguageOptions);

// 2. Replace the main dashboard UI
const oldUIStart = `<main className="engine-main">`;
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

                <section className="analysis-workspace">
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
                    </div>
                  </div>
                </section>

                <section className="workspace-actions">
                  <p className="workspace-action-hint">Ready to analyze your source code for complexity, architecture, security, and optimization.</p>
                  <button 
                    className="workspace-analyze-btn"
                    onClick={analyzeCode} 
                    disabled={status === "loading" || !code.trim()}
                  >
                    {status === "loading" ? (
                      <div className="tire-loader" style={{ width: '16px', height: '16px', border: '2px solid rgba(0,229,255,0.3)', borderTop: '2px solid #00E5FF', animation: 'tire-spin 1s linear infinite' }}></div>
                    ) : (
                      <span className="wab-icon">✦</span>
                    )}
                    {status === "loading" ? "ANALYZING..." : "RUN AI ANALYSIS"}
                  </button>

                  <div className="workspace-capabilities">
                    <span className="wcap-item"><span className="wcap-dot wcap-logic">●</span> LOGIC</span>
                    <span className="wcap-item"><span className="wcap-dot wcap-arch">●</span> ARCHITECTURE</span>
                    <span className="wcap-item"><span className="wcap-dot wcap-sec">●</span> SECURITY</span>
                    <span className="wcap-item"><span className="wcap-dot wcap-comp">●</span> COMPLEXITY</span>
                  </div>
                </section>

                `;

const startIdx = content.indexOf(oldUIStart);
const endIdx = content.indexOf(oldUIEnd);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newUI + content.substring(endIdx);
  fs.writeFileSync(jsxPath, content);
  console.log("Successfully updated CodeIntegrityEngine.jsx layout.");
} else {
  console.error("Could not find layout bounds.");
}
