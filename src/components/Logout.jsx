import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import "../styles/login.css";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await supabase.auth.signOut();
    };

    performLogout();

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div className="login-shell" style={{ position: 'relative' }}>
      {/* 🌌 BACKGROUND */}
      <div className="stars"></div>
      <div className="shooting-stars">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>

      <div className="login-card">

        <header className="login-header">
          <div style={{ 
            background: 'rgba(255, 77, 77, 0.1)', 
            borderRadius: '50%', 
            width: '64px', 
            height: '64px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid rgba(255, 77, 77, 0.3)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
              <path d="M8 12L11 15L16 9" />
            </svg>
          </div>
          <h1>Session Terminated</h1>
          <p>You have been safely logged out of CodeSage.</p>
        </header>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            Redirecting to home in 3 seconds...
          </p>
          <button 
            className="login-submit" 
            style={{ marginTop: '20px' }}
            onClick={() => navigate("/")}
          >
            RETURN HOME
          </button>
        </div>
      </div>
    </div>
  );
}
