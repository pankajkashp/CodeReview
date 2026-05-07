export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <a className="brand" href="#top" aria-label="CodeSage home">
          <div className="brand-icon">◇</div>
          <span>CodeSage</span>
        </a>
      </div>

      <div className="footer-links">
        <div>
          <p>Product</p>
          <a href="#">Engine</a>
          <a href="#">Intelligence</a>
          <a href="#">Pricing</a>
        </div>
        <div>
          <p>Resources</p>
          <a href="#">Documentation</a>
          <a href="#">API Reference</a>
          <a href="#">Support</a>
        </div>
        <div>
          <p>Company</p>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 CodeSage Global</span>
        <span>Better status, better PRs.</span>
      </div>
    </footer>
  );
}
