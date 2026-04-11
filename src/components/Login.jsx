import { supabase } from "../supabaseClient";

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <button onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
}