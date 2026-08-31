import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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

function detectLanguageFromFileName(fileName) {
  const lower = String(fileName || "").toLowerCase();
  if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".ts") || lower.endsWith(".tsx")) {
    return languageOptions.find((l) => l.id === "javascript");
  }
  if (lower.endsWith(".py")) {
    return languageOptions.find((l) => l.id === "python");
  }
  if (lower.endsWith(".cpp") || lower.endsWith(".cc") || lower.endsWith(".cxx") || lower.endsWith(".hpp")) {
    return languageOptions.find((l) => l.id === "cpp");
  }
  if (lower.endsWith(".c") || lower.endsWith(".h")) {
    return languageOptions.find((l) => l.id === "c");
  }
  if (lower.endsWith(".java")) {
    return languageOptions.find((l) => l.id === "java");
  }
  return null;
}

function getRecordDetails(record) {
  const result = record.result || {};
  const findingsCount = Array.isArray(result.issues) ? result.issues.length : (result.findings?.length || 0);
  const score = Number.isFinite(Number(result.score)) ? Number(result.score) : 80;

  let lang = "JavaScript";
  let fileName = "code_review.js";
  const codeSnippet = String(record.code || "");
  if (codeSnippet.includes("#include") || codeSnippet.includes("std::")) {
    lang = "C++";
    fileName = "inventory_manager.cpp";
  } else if (codeSnippet.includes("def ") || (codeSnippet.includes("import ") && codeSnippet.includes(":"))) {
    lang = "Python";
    fileName = "metrics_processor.py";
  } else if (codeSnippet.includes("public class ") || codeSnippet.includes("System.out.")) {
    lang = "Java";
    fileName = "UserService.java";
  } else if (codeSnippet.includes("#include <stdio.h>") || codeSnippet.includes("char*")) {
    lang = "C";
    fileName = "config_parser.c";
  } else if (codeSnippet.includes("calculateCartTotal") || codeSnippet.includes("cartItems")) {
    lang = "JavaScript";
    fileName = "cartService.js";
  }

  const dateStr = new Date(record.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return { findingsCount, score, lang, fileName, dateStr };
}

export function CodeIntegrityEngine({ onBack, user, onLogout }) {
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [currentFileName, setCurrentFileName] = useState(defaultLanguage.fileName);
  const [code, setCode] = useState(defaultLanguage.template);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");

  const fileInputRef = useRef(null);

  // Open historical review when passed via navigation state from Profile (Phase 7)
  useEffect(() => {
    if (location.state?.reviewResult) {
      setAnalysis(location.state.reviewResult);
      if (location.state.reviewCode) {
        setCode(location.state.reviewCode);
      }
      if (location.state.reviewFileName) {
        setCurrentFileName(location.state.reviewFileName);
        const detected = detectLanguageFromFileName(location.state.reviewFileName);
        if (detected) setSelectedLanguage(detected);
      }
      setActivePanel("analytics");
      setStatus("complete");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const lineCount = useMemo(() => (code ? code.split("\n").length : 0), [code]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setCode(content);
        setCurrentFileName(file.name);
        const detected = detectLanguageFromFileName(file.name);
        if (detected) {
          setSelectedLanguage(detected);
        }
        setError("");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
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
    
    // Update default filename if user has not imported a custom file
    const isDefaultFile = languageOptions.some(
      (opt) => opt.fileName.toLowerCase() === currentFileName.toLowerCase()
    );
    if (isDefaultFile) {
      setCurrentFileName(lang.fileName);
    }

    // USER CODE MUST ALWAYS WIN (Requirement 11)
    // Only load default template if editor is empty or currently matches an unmodified demo template.
    if (!code.trim() || isDefaultTemplate(code)) {
      setCode(lang.template);
    }
    setError("");
    setStatus("idle");
  };

  const handleResetToExample = () => {
    setCode(selectedLanguage.template);
    setCurrentFileName(selectedLanguage.fileName);
    setError("");
    setStatus("idle");
  };

  const handleClearEditor = () => {
    if (!code.trim()) return;
    if (isDefaultTemplate(code)) {
      setCode("");
      return;
    }
    if (window.confirm("Clear editor contents? Your current code will be removed.")) {
      setCode("");
    }
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

      // 2. Call API with 65-second client timeout (Task 4)
      let res;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 65000);

      try {
        res = await fetch("/api/review", {
          method: "POST",
          headers,
          body: JSON.stringify({ code: targetCode }),
          signal: controller.signal
        });
      } catch (netErr) {
        if (netErr.name === "AbortError") {
          throw new Error("The review took too long to complete. Try a smaller code sample.");
        }
        console.error("[CodeIntegrityEngine] Network reachability error:", netErr);
        throw new Error("Unable to reach the analysis service. Check your connection and try again.");
      } finally {
        clearTimeout(timeoutId);
      }

      // 3. Parse JSON response contract
      const raw = await res.text();
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        throw new Error("The review service returned an unexpected response format. Please try again.");
      }

      // 4. Handle HTTP & API error codes (Task 7)
      if (!res.ok || payload.success === false) {
        if (res.status === 400) {
          throw new Error(payload.error?.message || payload.error || "Code is too large or invalid for review.");
        }
        if (res.status === 401) {
          throw new Error("Your session has expired. Please sign in again.");
        }
        if (res.status === 429) {
          throw new Error(payload.error?.message || "AI review quota is temporarily unavailable. Please try again later.");
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
                      <strong style={{
                        color: "var(--semantic-danger, #ff1744)",
                        fontSize: "0.82rem",
                        letterSpacing: "0.12em",
                        display: "block",
                        marginBottom: "4px"
                      }}>
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
                          style={{
                            borderColor: "rgba(255, 23, 68, 0.5)",
                            color: "#ff8a80"
                          }}
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
                      <span className="weh-filename">{currentFileName.toUpperCase()}</span>
                      <span className="weh-badge">{selectedLanguage.label.toUpperCase()}</span>
                    </div>
                    <div className="weh-right">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept=".js,.jsx,.ts,.tsx,.py,.cpp,.cc,.cxx,.c,.h,.hpp,.java,.txt"
                        onChange={handleFileChange}
                        aria-label="Import code file"
                      />
                      <button 
                        type="button" 
                        className="weh-btn" 
                        onClick={handleImportClick}
                        title="Import local code file (.js, .py, .cpp, .c, .java)"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        IMPORT FILE
                      </button>
                      <button 
                        type="button" 
                        className="weh-btn" 
                        onClick={handleResetToExample}
                        title={`Load default ${selectedLanguage.label} application example`}
                      >
                        LOAD EXAMPLE
                      </button>
                      {code.trim() && (
                        <button 
                          type="button" 
                          className="weh-btn weh-btn-danger" 
                          onClick={handleClearEditor}
                          title="Clear editor contents"
                        >
                          CLEAR
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="workspace-tabs-container">
                    <div className="workspace-tabs" role="tablist" aria-label="Select Programming Language">
                      {languageOptions.map(lang => (
                        <button 
                          key={lang.id}
                          type="button"
                          role="tab"
                          aria-selected={selectedLanguage.id === lang.id}
                          className={selectedLanguage.id === lang.id ? "workspace-tab active" : "workspace-tab"}
                          onClick={() => handleLanguageUpdate(lang)}
                        >
                          {lang.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="workspace-editor-body">
                    {!code.trim() && (
                      <div className="workspace-empty-state-overlay" style={{
                        position: "absolute",
                        top: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 4,
                        width: "90%",
                        maxWidth: "520px",
                        background: "rgba(10, 15, 26, 0.88)",
                        border: "1px solid rgba(74, 109, 156, 0.3)",
                        borderRadius: "14px",
                        padding: "24px 28px",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 229, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        textAlign: "center",
                        pointerEvents: "auto"
                      }}>
                        <div style={{
                          display: "inline-block",
                          color: "var(--color-accent-primary, #00E5FF)",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          letterSpacing: "0.14em",
                          marginBottom: "8px",
                          textTransform: "uppercase"
                        }}>
                          ● PASTE YOUR CODE
                        </div>
                        <h3 style={{ margin: "0 0 8px", color: "#FFFFFF", fontSize: "1.18rem", fontWeight: "700", letterSpacing: "-0.01em" }}>
                          Ready for Logic & Structure Review
                        </h3>
                        <p style={{ fontSize: "0.85rem", lineHeight: "1.55", margin: "0 0 16px", color: "rgba(220, 235, 255, 0.7)" }}>
                          Paste any {selectedLanguage.label} function, class, service, or application code directly into the editor, or load a realistic example below.
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="ghost-button"
                            style={{ fontSize: "0.78rem", padding: "7px 16px", border: "1px solid rgba(0, 229, 255, 0.4)", color: "#00E5FF" }}
                            onClick={() => handleResetToExample()}
                          >
                            Load {selectedLanguage.label} Example
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            style={{ fontSize: "0.78rem", padding: "7px 16px", border: "1px solid rgba(220, 235, 255, 0.2)", color: "rgba(220, 235, 255, 0.8)" }}
                            onClick={handleImportClick}
                          >
                            Import File
                          </button>
                        </div>
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
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightSpecialChars: true,
                        history: true,
                        foldGutter: true,
                        drawSelection: true,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: false,
                        syntaxHighlighting: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: false,
                        rectangularSelection: true,
                        crosshairCursor: false,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        closeBracketsKeymap: true,
                        defaultKeymap: true,
                        searchKeymap: true,
                        historyKeymap: true,
                        foldKeymap: true,
                        completionKeymap: false,
                        lintKeymap: false,
                      }}
                    />
                  </div>

                  <div className="workspace-editor-footer">
                    <div className="wef-left">
                      <span className="wef-item">LINES: <strong className="wef-val">{lineCount}</strong></span>
                      <span className="wef-separator">|</span>
                      <span className="wef-item">CHARS: <strong className="wef-val">{code.length}</strong></span>
                      <span className="wef-separator">|</span>
                      <span className="wef-item">LANG: <strong className="wef-val">{selectedLanguage.label.toUpperCase()}</strong></span>
                    </div>
                    <div className="wef-center">
                      <span className="wef-item">UTF-8</span>
                      <span className="wef-separator">|</span>
                      <span className="wef-item">LF</span>
                    </div>
                    <div className="wef-right">
                      <span className={`wef-status ${status === "loading" ? "running" : "ready"}`}>
                        ● {status === "loading" ? "ANALYZING" : "READY"}
                      </span>
                      
                      <button 
                        type="button"
                        className="workspace-analyze-btn"
                        onClick={() => analyzeCode()} 
                        disabled={status === "loading" || !code.trim()}
                        aria-label="Run AI code analysis"
                      >
                        {status === "loading" ? (
                          <>
                            <div className="tire-loader" style={{ width: '14px', height: '14px', border: '2px solid rgba(0,229,255,0.3)', borderTop: '2px solid #00E5FF', animation: 'tire-spin 1s linear infinite' }}></div>
                            <span>ANALYZING CODE...</span>
                          </>
                        ) : (
                          <>
                            <span className="wab-icon">✦</span>
                            <span>RUN AI ANALYSIS</span>
                          </>
                        )}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ margin: 0 }}>Review History</h2>
                  <button 
                    type="button"
                    className="ghost-button"
                    style={{ fontSize: "0.78rem", padding: "6px 14px" }}
                    onClick={() => setActivePanel("dashboard")}
                  >
                    ← Back to Editor
                  </button>
                </div>
                <div className="history-list">
                  {history.length > 0 ? (
                    history.map((h) => {
                      const { findingsCount, score, lang, fileName, dateStr } = getRecordDetails(h);
                      return (
                        <article 
                          key={h.id} 
                          className="history-card interactive-history-item"
                          style={{ cursor: 'pointer', position: 'relative' }} 
                          onClick={() => {
                            setAnalysis(h.result);
                            setCode(h.code);
                            setCurrentFileName(fileName);
                            const detected = detectLanguageFromFileName(fileName);
                            if (detected) setSelectedLanguage(detected);
                            setActivePanel("analytics");
                            setStatus("complete");
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ color: '#00E5FF', fontSize: '0.7rem' }}>●</span>
                                <strong style={{ color: '#FFFFFF', fontSize: '0.92rem', fontFamily: "'JetBrains Mono', monospace" }}>
                                  {fileName.toUpperCase()}
                                </strong>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(220, 235, 255, 0.65)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <span>{lang}</span>
                                <span>·</span>
                                <span>Score {score}</span>
                                <span>·</span>
                                <span>{findingsCount} {findingsCount === 1 ? 'finding' : 'findings'}</span>
                                <span>·</span>
                                <span>{dateStr}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <span style={{ color: '#00E5FF', fontSize: '0.78rem', fontWeight: '700' }}>
                                VIEW →
                              </span>
                              <button 
                                type="button"
                                onClick={(e) => deleteHistoryRecord(e, h.id)}
                                className="history-delete-btn"
                                title="Delete Record"
                                aria-label="Delete review record"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="history-empty" style={{ textAlign: 'center', padding: '48px 20px' }}>
                      <div style={{ color: '#00E5FF', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        NO REVIEW HISTORY
                      </div>
                      <p style={{ color: 'rgba(220, 235, 255, 0.65)', fontSize: '0.9rem', marginBottom: '16px' }}>
                        Run your first analysis in the engine to create a review.
                      </p>
                      <button
                        type="button"
                        className="primary-button"
                        style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                        onClick={() => setActivePanel("dashboard")}
                      >
                        RUN AN ANALYSIS
                      </button>
                    </div>
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
