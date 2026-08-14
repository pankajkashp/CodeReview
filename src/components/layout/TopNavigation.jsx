import { UserProfile } from "../shared/UserProfile.jsx";
import { Link } from "react-router-dom";

export function TopNavigation({ user, onLoginClick, onLogout }) {


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
      `}</style>
    </header>
  );
}