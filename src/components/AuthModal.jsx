import { useState } from "react";
import "../styles/auth.css";

export default function AuthModal({ supabase, onClose }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Password is not correct or account not found.");
        }
        throw signInError;
      }
      
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/confirm"
        }
      });

      if (signUpError) throw signUpError;
      
      setError("Verification email sent! Please check your inbox 🚀");
      setTimeout(() => setMode("login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      {/* 🌌 BACKGROUND */}
      <div className="stars"></div>
      <div className="shooting-stars">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="auth-box">

        <button className="close" onClick={onClose}>✕</button>
        
        <div style={{ marginBottom: '20px', fontSize: '24px', color: 'var(--primary-color)' }}>◇</div>
        <h2>{mode === "login" ? "Access Console" : "Initialize Identity"}</h2>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
          <input
            type="email"
            placeholder="Identity Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Clearance Passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "PROCESSING..." : (mode === "login" ? "LOGIN" : "SIGN UP")}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="switch">
          {mode === "login" ? (
            <>
              New engineer?{" "}
              <span onClick={() => setMode("signup")}>Register Identity</span>
            </>
          ) : (
            <>
              Already registered?{" "}
              <span onClick={() => setMode("login")}>Enter Console</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}