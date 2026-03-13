import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate dropdown open
  useEffect(() => {
    if (open && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -8, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" },
      );
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".avatar-btn")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (loading) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        .nav-link {
          position: relative;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          padding: 5px 2px;
          transition: color 0.2s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.01em;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1.5px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #e2e8f0; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: #a5b4fc; }
        .nav-link.active::after { width: 100%; }

        .nav-login-btn {
          font-size: 13px; font-weight: 600;
          color: #a5b4fc;
          text-decoration: none;
          padding: 7px 16px;
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 8px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .nav-login-btn:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.5);
          color: #c4b5fd;
        }
        .nav-register-btn {
          font-size: 13px; font-weight: 600;
          color: #fff;
          text-decoration: none;
          padding: 7px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          border: none;
          box-shadow: 0 2px 14px rgba(99,102,241,0.35);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .nav-register-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(99,102,241,0.5);
        }
        .avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid rgba(99,102,241,0.4);
          cursor: pointer; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          display: block; flex-shrink: 0;
        }
        .avatar-btn:hover {
          border-color: rgba(139,92,246,0.7);
          transform: scale(1.05);
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; text-align: left;
          padding: 10px 14px;
          background: none; border: none;
          color: #94a3b8;
          font-size: 13px; font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: rgba(255,255,255,0.06);
          color: #f1f5f9;
        }
        .dropdown-item.danger { color: #f87171; }
        .dropdown-item.danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }
      `}</style>

      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: scrolled ? "rgba(15,17,23,0.88)" : "rgba(15,17,23,0.6)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.04)",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "58px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "7px",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              🏛️
            </div>
            <span
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "1.05rem",
                background: "linear-gradient(135deg,#a5b4fc,#c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Council Portal
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <Link
              to="/"
              className={`nav-link${isActive("/") ? " active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/positions"
              className={`nav-link${isActive("/positions") ? " active" : ""}`}
            >
              Positions
            </Link>
            <Link
              to="/contact"
              className={`nav-link${isActive("/contact") ? " active" : ""}`}
            >
              Contact
            </Link>
          </div>

          {/* Auth area */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!user ? (
              <>
                <Link to="/login" className="nav-login-btn">
                  Login
                </Link>
                <Link to="/register" className="nav-register-btn">
                  Register
                </Link>
              </>
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={
                    user.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="avatar-btn"
                  onClick={() => setOpen((o) => !o)}
                />

                {open && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: "200px",
                      background: "rgba(20,22,30,0.97)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      padding: "8px",
                      boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
                      transformOrigin: "top right",
                    }}
                  >
                    {/* User info header */}
                    <div
                      style={{
                        padding: "10px 14px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#f1f5f9",
                          fontFamily: "'Inter',sans-serif",
                          marginBottom: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.fullName || "User"}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#475569",
                          fontFamily: "'Inter',sans-serif",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                    >
                      <span>👤</span> Profile
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/my-application");
                        setOpen(false);
                      }}
                    >
                      <span>📁</span> My Applications
                    </button>

                    <div
                      style={{
                        height: "1px",
                        background: "rgba(255,255,255,0.06)",
                        margin: "6px 0",
                      }}
                    />

                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
