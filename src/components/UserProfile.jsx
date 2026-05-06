import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function UserProfile({ user, onLogout, onBack, setActivePanel, activePanel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0].toUpperCase() || "?";
  const userAvatar = user?.user_metadata?.avatar_url;

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
        className="profile-trigger-new"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          padding: '0px 1px 0px 10px',
          borderRadius: '40px',
          background: '#05070a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          transition: 'all 0.3s ease',
          width: 'max-content',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          position: 'relative'
        }}
      >
        <h3 style={{
          fontSize: '0.78rem',
          fontWeight: '900',
          color: 'var(--primary-color)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginTop: '0px',
          fontFamily: "'Outfit', sans-serif",
          position: 'relative',
          zIndex: 1002,
          paddingTop: '13px',
          transition: 'all 0.3s ease'
        }}>
          Profile
        </h3>
        <div className="user-avatar-exclusive-box" style={{
          margin: 0,
          background: '#05070a',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
          border: '2px solid var(--primary-color)',
          height: '34px',
          width: '34px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1002
        }}>
          {userAvatar ? <img src={userAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userInitial}
        </div>
      </div>

      <style>{`
        .profile-trigger-new:hover {
          background: rgba(59, 130, 246, 0.08) !important;
          border-color: rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.2);
        }
        .profile-trigger-new:hover h3 {
          color: #fff !important;
          text-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        }
      `}</style>

      <div className={`user-profile-menu ${menuOpen ? 'open' : ''}`} style={{ width: '220px' }}>
        <div style={{ padding: '12px 20px', fontSize: '0.75rem', opacity: 0.5 }}>
          {user.email}
        </div>
        <div className="menu-divider" />

        {/* DASHBOARD NAVIGATION */}
        {setActivePanel && (
          <>
            <button
              className={activePanel === 'dashboard' ? 'active-menu' : ''}
              onClick={() => { setMenuOpen(false); setActivePanel("dashboard"); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Engine Dashboard
            </button>
            <button
              className={activePanel === 'history' ? 'active-menu' : ''}
              onClick={() => { setMenuOpen(false); setActivePanel("history"); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Review History
            </button>
            <div className="menu-divider" />
          </>
        )}

        <button onClick={() => { setMenuOpen(false); navigate("/profile"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </button>

        <button onClick={() => { setMenuOpen(false); navigate("/about"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          About CodeSage
        </button>

        {onBack && (
          <button onClick={() => { setMenuOpen(false); onBack(); }} style={{ color: 'var(--primary-color)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Exit Engine
          </button>
        )}

        <div className="menu-divider" />
        <button
          onClick={() => { setMenuOpen(false); onLogout(); }}
          style={{ opacity: 0.7 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}


