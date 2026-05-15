import React from "react";
import "../styles/analytics.css";
import {
  ApproachTabs,
  CodeDiffViewer,
  ExplanationTabs,
  FeedbackPanel,
  LearningPanel,
  ReanalyzePanel,
  SuggestionsPanel,
  SummaryStrip,
  buildAnalysisViewModel
} from "./analysis/AnalysisSections.jsx";

export function Analytics({
  onApplyChanges,
  analysis = {},
  originalCode = "",
  onExit,
  onAnalyze,
  onBackToDashboard,
  loading = false
}) {
  const [editableCode, setEditableCode] = React.useState(originalCode);
  const [copyState, setCopyState] = React.useState("");
  const copyTimerRef = React.useRef(null);

  React.useEffect(() => {
    setEditableCode(originalCode);
  }, [originalCode]);

  const model = React.useMemo(
    () => buildAnalysisViewModel({ analysis: { ...analysis, originalCode }, originalCode }),
    [analysis, originalCode]
  );

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

  const timeLabel = model.timeComplexity || analysis.oldTimeComplexity || "Unknown";
  const spaceLabel = model.spaceComplexity || analysis.oldSpaceComplexity || "Unknown";

  return (
    <div className="analytics-view">
      <div className="analytics-backdrop" aria-hidden="true">
        <span className="backdrop-orb backdrop-orb-a" />
        <span className="backdrop-orb backdrop-orb-b" />
        <span className="backdrop-grid" />
      </div>

      <main className="analytics-shell">
        <header className="analytics-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="hero-badge">
                <i />
                AI REVIEW COMPLETE
              </span>
              <span className="hero-meta">Premium analysis workspace</span>
            </div>

            <h1>
              Actionable review for <span>smarter refactors</span>.
            </h1>

            <p>
              {model.summaryText} Complexity, diff insight, and interview feedback are grouped into one focused workspace.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={onBackToDashboard}>
                Back to dashboard
              </button>
              <button 
                type="button" 
                className={`ghost-button ${copyState === "Optimized copied" ? "copied" : ""}`} 
                onClick={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
              >
                {copyState === "Optimized copied" ? "Optimized copied!" : "Copy optimized code"}
              </button>
            </div>
          </div>

          <div className="hero-score-card">
            <div className="score-ring" style={{ "--score": model.score }}>
              <div className="score-ring-inner">
                <span>Overall score</span>
                <strong>{model.score || "—"}</strong>
                <small>/ 100</small>
              </div>
            </div>
            <div className="hero-score-meta">
              <div>
                <span>Time</span>
                <strong>{timeLabel}</strong>
              </div>
              <div>
                <span>Space</span>
                <strong>{spaceLabel}</strong>
              </div>
              <div>
                <span>Pattern</span>
                <strong>{model.pattern.title}</strong>
              </div>
            </div>
          </div>
        </header>

        <SummaryStrip model={model} />

        <CodeDiffViewer
          model={model}
          copyState={copyState}
          onCopyOriginal={() => copyToClipboard(originalCode, "Original copied")}
          onCopyOptimized={() => copyToClipboard(model.optimizedCode || "", "Optimized copied")}
        />

        <ApproachTabs 
          model={model} 
          onCopy={copyToClipboard}
          copyState={copyState}
        />

        <ExplanationTabs model={model} />

        <FeedbackPanel feedback={model.feedback} />

        <LearningPanel learning={model.learning} />

        <SuggestionsPanel suggestions={model.suggestions} />

        <ReanalyzePanel
          editableCode={editableCode}
          setEditableCode={setEditableCode}
          onAnalyze={onAnalyze}
          loading={loading}
        />
      </main>

      <footer className="analytics-footer" style={{ justifyContent: 'center' }}>
        <div className="footer-actions" style={{ marginLeft: 0 }}>
          <button type="button" className="primary-button" onClick={onExit || onBackToDashboard}>
            Go back
          </button>
        </div>
      </footer>
    </div>
  );
}
