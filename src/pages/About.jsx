import React from "react";
import "../styles/about.css";

export function About({ onBack }) {
  return (
    <div className="about-container">
      <div className="about-content">
        <header className="about-header">
          <div className="about-badge">MISSION CONTROL</div>
          <h1 className="about-title">
            <span className="highlight">CodeSage – AI Code Review Tool</span>
          </h1>
          <p className="about-subtitle">
            Redefining code integrity through autonomous neural analysis and structural refactoring.
          </p>
        </header>

        <section className="about-section">
          <div className="section-card main-focus">
            <div className="card-header">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h2>What is CodeSage?</h2>
            </div>
            <p>
              CodeSage is a next-generation <strong>AI Code Review Tool</strong> designed for modern engineering teams. 
              Built on a foundation of proprietary large language models and static analysis patterns, 
              it acts as a senior software architect that never sleeps.
            </p>
            <p>
              We don't just find syntax errors; we analyze the <em>intent</em> and <em>integrity</em> of your logic, 
              identifying deep structural flaws, security vulnerabilities, and performance bottlenecks before they reach production.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="section-card secondary">
              <div className="step-number">01</div>
              <h3>Neural Scan</h3>
              <p>
                When you input code, our engine performs a multi-layered neural scan, mapping out execution flows and state dependencies.
              </p>
            </div>
            <div className="section-card secondary">
              <div className="step-number">02</div>
              <h3>Contextual Review</h3>
              <p>
                CodeSage understands language-specific best practices, from JavaScript closure efficiency to Rust memory safety patterns.
              </p>
            </div>
            <div className="section-card secondary">
              <div className="step-number">03</div>
              <h3>Refactoring</h3>
              <p>
                Instead of just listing problems, we generate <strong>CodeSage Refactored</strong> source—optimized for speed, readability, and scale.
              </p>
            </div>
          </div>
        </section>

        <footer className="about-footer">
          <button className="back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            RETURN TO BASE
          </button>
        </footer>
      </div>
    </div>
  );
}
