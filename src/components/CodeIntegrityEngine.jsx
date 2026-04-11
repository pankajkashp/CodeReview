import { useMemo, useRef, useState } from "react";
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

struct Item {
    int price;
    int quantity;
};

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
  const number = Number(value);
  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
}

export function CodeIntegrityEngine({ onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultLanguage.template);
  const [analysis, setAnalysis] = useState(emptyAnalysis);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [modelName, setModelName] = useState("gpt-4.1-mini");
  const [fileName, setFileName] = useState(defaultLanguage.fileName);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const fileInputRef = useRef(null);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const searchMatches = useMemo(() => {
    if (!query.trim()) {
      return 0;
    }

    return code.toLowerCase().split(query.trim().toLowerCase()).length - 1;
  }, [code, query]);
  const complexityScore = clampScore(analysis.complexityScore);
  const bugRisk = clampScore(analysis.bugRisk);
  const maintainability = clampScore(analysis.maintainability);
  const securityScore = clampScore(analysis.securityScore);
  const primaryFinding = analysis.findings?.[0];
  const primaryOptimization = analysis.optimizations?.[0];
  const metrics = [
    ["Language", analysis.language || "Unknown"],
    ["Complexity", `${complexityScore}/100`],
    ["Bug Risk", `${bugRisk}/100`],
    ["Security", `${securityScore}/100`]
  ];

  async function analyzeCode() {
    setStatus("loading");
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, language: selectedLanguage.label })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to analyze code.");
      }

      const nextAnalysis = { ...emptyAnalysis, ...data.analysis };
      setAnalysis(nextAnalysis);
      setNotice(data.warning || "");
      setHistory((currentHistory) => [
        {
          id: Date.now(),
          fileName,
          selectedLanguage: selectedLanguage.label,
          language: nextAnalysis.language,
          summary: nextAnalysis.summary,
          bugRisk: clampScore(nextAnalysis.bugRisk),
          createdAt: new Date().toLocaleTimeString()
        },
        ...currentHistory
      ]);
      setStatus("complete");
      setActivePanel("analytics");
    } catch (caughtError) {
      setStatus("error");
      setError(caughtError instanceof Error ? caughtError.message : "Unable to analyze code.");
    }
  }

  async function uploadFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const extension = file.name.split(".").pop()?.toLowerCase();
    const matchedLanguage =
      languageOptions.find((option) => {
        const extensionMap = {
          javascript: ["js", "jsx", "ts", "tsx"],
          python: ["py"],
          java: ["java"],
          cpp: ["cpp", "cc", "cxx", "c", "h", "hpp"]
        };

        return extensionMap[option.id]?.includes(extension);
      }) || selectedLanguage;

    setSelectedLanguage(matchedLanguage);
    setCode(text);
    setFileName(file.name);
    setAnalysis(emptyAnalysis);
    setError("");
    setNotice("");
    setStatus("idle");
  }

  function chooseLanguage(language) {
    setSelectedLanguage(language);
    setCode(language.template);
    setFileName(language.fileName);
    setAnalysis(emptyAnalysis);
    setError("");
    setNotice("");
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
          <span className="logo-text">KINETIC <small>AI REVIEWER</small></span>
        </button>
        <nav>
          <button
            className={activePanel === "dashboard" ? "active" : ""}
            type="button"
            aria-label="Dashboard"
            onClick={() => setActivePanel("dashboard")}
          >
            <div className="dashboard-icon">
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="nav-label">DASHBOARD</span>
          </button>
          <button
            className={activePanel === "history" ? "active text-icon" : "text-icon"}
            type="button"
            aria-label="History"
            onClick={() => setActivePanel("history")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
              <path d="M12 8l0 4l2 2" />
              <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
            <span className="nav-label">HISTORY</span>
          </button>
          <button
            className={activePanel === "settings" ? "active text-icon" : "text-icon"}
            type="button"
            aria-label="Settings"
            onClick={() => setActivePanel("settings")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="nav-label">SETTINGS</span>
          </button>
        </nav>
        <button className="engine-back" type="button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </aside>

      <section className="engine-workspace" id="engine-main">
        {activePanel === "analytics" ? (
          <Analytics onApplyChanges={() => {
            setActivePanel("dashboard");
            setStatus("idle");
          }} />
        ) : (
          <>
            <header className="engine-topbar">
              <div className="engine-brand">
                <strong>Kinetic Void</strong>
                <span>System: Optimal</span>
              </div>
          <label className="engine-search">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search functions..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="engine-icons">
            <span title={`${searchMatches} matches`}>{searchMatches}</span>
            <span />
          </div>
        </header>

        <main className="engine-main">
          <section className="engine-hero">
            <div>
              <p>Advanced AI Intelligence</p>
              <h1>
                Code Integrity <em>Engine</em>
              </h1>
              <span>
                Neural architecture designed for deep semantic analysis of complex codebases.
                Upload, review, and refactor with precision.
              </span>
            </div>
            <div className="engine-actions">
              <button type="button" onClick={() => setActivePanel("history")}>
                Diff History
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()}>
                Upload File
              </button>
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.go,.rs,.c,.cpp,.cs,.php,.rb,.swift,.kt,.txt"
                onChange={uploadFile}
              />
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
              <div className="editor-toolbar">
                <div>
                  <span />
                  <span />
                  <span />
                </div>
                <strong>{fileName}</strong>
                <em>{selectedLanguage.label} Detector</em>
              </div>
              <div className="code-input-frame">
                <div className="line-rail" aria-hidden="true">
                  {Array.from({ length: lineCount }, (_, index) => (
                    <span key={index}>{String(index + 1).padStart(2, "0")}</span>
                  ))}
                </div>
                <textarea
                  aria-label="Paste code for analysis"
                  spellCheck="false"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Paste your code here..."
                />
              </div>
              <footer className="editor-footer">
                <small>
                  {selectedLanguage.label} - {lineCount} Lines - UTF-8 -{" "}
                  {status === "loading" ? "Analyzing" : "Ready"}
                </small>
                <button type="button" onClick={analyzeCode} disabled={status === "loading"}>
                  {status === "loading" ? "Analyzing..." : "Analyze Code"}
                </button>
              </footer>
            </article>

            <aside className="engine-panel-stack">
              <article className="health-panel">
                <header>
                  <h2>Session Health</h2>
                  <span aria-hidden="true">+</span>
                </header>
                <label>
                  <span>Complexity Score</span>
                  <strong>{complexityScore}/100</strong>
                  <meter min="0" max="100" value={complexityScore} />
                </label>
                <label>
                  <span>Maintainability</span>
                  <strong>{maintainability}/100</strong>
                  <meter min="0" max="100" value={maintainability} />
                </label>
              </article>

              <article className="live-panel">
                <h2>Live Intelligence</h2>
                <div>
                  <strong>{primaryFinding?.severity || "Analysis Summary"}</strong>
                  <p>{primaryFinding ? `${primaryFinding.title}: ${primaryFinding.detail}` : analysis.summary}</p>
                </div>
                <div className="muted">
                  <strong>Optimization Tip</strong>
                  <p>{primaryOptimization || "Run analysis to receive an optimization path."}</p>
                </div>
                {notice ? <p className="analysis-notice">{notice}</p> : null}
                {error ? <p className="analysis-error">{error}</p> : null}
              </article>

              <article className="model-panel">
                <div className="model-orbit" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div>
                  <h2>Model: {modelName}</h2>
                  <p>{status === "loading" ? "Inference running" : "Ultra-low latency inference ready"}</p>
                </div>
              </article>
            </aside>
          </section>

          {activePanel === "history" ? (
            <section className="history-panel" aria-labelledby="history-title">
              <h2 id="history-title">Diff History</h2>
              {history.length ? (
                <div className="history-list">
                  {history.map((item) => (
                    <article key={item.id}>
                      <span>{item.createdAt}</span>
                      <h3>{item.fileName}</h3>
                      <p>{item.summary}</p>
                      <strong>
                        Expected {item.selectedLanguage} - Detected {item.language || "Unknown"} -
                        Risk {item.bugRisk}/100
                      </strong>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No analysis history yet. Run Analyze Code to create the first entry.</p>
              )}
            </section>
          ) : null}

          {activePanel === "settings" ? (
            <section className="settings-panel" aria-labelledby="settings-title">
              <h2 id="settings-title">Analysis Settings</h2>
              <label>
                <span>Model label</span>
                <input value={modelName} onChange={(event) => setModelName(event.target.value)} />
              </label>
              <p>
                Server model comes from <strong>OPENAI_MODEL</strong>. This field controls the
                dashboard label for the current session.
              </p>
            </section>
          ) : null}

          <section className="metric-row" aria-label="Review metrics">
            {metrics.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </section>

          {analysis.findings?.length ? (
            <section className="findings-panel" aria-labelledby="findings-title">
              <h2 id="findings-title">Detected Issues</h2>
              <div className="findings-grid">
                {analysis.findings.map((finding, index) => (
                  <article key={`${finding.title}-${index}`}>
                    <span>{finding.severity || "info"}</span>
                    <h3>{finding.title}</h3>
                    <p>{finding.detail}</p>
                    <strong>{finding.line ? `Line ${finding.line}` : "General"}</strong>
                    <small>{finding.fix}</small>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {analysis.improvedCode ? (
            <section className="improved-code-panel" aria-labelledby="improved-code-title">
              <h2 id="improved-code-title">Suggested Rewrite</h2>
              <pre>
                <code>{analysis.improvedCode}</code>
              </pre>
            </section>
          ) : null}
        </main>
        </>
      )}
      </section>
    </div>
  );
}
