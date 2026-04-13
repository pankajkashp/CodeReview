import { useState } from "react";
import { EngineEffect } from "./EngineEffect";

const languagesRow1 = [
  { name: "JavaScript", logo: "JS", tag: "@brendan_eich", text: "Any application that can be written in JavaScript, will eventually be written in JavaScript." },
  { name: "Python", logo: "PY", tag: "@guido_van", text: "Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex." },
  { name: "Rust", logo: "RS", tag: "@graydon_hoare", text: "Fearless concurrency. Performance of C++, safety of a managed language. Truly zero-cost." },
  { name: "Go", logo: "GO", tag: "@rob_pike", text: "Go is not meant to innovate. It is meant to be used. Complexity is what kills software." }
];

const languagesRow2 = [
  { name: "TypeScript", logo: "TS", tag: "@anders_hejlsberg", text: "Static typing for the dynamic web. Optional types, ultimate developer experience." },
  { name: "C++", logo: "C+", tag: "@bjarne_stroustrup", text: "C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do it blows your whole leg off." },
  { name: "Java", logo: "JV", tag: "@james_gosling", text: "Write once, run everywhere. The powerhouse of the enterprise ecosystem for decades." },
  { name: "Swift", logo: "SW", tag: "@chris_lattner", text: "Safe, fast, and expressive. The future of high-performance modern application development." }
];

export function Hero({ onLaunch }) {
  return (
    <section className="hero" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="hero-noise"></div>

      <div className="hero-inner" style={{ paddingTop: '0', zIndex: 2, marginBottom: '60px' }}>
        {/* BIG CENTERED SVG LOGO */}
        <div style={{
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(255,77,77,0.25) 0%, transparent 70%)',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          filter: 'drop-shadow(0 0 40px rgba(255, 77, 77, 0.3))',
          animation: 'breath 4s ease-in-out infinite'
        }}>

          {/* SYMBOL */}
          <div style={{
            fontSize: '90px',
            color: '#fff',
            fontWeight: '900',
            letterSpacing: '2px',
            animation: 'symbolPulse 4s ease-in-out infinite'
          }}>
            ◇
          </div>

          {/* ORBIT RING */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '1px solid rgba(255, 77, 77, 0.15)',
            borderRadius: '50%',
            transform: 'rotateX(60deg) rotateY(20deg)',
            animation: 'spinSlow 20s linear infinite'
          }}></div>

          {/* EXTRA GLOW RING (NEW 🔥) */}
          <div style={{
            position: 'absolute',
            width: '140%',
            height: '140%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,77,77,0.15), transparent)',
            animation: 'glowPulse 5s ease-in-out infinite'
          }}></div>

        </div>

        <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', marginBottom: '5px' }}>
          <span style={{
            background: 'linear-gradient(180deg, #ff4d4d 0%, #a00000 100%)',
            WebkitBackgroundClip: 'text',
            backgroundImage: 'linear-gradient(180deg, #ff4c4c 10%, #d90429 60%, #8d021f 100%)',
            color: 'transparent'
          }}>CodeSage</span>
        </h1>
        <p className="pill" style={{ borderColor: '#ff4d4d', color: '#ff4d4d', fontSize: '0.65rem', marginBottom: '24px' }}>
          THE AI THAT ACTUALLY REVIEWS ARCHITECTURE.
        </p>

        <p className="hero-copy" style={{ marginBottom: '40px', color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: '1.4' }}>
          Scan, refactor, and master your source code in seconds.<br />
          Enterprise-grade intelligence for developers who value perfection.
        </p>

        <div className="hero-actions" style={{ justifyContent: 'center', gap: '20px' }}>
          <button className="primary-btn pulse" onClick={onLaunch} style={{ padding: '0 50px', height: '60px', fontSize: '1.1rem', borderRadius: '8px' }}>
            LAUNCH SYSTEM
          </button>
        </div>
      </div>

      {/* TESTIMONIAL STYLE BANNER - POSITIONED LOWER */}
      <div style={{
        position: 'absolute',
        bottom: '4%',
        width: '100%',
        zIndex: 1,
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}>
        {/* Row 1 */}
        <div style={{
          display: 'flex',
          gap: '24px',
          width: 'max-content',
          animation: 'marquee 45s linear infinite',
          marginBottom: '20px'
        }}>
          {[...languagesRow1, ...languagesRow1].map((lang, i) => (
            <div key={i} className="test-card">
              <div className="test-avatar">{lang.logo}</div>
              <div className="test-content">
                <p>"{lang.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="test-tag">{lang.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{lang.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div style={{
          display: 'flex',
          gap: '24px',
          width: 'max-content',
          animation: 'marquee-reverse 45s linear infinite'
        }}>
          {[...languagesRow2, ...languagesRow2].map((lang, i) => (
            <div key={i} className="test-card">
              <div className="test-avatar">{lang.logo}</div>
              <div className="test-content">
                <p>"{lang.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="test-tag">{lang.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{lang.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .test-card {
           background: rgba(255, 255, 255, 0.02);
           backdrop-filter: blur(12px);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 12px;
           padding: 16px 20px;
           display: flex;
           gap: 16px;
           min-width: 420px;
           align-items: flex-start;
           transition: all 0.3s ease;
        }
        .test-card:hover {
           border-color: rgba(255, 77, 77, 0.3);
           background: rgba(255, 77, 77, 0.02);
           transform: translateY(-2px);
        }
        .test-avatar {
           width: 40px;
           height: 40px;
           border-radius: 8px;
           background: #111;
           border: 1px solid rgba(255, 77, 77, 0.2);
           color: #ff4d4d;
           display: flex;
           align-items: center;
           justify-content: center;
           font-weight: 900;
           font-size: 0.85rem;
           flex: 0 0 auto;
        }
        .test-content p {
           margin: 0 0 10px 0;
           font-size: 0.82rem;
           color: rgba(255,255,255,0.65);
           line-height: 1.5;
           font-style: italic;
           font-family: serif;
        }
        .test-tag {
           font-size: 0.65rem;
           color: #ff4d4d;
           font-weight: 800;
           letter-spacing: 1px;
           text-transform: uppercase;
           border: 1px solid rgba(255, 77, 77, 0.3);
           padding: 2px 8px;
           border-radius: 4px;
        }
           @keyframes breath {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(255, 77, 77, 0.2));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 60px rgba(255, 77, 77, 0.4));
  }
}

@keyframes symbolPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes spinSlow {
  0% {
    transform: rotateX(60deg) rotateY(20deg) rotate(0deg);
  }
  100% {
    transform: rotateX(60deg) rotateY(20deg) rotate(360deg);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}
      `}</style>
    </section>
  );
}
