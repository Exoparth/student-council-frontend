import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
// import { sendContactMessage } from "../api/contactApi"; // uncomment when API is ready

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const cardRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1 },
      );
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.2 },
      );
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Replace with: await sendContactMessage(form);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    gsap.fromTo(
      ".success-msg",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
    );
  };

  const contacts = [
    { icon: "📧", label: "Email", value: "council@college.edu" },
    { icon: "📍", label: "Location", value: "Student Affairs Office, Block A" },
    { icon: "🕐", label: "Office Hours", value: "Mon–Fri, 10am – 4pm" },
    { icon: "📞", label: "Phone", value: "+91 98765 43210" },
  ];

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

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
        .name-email-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 500px) {
          .name-email-grid { grid-template-columns: 1fr; }
        }
        .contact-input {
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
          resize: none;
        }
        .contact-input:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .contact-input::placeholder { color: #334155; }
        .send-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 12px;
          padding: 14px; color: #fff;
          font-weight: 600; font-size: 15px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          font-family: 'Inter', sans-serif;
        }
        .send-btn:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.5);
        }
        .send-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .contact-info-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .contact-info-item:hover {
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.2);
        }
        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .tag-pill {
          background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc; font-size: 12px; font-weight: 500;
          padding: 3px 12px; border-radius: 999px; display: inline-block; margin-bottom: 14px;
        }
        .dot-grid-fixed {
          position: fixed; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none; z-index: 0;
        }
        .field-label {
          display: block; font-size: 11px; color: #64748b;
          font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
      `}</style>

      {/* Background effects */}
      <div
        style={{
          position: "fixed",
          top: "-100px",
          left: "20%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-80px",
          right: "15%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="dot-grid-fixed" />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="tag-pill">✉️ Get in Touch</div>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(2rem,4.5vw,3rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p
            style={{
              color: "#475569",
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Have questions about the council or the application process? We're
            here to help.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="contact-grid">
          {/* LEFT — Contact info */}
          <div
            ref={infoRef}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "28px 24px",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "#f1f5f9",
                  marginBottom: "8px",
                }}
              >
                Student Council Office
              </h2>
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Reach out to us for queries about positions, application
                deadlines, eligibility, or any campus-related concerns.
              </p>
            </div>

            {contacts.map((c, i) => (
              <div key={i} className="contact-info-item">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#475569",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "3px",
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#cbd5e1",
                      fontWeight: 500,
                    }}
                  >
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Form */}
          <div
            ref={cardRef}
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "24px",
              padding: "36px 32px",
            }}
          >
            {sent ? (
              <div
                className="success-msg"
                style={{ textAlign: "center", padding: "40px 20px" }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
                <h3
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "#f1f5f9",
                    marginBottom: "8px",
                  }}
                >
                  Message Sent!
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  Thanks for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  style={{
                    marginTop: "24px",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "10px",
                    padding: "10px 24px",
                    color: "#a5b4fc",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "#f1f5f9",
                    marginBottom: "24px",
                  }}
                >
                  Send a Message
                </h3>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div className="name-email-grid">
                    <div>
                      <label className="field-label">Name</label>
                      <input
                        name="name"
                        required
                        placeholder="Your name"
                        className="contact-input"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="field-label">Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="contact-input"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Subject</label>
                    <input
                      name="subject"
                      required
                      placeholder="What's this about?"
                      className="contact-input"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="field-label">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="contact-input"
                      value={form.message}
                      onChange={handleChange}
                      style={{ minHeight: "130px" }}
                    />
                  </div>

                  <button type="submit" className="send-btn" disabled={sending}>
                    {sending ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
