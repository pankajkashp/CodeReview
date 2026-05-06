import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import supabase from "../supabaseClient.js";
import { Analytics } from "./Analytics";
import { UserProfile } from "./UserProfile.jsx";
import { AnalysisLoader } from "./AnalysisLoader.jsx";

const languageOptions = [
  {
    id: "javascript",
    label: "JavaScript",
    fileName: "analysis.js",
    template: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}`
  },
  {
    id: "python",
    label: "Python",
    fileName: "main.py",
    template: `def calculate_total(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total`
  },
  {
    id: "rust",
    label: "Rust",
    fileName: "main.rs",
    template: `fn calculate_total(items: &[Item]) -> f64 {
    items.iter().map(|i| i.price * i.quantity).sum()
}`
  },
  {
    id: "go",
    label: "Go",
    fileName: "main.go",
    template: `func CalculateTotal(items []Item) float64 {
    var total float64
    for _, item := range items {
        total += item.Price * float64(item.Quantity)
    }
    return total
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

  const searchTerm = "";

  const lineRailRef = useRef(null);
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

  // 🛡️ LANGUAGE VALIDATION
  const validateCode = (input, langId) => {
    if (!input.trim()) return true;
    
    // Basic heuristic checks
    if (langId === "javascript" && input.includes("def ") && !input.includes("function")) return false;
    if (langId === "python" && (input.includes("function ") || input.includes("{") && input.includes("}"))) {
      // Python doesn't use braces for blocks generally
      if (!input.includes("def ")) return false;
    }
    if (langId === "rust" && !input.includes("fn ") && (input.includes("function") || input.includes("def "))) return false;
    if (langId === "go" && !input.includes("func ") && (input.includes("def "))) return false;
    
    return true;
  };

  const handleLanguageUpdate = (lang) => {
    setSelectedLanguage(lang);
    setCode(lang.template);
    setError("");
    setStatus("idle");
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (!validateCode(newCode, selectedLanguage.id)) {
      setError(`Language Mismatch: The code looks like it's not ${selectedLanguage.label}. Please switch language or check your code.`);
    } else {
      setError("");
    }
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
            code,
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
      {status === "loading" && <AnalysisLoader />}

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
            onApplyChanges={() => setActivePanel("dashboard")}
            onExit={onBack}
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
                    <button onClick={handleImportClick}>IMPORT FILE</button>
                    <button 
                      className="primary-btn" 
                      onClick={analyzeCode} 
                      disabled={status === "loading" || !code.trim()}
                      style={{ padding: '0 30px', background: 'var(--primary-color)', color: 'var(--bg-deep)' }}
                    >
                      {status === "loading" ? "INITIALIZING..." : "START ANALYSIS"}
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
                      <div>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <strong>{selectedLanguage.fileName}</strong>
                      <em>{selectedLanguage.label}</em>

                    </div>

                    <div className="code-input-frame">
                      <div className="line-rail-wrapper">
                        <div className="line-rail" ref={lineRailRef}>
                          {Array.from({ length: lineCount }, (_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={code}
                        onChange={handleCodeChange}
                        placeholder={`Paste your ${selectedLanguage.label} code here...`}

                        onScroll={(e) => {
                          if (lineRailRef.current) {
                            lineRailRef.current.style.transform = `translateY(-${e.target.scrollTop}px)`;
                          }
                        }}
                      />
                    </div>

                    <footer className="editor-footer">
                      <small>{lineCount} lines</small>
                      <button 
                        className="pulse"
                        onClick={analyzeCode} 
                        disabled={status === "loading" || !code.trim()}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          background: 'var(--primary-color)',
                          color: 'var(--bg-deep)',
                          fontWeight: '900',
                          padding: '0 25px',
                          borderRadius: '4px',
                          height: '36px'
                        }}
                      >
                        {status === "loading" ? (
                          <div className="tire-loader" style={{ width: '14px', height: '14px', border: '2px solid #000', borderTop: '2px solid #fff', animation: 'tire-spin 1s linear infinite' }}></div>
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
                        background: 'var(--primary-glow)', 
                        padding: '4px 12px', 
                        borderRadius: '20px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: 'var(--primary-color)',
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
                        <div className="intel-item error" style={{ borderLeft: '2px solid var(--primary-color)', paddingLeft: '15px' }}>
                          <strong style={{ color: 'var(--primary-color)' }}>System Alert</strong>
                          <p>{error}</p>
                        </div>
                      )}

                      {analysis?.simulated && (
                        <div className="intel-item warn" style={{ borderLeft: '2px solid #8a55ff', paddingLeft: '15px' }}>
                          <strong style={{ color: '#8a55ff' }}>Simulation Active</strong>
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
                  {searchTerm && <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}>FILTERING BY: "{searchTerm}"</span>}
                </div>
                <div className="history-list">
                  {history.filter(h => 
                    h.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (h.result?.summary || "").toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    history
                      .filter(h => 
                        h.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (h.result?.summary || "").toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((h) => (
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
