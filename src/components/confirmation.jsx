import { useEffect } from "react";
import { supabase } from "../supabaseclient";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirm = async () => {
      const { data } = await supabase.auth.getSession();

      // Increased delay to 3.5 seconds so user can read the success message
      setTimeout(() => {
        if (data.session) {
          navigate("/"); 
        } else {
          navigate("/login");
        }
      }, 3500);
    };

    handleConfirm();
  }, [navigate]);

  return (
    <div style={{ 
      background: '#020305',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 77, 77, 0.1)',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ff4d4d',
        marginBottom: '24px',
        animation: 'pulse 2s infinite'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2.5">
          <path d="M20 6L9 17L4 12" />
        </svg>
      </div>
      <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '8px' }}>Identity Verified</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>Your account is now fully secured. Redirecting to terminal...</p>
      
      <div style={{ marginTop: '40px' }} className="tire-loader"></div>
    </div>
  );
}