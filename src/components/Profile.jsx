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
        navigate("/");
        return;
      }
      setUser(user);
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");

      // Fetch history
      const { data: records } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setHistory(records || []);
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
    else alert("Identity Updated Successfully!");
  };

  const deleteHistoryRecord = async (e, id) => {
    e.stopPropagation();
    if (!confirm("De-authorize and delete this record permanently?")) return;
    
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);
      
    if (!error) {
      setHistory(history.filter(h => h.id !== id));
    }
  };

  const userInitial = fullName?.[0] || user?.email?.[0] || "?";

  if (loading) return (
    <div className="profile-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader-text">Initializing Identity Terminal...</div>
    </div>
  );

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
               <div className="avatar-upload-btn" onClick={() => setActiveTab("settings")}>EDIT</div>
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
            <section className="history-card" style={{ background: '#0d1117' }}>
              <header className="card-header">
                <h2>Security Log</h2>
                <p>Tracked records of your source code integrity reviews.</p>
              </header>

              <div className="history-list">
                {history.length > 0 ? history.map((record) => (
                  <div key={record.id} className="history-item" style={{ position: 'relative' }}>
                    <div className="history-info">
                      <h3>Analytic Pulse #{record.id.slice(0, 6)}</h3>
                      <span>{new Date(record.created_at).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="history-score" style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                        {record.result?.score || 85}
                      </div>
                      <button 
                        onClick={(e) => deleteHistoryRecord(e, record.id)}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem' }}
                        title="Delete record"
                      >
                        ✕
                      </button>
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
            <section className="settings-card" style={{ background: '#0d1117' }}>
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
                  <label>Avatar Connection (Image URL)</label>
                  <input 
                    type="text" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>Paste a link to your custom identity portrait.</p>
                </div>
                <button 
                  className="login-submit" 
                  type="submit" 
                  disabled={saving}
                  style={{ marginTop: '20px' }}
                >
                  {saving ? "SAVING..." : "UPDATE IDENTITY"}
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
