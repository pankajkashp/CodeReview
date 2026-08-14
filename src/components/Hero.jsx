import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import '../styles/hero.css';

gsap.registerPlugin(TextPlugin);

function AnimatedCodeSnippet() {
  const codeRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Respect prefers-reduced-motion
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Clear text before starting
        const el = codeRef.current;
        if (el) el.innerHTML = "";
        
        // Target raw code text
        const codeText = `function analyzeArchitecture(ast) {
  // 1. Tokenize input stream
  const tokens = lexer(ast.raw);
  
  // 2. Build semantic tree
  const tree = buildTree(tokens);
  
  // 3. Detect O(N^2) patterns
  const bottlenecks = detectLoops(tree);
  
  if (bottlenecks.length > 0) {
    return optimize(bottlenecks);
  }
  
  return { status: 'OPTIMAL', score: 98 };
}`;
        
        // We use a looping timeline
        const typeTl = gsap.timeline({ repeat: -1, delay: 1.5 });
        typeTl.to(el, {
          duration: 4,
          text: {
            value: codeText,
            preserveSpaces: true
          },
          ease: "none"
        }).to(el, {
          duration: 1.5,
          text: {
            value: "",
            preserveSpaces: true
          },
          ease: "none",
          delay: 3 // Wait 3 seconds before erasing and repeating
        });
      });
      
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const el = codeRef.current;
        if (el) el.innerHTML = `function analyzeArchitecture(ast) {\n  const tokens = lexer(ast.raw);\n  const tree = buildTree(tokens);\n  const bottlenecks = detectLoops(tree);\n  if (bottlenecks.length > 0) {\n    return optimize(bottlenecks);\n  }\n  return { status: 'OPTIMAL' };\n}`;
      });
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-ambient-code">
      <div className="hero-ambient-header">
        <span className="hero-ambient-status">
          <span className="hero-status-dot"></span> SYSTEM.READY
        </span>
        <span className="hero-ambient-thread">// THREAD_01</span>
      </div>
      
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        <code ref={codeRef} className="hero-ambient-text"></code>
        <span className="hero-typing-cursor"></span>
      </pre>
      
      <div className="hero-scan-line"></div>
    </div>
  );
}

export function Hero({ onLaunch }) {
  const heroRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const btnRef = useRef(null);
  const bgRef = useRef(null);
  const dividerRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        
        // Initial states
        gsap.set(bgRef.current, { opacity: 0 });
        gsap.set(leftRef.current.children, { y: 30, opacity: 0 });
        gsap.set(rightRef.current, { x: 30, opacity: 0 });
        gsap.set(btnRef.current, { scale: 0.8, opacity: 0 });
        if (dividerRef.current) gsap.set(dividerRef.current, { scaleX: 0, opacity: 0 });
        if (featuresRef.current) gsap.set(featuresRef.current.children, { y: 20, opacity: 0 });
        
        // Sequence
        tl.to(bgRef.current, { opacity: 0.1, duration: 1, ease: "power2.out" })
          .to(leftRef.current.children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.5")
          .to(dividerRef.current, { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")
          .to(featuresRef.current.children, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4")
          .to(rightRef.current, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.8");
      });
      
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      
      {/* 1. BACKGROUND: Full-Bleed Overlay Image */}
      <div className="hero-bg-overlay" ref={bgRef}></div>

      {/* FOREGROUND CONTENT */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* 2. GRID LAYOUT: Content over background */}
        <div className="hero-inner-grid">
          
          {/* Left Side: Typography */}
          <div className="hero-content-left" ref={leftRef}>
            <h1 className="hero-headline">
              <span className="hero-headline-accent">{">_"}</span>
              <span className="hero-headline-text">CodeSage</span>
            </h1>
            <p className="hero-copy-text" style={{ marginBottom: '10px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              The AI that actually reviews architecture.
            </p>
            <p className="hero-copy-text" style={{ marginBottom: '48px' }}>
              Scan, refactor, and master your source code in seconds. Detects algorithmic patterns and hidden dependencies like a senior engineer.
            </p>
            
            <div className="hero-action-left" ref={btnRef}>
              <button className="hero-launch-btn" onClick={onLaunch}>
                ./launch_system.sh
              </button>
            </div>

            <div className="hero-divider" ref={dividerRef}></div>
            
            <div className="hero-features-container" ref={featuresRef}>
              <div className="hero-features-header">
                <span className="hero-features-eyebrow">What CodeSage Sees</span>
                <p className="hero-features-subtitle">Not just syntax. Your entire code structure.</p>
              </div>
              
              <div className="hero-features-grid">
                <div className="hero-feature-item feature-logic">
                  <span className="hero-feature-num">01</span>
                  <div className="hero-feature-title">LOGIC</div>
                  <p className="hero-feature-desc">Detect inefficient algorithms and hidden bottlenecks.</p>
                </div>
                
                <div className="hero-feature-item feature-architecture">
                  <span className="hero-feature-num">02</span>
                  <div className="hero-feature-title">ARCHITECTURE</div>
                  <p className="hero-feature-desc">Understand dependencies, structure, and patterns.</p>
                </div>
                
                <div className="hero-feature-item feature-security">
                  <span className="hero-feature-num">03</span>
                  <div className="hero-feature-title">SECURITY</div>
                  <p className="hero-feature-desc">Find suspicious and vulnerable code paths.</p>
                </div>
                
                <div className="hero-feature-item feature-quality">
                  <span className="hero-feature-num">04</span>
                  <div className="hero-feature-title">QUALITY</div>
                  <p className="hero-feature-desc">Improve readability, maintainability, and scalability.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Animated Ambient Element */}
          <div className="hero-content-right" ref={rightRef}>
            <AnimatedCodeSnippet />
          </div>
          
        </div>

      </div>

    </section>
  );
}
