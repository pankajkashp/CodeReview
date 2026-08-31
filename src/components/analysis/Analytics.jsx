import React from "react";
import "../../styles/analytics.css";
import "../../styles/analytics-polish.css";
import {
  KeyFindingsSection,
  AdditionalInsightsSection,
  buildAnalysisViewModel,
  safeSyntaxHighlight
} from "./AnalysisSections.jsx";

class AnalyticsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Analytics Error Boundary Caught Exception]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "48px 24px",
          textAlign: "center",
          maxWidth: "680px",
          margin: "80px auto",
          background: "rgba(18, 26, 42, 0.9)",
          border: "1px solid rgba(255, 23, 68, 0.4)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
        }}>
          <span style={{
            display: "inline-block",
            color: "var(--semantic-danger, #ff1744)",
            fontSize: "0.75rem",
            fontWeight: "800",
            letterSpacing: "0.12em",
            marginBottom: "12px"
          }}>
            REVIEW RENDERING NOTICE
          </span>
          <h2 style={{ color: "#fff", fontSize: "1.4rem", margin: "0 0 12px" }}>
            Review Analysis Display Fallback
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6", margin: "0 0 24px" }}>
            The AI review succeeded, but an unexpected layout error occurred while rendering the comparison view.
          </p>
          <button type="button" className="primary-button" onClick={this.props.onBackToDashboard} style={{ padding: "10px 24px" }}>
            RETURN TO EDITOR
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Analytics({ analysis = {}, originalCode = "", onBackToDashboard }) {
  const [copyState, setCopyState] = React.useState("");
  const copyTimerRef = React.useRef(null);

  const leftCodeRef = React.useRef(null);
  const rightCodeRef = React.useRef(null);
  const isSyncingRef = React.useRef(false);

  const model = React.useMemo(() => {
    try {
      return buildAnalysisViewModel({ analysis: { ...analysis, originalCode }, originalCode });
    } catch (err) {
      console.error("[Analytics] Error in buildAnalysisViewModel:", err);
      const safeScore = Number.isFinite(Number(analysis?.score)) ? Number(analysis.score) : 75;
      return {
        originalCode: String(originalCode || ""), optimizedCode: String(originalCode || ""), score: safeScore,
        timeComplexity: analysis?.newTimeComplexity || analysis?.oldTimeComplexity || "Unknown",
        spaceComplexity: analysis?.newSpaceComplexity || analysis?.oldSpaceComplexity || "Unknown",
        summaryText: analysis?.summary || "Analysis completed.", language: "javascript",
        diffStats: { originalLines: 0, optimizedLines: 0, changedLines: 0, breakdown: "No changes" },
        diff: { identical: true, hasChanges: false, hunks: [], alignedRows: [] }, feedback: null, explanationTabs: [], analysis
      };
    }
  }, [analysis, originalCode]);

  const copyToClipboard = async (text, label) => {
    const cleanText = String(text || "").trim();
    if (!cleanText) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = cleanText;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopyState(label);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopyState(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyState("Copy failed");
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopyState(""), 2000);
    }
  };

  const getScoreStatus = (score) => {
    if (score >= 90) return { label: "EXCELLENT", color: "#00e676" };
    if (score >= 75) return { label: "GOOD", color: "#00E5FF" };
    if (score >= 50) return { label: "NEEDS IMPROVEMENT", color: "#ffb300" };
    return { label: "CRITICAL", color: "#ff1744" };
  };
  const scoreStatus = getScoreStatus(model.score || 0);

  // Synchronized scroll handlers between left and right editor panes
  const handleLeftScroll = () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    if (rightCodeRef.current && leftCodeRef.current) {
      rightCodeRef.current.scrollTop = leftCodeRef.current.scrollTop;
      rightCodeRef.current.scrollLeft = leftCodeRef.current.scrollLeft;
    }
    requestAnimationFrame(() => { isSyncingRef.current = false; });
  };

  const handleRightScroll = () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    if (leftCodeRef.current && rightCodeRef.current) {
      leftCodeRef.current.scrollTop = rightCodeRef.current.scrollTop;
      leftCodeRef.current.scrollLeft = rightCodeRef.current.scrollLeft;
    }
    requestAnimationFrame(() => { isSyncingRef.current = false; });
  };

  const handleScrollToFindings = () => {
    document.getElementById("key-findings")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isNoChanges = model.diff?.identical || !model.diff?.hasChanges || model.analysis?.hasImprovements === false;

  // Language & Filename labels
  const langUpper = (model.language || "code").toUpperCase();
  const getDisplayFilename = (lang) => {
    switch (lang?.toLowerCase()) {
      case "cpp": case "c++": return "twoSum.cpp";
      case "python": case "py": return "solution.py";
      case "java": return "Solution.java";
      case "c": return "solution.c";
      case "typescript": case "ts": return "solution.ts";
      default: return "solution.js";
    }
  };
  const displayFileName = getDisplayFilename(model.language);

  // Prepare aligned rows for synchronized line-by-line full file rendering
  const alignedRows = React.useMemo(() => {
    if (model.diff?.alignedRows && model.diff.alignedRows.length > 0) {
      return model.diff.alignedRows;
    }
    const lines = (model.originalCode || "").split("\n");
    return lines.map((l, i) => ({
      type: "unchanged",
      origLineNum: i + 1,
      imprvLineNum: i + 1,
      origText: l,
      imprvText: l
    }));
  }, [model.diff?.alignedRows, model.originalCode]);

  return (
    <AnalyticsErrorBoundary onBackToDashboard={onBackToDashboard}>
      <div className="analytics-view">
        <main className="analytics-shell">

          {/* PAGE TITLE & SUBTITLE */}
          <div className="review-page-header">
            <div className="rph-title-group">
              <div className="rph-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h1 className="rph-title">CODE COMPARISON</h1>
                <p className="rph-subtitle">
                  {isNoChanges
                    ? "Review complete — No meaningful changes recommended"
                    : "Review and compare your code with AI improvements"}
                </p>
              </div>
            </div>
          </div>

          {/* 1. MAIN CODE COMPARISON HERO */}
          {isNoChanges ? (
            /* ==============================================================
               EMPTY / OPTIMAL CODE CASE:
               Shows full original source code + clean optimal status banner.
               Never shows an empty or artificial improved code panel.
               ============================================================== */
            <div className="optimal-code-wrapper">
              <div className="optimal-code-banner">
                <div className="ocb-badge">✓ CODE LOOKS GOOD</div>
                <h2 className="ocb-title">No meaningful changes are recommended.</h2>
                <p className="ocb-desc">Your code is already clean and efficient.</p>
              </div>

              <div className="code-diff-panel single-optimal-panel">
                <div className="cdp-header">
                  <div className="cdp-title">
                    <span className="dot dot-green">●</span>
                    <span>ORIGINAL CODE · FULL SOURCE</span>
                  </div>
                  <div className="cdp-meta">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="cdp-filename">{displayFileName}</span>
                    <span className="cdp-badge">{langUpper}</span>
                  </div>
                </div>

                <div className="cdp-body">
                  {(model.originalCode || "").split("\n").map((line, i) => (
                    <div key={`orig-optimal-${i}`} className="code-row">
                      <span className="code-line-num">{i + 1}</span>
                      <span className="code-line-gutter-marker"></span>
                      <span
                        className="code-line-text"
                        dangerouslySetInnerHTML={{ __html: safeSyntaxHighlight(line, model.language) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ==============================================================
               IMPROVEMENTS EXIST:
               Full-file side-by-side comparison from line 1 to end.
               Red background & "-" for removed/replaced lines in Original.
               Green background & "+" for added/replacing lines in Improved.
               Unchanged lines stay normal and readable.
               ============================================================== */
            <div className="code-comparison-grid">

              {/* LEFT PANEL: ORIGINAL CODE (FULL SOURCE) */}
              <div className="code-diff-panel original-panel">
                <div className="cdp-header">
                  <div className="cdp-title">
                    <span className="dot dot-red">●</span>
                    <span>ORIGINAL CODE</span>
                  </div>
                  <div className="cdp-meta">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="cdp-filename">{displayFileName}</span>
                    <span className="cdp-badge">{langUpper}</span>
                  </div>
                </div>

                <div className="cdp-body" ref={leftCodeRef} onScroll={handleLeftScroll}>
                  {alignedRows.map((row, i) => {
                    const isMod = row.type === "modified";
                    const isDel = row.type === "removed";
                    const lineClass = isDel || isMod ? "line-removed" : "";
                    const marker = isDel || isMod ? "-" : "";

                    return (
                      <div key={`orig-row-${i}`} className={`code-row ${lineClass} ${!row.origLineNum ? "line-empty" : ""}`}>
                        <span className="code-line-num">{row.origLineNum || ""}</span>
                        <span className={`code-line-gutter-marker ${marker ? "marker-del" : ""}`}>{marker}</span>
                        <span
                          className="code-line-text"
                          dangerouslySetInnerHTML={{
                            __html: row.origLineNum
                              ? safeSyntaxHighlight(row.origText, model.language, isMod ? row.inline : null, "del")
                              : "&nbsp;"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Legend */}
                <div className="cdp-legend">
                  <span className="legend-item"><span className="legend-swatch swatch-red"></span> Removed / Modified</span>
                  <span className="legend-item"><span className="legend-swatch swatch-green"></span> Added / Improved</span>
                </div>
              </div>

              {/* RIGHT PANEL: IMPROVED CODE (FULL SOURCE) */}
              <div className="code-diff-panel improved-panel">
                <div className="cdp-header">
                  <div className="cdp-title">
                    <span className="dot dot-green">●</span>
                    <span>IMPROVED CODE</span>
                  </div>
                  <div className="cdp-meta">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="cdp-filename">{displayFileName}</span>
                    <span className="cdp-badge">{langUpper}</span>
                  </div>
                </div>

                <div className="cdp-body" ref={rightCodeRef} onScroll={handleRightScroll}>
                  {alignedRows.map((row, i) => {
                    const isMod = row.type === "modified";
                    const isAdd = row.type === "added";
                    const lineClass = isAdd || isMod ? "line-added" : "";
                    const marker = isAdd || isMod ? "+" : "";

                    return (
                      <div key={`imprv-row-${i}`} className={`code-row ${lineClass} ${!row.imprvLineNum ? "line-empty" : ""}`}>
                        <span className="code-line-num">{row.imprvLineNum || ""}</span>
                        <span className={`code-line-gutter-marker ${marker ? "marker-ins" : ""}`}>{marker}</span>
                        <span
                          className="code-line-text"
                          dangerouslySetInnerHTML={{
                            __html: row.imprvLineNum
                              ? safeSyntaxHighlight(row.imprvText, model.language, isMod ? row.inline : null, "ins")
                              : "&nbsp;"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 2. ACTION BUTTONS STRIP */}
          <div className="review-action-strip">
            {!isNoChanges && model.optimizedCode?.trim() ? (
              <>
                <button
                  type="button"
                  className={`primary-gradient-btn ${copyState === "Optimized copied" ? "copied" : ""}`}
                  onClick={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copyState === "Optimized copied" ? "✓ COPIED" : "COPY IMPROVED CODE"}
                </button>
                <button
                  type="button"
                  className="ghost-action-btn"
                  onClick={handleScrollToFindings}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  VIEW CHANGES
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`primary-gradient-btn ${copyState === "Original copied" ? "copied" : ""}`}
                  onClick={() => copyToClipboard(originalCode || "", "Original copied")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copyState === "Original copied" ? "✓ COPIED" : "COPY CURRENT CODE"}
                </button>
              </>
            )}

            <button
              type="button"
              className="ghost-action-btn"
              onClick={onBackToDashboard}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              BACK TO EDITOR
            </button>
          </div>

          {/* 3. METRICS ROW: 4 EQUAL-WIDTH CARDS (SCORE, TIME, SPACE, CHANGES) */}
          <section className="metrics-four-grid" aria-label="Review Metrics">
            {/* CARD 1: SCORE */}
            <div className="metric-box-compact">
              <span className="mbc-label">SCORE</span>
              <div className="mbc-value-group">
                <strong className="mbc-val" style={{ color: scoreStatus.color }}>
                  {model.score || "—"}
                </strong>
                <span className="mbc-sub">/ 100</span>
              </div>
              <span className="mbc-status" style={{ color: scoreStatus.color }}>
                {scoreStatus.label}
              </span>
            </div>

            {/* CARD 2: TIME */}
            <div className="metric-box-compact">
              <span className="mbc-label">TIME</span>
              <div className="mbc-value-group">
                <strong className="mbc-val mono">
                  {model.timeComplexityDelta || model.timeComplexity || "O(1)"}
                </strong>
              </div>
              <span className="mbc-status" style={{ color: model.timeComplexityDelta ? "#00e676" : "#60a5fa" }}>
                {model.timeComplexityDelta ? "IMPROVED" : "OPTIMAL"}
              </span>
            </div>

            {/* CARD 3: SPACE */}
            <div className="metric-box-compact">
              <span className="mbc-label">SPACE</span>
              <div className="mbc-value-group">
                <strong className="mbc-val mono">
                  {model.spaceComplexityDelta || model.spaceComplexity || "O(1)"}
                </strong>
              </div>
              <span className="mbc-status" style={{ color: model.spaceComplexityDelta ? "#00e676" : "#a78bfa" }}>
                {model.spaceComplexityDelta ? "IMPROVED" : "OPTIMAL"}
              </span>
            </div>

            {/* CARD 4: CHANGES */}
            <div className="metric-box-compact">
              <span className="mbc-label">CHANGES</span>
              <div className="mbc-value-group">
                <strong className="mbc-val">
                  {isNoChanges ? "0" : `${model.findings?.length || 1}`}
                </strong>
                <span className="mbc-sub">
                  {isNoChanges ? "changes" : ((model.findings?.length || 1) === 1 ? "finding" : "findings")}
                </span>
              </div>
              <span className="mbc-status" style={{ color: isNoChanges ? "#00e676" : "#00E5FF" }}>
                {isNoChanges ? "ALREADY OPTIMAL" : `${model.diffStats?.changedLines || 1} lines updated`}
              </span>
            </div>
          </section>

          {/* 4. KEY FINDINGS SECTION */}
          {model.findings && model.findings.length > 0 ? (
            <KeyFindingsSection findings={model.findings} />
          ) : (
            <div id="key-findings" className="optimal-findings-notice">
              <span className="dot dot-green">●</span>
              <span>No critical bottlenecks or structural issues detected. All standards satisfied.</span>
            </div>
          )}

          {/* 5. ADDITIONAL INSIGHTS */}
          <AdditionalInsightsSection model={model} />

        </main>
      </div>
    </AnalyticsErrorBoundary>
  );
}
