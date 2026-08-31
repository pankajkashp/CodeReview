import React from "react";
import "../../styles/analytics.css";
import {
  KeyFindingsSection,
  CodeDiffViewer,
  AdditionalInsightsSection,
  buildAnalysisViewModel
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
            The AI review succeeded, but an unexpected layout error occurred while rendering the full comparison view. Your source code and review history remain safe.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={this.props.onBackToDashboard}
            style={{ padding: "10px 24px" }}
          >
            RETURN TO EDITOR
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Analytics({
  analysis = {},
  originalCode = "",
  onBackToDashboard
}) {
  const [copyState, setCopyState] = React.useState("");
  const copyTimerRef = React.useRef(null);

  const model = React.useMemo(() => {
    try {
      return buildAnalysisViewModel({ analysis: { ...analysis, originalCode }, originalCode });
    } catch (err) {
      console.error("[Analytics] Error in buildAnalysisViewModel:", err);
      const safeScore = Number.isFinite(Number(analysis?.score)) ? Number(analysis.score) : 75;
      return {
        originalCode: String(originalCode || ""),
        optimizedCode: String(originalCode || ""),
        score: safeScore,
        timeComplexity: analysis?.newTimeComplexity || analysis?.oldTimeComplexity || "Unknown",
        spaceComplexity: analysis?.newSpaceComplexity || analysis?.oldSpaceComplexity || "Unknown",
        summaryText: analysis?.summary || "Analysis completed.",
        language: "javascript",
        diffStats: { originalLines: 0, optimizedLines: 0, changedLines: 0, breakdown: "No changes" },
        diff: { identical: true, hasChanges: false, hunks: [], alignedRows: [] },
        feedback: null,
        explanationTabs: [],
        analysis
      };
    }
  }, [analysis, originalCode]);

  const copyToClipboard = async (text, label) => {
    const cleanText = String(text || "").trim();
    if (!cleanText) return;

    try {
      // Primary: Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanText);
      } else {
        // Fallback: Textarea hack
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
    if (score >= 90) return { label: "EXCELLENT", color: "var(--semantic-success)" };
    if (score >= 75) return { label: "GOOD", color: "var(--color-accent-primary)" };
    if (score >= 50) return { label: "NEEDS IMPROVEMENT", color: "var(--semantic-warning)" };
    return { label: "CRITICAL", color: "var(--semantic-danger)" };
  };
  const scoreStatus = getScoreStatus(model.score || 0);

  const handleJumpToHunk = (hunkId) => {
    const el = document.getElementById(hunkId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("hunk-target-highlight");
      setTimeout(() => el.classList.remove("hunk-target-highlight"), 2200);
    } else {
      const diffEl = document.getElementById("code-changes");
      diffEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToChanges = () => {
    const diffEl = document.getElementById("code-changes");
    diffEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnalyticsErrorBoundary onBackToDashboard={onBackToDashboard}>
      <div className="analytics-view">
        <div className="analytics-backdrop" aria-hidden="true">
          <span className="backdrop-orb backdrop-orb-a" />
          <span className="backdrop-orb backdrop-orb-b" />
          <span className="backdrop-grid" />
        </div>

        <main className="analytics-shell">
          {/* HIERARCHY PART 1 & 2: Result Hero Header */}
          <header className="analytics-hero">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="hero-badge">
                  <i />
                  AI CODE REVIEW COMPLETE
                </span>
                {model.timeComplexityDelta && (
                  <span className="finding-complexity-badge" style={{ fontSize: "0.75rem", padding: "3px 10px" }}>
                    {model.timeComplexityDelta}
                  </span>
                )}
              </div>

              <h1>
                {model.findings?.[0]?.title
                  ? `${model.findings[0].title}`
                  : (model.diff?.hasChanges ? "Optimization Opportunities Identified" : "Code Quality is High & Optimal")}
              </h1>

              <p className="hero-ai-summary">
                {model.summaryText}
              </p>

              {/* Main weakness / core takeaway callout (Part 2) */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "6px 14px",
                borderRadius: "8px",
                margin: "4px 0 16px",
                fontSize: "0.82rem"
              }}>
                <span style={{ color: "var(--color-accent-primary)", fontWeight: "800", letterSpacing: "0.08em" }}>
                  CORE TAKEAWAY:
                </span>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {model.mainWeakness}
                </span>
              </div>

              <div className="hero-actions">
                {model.diff?.hasChanges && model.optimizedCode?.trim() ? (
                  <>
                    <button 
                      type="button" 
                      className={`primary-button ${copyState === "Optimized copied" ? "copied" : ""}`} 
                      onClick={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
                    >
                      {copyState === "Optimized copied" ? "✓ COPIED" : "COPY IMPROVED CODE"}
                    </button>
                    <button 
                      type="button" 
                      className="ghost-button"
                      style={{ border: "1px solid rgba(0, 229, 255, 0.4)", color: "#00E5FF" }}
                      onClick={handleScrollToChanges}
                    >
                      VIEW CHANGES ↓
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--semantic-success, #00e676)",
                      fontSize: "0.82rem",
                      fontWeight: "800",
                      letterSpacing: "0.08em",
                      padding: "8px 14px",
                      background: "rgba(0, 230, 118, 0.08)",
                      border: "1px solid rgba(0, 230, 118, 0.25)",
                      borderRadius: "8px"
                    }}>
                      ✓ CODE LOOKS GOOD
                    </div>
                    <button 
                      type="button" 
                      className={`primary-button ${copyState === "Original copied" ? "copied" : ""}`} 
                      onClick={() => copyToClipboard(originalCode || "", "Original copied")}
                    >
                      {copyState === "Original copied" ? "✓ COPIED" : "COPY CURRENT CODE"}
                    </button>
                  </>
                )}
                <button type="button" className="ghost-button" onClick={onBackToDashboard}>
                  BACK TO EDITOR
                </button>
              </div>
            </div>

            {/* Score Ring (Part 2) */}
            <div className="hero-score-card">
              <div 
                className="score-ring" 
                style={{ 
                  "--score": model.score,
                  "--score-color": scoreStatus.color
                }}
              >
                <div className="score-ring-inner">
                  <span>SCORE</span>
                  <strong>{model.score || "—"}</strong>
                  <small>/ 100</small>
                </div>
              </div>
              <div className="hero-score-status" style={{ color: scoreStatus.color }}>
                {scoreStatus.label}
              </div>
            </div>
          </header>

          {/* HIERARCHY PART 3: Key Findings Section */}
          <KeyFindingsSection
            findings={model.findings}
            onJumpToHunk={handleJumpToHunk}
          />

          {/* HIERARCHY PART 4: Code Changes Hero Comparison */}
          <div id="code-changes">
            <CodeDiffViewer
              model={model}
              copyState={copyState}
              onCopyOriginal={() => copyToClipboard(originalCode, "Original copied")}
              onCopyOptimized={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
            />
          </div>

          {/* HIERARCHY PART 16: Additional Insights & Learning (Below Diff) */}
          <AdditionalInsightsSection model={model} />
        </main>
      </div>
    </AnalyticsErrorBoundary>
  );
}
