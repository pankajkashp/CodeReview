import { useState, useEffect, useRef } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

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
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatarUrl }
    });
    
    setSaving(false);
    if (updateError) setError(updateError.message);
    else setSuccess("Identity Updated Successfully!");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    // Validate size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB.');
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Upload to 'codereview' bucket
      const { error: uploadError } = await supabase.storage
        .from('codereview')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
          throw new Error('Storage bucket "codereview" not found. Please create it in your Supabase dashboard.');
        }
        throw uploadError;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('codereview')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      
      // Update profile immediately
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      setSuccess("Identity Portrait Uploaded!");
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message || "Failed to upload image. Ensure bucket policies allow uploads.");
    } finally {
      setUploading(false);
    }
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
               <div 
                className="avatar-upload-btn" 
                onClick={() => fileInputRef.current?.click()}
               >
                 {uploading ? "..." : "UPLOAD"}
               </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
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
                  <label>Identity Portrait</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button"
                      className="login-submit"
                      style={{ padding: '0 20px', width: 'auto', margin: 0, fontSize: '0.8rem' }}
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        fileInputRef.current?.click();
                      }}
                      disabled={uploading}
                    >
                      {uploading ? "..." : "UPLOAD FILE"}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>
                    Paste a link or upload a file from your desktop.
                  </p>
                </div>

                <button 
                  className="login-submit" 
                  type="submit" 
                  disabled={saving || uploading}
                  style={{ marginTop: '20px' }}
                >
                  {saving ? "SAVING..." : "UPDATE IDENTITY"}
                </button>

                {error && (
                  <div className="error-message" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', padding: '10px', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '4px' }}>
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="success-message" style={{ color: '#34d399', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', padding: '10px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '4px' }}>
                    {success}
                  </div>
                )}
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
