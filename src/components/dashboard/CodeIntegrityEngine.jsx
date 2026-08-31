import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import supabase from "../../lib/supabaseClient.js";
import { Analytics } from "../analysis/Analytics.jsx";
import { UserProfile } from "../shared/UserProfile.jsx";
import { AnalysisLoader } from "../analysis/AnalysisLoader.jsx";
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
    fileName: "cartService.js",
    template: `// Calculates shopping cart total with discount and tax
function calculateCartTotal(cartItems, discountCode, taxRate = 0.08) {
  let subtotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    subtotal += item.price * item.quantity;
  }

  let discount = 0;
  if (discountCode === "SAVE10") {
    discount = subtotal * 0.10;
  } else if (discountCode === "SAVE20" && subtotal > 100) {
    discount = subtotal * 0.20;
  }

  const total = (subtotal - discount) * (1 + taxRate);
  return Number(total.toFixed(2));
}`
  },
  {
    id: "python",
    label: "Python",
    fileName: "metrics_processor.py",
    template: `# Parses and aggregates user activity logs from CSV lines
def process_user_metrics(log_entries):
    user_totals = {}

    for entry in log_entries:
        parts = entry.strip().split(",")
        if len(parts) < 3:
            continue

        user_id, action, duration = parts[0], parts[1], float(parts[2])

        if user_id not in user_totals:
            user_totals[user_id] = {"count": 0, "total_duration": 0.0}

        user_totals[user_id]["count"] += 1
        user_totals[user_id]["total_duration"] += duration

    return user_totals`
  },
  {
    id: "cpp",
    label: "C++",
    fileName: "inventory_manager.cpp",
    template: `#include <string>
#include <vector>
#include <unordered_map>

struct Product {
    std::string id;
    std::string name;
    int stock;
    double price;
};

class InventoryManager {
private:
    std::unordered_map<std::string, Product> inventory;

public:
    bool updateStock(const std::string& productId, int quantityChange) {
        auto it = inventory.find(productId);
        if (it == inventory.end()) {
            return false;
        }

        if (it->second.stock + quantityChange < 0) {
            return false;
        }

        it->second.stock += quantityChange;
        return true;
    }
};`
  },
  {
    id: "c",
    label: "C",
    fileName: "config_parser.c",
    template: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool parse_config_line(const char* line, char* key_out, char* val_out) {
    if (line == NULL || line[0] == '#' || line[0] == '\0') {
        return false;
    }

    char buffer[256];
    strncpy(buffer, line, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\0';

    char* sep = strchr(buffer, '=');
    if (sep == NULL) {
        return false;
    }

    *sep = '\0';
    strcpy(key_out, buffer);
    strcpy(val_out, sep + 1);
    return true;
}`
  },
  {
    id: "java",
    label: "Java",
    fileName: "UserService.java",
    template: `import java.util.regex.Pattern;

public class UserService {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public boolean validateUserRegistration(String username, String email, int age) {
        if (username == null || username.trim().length() < 3) {
            return false;
        }

        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            return false;
        }

        if (age < 18 || age > 120) {
            return false;
        }

        return true;
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

  const isDefaultTemplate = (currentCode) => {
    const trimmed = String(currentCode || "").trim();
    return languageOptions.some((opt) => opt.template.trim() === trimmed);
  };

  const [historyWarning, setHistoryWarning] = useState("");

  const handleLanguageUpdate = (lang) => {
    setSelectedLanguage(lang);
    // Part E: User pasted/custom code has absolute priority!
    // Only switch code if editor is empty or currently matches an unmodified demo template.
    if (!code.trim() || isDefaultTemplate(code)) {
      setCode(lang.template);
    }
    setError("");
    setStatus("idle");
  };

  const handleCodeChange = (val) => {
    setCode(val);
    setError("");
  };

  // 🚀 ANALYZE FUNCTION (Phase 5: Authenticated, Graceful Error Handling & Failure Isolation)
  async function analyzeCode(codeToAnalyze = null) {
    const targetCode = (typeof codeToAnalyze === 'string' && codeToAnalyze) ? codeToAnalyze : code;
    setStatus("loading");
    setError("");
    setHistoryWarning("");

    try {
      // 1. Retrieve current Supabase access token (Part 8 & 9 & 14)
      let session = null;
      try {
        const sessionRes = await supabase.auth.getSession();
        session = sessionRes.data?.session;

        // If token missing or expired, attempt refresh
        if (!session?.access_token) {
          const refreshRes = await supabase.auth.refreshSession();
          session = refreshRes.data?.session;
        }
      } catch (sessErr) {
        console.warn("[CodeIntegrityEngine] Session retrieval error:", sessErr);
      }

      if (!session?.access_token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      };

      // 2. Call API with network failure isolation (Part 13)
      let res;
      try {
        res = await fetch("/api/review", {
          method: "POST",
          headers,
          body: JSON.stringify({ code: targetCode })
        });
      } catch (netErr) {
        console.error("[CodeIntegrityEngine] Network reachability error:", netErr);
        throw new Error("Unable to reach the analysis service. Check your connection and try again.");
      }

      // 3. Parse JSON response contract
      const raw = await res.text();
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        throw new Error("The review service returned an unexpected response format. Please try again.");
      }

      // 4. Handle HTTP & API error codes (Part 12 & 13)
      if (!res.ok || payload.success === false) {
        if (res.status === 401) {
          throw new Error("Your session has expired. Please sign in again.");
        }
        if (res.status === 429) {
          throw new Error("You're reviewing code too quickly. Please wait a moment.");
        }
        if (res.status === 400) {
          throw new Error(payload.error?.message || payload.error || "Code is too large or invalid for review.");
        }
        if (res.status === 503) {
          throw new Error("The analysis service is temporarily unavailable. Please try again.");
        }
        if (res.status === 504) {
          throw new Error("The review took too long to complete. Try a smaller code sample.");
        }
        const errorMsg = payload.error?.message || payload.error || `Analysis request failed with status ${res.status}`;
        throw new Error(errorMsg);
      }

      // 5. Unpack AI Review Data (Part 6: Display review immediately!)
      const reviewData = payload.data || payload;
      setAnalysis(reviewData);
      setStatus("complete");
      setActivePanel("analytics");

      // 6. Non-blocking History Persistence (Part 6 & 7: Supabase failure must NOT destroy AI review)
      if (user) {
        (async () => {
          try {
            const { error: dbError } = await supabase.from("reviews").insert([
              {
                user_id: user.id,
                code: targetCode,
                result: reviewData
              }
            ]);

            if (dbError) {
              console.warn("[CodeIntegrityEngine] Non-blocking history save failure:", dbError);
              setHistoryWarning("Review complete. Analysis generated successfully, but couldn't save to history.");
            } else {
              fetchHistory();
            }
          } catch (dbEx) {
            console.warn("[CodeIntegrityEngine] Non-blocking history save exception:", dbEx);
            setHistoryWarning("Review complete. Analysis generated successfully, but couldn't save to history.");
          }
        })();
      }

    } catch (err) {
      console.error("[CodeIntegrityEngine] Analysis error:", err);
      setError(err.message || "An unexpected error occurred during review.");
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
          <>
            {historyWarning && (
              <div style={{
                background: "rgba(255, 145, 0, 0.12)",
                border: "1px solid rgba(255, 145, 0, 0.35)",
                borderRadius: "10px",
                padding: "12px 20px",
                margin: "12px 24px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                position: "relative",
                zIndex: 20
              }}>
                <span style={{ color: "#ffb74d", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠ {historyWarning}
                </span>
                <button
                  type="button"
                  className="ghost-button"
                  style={{ fontSize: "0.75rem", padding: "4px 12px", borderColor: "rgba(255, 145, 0, 0.4)", color: "#ffb74d" }}
                  onClick={() => {
                    if (user && analysis) {
                      supabase.from("reviews").insert([{ user_id: user.id, code, result: analysis }])
                        .then(({ error: retryErr }) => {
                          if (!retryErr) {
                            setHistoryWarning("");
                            fetchHistory();
                          }
                        });
                    }
                  }}
                >
                  Retry Save
                </button>
              </div>
            )}
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
          </>
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
                {status === "error" && error && (
                  <div className="workspace-error-alert" style={{
                    background: "rgba(255, 23, 68, 0.12)",
                    border: "1px solid rgba(255, 23, 68, 0.4)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}>
                    <div>
                      <strong style={{ color: "var(--semantic-danger, #ff1744)", fontSize: "0.82rem", letterSpacing: "0.12em", display: "block", marginBottom: "4px" }}>
                        ANALYSIS FAILED
                      </strong>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: "0.88rem", lineHeight: "1.5" }}>
                        {error || "We couldn't complete this review. Your code has been preserved in the editor."}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {error.toLowerCase().includes("session") || error.toLowerCase().includes("sign in") ? (
                        <button
                          type="button"
                          className="primary-button"
                          style={{ fontSize: "0.8rem", padding: "6px 16px" }}
                          onClick={onLogout}
                        >
                          Sign in again
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ghost-button"
                          style={{ borderColor: "rgba(255, 23, 68, 0.5)", color: "#ff8a80" }}
                          onClick={() => analyzeCode()}
                        >
                          Try again
                        </button>
                      )}
                    </div>
                  </div>
                )}

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

                  <div className="workspace-editor-body" style={{ position: "relative" }}>
                    {!code.trim() && (
                      <div className="workspace-empty-state-overlay" style={{
                        position: "absolute",
                        top: "32px",
                        left: "60px",
                        zIndex: 4,
                        maxWidth: "460px",
                        color: "rgba(255,255,255,0.75)",
                        pointerEvents: "auto"
                      }}>
                        <span style={{
                          display: "inline-block",
                          color: "var(--color-accent-primary)",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          letterSpacing: "0.12em",
                          marginBottom: "6px"
                        }}>
                          PASTE YOUR CODE
                        </span>
                        <h3 style={{ margin: "0 0 10px", color: "#FFFFFF", fontSize: "1.15rem", fontWeight: "700" }}>
                          Paste any {selectedLanguage.label} or application code.
                        </h3>
                        <p style={{ fontSize: "0.86rem", lineHeight: "1.5", margin: "0 0 12px", color: "rgba(255,255,255,0.7)" }}>
                          CodeSage will analyze logic, complexity, edge cases, and provide actionable before/after code refactors:
                        </p>
                        <ul style={{ fontSize: "0.82rem", lineHeight: "1.7", margin: "0 0 16px", paddingLeft: "20px", color: "rgba(255,255,255,0.6)" }}>
                          <li>Algorithmic bottlenecks & complexity issues</li>
                          <li>Critical bugs & logical mistakes</li>
                          <li>Missed edge cases & runtime hazards</li>
                          <li>Cleaner, more maintainable replacements</li>
                        </ul>
                        <button
                          type="button"
                          className="ghost-button"
                          style={{ fontSize: "0.78rem", padding: "6px 14px", border: "1px solid rgba(0, 229, 255, 0.4)", color: "#00E5FF" }}
                          onClick={() => setCode(selectedLanguage.template)}
                        >
                          Load {selectedLanguage.label} Example
                        </button>
                      </div>
                    )}
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
