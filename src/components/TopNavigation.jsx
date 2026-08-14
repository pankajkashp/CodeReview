import { UserProfile } from "./UserProfile.jsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function TopNavigation({ user, onLoginClick, onLogout }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <header className="top-navigation">
      <Link className="brand" to="/">
        <span className="brand-glyph">◇</span>
        <span style={{ fontSize: "20px" }}>CodeSage</span>
      </Link>

      <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/about" style={{ 
          fontSize: '0.8rem', 
          fontWeight: '700', 
          color: 'var(--color-text-secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          transition: 'color 0.3s'
        }} className="nav-link-hover">
          About
        </Link>
        {user && (
          <Link to="/dashboard" style={{ 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            color: 'var(--color-text-secondary)', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            transition: 'color 0.3s'
          }} className="nav-link-hover">
            Dashboard
          </Link>
        )}
        <div className="nav-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            className="theme-toggle-btn"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          {user ? (
            <UserProfile user={user} onLogout={onLogout} />
          ) : (
            <button className="primary-btn pulse" onClick={onLoginClick}>
              Login / Signup
            </button>
          )}
        </div>
      </nav>

      <style>{`
        .nav-link-hover:hover {
          color: var(--color-accent-primary) !important;
        }
        .theme-toggle-btn:hover {
          color: var(--color-accent-primary) !important;
          border-color: var(--color-accent-primary) !important;
        }
      `}</style>
    </header>
  );
}