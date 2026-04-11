const navItems = ["Features", "How It Works", "Intelligence"];

export function TopNavigation({ user, onLogin, onLogout }) {
  return (
    <header className="top-navigation">
      <a className="brand" href="#top">
        <span className="brand-glyph">◇</span>
        <span style={{ fontSize: "20px" }}>Kinetic Void</span>
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
          <>
            <span style={{ fontSize: "14px", color: "rgba(245, 247, 251, 0.78)" }}>{user.email}</span>
            <button className="outline-btn" style={{ height: "36px", padding: "0 16px" }} onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <button className="primary-btn pulse" style={{ height: "36px", padding: "0 16px" }} onClick={onLogin}>Login with Google</button>
        )}
      </div>
    </header>
  );
}