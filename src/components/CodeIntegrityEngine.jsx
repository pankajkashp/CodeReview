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
    template: `console.log("CodeSage");`
  },
  {
    id: "python",
    label: "Python",
    fileName: "main.py",
    template: `print("CodeSage")`
  },
  {
    id: "cpp",
    label: "C++",
    fileName: "main.cpp",
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "CodeSage" << endl;
    return 0;
}`
  },
  {
    id: "c",
    label: "C",
    fileName: "main.c",
    template: `#include <stdio.h>

int main() {
    printf("CodeSage\\n");
    return 0;
}`
  },
  {
    id: "java",
    label: "Java",
    fileName: "Main.java",
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("CodeSage");
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
      {status === "loading" && <AnalysisLoader filename={selectedLanguage.fileName} />}

      <section className="engine-workspace">
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
          <main className="engine-main">
            {activePanel === "dashboard" && (
              <>
                <section className="engine-hero">
                  <div>
                    <p>SYSTEM READY</p>
                    <h1><em>Deep</em> Logic Review.</h1>
                    <span>
                      Initialize the neural engine to analyze your code for structural
                      integrity, security vulnerabilities, and logic optimizations.
                    </span>
                  </div>
                  <div className="engine-actions">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange}
                    />
                    <button className="engine-secondary-btn" onClick={handleImportClick}>
                      IMPORT FILE
                    </button>
                    <button
                      className="primary-btn engine-start-btn pulse"
                      onClick={analyzeCode}
                      disabled={status === "loading" || !code.trim()}
                    >
                      <span>{status === "loading" ? "INITIALIZING..." : "START ANALYSIS"}</span>
                    </button>
                  </div>
                </section>

                <section className="engine-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <article className="code-editor">
                    <div className="language-tabs">
                      {languageOptions.map(lang => (
                        <button 
                          key={lang.id}
                          className={selectedLanguage.id === lang.id ? "active" : ""}
                          onClick={() => handleLanguageUpdate(lang)}
                        >
                          {lang.label.toUpperCase()}
                        </button>
                      ))}
                    </div>


                    <div className="editor-toolbar">
                      <strong>{selectedLanguage.fileName}</strong>
                    </div>

                    <div className="code-input-frame" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                        style={{ fontSize: '14px', fontFamily: 'var(--font-main)' }}
                        minHeight="300px"
                      />
                    </div>

                    <footer className="editor-footer">
                      <small>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</small>
                      <button 
                        className="pulse"
                        onClick={analyzeCode} 
                        disabled={status === "loading" || !code.trim()}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          background: 'var(--color-accent-primary)',
                          color: 'var(--color-bg-page)',
                          fontWeight: '900',
                          padding: '0 25px',
                          borderRadius: '4px',
                          height: '36px'
                        }}
                      >
                        {status === "loading" ? (
                          <div className="tire-loader" style={{ width: '14px', height: '14px', border: '2px solid var(--color-border-subtle)', borderTop: '2px solid var(--color-text-primary)', animation: 'tire-spin 1s linear infinite' }}></div>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        )}
                        {status === "loading" ? "ANALYZING..." : "RUN ANALYSIS"}
                      </button>
                    </footer>
                  </article>

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
                </section>
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
