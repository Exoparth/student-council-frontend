import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },

    /* NEW TAB */
    {
      label: "Messages",
      path: "/admin/messages",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d14",
        display: "flex",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sidebar {
          background: rgba(13,15,25,0.98);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
          color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.25);
        }
        .nav-item.active svg { color: #a5b4fc; }

        .collapse-btn {
          width: 28px; height: 28px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #64748b;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; }

        .logout-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.06);
          color: #f87171;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          width: 100%;
          white-space: nowrap; overflow: hidden;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.4);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: auto;
          min-width: 0;
        }

        .top-bar {
          background: rgba(13,15,25,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 5;
        }

        .breadcrumb {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .page-body {
          padding: 32px;
          flex: 1;
        }

        .gradient-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 0 8px rgba(99,102,241,0.6);
          flex-shrink: 0;
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="sidebar" style={{ width: collapsed ? "64px" : "220px" }}>
        {/* Logo area */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            gap: "10px",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="gradient-dot" />
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  background: "linear-gradient(135deg, #a5b4fc, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Admin
              </span>
            </div>
          )}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              {collapsed ? (
                <>
                  <path d="M9 18l6-6-6-6" />
                </>
              ) : (
                <>
                  <path d="M15 18l-6-6 6-6" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <div
          style={{
            padding: "16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: "12px 10px 20px" }}>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="breadcrumb">
              {isActive("/admin/users")
                ? "User Management"
                : isActive("/admin/messages")
                  ? "Contact Messages"
                  : "Dashboard"}
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#475569",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px",
              padding: "6px 14px",
              fontWeight: 500,
            }}
          >
            Student Council 2026
          </div>
        </div>

        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
