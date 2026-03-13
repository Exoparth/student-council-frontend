import { useEffect, useState, useRef } from "react";
import { getMyApplication } from "../api/applicationApi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MyApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const addCard = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getMyApplication();
        setApplications(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  useEffect(() => {
    if (!loading && cardsRef.current.length) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        );
        gsap.set(cardsRef.current, { opacity: 0, y: 60, scale: 0.93 });
        cardsRef.current.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            delay: (i % 3) * 0.1,
          });
        });
      });
      return () => ctx.revert();
    }
  }, [loading]);

  const statusConfig = (status) => {
    if (status === "accepted")
      return {
        bg: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.3)",
        color: "#4ade80",
        dot: "#22c55e",
        label: "Accepted",
      };
    if (status === "rejected")
      return {
        bg: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.3)",
        color: "#f87171",
        dot: "#ef4444",
        label: "Rejected",
      };
    return {
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.3)",
      color: "#fbbf24",
      dot: "#f59e0b",
      label: status || "Pending",
    };
  };

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig(status);
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: "999px",
          padding: "3px 10px",
          fontSize: "11px",
          fontWeight: 600,
          color: cfg.color,
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: cfg.dot,
            flexShrink: 0,
          }}
        />
        {cfg.label}
      </span>
    );
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
            Loading applications...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1117",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter',sans-serif",
        }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>📭</div>
        <h2
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "1.6rem",
            color: "#f1f5f9",
            marginBottom: "10px",
          }}
        >
          No Applications Yet
        </h2>
        <p style={{ color: "#475569", fontSize: "0.95rem" }}>
          You haven't submitted any applications yet.
        </p>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');`}</style>
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
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .app-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 26px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          will-change: transform;
        }
        .app-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.18);
          border-color: rgba(139,92,246,0.3);
        }
        .info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .info-row:last-child { border-bottom: none; }
        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .tag-pill {
          background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc; font-size: 12px; font-weight: 500;
          padding: 3px 12px; border-radius: 999px; display: inline-block;
        }
        .dot-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: "relative",
          padding: "80px 24px 50px",
          textAlign: "center",
          background:
            "linear-gradient(160deg,#0f1117 0%,#131929 60%,#0f1117 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="dot-grid" />
        <div ref={headingRef} style={{ position: "relative", zIndex: 1 }}>
          <div className="tag-pill" style={{ marginBottom: "14px" }}>
            📁 My Applications
          </div>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(2rem,4.5vw,3rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.1,
              marginBottom: "10px",
            }}
          >
            Application <span className="gradient-text">Tracker</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Track the status of all your submitted applications
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 32px" }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginTop: "-20px",
          }}
        >
          {[
            { label: "Total", value: applications.length, color: "#a5b4fc" },
            {
              label: "Accepted",
              value: applications.filter(
                (a) => a.applicationStatus === "accepted",
              ).length,
              color: "#4ade80",
            },
            {
              label: "Pending",
              value: applications.filter(
                (a) =>
                  a.applicationStatus !== "accepted" &&
                  a.applicationStatus !== "rejected",
              ).length,
              color: "#fbbf24",
            },
            {
              label: "Rejected",
              value: applications.filter(
                (a) => a.applicationStatus === "rejected",
              ).length,
              color: "#f87171",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "14px 22px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: s.color,
                }}
              >
                {s.value}
              </span>
              <span
                style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Application cards */}
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: "20px",
          }}
        >
          {applications.map((application) => (
            <div key={application._id} ref={addCard} className="app-card">
              {/* Position header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#f1f5f9",
                      marginBottom: "4px",
                    }}
                  >
                    {application.position}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#475569" }}>
                    {application.department}
                  </span>
                </div>
                <StatusBadge status={application.applicationStatus} />
              </div>

              {/* Info rows */}
              <div>
                <div className="info-row">
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    Roll No
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#cbd5e1",
                      fontWeight: 600,
                    }}
                  >
                    {application.rollNo}
                  </span>
                </div>
                <div className="info-row">
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    Application
                  </span>
                  <StatusBadge status={application.applicationStatus} />
                </div>
                <div className="info-row">
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    Interview
                  </span>
                  <StatusBadge status={application.interviewStatus} />
                </div>
                <div className="info-row">
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    Interview Date
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: application.interviewDate ? "#a5b4fc" : "#475569",
                    }}
                  >
                    {application.interviewDate
                      ? new Date(application.interviewDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "Not Scheduled"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyApplication;
