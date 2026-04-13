import { useState } from "react";

const languages = [
  "JavaScript", "Python", "Rust", "Go", "C++", "Java", "TypeScript", "Swift", "Kotlin", "Ruby"
];

export function Hero({ onLaunch }) {
  return (
    <section className="hero" style={{ height: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="hero-noise"></div>
      
      <div className="hero-inner" style={{ paddingTop: '0' }}>
        {/* BIG CENTERED LOGO */}
        <div style={{
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, #ff4d4d 0%, transparent 70%)',
          margin: '0 auto 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          filter: 'drop-shadow(0 0 40px rgba(255, 77, 77, 0.4))'
        }}>
           <div style={{
             fontSize: '120px',
             color: '#fff',
             fontWeight: '900',
             animation: 'pulse 3s infinite alternate'
           }}>◇</div>
           <div style={{
             position: 'absolute',
             width: '100%',
             height: '100%',
             border: '1px solid rgba(255, 77, 77, 0.2)',
             borderRadius: '50%',
             transform: 'rotateX(60deg) rotateY(20deg)',
             animation: 'spin 10s linear infinite'
           }}></div>
        </div>

        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', marginBottom: '10px' }}>
          <span>CodeSage</span>
        </h1>
        <p className="pill" style={{ borderColor: '#ff4d4d', color: '#ff4d4d', fontSize: '0.7rem' }}>
          THE AI THAT ACTUALLY REVIEWS ARCHITECTURE.
        </p>

        <p className="hero-copy" style={{ marginBottom: '48px', color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
          Scan, refactor, and master your source code in seconds.<br/>
          Enterprise-grade intelligence for developers who value perfection.
        </p>

        <div className="hero-actions" style={{ justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
          <button className="primary-btn pulse" onClick={onLaunch} style={{ padding: '0 40px', height: '56px', fontSize: '1rem' }}>
            LAUNCH SYSTEM
          </button>
          <button className="outline-button" style={{ border: '1px solid rgba(255, 77, 77, 0.3)', color: '#ff4d4d', padding: '0 40px', height: '56px' }}>
            DOCUMENTATION
          </button>
        </div>

        {/* MOVING BANNER (MARQUEE) */}
        <div style={{ 
          width: '100vw', 
          position: 'absolute', 
          bottom: '5%', 
          left: '0',
          overflow: 'hidden',
          padding: '12px 0',
          background: 'rgba(255, 77, 77, 0.05)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 77, 77, 0.15)',
          borderBottom: '1px solid rgba(255, 77, 77, 0.15)',
          boxShadow: '0 0 30px rgba(255, 77, 77, 0.05)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}>
          <div style={{
            display: 'flex',
            gap: '80px',
            width: 'max-content',
            animation: 'marquee 30s linear infinite'
          }}>
            {[...languages, ...languages].map((lang, i) => (
              <span key={i} style={{ 
                fontSize: '0.8rem', 
                fontWeight: '900', 
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(255, 77, 77, 0.2)'
              }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
