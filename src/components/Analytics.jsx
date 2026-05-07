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
    try {
      await navigator.clipboard.writeText(text || "");
      setCopyState(label);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopyState(""), 1400);
    } catch {
      setCopyState("Copy failed");
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopyState(""), 1400);
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
              <button type="button" className="ghost-button" onClick={() => copyToClipboard(model.optimizedCode || "", "Optimized code copied")}>
                {copyState || "Copy optimized code"}
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
          onCopyOriginal={() => copyToClipboard(originalCode, "Original code copied")}
          onCopyOptimized={() => copyToClipboard(model.optimizedCode || "", "Optimized code copied")}
        />

        <ApproachTabs model={model} />

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

      <footer className="analytics-footer">
        <div className="footer-metrics">
          <div className="footer-metric">
            <small>Readability</small>
            <strong>{model.readabilityScore}</strong>
          </div>
          <div className="footer-metric">
            <small>Maintainability</small>
            <strong>{model.maintainabilityScore}</strong>
          </div>
          <div className="footer-metric">
            <small>Diff lines</small>
            <strong>{model.diffStats.changedLines}</strong>
          </div>
          <div className="footer-metric">
            <small>Pattern</small>
            <strong>{model.pattern.title}</strong>
          </div>
        </div>
        <div className="footer-actions">
          <button type="button" className="ghost-button" onClick={onExit || onBackToDashboard}>
            Exit review
          </button>
          <button type="button" className="primary-button" onClick={onApplyChanges}>
            Apply all changes
          </button>
        </div>
      </footer>
    </div>
  );
}
