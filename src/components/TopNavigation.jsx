import { UserProfile } from "./UserProfile.jsx";

const navItems = ["Features", "How It Works", "Intelligence"];

export function TopNavigation({ user, onLogin, onLogout }) {
  return (
    <header className="top-navigation">
      <a className="brand" href="#top">
        <span className="brand-glyph">◇</span>
        <span style={{ fontSize: "20px" }}>CodeSage</span>
      </a>

      <nav>
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        {user ? (
          <UserProfile user={user} onLogout={onLogout} />
        ) : (
          <button className="primary-btn pulse" onClick={onLogin}>
            Login / Signup
          </button>
        )}
      </div>
    </header>
  );
}