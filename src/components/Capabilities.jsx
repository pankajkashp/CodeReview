const capabilities = [
  {
    icon: "▦",
    title: "Bug Detection",
    text: "Autonomous scanning for memory leaks, edge cases, and logic flaws before they hit production."
  },
  {
    icon: "✦",
    title: "Optimization",
    text: "AI-driven performance tuning that suggests faster algorithms and efficient resource handling."
  },
  {
    icon: "◎",
    title: "Intelligence",
    text: "Real-time intelligent code completion and structural refactoring based on millions of repositories."
  },
  {
    icon: "▣",
    title: "Code Scoring",
    text: "Quantitative quality metrics for your codebase, revealing maintainability and technical debt."
  }
];

export function Capabilities() {
  return (
    <section className="capabilities" id="features" aria-labelledby="capabilities-title">
      <p className="section-kicker">Core Capabilities</p>
      <h2 id="capabilities-title">Engineered Precision.</h2>
      <div className="capability-grid">
        {capabilities.map((item) => (
          <article className="capability-card" key={item.title}>
            <span className="capability-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
