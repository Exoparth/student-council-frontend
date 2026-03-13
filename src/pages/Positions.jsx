import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Positions() {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const addCard = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 40 });
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.set(cardsRef.current, { opacity: 0, y: 60, scale: 0.93 });
      cardsRef.current.forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.15 + i * 0.08,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const groups = [
    {
      title: "General Secretary",
      icon: "🏛️",
      color: "rgba(99,102,241,0.3)",
      roles: ["General Secretary", "Assistant General Secretary"],
    },
    {
      title: "Joint Secretary",
      icon: "📋",
      color: "rgba(139,92,246,0.3)",
      roles: ["Joint Secretary", "Assistant Joint Secretary"],
    },
    {
      title: "Points & Tally",
      icon: "📊",
      color: "rgba(59,130,246,0.3)",
      roles: ["Head", "Co-Head"],
    },
    {
      title: "Student Pool Coordinator",
      icon: "👥",
      color: "rgba(16,185,129,0.25)",
      roles: ["Head", "Co-Head"],
    },
    {
      title: "IMC",
      icon: "📢",
      color: "rgba(245,158,11,0.2)",
      roles: ["Head", "Co-Head"],
    },
    {
      title: "Cultural Affairs",
      icon: "🎭",
      color: "rgba(236,72,153,0.2)",
      roles: ["Head", "Co-Head"],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        color: "#e2e8f0",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .pos-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          will-change: transform;
        }
        .pos-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(99,102,241,0.2);
          border-color: rgba(139,92,246,0.35);
        }
        .role-btn {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 11px 16px;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: space-between;
        }
        .role-btn:hover {
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
          border-color: rgba(139,92,246,0.5);
          color: #f1f5f9;
          transform: translateX(4px);
        }
        .tag-pill {
          background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc; font-size: 12px; font-weight: 500;
          padding: 3px 12px; border-radius: 999px; display: inline-block;
        }
        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
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
          padding: "80px 24px 60px",
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
              "radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="dot-grid" />
        <div ref={headingRef} style={{ position: "relative", zIndex: 1 }}>
          <div className="tag-pill" style={{ marginBottom: "14px" }}>
            📋 Open Positions
          </div>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(2rem,4.5vw,3.2rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.1,
              marginBottom: "14px",
            }}
          >
            Council <span className="gradient-text">Positions</span>
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Choose a role and apply to become part of the Student Council 2026.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px 24px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "22px",
          }}
        >
          {groups.map((group, index) => (
            <div
              key={index}
              ref={addCard}
              className="pos-card"
              style={{ padding: "28px" }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: group.color,
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                  }}
                >
                  {group.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#f1f5f9",
                      lineHeight: 1.3,
                    }}
                  >
                    {group.title}
                  </h3>
                  <span style={{ fontSize: "11px", color: "#475569" }}>
                    {group.roles.length} positions available
                  </span>
                </div>
              </div>

              {/* Role buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {group.roles.map((role, i) => (
                  <button
                    key={i}
                    className="role-btn"
                    onClick={() =>
                      navigate("/apply", { state: { position: role } })
                    }
                  >
                    <span>Apply for {role}</span>
                    <span style={{ fontSize: "16px", opacity: 0.5 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Positions;
