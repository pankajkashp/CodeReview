import { useState, useEffect, useRef } from "react";
import "../../styles/analysis-loader.css";

export function AnalysisLoader({ filename = "analysis.js" }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    document.body.style.overflow = "hidden";
    return () => {
      isMounted.current = false;
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const sequence = [
      { text: `codesage analyze --target=${filename}`, type: 'command', typeSpeed: 30 },
      { text: `> reading source file... `, delay: 300, appendDone: true, doneDelay: 250 },
      { text: `> tokenizing input... `, delay: 200, appendDone: true, doneDelay: 250 },
      { text: `> building AST... `, delay: 300, appendDone: true, doneDelay: 400 },
      { text: `> detecting algorithmic pattern... `, delay: 350 },
      { text: `> running complexity analysis... `, delay: 400 },
      { text: `> generating review... `, delay: 500 }
    ];

    const runSequence = async () => {
      for (let i = 0; i < sequence.length; i++) {
        if (!isMounted.current) return;
        const item = sequence[i];
        
        if (item.delay) await new Promise(r => setTimeout(r, item.delay));
        if (!isMounted.current) return;

        setVisibleLines(prev => [...prev, { id: i, text: '', type: item.type, showDone: false, appendDone: item.appendDone }]);

        const chars = item.text.split('');
        for (let c = 0; c < chars.length; c++) {
          await new Promise(r => setTimeout(r, item.typeSpeed || 15));
          if (!isMounted.current) return;
          setVisibleLines(prev => {
            const arr = [...prev];
            arr[i].text += chars[c];
            return arr;
          });
        }

        if (item.appendDone) {
          await new Promise(r => setTimeout(r, item.doneDelay || 250));
          if (!isMounted.current) return;
          setVisibleLines(prev => {
            const arr = [...prev];
            arr[i].showDone = true;
            return arr;
          });
        }
      }
      if (isMounted.current) setIsFinished(true);
    };

    runSequence();
  }, [filename]);

  return (
    <div className="analysis-loader-overlay">
      <div className="terminal-loader-container">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <span className="terminal-title">bash — codesage-engine</span>
          </div>
          <div className="terminal-body">
            {visibleLines.map((line, idx) => (
              <div key={line.id} className="terminal-line">
                {line.type === 'command' ? (
                  <>
                    <span className="terminal-accent" style={{ marginRight: '10px' }}>$</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{line.text}</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{line.text}</span>
                    {line.showDone && <span className="terminal-accent" style={{ marginLeft: '6px' }}>done</span>}
                  </>
                )}
                {/* Blinking cursor at the end of the currently active typing line */}
                {!isFinished && idx === visibleLines.length - 1 && (
                  <span className="terminal-cursor">█</span>
                )}
              </div>
            ))}
            
            {/* Blinking cursor drops to new line when sequence is finished but waiting on API */}
            {isFinished && (
              <div className="terminal-line" style={{ marginTop: '8px' }}>
                <span className="terminal-pulse-text">awaiting neural response...</span>
                <span className="terminal-cursor" style={{ marginLeft: '8px' }}>█</span>
              </div>
            )}
          </div>
        </div>
        <div className="loader-sub-text">DO NOT CLOSE OR REFRESH</div>
      </div>
    </div>
  );
}
