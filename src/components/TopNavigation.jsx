import { UserProfile } from "./UserProfile.jsx";

const navItems = ["Features", "How It Works", "Intelligence"];

export function TopNavigation({ user, onLoginClick, onLogout }) {
  return (
    <header className="top-navigation">
      <a className="brand" href="#top">
        <span className="brand-glyph">◇</span>
        <span style={{ fontSize: "20px" }}>CodeSage</span>
      </a>

      <div className="nav-actions">
        {user ? (
          <UserProfile user={user} onLogout={onLogout} />
        ) : (
          <button className="primary-btn pulse" onClick={onLoginClick}>
            Login / Signup
          </button>
        )}
      </div>
    </header>
  );
}