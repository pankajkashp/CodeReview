import { useState } from "react";
import { supabase } from "../supabaseclient.js";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: "http://localhost:5173/confirm"
          }
        });
        if (signUpError) throw signUpError;
        setSuccessMsg("Verification email sent! Please check your inbox 🚀");
        // Don't auto-switch to sign-in yet so they can see the message
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("You are not a user, create an account first.");
          }
          throw signInError;
        }
        
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <header className="login-header">
          <h1>{isSignUp ? "Initialize Account" : "Access Console"}</h1>
          <p>{isSignUp ? "Create your developer credentials" : "Enter your security clearance"}</p>
        </header>

        {/* Keeping top error for critical system failures, but moving specific ones below */}
        {error && !error.includes("not a user") && (
          <div className="login-error">{error}</div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Terminal</label>
            <input
              id="email"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passcode</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "AUTHENTICATING..." : (isSignUp ? "CREATE ACCOUNT" : "SIGN IN")}
          </button>

          {/* New Feedback Area below the button */}
          {(error.includes("not a user") || successMsg) && (
            <div style={{ 
              marginTop: '18px', 
              padding: '12px', 
              borderRadius: '6px', 
              fontSize: '0.85rem',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease',
              background: successMsg ? 'rgba(85, 231, 255, 0.1)' : 'rgba(255, 82, 82, 0.1)',
              border: `1px solid ${successMsg ? 'rgba(85, 231, 255, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
              color: successMsg ? '#55e7ff' : '#ffb7b7'
            }}>
              {error.includes("not a user") ? error : successMsg}
            </div>
          )}
        </form>

        <footer className="login-footer">
          <button onClick={() => { 
            setIsSignUp(!isSignUp); 
            setError(""); 
            setSuccessMsg(""); 
          }}>
            {isSignUp ? "Already secured? Sign In" : "Need clearance? Create Account"}
          </button>
        </footer>
      </div>
    </div>
  );
}