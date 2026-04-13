import { useState, useEffect } from "react";
import { supabase } from "../supabaseclient.js";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import "../styles/login.css"; // Reuse form styles

export default function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("history");
  
  // Settings state
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");

      // Fetch history
      const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setHistory(reviews || []);
      setLoading(false);
    }

    getProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatarUrl }
    });
    setSaving(false);
    if (error) alert(error.message);
    else alert("Profile updated successfully!");
  };

  const userInitial = fullName?.[0] || user?.email?.[0] || "?";

  if (loading) return <div className="profile-shell">Loading Terminal...</div>;

  return (
    <div className="profile-shell">
      <div className="back-link" onClick={() => navigate("/")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Return to Intelligence Home
      </div>

      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-big">
               {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : userInitial.toUpperCase()}
               <div className="avatar-upload-btn">EDIT</div>
            </div>
            <h1 style={{ fontSize: '1.2rem', margin: '10px 0 4px' }}>{fullName || "Developer"}</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={activeTab === "history" ? "active" : ""} 
              onClick={() => setActiveTab("history")}
            >
              Analysis History
            </button>
            <button 
              className={activeTab === "settings" ? "active" : ""} 
              onClick={() => setActiveTab("settings")}
            >
              Account Settings
            </button>
          </nav>
        </aside>

        <main className="profile-main">
          {activeTab === "history" ? (
            <section className="history-card">
              <header className="card-header">
                <h2>Security Log</h2>
                <p>Tracked records of your source code integrity reviews.</p>
              </header>

              <div className="history-list">
                {history.length > 0 ? history.map((record) => (
                  <div key={record.id} className="history-item">
                    <div className="history-info">
                      <h3>Analytic Pulse #{record.id.slice(0, 6)}</h3>
                      <span>{new Date(record.created_at).toLocaleString()}</span>
                    </div>
                    <div className="history-score">
                      {record.result?.score || 85}
                    </div>
                  </div>
                )) : (
                  <div className="history-empty">
                    <p>Terminal empty. Start an analysis to generate records.</p>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="settings-card">
              <header className="card-header">
                <h2>Account Configuration</h2>
                <p>Maintain your developer identity and security preferences.</p>
              </header>

              <form className="login-form" onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Avatar Connection (URL)</label>
                  <input 
                    type="text" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <button 
                  className="login-submit" 
                  type="submit" 
                  disabled={saving}
                  style={{ marginTop: '20px' }}
                >
                  {saving ? "SAVING..." : "UPDATE IDENTITY"}
                </button>
              </form>settings-card
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
