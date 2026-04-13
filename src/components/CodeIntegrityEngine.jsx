import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabaseclient.js";
import { Analytics } from "./Analytics";
import { UserProfile } from "./UserProfile.jsx";

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
  }
];

const defaultLanguage = languageOptions[0];

export function CodeIntegrityEngine({ onBack, user, onLogout }) {
  const [code, setCode] = useState(defaultLanguage.template);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");

  const lineRailRef = useRef(null);

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  // ✅ FETCH HISTORY
  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setHistory(data || []);
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // 🚀 ANALYZE FUNCTION
  async function analyzeCode() {
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // 🔥 MAP DATA TO UI FORMAT
      const formatted = {
        summary: "Analysis Complete",
        language: "Detected",
        complexityScore: data.score || 80,
        findings: Array.isArray(data.errors) ? data.errors?.map((e) => ({
          title: e,
          detail: e,
          severity: "warning"
        })) : [],
        optimizations: data.optimization || [],
        improvedCode: data.improvedCode || "",
        simulated: data.simulated || false
      };

      setAnalysis(formatted);
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
    <div className="engine-shell">
      <aside className="engine-sidebar">
        <button className="engine-logo" onClick={() => setActivePanel("dashboard")}>
          SAGE <small>v4.2</small>
        </button>

        <nav>
          <button
            className={activePanel === "dashboard" ? "active" : ""}
            onClick={() => setActivePanel("dashboard")}
          >
            <div className="dashboard-icon">
              <span></span><span></span><span></span><span></span>
            </div>
            <span className="nav-label">Dashboard</span>
          </button>
          <button
            className={activePanel === "history" ? "active" : ""}
            onClick={() => setActivePanel("history")}
          >
            <svg className="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="nav-label">History</span>
          </button>
        </nav>

        <button className="engine-back" onClick={onBack}>
          <svg className="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7 7l-7-7 7-7" />
          </svg>
          <span className="nav-label">Exit Engine</span>
        </button>
      </aside>

      <section className="engine-workspace">
        <header className="engine-topbar">
          <div className="engine-brand">
            <strong>CODE INTEGRITY</strong>
            <span>CORE ENGINE v4.2</span>
          </div>
          <div className="engine-search">
            <span>/</span>
            <input type="text" placeholder="Search commands or files..." />
          </div>
          <div className="engine-icons">
            <span style={{ marginRight: '15px' }}>?</span>
            <UserProfile user={user} onLogout={onLogout} />
          </div>
        </header>

        {activePanel === "analytics" && analysis ? (
          <Analytics
            analysis={analysis}
            originalCode={code}
            onApplyChanges={() => setActivePanel("dashboard")}
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
                    <button>IMPORT FILE</button>
                    <button>SETTINGS</button>
                  </div>
                </section>

                <section className="engine-grid">
                  <article className="code-editor">
                    <div className="language-tabs">
                      <button className="active">JAVASCRIPT</button>
                      <button>PYTHON</button>
                      <button>RUST</button>
                      <button>GO</button>
                    </div>

                    <div className="editor-toolbar">
                      <div>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <strong>analysis.js</strong>
                      <em>Read Only</em>
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
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your code here..."
                        onScroll={(e) => {
                          if (lineRailRef.current) {
                            lineRailRef.current.style.transform = `translateY(-${e.target.scrollTop}px)`;
                          }
                        }}
                      />
                    </div>

                    <footer className="editor-footer">
                      <small>{lineCount} lines</small>
                      <button onClick={analyzeCode} disabled={status === "loading"}>
                        {status === "loading" ? "Processing..." : "Analyze Code"}
                      </button>
                    </footer>
                  </article>

                  <aside className="engine-panel-stack">
                    <article className="live-panel">
                      <h2>Live Intelligence</h2>

                      <div>
                        <strong>Engine Status</strong>
                        <p className={status === "loading" ? "" : "muted"}>
                          {status === "loading" ? "Neural analysis in progress..." : "Standing by for input..."}
                        </p>
                      </div>

                      {error && (
                        <div className="analysis-error">
                          <strong>Connection Error</strong>
                          <p>{error}</p>
                        </div>
                      )}

                      {analysis?.simulated && (
                        <div className="analysis-notice">
                          <strong>Simulation Active</strong>
                          <p>Running in offline mode due to API configuration issues. Results are simulated.</p>
                        </div>
                      )}

                      {!error && status === "idle" && (
                        <div>
                          <strong>Ready</strong>
                          <p>Upload or paste code to begin.</p>
                        </div>
                      )}
                    </article>

                    <article className="model-panel">
                      <div className="model-orbit">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div>
                        <h2>K-Core v4.2</h2>
                        <p>ACTIVE MODEL</p>
                      </div>
                    </article>
                  </aside>
                </section>
              </>
            )}

            {activePanel === "history" && (
              <section className="history-panel">
                <h2>Analysis History</h2>
                <div className="history-list">
                  {history.length > 0 ? (
                    history.map((h) => (
                      <article key={h.id}>
                        <span>{new Date(h.created_at).toLocaleDateString()}</span>
                        <h3>Review Pulse #{h.id.slice(0, 4)}</h3>
                        <p>Code integrity score: {h.result?.score || "N/A"}</p>
                      </article>
                    ))
                  ) : (
                    <p>No history found for this user.</p>
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