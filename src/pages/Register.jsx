import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useToast } from "../context/ToastContext";

/* ─── Grid Background (shared logic) ────────────────────────── */
const COLS = 20;
const ROWS = 14;
const FADE_MS = 800;

function GridBackground() {
  const canvasRef = useRef(null);
  const cells = useRef({});
  const rafRef = useRef(null);

  const getCell = useCallback((col, row) => `${col}-${row}`, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const cw = canvas.width / COLS;
      const ch = canvas.height / ROWS;
      const col = Math.floor(e.clientX / cw);
      const row = Math.floor(e.clientY / ch);
      const key = getCell(col, row);
      cells.current[key] = { col, row, lit: 1, ts: Date.now() };
    };
    window.addEventListener("mousemove", onMouseMove);

    const COLORS = [
      "rgba(99,102,241,",
      "rgba(139,92,246,",
      "rgba(59,130,246,",
      "rgba(168,85,247,",
    ];

    const draw = () => {
      const now = Date.now();
      const cw = canvas.width / COLS;
      const ch = canvas.height / ROWS;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cw, 0);
        ctx.lineTo(c * cw, canvas.height);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * ch);
        ctx.lineTo(canvas.width, r * ch);
        ctx.stroke();
      }

      Object.keys(cells.current).forEach((key) => {
        const cell = cells.current[key];
        const elapsed = now - cell.ts;
        const alpha = Math.max(0, 1 - elapsed / FADE_MS);
        if (alpha <= 0) {
          delete cells.current[key];
          return;
        }
        const colorBase = COLORS[(cell.col + cell.row) % COLORS.length];
        ctx.fillStyle = colorBase + alpha * 0.35 + ")";
        ctx.fillRect(cell.col * cw + 1, cell.row * ch + 1, cw - 2, ch - 2);

        ctx.strokeStyle = colorBase + alpha * 0.7 + ")";
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.col * cw + 1, cell.row * ch + 1, cw - 2, ch - 2);
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [getCell]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Eye-tracking Mascot ────────────────────────────────────── */
function Mascot({ isTypingPassword }) {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isTypingPassword) return;
      [leftEyeRef, rightEyeRef].forEach((eyeRef) => {
        const eye = eyeRef.current;
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        const dist = Math.min(
          5,
          Math.hypot(e.clientX - cx, e.clientY - cy) / 8,
        );
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;
        const pupil = eye.querySelector(".pupil");
        if (pupil) {
          pupil.style.transform = `translate(${px}px, ${py}px)`;
        }
      });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isTypingPassword]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "6px",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1e1b4b, #312e81)",
          border: "2px solid rgba(139,92,246,0.6)",
          boxShadow:
            "0 0 24px rgba(139,92,246,0.3), 0 0 60px rgba(99,102,241,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          {[leftEyeRef, rightEyeRef].map((ref, i) => (
            <div
              key={i}
              ref={ref}
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="pupil"
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: "#1e1b4b",
                  transition: "transform 0.05s ease-out, opacity 0.2s ease",
                  position: "relative",
                  opacity: isTypingPassword ? 0 : 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1px",
                    left: "1px",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.7)",
                  }}
                />
              </div>

              {/* Eyelid overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(180deg, #312e81, #1e1b4b)",
                  borderRadius: "50%",
                  transform: isTypingPassword
                    ? "translateY(0%)"
                    : "translateY(-100%)",
                  transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "2px",
                    borderRadius: "2px",
                    background: "rgba(165,180,252,0.7)",
                    marginTop: "2px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mouth */}
        <div
          style={{
            width: "24px",
            height: isTypingPassword ? "2px" : "8px",
            borderRadius: isTypingPassword ? "2px" : "0 0 12px 12px",
            border: isTypingPassword
              ? "none"
              : "2px solid rgba(139,92,246,0.7)",
            borderTop: "none",
            background: isTypingPassword
              ? "rgba(139,92,246,0.5)"
              : "transparent",
            marginBottom: "6px",
            transition: "all 0.3s ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "14px",
            background: "rgba(139,92,246,0.7)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: isTypingPassword ? "#f472b6" : "#a5b4fc",
              position: "absolute",
              top: "-5px",
              left: "-3px",
              boxShadow: isTypingPassword
                ? "0 0 8px rgba(244,114,182,0.9)"
                : "0 0 8px rgba(165,180,252,0.8)",
              transition: "background 0.3s ease, box-shadow 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Register Page ──────────────────────────────────────────── */
function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(formData);

      showToast("Account created successfully!", "success");

      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";

      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-card {
          background: rgba(15,17,26,0.85);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08);
        }

        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .auth-input::placeholder { color: #475569; }
        .auth-input:focus {
          border-color: rgba(139,92,246,0.6);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
        }

        .auth-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.3px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .auth-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.5);
        }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .auth-link {
          color: #a5b4fc;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .auth-link:hover { color: #c4b5fd; }

        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.in {
          opacity: 1;
          transform: translateY(0);
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fca5a5;
          font-size: 13px;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div
        className="blob"
        style={{
          width: 400,
          height: 400,
          top: "-10%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
        }}
      />
      <div
        className="blob"
        style={{
          width: 350,
          height: 350,
          bottom: "-8%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)",
        }}
      />

      <GridBackground />

      <div
        className={`auth-card fade-up${mounted ? " in" : ""}`}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
          margin: "0 16px",
        }}
      >
        {/* Mascot */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <Mascot isTypingPassword={isTypingPassword} />
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#f1f5f9",
              marginTop: "14px",
              lineHeight: 1.1,
            }}
          >
            Create <span className="gradient-text">Account</span>
          </h1>
          <p style={{ color: "#475569", fontSize: "13.5px", marginTop: "6px" }}>
            Join the Student Council 2026
          </p>
        </div>

        <div className="divider" style={{ marginBottom: "24px" }} />

        {error && (
          <div className="error-box" style={{ marginBottom: "16px" }}>
            ⚠ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {[
            {
              label: "Full Name",
              name: "fullName",
              type: "text",
              placeholder: "John Doe",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "your@email.com",
            },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "6px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                className="auth-input"
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Password — triggers eye-close on focus */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#64748b",
                marginBottom: "6px",
                fontWeight: 500,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setIsTypingPassword(true)}
              onBlur={() => setIsTypingPassword(false)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            style={{ marginTop: "6px" }}
          >
            {loading ? "Creating Account…" : "Create Account →"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "13.5px",
            color: "#475569",
            marginTop: "22px",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
