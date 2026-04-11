const benefits = [
  {
    label: "Multi-repo Context",
    text: "Analyze how your change affects other services in your ecosystem."
  },
  {
    label: "Semantic Search",
    text: "Find technical debt using advanced natural language queries."
  }
];

export function IntelligenceSection() {
  return (
    <section className="intelligence" id="intelligence" aria-labelledby="intelligence-title">
      <div className="wave-panel" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="intelligence-copy">
        <p className="section-kicker">Designed for scale</p>
        <h2 id="intelligence-title">Intelligence Beyond the Syntax.</h2>
        <p>
          CodeSage does not just look for typos. It understands the architectural intent of your
          software, mapping dependencies and predicting downstream effects of every line change.
        </p>
        <div className="benefit-list">
          {benefits.map((item) => (
            <article key={item.label}>
              <span>✳</span>
              <div>
                <h3>{item.label}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
