import { useEffect, useState, useRef } from "react";
import { getMe, updateProfile } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";

function Profile() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [collegeIdCard, setCollegeIdCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const cardRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setFullName(data.fullName);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (!user) fetchUser();
    else {
      setFullName(user.fullName);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        },
      );
      gsap.fromTo(
        avatarRef.current,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.35,
        },
      );
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ text: "", type: "" });
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (collegeIdCard) formData.append("collegeIdCard", collegeIdCard);
      const res = await updateProfile(formData);
      setUser(res.user);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      gsap.fromTo(
        ".profile-msg",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
    } catch (err) {
      console.log(err);
      setMessage({ text: "Update failed. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(99,102,241,0.3)",
              borderTop: "3px solid #6366f1",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}>
            Loading profile...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        color: "#e2e8f0",
        fontFamily: "'Inter',sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .profile-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-input:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .profile-input::placeholder { color: #475569; }
        .file-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .file-input:hover { border-color: rgba(99,102,241,0.5); }
        .save-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 12px;
          padding: 14px; color: #fff;
          font-weight: 600; font-size: 15px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
        }
        .save-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.5); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .dot-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }
      `}</style>

      {/* BG orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "30%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "20%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="dot-grid" />

      {/* Card */}
      <div
        ref={cardRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "480px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "24px",
          padding: "40px 36px",
        }}
      >
        {/* Avatar */}
        <div
          ref={avatarRef}
          style={{ textAlign: "center", marginBottom: "28px" }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={
                user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(99,102,241,0.4)",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #0f1117",
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "#f1f5f9",
              marginTop: "12px",
              marginBottom: "4px",
            }}
          >
            {user?.fullName || "Your Profile"}
          </h2>
          <p style={{ color: "#475569", fontSize: "0.85rem" }}>{user?.email}</p>
          {user?.rollNo && (
            <span
              style={{
                display: "inline-block",
                marginTop: "6px",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "999px",
                padding: "2px 10px",
                fontSize: "11px",
                color: "#a5b4fc",
              }}
            >
              Roll No: {user.rollNo}
            </span>
          )}
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "28px",
          }}
        />

        {/* Message */}
        {message.text && (
          <div
            className="profile-msg"
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 500,
              background:
                message.type === "success"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(239,68,68,0.12)",
              border: `1px solid ${message.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: message.type === "success" ? "#4ade80" : "#f87171",
              textAlign: "center",
            }}
          >
            {message.type === "success" ? "✓ " : "✕ "}
            {message.text}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 500,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="profile-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 500,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 500,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              College ID Card
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="file-input"
              onChange={(e) => setCollegeIdCard(e.target.files[0])}
            />
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
