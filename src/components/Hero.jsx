export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-inner">
        <p className="pill">Intelligence for non-live code</p>
        <h1 id="hero-title">
          The Future of Code,
          <span>Reviewed.</span>
        </h1>
        <p className="hero-copy">
          AI-powered code analysis that finds bugs, improves performance, and writes cleaner code
          instantly. Precision-engineered for the modern stack.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#features">
            Launch Console
            <span aria-hidden="true">→</span>
          </a>
          <a className="outline-button" href="#docs">
            Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
