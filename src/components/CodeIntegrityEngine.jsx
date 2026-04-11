import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { Analytics } from "./Analytics";

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
    fileName: "analysis.py",
    template: `def calculate_total(items):
    total = 0
    for item in items:
        total += item["price"] * item["quantity"]
    return total`
  },
  {
    id: "java",
    label: "Java",
    fileName: "Analysis.java",
    template: `public class Analysis {
    public static int calculateTotal(Item[] items) {
        int total = 0;
        for (Item item : items) {
            total += item.price * item.quantity;
        }
        return total;
    }
}`
  },
  {
    id: "cpp",
    label: "C++",
    fileName: "analysis.cpp",
    template: `#include <vector>
struct Item { int price; int quantity; };
int calculateTotal(const std::vector<Item>& items) {
    int total = 0;
    for (const Item& item : items) {
        total += item.price * item.quantity;
    }
    return total;
}`
  }
];

const defaultLanguage = languageOptions[0];

const emptyAnalysis = {
  summary: "Paste code and run analysis to generate live findings.",
  language: "Waiting",
  complexityScore: 0,
  bugRisk: 0,
  maintainability: 0,
  securityScore: 0,
  findings: [],
  optimizations: [],
  improvedCode: ""
};

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export function CodeIntegrityEngine({ onBack, user }) {

  // ✅ ALL STATES INSIDE COMPONENT
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultLanguage.template);
  const [analysis, setAnalysis] = useState(emptyAnalysis);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [fileName, setFileName] = useState(defaultLanguage.fileName);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const fileInputRef = useRef(null);

  const lineRailRef = useRef(null);

  // ✅ FETCH HISTORY FROM SUPABASE
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setHistory(data || []);
    };

    fetchHistory();
  }, [user]);

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  // 🚀 🔥 MAIN FUNCTION (ANALYZE)
  async function analyzeCode() {
    if (!code) return;

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("http://localhost:3001/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, userId: user?.id })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);
      setStatus("complete");
      setActivePanel("analytics");

      // ✅ SAVE TO SUPABASE
      if (user) {
        await supabase.from("reviews").insert([
          {
            user_id: user.id,
            code,
            result: data
          }
        ]);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze code");
      setStatus("error");
    }
  }

  function chooseLanguage(language) {
    setSelectedLanguage(language);
    setCode(language.template);
    setFileName(language.fileName);
    setAnalysis(emptyAnalysis);
    setError("");
    setStatus("idle");
  }

  return (
    <div className="engine-shell">
      {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />}
      <aside className={`engine-sidebar ${isMobileOpen ? 'mobile-open' : ''}`} aria-label="Workspace navigation">
        <button className="engine-logo" type="button" onClick={() => {
          if (window.innerWidth <= 768 && !isMobileOpen) {
            setIsMobileOpen(true);
          } else {
            onBack();
          }
        }}>
          <span className="logo-text">CODESAGE <small>AI REVIEWER</small></span>
        </button>
        <nav>
          <button
            className={activePanel === "dashboard" ? "active" : ""}
            type="button"
            onClick={() => setActivePanel("dashboard")}
          >
            <div className="dashboard-icon">
              <span /><span /><span /><span />
            </div>
            <span className="nav-label">DASHBOARD</span>
          </button>
          <button
            className={activePanel === "history" ? "active text-icon" : "text-icon"}
            type="button"
            onClick={() => setActivePanel("history")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
              <path d="M12 8l0 4l2 2" />
              <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
            <span className="nav-label">HISTORY</span>
          </button>
        </nav>
        <button className="engine-back" type="button" onClick={onBack}>
          ← BACK
        </button>
      </aside>

      <section className="engine-workspace">
        {activePanel === "analytics" ? (
          <Analytics 
            analysis={analysis}
            originalCode={code}
            onApplyChanges={() => {
              setActivePanel("dashboard");
              setStatus("idle");
            }} 
          />
        ) : (
          <>
            <header className="engine-topbar">
              <div className="engine-brand">
                <strong>CodeSage</strong>
                <span>System: Optimal</span>
              </div>
              <div className="engine-actions">
                <button type="button" className="text-icon" onClick={() => setActivePanel("history")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <path d="M12 8l0 4l2 2" />
                    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                  </svg>
                  History
                </button>
              </div>
            </header>

            <main className="engine-main">
              <section className="engine-hero">
                <div>
                  <p>Advanced AI Intelligence</p>
                  <h1>Code Integrity <em>Engine</em></h1>
                  <span>Neural architecture designed for deep semantic analysis.</span>
                </div>
              </section>

              <section className="engine-grid">
                <article className="code-editor">
                  <div className="language-tabs" aria-label="Language options">
                    {languageOptions.map((language) => (
                      <button
                        className={selectedLanguage.id === language.id ? "active" : ""}
                        type="button"
                        key={language.id}
                        onClick={() => chooseLanguage(language)}
                      >
                        {language.label}
                      </button>
                    ))}
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
                      onScroll={(e) => {
                        if (lineRailRef.current) {
                          lineRailRef.current.style.transform = `translateY(-${e.target.scrollTop}px)`;
                        }
                      }}
                    />
                  </div>
                  <footer className="editor-footer">
                    <button onClick={analyzeCode} disabled={status === "loading"}>
                      {status === "loading" ? "Analyzing..." : "Analyze Code"}
                    </button>
                  </footer>
                </article>

                <aside className="engine-panel-stack">
                  <article className="live-panel">
                    <h2>Live Intelligence</h2>
                    {error && <p className="analysis-error" style={{ color: "#ff6b6b" }}>{error}</p>}
                    {!error && <p>System ready for inference.</p>}
                  </article>
                </aside>
              </section>

              {activePanel === "history" && (
                <section className="history-panel">
                  <h2>Recent Reviews</h2>
                  <div className="history-list">
                    {history.map((item) => (
                      <article key={item.id} className="history-item">
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                        <p>{item.result?.summary || "Manual code review"}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </>
        )}
      </section>
    </div>
  );
}