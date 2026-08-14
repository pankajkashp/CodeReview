import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import supabase from "../supabaseClient.js";
import { Analytics } from "./Analytics";
import { UserProfile } from "./UserProfile.jsx";
import { AnalysisLoader } from "./AnalysisLoader.jsx";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const languageOptions = [
  {
    id: "javascript",
    label: "JavaScript",
    fileName: "analysis.js",
    template: `function analyzeData(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (items[i] === items[j]) {
        console.log(items[i]);
      }
    }
  }
}`
  },
  {
    id: "python",
    label: "Python",
    fileName: "main.py",
    template: `def analyze_data(items):
    for i in range(len(items)):
        for j in range(len(items)):
            if items[i] == items[j]:
                print(items[i])`
  },
  {
    id: "cpp",
    label: "C++",
    fileName: "main.cpp",
    template: `#include <iostream>
#include <vector>

void analyzeData(const std::vector<int>& items) {
    for (size_t i = 0; i < items.size(); i++) {
        for (size_t j = 0; j < items.size(); j++) {
            if (items[i] == items[j]) {
                std::cout << items[i] << std::endl;
            }
        }
    }
}`
  },
  {
    id: "c",
    label: "C",
    fileName: "main.c",
    template: `#include <stdio.h>

void analyze_data(int items[], int size) {
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            if (items[i] == items[j]) {
                printf("%d\\n", items[i]);
            }
        }
    }
}`
  },
  {
    id: "java",
    label: "Java",
    fileName: "Main.java",
    template: `public class Main {
    public static void analyzeData(int[] items) {
        for (int i = 0; i < items.length; i++) {
            for (int j = 0; j < items.length; j++) {
                if (items[i] == items[j]) {
                    System.out.println(items[i]);
                }
            }
        }
    }
}`
  }
];

const defaultLanguage = languageOptions[0];

export function CodeIntegrityEngine({ onBack, user, onLogout }) {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultLanguage.template);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");

  const fileInputRef = useRef(null);

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
  };

  // ✅ FETCH HISTORY
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setHistory(data);
  }, [user]);

  const deleteHistoryRecord = async (e, id) => {
    e.stopPropagation(); // prevent opening the record
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);
      
    if (!error) {
      setHistory(history.filter(h => h.id !== id));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLanguageUpdate = (lang) => {
    setSelectedLanguage(lang);
    setCode(lang.template);
    setError("");
    setStatus("idle");
  };

  const handleCodeChange = (val) => {
    setCode(val);
    setError("");
  };

  // 🚀 ANALYZE FUNCTION
  async function analyzeCode(codeToAnalyze = null) {
    // 🛡️ Fix: Ensure we don't accidentally try to stringify a React event object
    const targetCode = (typeof codeToAnalyze === 'string' && codeToAnalyze) ? codeToAnalyze : code;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: targetCode })
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          `Server did not return JSON (status ${res.status}). ` +
          `Make sure the Express server is running on :3001 with \`npm run server\`, then restart \`npm run dev\` if you changed the proxy. ` +
          `First 120 chars of response: ${raw.slice(0, 120)}`
        );
      }

      if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`);

      // Pass the Gemini response directly — Analytics reads these fields.
      setAnalysis(data);
      setStatus("complete");
      setActivePanel("analytics");

      // ✅ SAVE HISTORY
      if (user) {
        await supabase.from("reviews").insert([
          {
            user_id: user.id,
            code: targetCode,
            result: data
          }
        ]);
        fetchHistory();
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="engine-shell no-sidebar">
      <div className="hero-bg-overlay" style={{ opacity: 0.1, position: 'fixed', zIndex: 0 }}></div>
      {status === "loading" && <AnalysisLoader filename={selectedLanguage.fileName} />}

      <section className="engine-workspace" style={{ position: 'relative', zIndex: 10 }}>
        <header className="engine-topbar">
          <div className="engine-brand">
            <strong>CODE INTEGRITY</strong>
            <span>CORE ENGINE v4.2</span>
          </div>
          <div className="engine-icons" style={{ marginLeft: 'auto' }}>
            <UserProfile 
              user={user} 
              onLogout={onLogout} 
              onBack={onBack}
              setActivePanel={setActivePanel}
              activePanel={activePanel}
            />
          </div>

        </header>

        {activePanel === "analytics" && analysis ? (
          <Analytics
            analysis={analysis}
            originalCode={code}
            onExit={onBack}
            loading={status === "loading"}
            onAnalyze={(newCode) => {
              setCode(newCode);
              analyzeCode(newCode);
            }}
            onBackToDashboard={() => setActivePanel("dashboard")}
          />
        ) : (
          <main className="engine-main workspace-main">
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

                {/* 📡 Live Intelligence Horizontal Bar */}
                  <article className="live-panel horizontal-intelligence" style={{ gridColumn: '1 / -1', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ margin: 0 }}>Live Intelligence</h2>
                      <div className="engine-status-badge" style={{ 
                         
                        padding: '4px 12px', 
                        borderRadius: '20px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: 'var(--color-accent-primary)',
                        letterSpacing: '1px'
                      }}>
                        {status.toUpperCase()}
                      </div>
                    </div>

                    <div className="intelligence-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                      <div className="intel-item">
                        <strong>Engine Status</strong>
                        <p className={status === "loading" ? "pulse-text" : "muted"}>
                          {status === "loading" ? "Neural analysis in progress..." : "Standing by for input..."}
                        </p>
                      </div>

                      {error && (
                        <div className="intel-item error" style={{ borderLeft: '2px solid var(--color-accent-primary)', paddingLeft: '15px' }}>
                          <strong style={{ color: 'var(--color-accent-primary)' }}>System Alert</strong>
                          <p>{error}</p>
                        </div>
                      )}

                      {analysis?.simulated && (
                        <div className="intel-item warn" style={{ borderLeft: '2px solid var(--color-status-warning)', paddingLeft: '15px' }}>
                          <strong style={{ color: 'var(--color-status-warning)' }}>Simulation Active</strong>
                          <p>Results are simulated due to offline mode.</p>
                        </div>
                      )}

                      {!error && status === "idle" && (
                        <div className="intel-item">
                          <strong>Readiness</strong>
                          <p>Neural core synchronized. Ready for code input.</p>
                        </div>
                      )}
                    </div>
                  </article>
              </>
            )}

            {activePanel === "history" && (
              <section className="history-panel" style={{ animation: 'fadeIn 0.4s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ margin: 0 }}>Review History</h2>
                </div>
                <div className="history-list">
                  {history.length > 0 ? (
                    history.map((h) => (
                      <article 
                        key={h.id} 
                        className="history-card"
                        style={{ cursor: 'pointer', position: 'relative' }} 
                        onClick={() => {
                          setAnalysis(h.result);
                          setCode(h.code);
                          setActivePanel("analytics");
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span>{new Date(h.created_at).toLocaleDateString()}</span>
                            <h3>Review Pulse #{h.id.slice(0, 4)}</h3>
                            <p>Code integrity score: {h.result?.score || "N/A"}</p>
                          </div>
                          <button 
                            onClick={(e) => deleteHistoryRecord(e, h.id)}
                            className="history-delete-btn"
                            title="Delete Record"
                          >
                            ✕
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="history-empty">No matching records found.</p>
                  )}
                </div>
              </section>
            )}
          </main>
        )}
      </section>
    </div>
  );
}
