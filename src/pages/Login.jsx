import { useState } from "react";
import supabase from "../lib/supabaseClient.js";
import { getFriendlyAuthErrorMessage } from "../lib/authErrors.js";
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
            emailRedirectTo: window.location.origin + "/confirm"
          }
        });
        if (signUpError) throw signUpError;
        setSuccessMsg("Verification email sent! Please check your inbox 🚀");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        // Direct navigation to Dashboard without bouncing through home (Part 5)
        navigate("/dashboard");
      }
    } catch (err) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">

      {/* 🌌 BACKGROUND LAYER */}
      <div className="login-bg">
        
        
      </div>

      {/* 💠 LOGIN CARD */}
      <div className="login-card">
        <header className="login-header">
          <h1>{isSignUp ? "Initialize Account" : "Access Console"}</h1>
          <p>
            {isSignUp
              ? "Create your developer credentials"
              : "Enter your security clearance"}
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Terminal</label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Passcode</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading
              ? "AUTHENTICATING..."
              : isSignUp
                ? "CREATE ACCOUNT"
                : "SIGN IN"}
          </button>

          {(error || successMsg) && (
            <div className="login-feedback">
              {error || successMsg}
            </div>
          )}
        </form>

        <footer className="login-footer">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setSuccessMsg("");
            }}
          >
            {isSignUp
              ? "Already secured? Sign In"
              : "Need clearance? Create Account"}
          </button>
        </footer>
      </div>
    </div>
  );
}