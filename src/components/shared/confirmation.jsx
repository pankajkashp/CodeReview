import { useEffect } from "react";
import supabase from "../../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirm = async () => {
      const { data } = await supabase.auth.getSession();

      const timer = setTimeout(() => {
        if (data.session) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      }, 1000);

      return () => clearTimeout(timer);
    };

    handleConfirm();
  }, [navigate]);

  return (
    <div style={{
      background: 'var(--color-bg-page)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-text-primary)',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-accent-primary)',
        background: 'rgba(0, 229, 255, 0.08)',
        marginBottom: '24px',
        animation: 'pulse 2s infinite'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2.5">
          <path d="M20 6L9 17L4 12" />
        </svg>
      </div>
      <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '8px' }}>Identity Verified</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '440px' }}>
        Your account is now fully secured. Redirecting to engine terminal...
      </p>

      <button
        type="button"
        className="primary-button"
        style={{ marginTop: '32px', padding: '10px 28px', fontSize: '0.85rem' }}
        onClick={() => navigate("/dashboard")}
      >
        CONTINUE TO DASHBOARD
      </button>
    </div>
  );
}