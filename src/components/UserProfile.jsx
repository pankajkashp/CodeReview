import { useState, useRef, useEffect } from "react";

export function UserProfile({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userInitial = user?.email?.[0].toUpperCase() || "?";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <div 
        className="profile-circle" 
        onClick={() => setMenuOpen(!menuOpen)}
        title={user.email}
      >
        {userInitial}
      </div>
      
      <div className={`user-profile-menu ${menuOpen ? 'open' : ''}`}>
        <div style={{ padding: '12px 20px', fontSize: '0.75rem', opacity: 0.5 }}>
          {user.email}
        </div>
        <div className="menu-divider" />
        <button onClick={() => { setMenuOpen(false); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
             <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </button>
        <button 
          onClick={() => { setMenuOpen(false); onLogout(); }}
          style={{ color: '#ff8080' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
