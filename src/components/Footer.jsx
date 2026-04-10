const footerGroups = [
  ["Product", "Platform", "Integrations", "Pricing"],
  ["Resources", "Docs", "Blog", "Security"],
  ["Company", "About", "Privacy", "Terms"]
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <a className="brand" href="#top" aria-label="Kinetic Void home">
          <span className="brand-glyph">◇</span>
          <span>Kinetic Void</span>
        </a>
        <p>Architecting the future of artificial intelligence in code.</p>
        <div className="social-links" aria-label="Social links">
          <a href="#x">X</a>
          <a href="#github">G</a>
          <a href="#in">In</a>
        </div>
      </div>
      <div className="footer-columns">
        {footerGroups.map(([title, ...links]) => (
          <nav aria-label={`${title} links`} key={title}>
            <h2>{title}</h2>
            {links.map((link) => (
              <a href={`#${link.toLowerCase()}`} key={link}>
                {link}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2024 Kinetic Void Global</span>
        <span>Better status, better PRs.</span>
      </div>
    </footer>
  );
}
