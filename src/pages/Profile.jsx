import { useState, useEffect, useRef } from "react";
import supabase from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import "../styles/login.css"; // Reuse form styles

function getRecordDetails(record) {
  const result = record.result || {};
  const findingsCount = Array.isArray(result.issues) ? result.issues.length : (result.findings?.length || 0);
  const score = Number.isFinite(Number(result.score)) ? Number(result.score) : 80;

  let lang = "JavaScript";
  let fileName = "code_review.js";
  const codeSnippet = String(record.code || "");
  if (codeSnippet.includes("#include") || codeSnippet.includes("std::")) {
    lang = "C++";
    fileName = "inventory_manager.cpp";
  } else if (codeSnippet.includes("def ") || (codeSnippet.includes("import ") && codeSnippet.includes(":"))) {
    lang = "Python";
    fileName = "metrics_processor.py";
  } else if (codeSnippet.includes("public class ") || codeSnippet.includes("System.out.")) {
    lang = "Java";
    fileName = "UserService.java";
  } else if (codeSnippet.includes("#include <stdio.h>") || codeSnippet.includes("char*")) {
    lang = "C";
    fileName = "config_parser.c";
  } else if (codeSnippet.includes("calculateCartTotal") || codeSnippet.includes("cartItems")) {
    lang = "JavaScript";
    fileName = "cartService.js";
  }

  const dateStr = new Date(record.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return { findingsCount, score, lang, fileName, dateStr };
}

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

  const openHistoricalReview = (record) => {
    const { fileName, lang } = getRecordDetails(record);
    navigate("/dashboard", {
      state: {
        fromHistory: true,
        reviewId: record.id,
        reviewCode: record.code,
        reviewResult: record.result,
        reviewFileName: fileName,
        reviewLanguage: lang
      }
    });
  };

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
      <button 
        type="button"
        className="back-link" 
        onClick={() => navigate("/dashboard")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(220, 235, 255, 0.8)",
          fontSize: "0.85rem",
          fontWeight: "700",
          letterSpacing: "0.06em",
          marginBottom: "24px",
          padding: 0
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Return to Engine Dashboard
      </button>

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
            <p style={{ color: 'var(--color-border-subtle)', fontSize: '0.85rem' }}>{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              type="button"
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              Analysis History
            </button>
            <button
              type="button"
              className={activeTab === "settings" ? "active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              Account Settings
            </button>
            <button
              type="button"
              onClick={() => navigate("/logout")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                border: "1px solid rgba(255, 23, 68, 0.3)",
                color: "#ff8a80",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.78rem",
                fontWeight: "700",
                cursor: "pointer",
                marginTop: "16px",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </nav>
        </aside>

        <main className="profile-main">
          {activeTab === "history" ? (
            <section className="history-card" style={{ background: 'var(--color-bg-surface)' }}>
              <header className="card-header">
                <h2>Security Log</h2>
                <p>Tracked records of your source code integrity reviews.</p>
              </header>

              <div className="history-list">
                {history.length > 0 ? (
                  history.map((record) => {
                    const { findingsCount, score, lang, fileName, dateStr } = getRecordDetails(record);
                    return (
                      <div 
                        key={record.id} 
                        className="history-item interactive-history-item"
                        onClick={() => openHistoricalReview(record)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openHistoricalReview(record); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="history-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--color-accent-primary, #00E5FF)', fontSize: '0.75rem' }}>●</span>
                            <strong style={{ color: '#FFFFFF', fontSize: '0.92rem', fontFamily: "'JetBrains Mono', monospace" }}>
                              {fileName.toUpperCase()}
                            </strong>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(220, 235, 255, 0.65)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span>{lang}</span>
                            <span>·</span>
                            <span>Score {score}</span>
                            <span>·</span>
                            <span>{findingsCount} {findingsCount === 1 ? 'finding' : 'findings'}</span>
                            <span>·</span>
                            <span>{dateStr}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span className="history-view-btn" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--color-accent-primary, #00E5FF)',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            letterSpacing: '0.06em'
                          }}>
                            VIEW →
                          </span>
                          <button
                            type="button"
                            onClick={(e) => deleteHistoryRecord(e, record.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'rgba(255, 23, 68, 0.6)',
                              cursor: 'pointer',
                              fontSize: '1.1rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              transition: 'all 0.2s ease'
                            }}
                            title="Delete record"
                            aria-label="Delete review record"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="history-empty" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ color: 'var(--color-accent-primary, #00E5FF)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      NO REVIEWS YET
                    </div>
                    <p style={{ color: 'rgba(220, 235, 255, 0.65)', fontSize: '0.9rem', marginBottom: '16px' }}>
                      Your completed CodeSage reviews will appear here.
                    </p>
                    <button
                      type="button"
                      className="primary-button"
                      style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                      onClick={() => navigate("/dashboard")}
                    >
                      ANALYZE CODE
                    </button>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="settings-card" style={{ background: 'var(--color-bg-surface)' }}>
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
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '5px' }}>
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
                  <div className="error-message" style={{ color: 'var(--color-status-error)', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', padding: '10px', background: 'var(--color-status-error)', borderRadius: '4px' }}>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="success-message" style={{ color: 'var(--color-status-success)', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', padding: '10px',  borderRadius: '4px' }}>
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
