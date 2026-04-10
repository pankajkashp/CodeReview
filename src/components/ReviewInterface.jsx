const metricLabels = ["Logic", "Runtime", "Style", "Risk"];

export function ReviewInterface() {
  return (
    <section className="interface-section" id="how-it-works" aria-label="Code review interface">
      <div className="interface-frame">
        <div className="scanner-screen">
          <div className="screen-topline">
            <span>Debugging Kernel</span>
            <span>0000</span>
          </div>
          <div className="toolbar">
            <span />
            <span />
            <span />
            <strong>Code image</strong>
          </div>
          <div className="analysis-grid">
            <aside>
              <h2>Function Symphony</h2>
              {Array.from({ length: 12 }, (_, index) => (
                <p key={index} />
              ))}
            </aside>
            <div className="scan-core" aria-hidden="true">
              <span className="ring ring-one" />
              <span className="ring ring-two" />
              <span className="ring ring-three" />
              <span className="matrix" />
            </div>
            <aside className="right-panel">
              <div className="mini-chart" />
              <div className="control-stack">
                {metricLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </aside>
          </div>
          <div className="lower-console">
            <div className="annotation">
              <span>AI Suggestion</span>
              <strong>Performance insight</strong>
              <p>
                Refactor detected in <mark>auth_provider.py</mark>. Efficiency can be improved by
                24% using asynchronous hooks.
              </p>
            </div>
            <div className="dials">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
