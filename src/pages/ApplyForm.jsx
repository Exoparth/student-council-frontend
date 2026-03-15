import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyForCouncil } from "../api/applicationApi";
import { useToast } from "../context/ToastContext";

function ApplyForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPosition = location.state?.position || "";

  const [formData, setFormData] = useState({
    domainId: "",
    department: "",
    rollNo: "",
    currentYear: "",
    phone: "",
    position: selectedPosition,
    statement: "",
    experience: "",
    kts: "",
    pointer: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal info, 2 = application details
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

      const payload = {
        ...formData,
        currentYear: Number(formData.currentYear),
        kts: Number(formData.kts),
        pointer: Number(formData.pointer),
      };

      await applyForCouncil(payload);

      showToast("Application submitted successfully!", "success");

      // delay navigation so user sees the toast
      setTimeout(() => {
        navigate("/my-application");
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";

      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const fields1 = [
    {
      name: "domainId",
      label: "Domain ID",
      type: "text",
      placeholder: "e.g. ST2024001",
      col: 1,
    },
    {
      name: "department",
      label: "Department",
      type: "text",
      placeholder: "e.g. Computer Engineering",
      col: 1,
    },
    {
      name: "rollNo",
      label: "Roll No",
      type: "text",
      placeholder: "e.g. 2021BTCS001",
      col: 1,
    },
    {
      name: "currentYear",
      label: "Current Year",
      type: "number",
      placeholder: "1 – 4",
      col: 1,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "+91 XXXXX XXXXX",
      col: 1,
    },
    {
      name: "kts",
      label: "No. of KTs",
      type: "number",
      placeholder: "0",
      col: 1,
    },
    {
      name: "pointer",
      label: "Pointer / CGPA",
      type: "number",
      placeholder: "0.00 – 10.00",
      col: 1,
      step: "0.01",
      min: "0",
      max: "10",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d14",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "48px 16px 64px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .apply-wrap {
          width: 100%; max-width: 680px;
        }

        .apply-card {
          background: rgba(15,17,26,0.9);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.06);
        }

        .apply-input, .apply-select, .apply-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 12px 15px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .apply-input::placeholder,
        .apply-textarea::placeholder { color: #334155; }
        .apply-input:focus,
        .apply-select:focus,
        .apply-textarea:focus {
          border-color: rgba(139,92,246,0.55);
          background: rgba(139,92,246,0.05);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .apply-select option { background: #0f1117; color: #e2e8f0; }
        .apply-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

        .field-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 7px;
        }

        .apply-btn {
          width: 100%; padding: 14px;
          border-radius: 12px; border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 15px;
          cursor: pointer; letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .apply-btn:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.5);
        }
        .apply-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .step-btn {
          padding: 11px 24px; border-radius: 10px; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
          cursor: pointer; transition: all 0.2s;
        }
        .step-btn-next {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.3);
        }
        .step-btn-next:hover { background: rgba(99,102,241,0.25); transform: translateX(2px); }
        .step-btn-back {
          background: rgba(255,255,255,0.05);
          color: #64748b;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .step-btn-back:hover { background: rgba(255,255,255,0.09); color: #94a3b8; }

        .step-dot {
          width: 8px; height: 8px; border-radius: 50%;
          transition: all 0.3s ease;
        }

        .tag-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
          font-size: 12px; font-weight: 500;
          padding: 4px 12px; border-radius: 999px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .error-box {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          padding: 10px 14px;
          color: #f87171; font-size: 13px;
        }
        .success-box {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 10px;
          padding: 10px 14px;
          color: #4ade80; font-size: 13px;
        }

        .divider { height: 1px; background: rgba(255,255,255,0.06); }

        .fade-up {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .fade-up.in { opacity: 1; transform: translateY(0); }

        .blob {
          position: fixed; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }

        /* dot grid bg */
        .dot-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 26px 26px;
        }
      `}</style>

      {/* Ambient */}
      <div className="dot-bg" />
      <div
        className="blob"
        style={{
          width: 380,
          height: 380,
          top: "-8%",
          left: "-6%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)",
        }}
      />
      <div
        className="blob"
        style={{
          width: 320,
          height: 320,
          bottom: "-6%",
          right: "-4%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.09), transparent 70%)",
        }}
      />

      <div
        className={`apply-wrap fade-up${mounted ? " in" : ""}`}
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="tag-pill" style={{ marginBottom: "14px" }}>
            📋 Student Council 2026
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "#f1f5f9",
              lineHeight: 1.15,
              marginBottom: "8px",
            }}
          >
            Council <span className="gradient-text">Application</span>
          </h1>
          <p style={{ color: "#475569", fontSize: "14px", lineHeight: 1.6 }}>
            Fill in your details carefully — all fields are reviewed by the
            council team.
          </p>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: step === s ? 1 : 0.4,
                  transition: "opacity 0.3s",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background:
                      step === s
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      step === s ? "none" : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: step === s ? "#fff" : "#475569",
                    transition: "all 0.3s",
                    boxShadow:
                      step === s ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                  }}
                >
                  {s}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: step === s ? "#e2e8f0" : "#475569",
                    transition: "color 0.3s",
                  }}
                >
                  {s === 1 ? "Personal Info" : "Application Details"}
                </span>
              </div>
              {s < 2 && (
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background:
                      step > s
                        ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                        : "rgba(255,255,255,0.08)",
                    transition: "background 0.4s",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="apply-card">
          <form onSubmit={handleSubmit}>
            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div style={{ padding: "32px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#f1f5f9",
                    }}
                  >
                    Personal Information
                  </p>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "#475569",
                      marginTop: "4px",
                    }}
                  >
                    Your academic and contact details
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {fields1.map(
                    ({ name, label, type, placeholder, step: s, min, max }) => (
                      <div key={name}>
                        <label className="field-label">{label}</label>
                        <input
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          className="apply-input"
                          value={formData[name]}
                          onChange={handleChange}
                          step={s}
                          min={min}
                          max={max}
                          required
                        />
                      </div>
                    ),
                  )}
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="step-btn step-btn-next"
                    onClick={() => {
                      if (
                        !formData.domainId ||
                        !formData.rollNo ||
                        !formData.phone
                      ) {
                        showToast(
                          "Please complete personal information first",
                          "error",
                        );
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Next: Application Details →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Application Details ── */}
            {step === 2 && (
              <div style={{ padding: "32px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#f1f5f9",
                    }}
                  >
                    Application Details
                  </p>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "#475569",
                      marginTop: "4px",
                    }}
                  >
                    Choose your position and share your vision
                  </p>
                </div>

                {/* Position */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="field-label">Position Applying For</label>
                  <select
                    name="position"
                    className="apply-select"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a position…</option>
                    <option value="General Secretary">General Secretary</option>
                    <option value="Assistant General Secretary">
                      Assistant General Secretary
                    </option>
                    <option value="Joint Secretary">Joint Secretary</option>
                    <option value="Assistant Joint Secretary">
                      Assistant Joint Secretary
                    </option>
                    <option value="Points and Tally Head">
                      Points and Tally (Head)
                    </option>
                    <option value="Points and Tally Co-Head">
                      Points and Tally (Co-Head)
                    </option>
                    <option value="Student Pool Coordinator Head">
                      Student Pool Coordinator (Head)
                    </option>
                    <option value="Student Pool Coordinator Co-Head">
                      Student Pool Coordinator (Co-Head)
                    </option>
                    <option value="IMC Head">
                      IMC – Integrated Marketing Communication (Head)
                    </option>
                    <option value="IMC Co-Head">
                      IMC – Integrated Marketing Communication (Co-Head)
                    </option>
                  </select>
                </div>

                {/* Statement */}
                <div style={{ marginBottom: "16px" }}>
                  <label className="field-label">
                    Why do you want this position?
                  </label>
                  <textarea
                    name="statement"
                    placeholder="Share your motivation, goals, and what you'll bring to the council…"
                    className="apply-textarea"
                    value={formData.statement}
                    onChange={handleChange}
                    style={{ minHeight: "110px" }}
                  />
                </div>

                {/* Experience */}
                <div style={{ marginBottom: "24px" }}>
                  <label className="field-label">Previous Experience</label>
                  <textarea
                    name="experience"
                    placeholder="List any relevant roles, events organised, committees, or leadership experience…"
                    className="apply-textarea"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{ minHeight: "90px" }}
                  />
                </div>

                <div className="divider" style={{ marginBottom: "20px" }} />

                {/* {error && (
                  <div className="error-box" style={{ marginBottom: "14px" }}>
                    ⚠ {error}
                  </div>
                )}
                {success && (
                  <div className="success-box" style={{ marginBottom: "14px" }}>
                    ✓ {success}
                  </div>
                )} */}

                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <button
                    type="button"
                    className="step-btn step-btn-back"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="apply-btn"
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? "Submitting…" : "Submit Application →"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#334155",
            marginTop: "20px",
          }}
        >
          You can track your application status on the{" "}
          <span
            onClick={() => navigate("/my-application")}
            style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}
          >
            My Application
          </span>{" "}
          page.
        </p>
      </div>
    </div>
  );
}

export default ApplyForm;
