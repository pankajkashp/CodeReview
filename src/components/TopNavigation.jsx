const navItems = ["Features", "How It Works", "Intelligence"];

export function TopNavigation() {
  return (
    <header className="top-navigation">
      <a className="brand" href="#top" aria-label="Kinetic Void home">
        <span className="brand-glyph">◇</span>
        <span style={{ fontSize: "20px" }}>Kinetic Void</span>
      </a>

      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <a href="#login">Login</a>
        <a className="signin-button" href="#signup">
          Sign Up
        </a>
      </div>
    </header>
  );
}
