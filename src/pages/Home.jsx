import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getDashboardStats } from "../api/statsApi";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(0);
  /* ── Refs ── */
  const statsSectionRef = useRef(null);
  const statsSlidesRef = useRef([]);
  const addStatRef = (el) => {
    if (el && !statsSlidesRef.current.includes(el))
      statsSlidesRef.current.push(el);
  };

  const featureSectionRef = useRef(null);
  const featureHeadingRef = useRef(null);
  const cardsRef = useRef([]);
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  const faqSectionRef = useRef(null);
  const faqCardsRef = useRef([]);
  const addFaqRef = (el) => {
    if (el && !faqCardsRef.current.includes(el)) faqCardsRef.current.push(el);
  };

  // CTA — simple stagger, NO pin
  const ctaSectionRef = useRef(null);
  const ctaInnerRef = useRef(null);

  /* ── State ── */
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });
  const [stats, setStats] = useState({ totalUsers: 0, totalApplications: 0 });

  /* ── Countdown ── */
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p.seconds > 0) return { ...p, seconds: p.seconds - 1 };
        if (p.minutes > 0) return { ...p, minutes: p.minutes - 1, seconds: 59 };
        if (p.hours > 0)
          return { ...p, hours: p.hours - 1, minutes: 59, seconds: 59 };
        if (p.days > 0)
          return {
            ...p,
            days: p.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        return p;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Fetch stats ── */
  useEffect(() => {
    getDashboardStats()
      .then((d) =>
        setStats({
          totalUsers: d.totalUsers,
          totalApplications: d.totalApplications,
        }),
      )
      .catch(console.log);
  }, []);

  /* ══════════════════════════════════════════════════════════
     GSAP 1 — STATS CUBE  (pinned, pinSpacing: true)
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const slides = statsSlidesRef.current;
    if (!slides.length || !statsSectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(slides, {
        rotationX: (i) => (i === 0 ? 0 : -90),
        opacity: (i) => (i === 0 ? 1 : 0),
        transformOrigin: "center center -180px",
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: statsSectionRef.current,
          start: "top top",
          end: `+=${slides.length * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true, // ← reserves space, stops overlap
        },
        defaults: {
          ease: "power1.inOut",
          transformOrigin: "center center -180px",
        },
      });
      slides.forEach((slide, i) => {
        const next = slides[i + 1];
        if (!next) return;
        tl.to(slide, { rotationX: 90, opacity: 0, duration: 0.4 }, "+=0.3").to(
          next,
          { rotationX: 0, opacity: 1, duration: 0.4 },
          "<",
        );
      });
      tl.to({}, { duration: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════
     GSAP 2 — FEATURE HEADING  (fade-up, NO pin)
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const heading = featureHeadingRef.current;
    if (!heading) return;
    const ctx = gsap.context(() => {
      gsap.set(heading, { opacity: 0, y: 50 });
      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════
     GSAP 3 — FEATURE CARDS  scatter → gather → scatter
     pin: true  pinSpacing: true  scrub: true
     • Entering: cards fly in from random offsets to grid
     • Leaving:  cards scatter outward again
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const cards = cardsRef.current;
    const section = featureSectionRef.current;
    if (!cards.length || !section) return;

    // Pre-compute stable random offsets so they don't re-randomise on each render
    const startOffsets = cards.map(() => ({
      x: gsap.utils.random(-320, 320),
      y: gsap.utils.random(-220, 220),
      r: gsap.utils.random(-18, 18),
    }));
    const endOffsets = cards.map(() => ({
      x: gsap.utils.random(-320, 320),
      y: gsap.utils.random(-220, 220),
      r: gsap.utils.random(-18, 18),
    }));

    const ctx = gsap.context(() => {
      // Start: scattered, invisible
      cards.forEach((card, i) => {
        gsap.set(card, {
          opacity: 0,
          x: startOffsets[i].x,
          y: startOffsets[i].y,
          rotate: startOffsets[i].r,
          scale: 0.75,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 30%",
          end: "bottom 55%",
          scrub: 1.4,
          pin: false, // NO pin — stays in normal flow
        },
      });

      // Phase 1 — gather into grid (first 50% of scroll range)
      tl.to(cards, {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.06,
      });

      // Phase 2 — hold in place briefly
      tl.to({}, { duration: 0.4 });

      // Phase 3 — scatter outward again (last 50%)
      tl.to(cards, {
        opacity: 0,
        x: (i) => endOffsets[i].x,
        y: (i) => endOffsets[i].y,
        rotate: (i) => endOffsets[i].r,
        scale: 0.75,
        duration: 1,
        ease: "power2.in",
        stagger: 0.05,
      });
    });

    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════
     GSAP 4 — FAQ FLIP  (pinned, pinSpacing: true)
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const cards = faqCardsRef.current;
    if (!cards.length || !faqSectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(cards, {
        rotationX: (i) => (i === 0 ? 0 : -90),
        opacity: (i) => (i === 0 ? 1 : 0.5),
        transformOrigin: "center center -220px",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: faqSectionRef.current,
          start: "top top",
          end: `+=${cards.length * 120}%`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true, // ← critical
        },
        defaults: {
          ease: "power2.inOut",
          transformOrigin: "center center -220px",
        },
      });
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;

        tl.to(
          card,
          {
            rotationX: 90,
            opacity: 0.4,
            scale: 0.92,
            duration: 0.5,
            onStart: () => setActiveFaq(i + 1),
          },
          "+=0.4",
        ).to(
          next,
          {
            rotationX: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
          },
          "<",
        );
      });
      tl.to({}, { duration: 0.4 });
    });
    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════
     GSAP 5 — CTA  pinned horizontal text swap
     Texts slide out LEFT → next slides in from RIGHT
     Button stays fixed in place the entire time
     pin: true  pinSpacing: true
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const section = ctaSectionRef.current;
    const inner = ctaInnerRef.current;
    if (!section || !inner) return;

    // Grab only the text slides (first child of inner), not the button wrapper
    const textSlides = Array.from(inner.querySelectorAll(".cta-slide"));
    if (!textSlides.length) return;

    const ctx = gsap.context(() => {
      // Set all slides: first visible, rest off to the right
      gsap.set(textSlides, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        xPercent: (i) => (i === 0 ? 0 : 100),
        opacity: (i) => (i === 0 ? 1 : 0),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(textSlides.length - 1) * 80}%`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          pinSpacing: false, // ← last section, no spacer needed
        },
      });

      textSlides.forEach((slide, i) => {
        const next = textSlides[i + 1];
        if (!next) return;
        tl.to(
          slide,
          { xPercent: -100, opacity: 0, duration: 1, ease: "power2.inOut" },
          "+=0.1",
        ).to(
          next,
          { xPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
          "<",
        );
      });
      // no hold — ends exactly when last slide settles in

      // Pulsing glow on button — fires once on enter, loops forever
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(".cta-apply-btn", {
            boxShadow: "0 0 44px rgba(99,102,241,0.65)",
            repeat: -1,
            yoyo: true,
            duration: 1.8,
            ease: "sine.inOut",
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  /* ── Data ── */
  const statistics = [
    { label: "Active Positions", value: "12", icon: "📋" },
    { label: "Candidates Applied", value: stats.totalApplications, icon: "👥" },
    { label: "Students Registered", value: stats.totalUsers, icon: "🎓" },
    { label: "Past Elections", value: "8", icon: "🗳️" },
  ];

  const features = [
    {
      title: "Leadership Opportunities",
      description:
        "Lead initiatives and represent the student community in decision making.",
      icon: "🌟",
    },
    {
      title: "Event Management",
      description:
        "Organize cultural events and technical festivals across campus.",
      icon: "🎪",
    },
    {
      title: "Student Welfare",
      description:
        "Work towards improving academic environment and student wellbeing.",
      icon: "🤝",
    },
    {
      title: "Campus Development",
      description:
        "Contribute to infrastructure improvements and better facilities.",
      icon: "🏛️",
    },
    {
      title: "Community Outreach",
      description: "Plan social initiatives and community engagement programs.",
      icon: "🌍",
    },
    {
      title: "Digital Innovation",
      description: "Build technical solutions to improve campus communication.",
      icon: "💡",
    },
  ];

  const faqs = [
    {
      question: "Who can apply for council positions?",
      answer:
        "All currently enrolled students with minimum CGPA of 7.0 and no disciplinary cases.",
    },
    {
      question: "What is the selection process?",
      answer:
        "Application screening followed by interview and presentation of your vision.",
    },
    {
      question: "How long is the council term?",
      answer: "The council term lasts for one academic year.",
    },
    {
      question: "Can I apply for more than one position?",
      answer:
        "Yes, students can apply for up to three council positions if they meet the eligibility criteria.",
    },
    {
      question: "When will the final results be announced?",
      answer:
        "The final results will be announced on the student portal after the interview and evaluation process is completed.",
    },
  ];

  /* ════════════════════════════════ JSX ════════════════════════════════ */
  return (
    <div
      style={{
        background: "#0f1117",
        color: "#e2e8f0",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
        }
        .glass-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          will-change: transform;
        }
        .glass-hover:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 60px rgba(99,102,241,0.25);
          border-color: rgba(139,92,246,0.4);
        }
        .countdown-box {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 18px 8px; text-align: center;
        }
        .btn-grad {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; border: none; padding: 13px 30px; border-radius: 10px;
          font-weight: 600; font-size: 15px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
        }
        .btn-grad:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
        .btn-outline {
          background: transparent; color: #a5b4fc;
          border: 1.5px solid rgba(165,180,252,0.5);
          padding: 13px 30px; border-radius: 10px;
          font-weight: 600; font-size: 15px; cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .btn-outline:hover { background: rgba(165,180,252,0.1); color: #fff; transform: translateY(-2px); }
        .tag-pill {
          background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc; font-size: 13px; font-weight: 500;
          padding: 4px 14px; border-radius: 999px; display: inline-block; margin-bottom: 14px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .icon-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 14px;
        }
        .dot-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }
      `}</style>

      {/* ══════════════════════════════════════
          1. HERO  — normal flow
      ══════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "110px 24px 90px",
          background:
            "linear-gradient(160deg,#0f1117 0%,#131929 60%,#0f1117 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="dot-grid" />

        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="tag-pill">🎓 Student Council 2026</div>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(2.4rem,5vw,3.8rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "20px",
              color: "#f1f5f9",
            }}
          >
            Student Council <span className="gradient-text">Portal</span>
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.1rem",
              maxWidth: "520px",
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Register yourself, apply for leadership positions and contribute
            towards improving campus life and student engagement.
          </p>
          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button className="btn-grad" onClick={() => navigate("/positions")}>
              View Positions
            </button>
            <button
              className="btn-outline"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. COUNTDOWN + STATS CUBE
          pin:true  pinSpacing:true ✓
      ══════════════════════════════════════ */}
      <section
        ref={statsSectionRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          background: "#0f1117",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Countdown */}
          <div
            style={{
              background:
                "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "24px",
              padding: "40px 32px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: "6px",
                color: "#f1f5f9",
              }}
            >
              Elections 2026
            </h2>
            <p
              style={{
                color: "#94a3b8",
                marginBottom: "28px",
                fontSize: "0.95rem",
              }}
            >
              Time remaining to submit your application
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "10px",
              }}
            >
              {Object.entries(timeLeft).map(([key, value]) => (
                <div key={key} className="countdown-box">
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      fontFamily: "'Syne',sans-serif",
                      color: "#c4b5fd",
                      lineHeight: 1,
                    }}
                  >
                    {String(value).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#64748b",
                      marginTop: "6px",
                    }}
                  >
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotating cube */}
          <div
            style={{
              position: "relative",
              height: "260px",
              perspective: "800px",
            }}
          >
            {statistics.map((stat, i) => (
              <div
                key={i}
                ref={addStatRef}
                className="glass"
                style={{
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  left: 0,
                  padding: "40px",
                  textAlign: "center",
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "2.6rem",
                    fontWeight: 800,
                    fontFamily: "'Syne',sans-serif",
                    background: "linear-gradient(135deg,#a5b4fc,#c4b5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value || "—"}
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    marginTop: "6px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. WHY JOIN — normal flow
          heading fade-up + cards float-up
          NO pin → zero overlap risk
      ══════════════════════════════════════ */}
      <section
        ref={featureSectionRef}
        style={{
          position: "relative",
          padding: "100px 24px 110px",
          background:
            "linear-gradient(160deg,#0d1320 0%,#0f1729 50%,#0d1320 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(139,92,246,0.13) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="dot-grid" />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {/* Heading — fades up when scrolled into view */}
          <div
            ref={featureHeadingRef}
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <div className="tag-pill">✦ Benefits</div>
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: "clamp(1.8rem,3.5vw,2.6rem)",
                fontWeight: 800,
                color: "#f1f5f9",
                marginTop: "4px",
              }}
            >
              Why Join the Student Council?
            </h2>
            <p
              style={{
                color: "#475569",
                maxWidth: "440px",
                margin: "12px auto 0",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              Shape campus culture, build leadership skills, and make a lasting
              impact.
            </p>
          </div>

          {/* 2 × 3 grid — each card floats up individually */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "22px",
            }}
          >
            {features.map((feature, i) => (
              <div
                key={i}
                ref={addToRefs}
                className="glass glass-hover"
                style={{ padding: "30px 26px" }}
              >
                <div className="icon-wrap">{feature.icon}</div>
                <h3
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#e2e8f0",
                    marginBottom: "10px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. FAQ FLIP
          pin:true  pinSpacing:true ✓
      ══════════════════════════════════════ */}
      <section
        ref={faqSectionRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          background: "#0f1117",
          position: "relative",
        }}
      >
        <div className="dot-grid" />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "700px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="tag-pill">❓ FAQs</div>
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: "clamp(1.8rem,3vw,2.4rem)",
                fontWeight: 800,
                color: "#f1f5f9",
                marginTop: "4px",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              style={{
                color: "#475569",
                marginTop: "10px",
                fontSize: "0.9rem",
              }}
            >
              Scroll to flip through answers
            </p>
          </div>

          {/* Card stack */}
          <div
            style={{
              position: "relative",
              height: "230px",
              perspective: "900px",
            }}
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                ref={addFaqRef}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "18px",
                  padding: "32px",
                  boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: "8px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    color: "#a5b4fc",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    marginBottom: "12px",
                  }}
                >
                  Q {i + 1} / {faqs.length}
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#e2e8f0",
                    marginBottom: "10px",
                    fontSize: "1.05rem",
                  }}
                >
                  {faq.question}
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.92rem",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "28px",
            }}
          >
            {faqs.map((_, i) => (
              <div
                key={i}
                style={{
                  width: activeFaq === i ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background:
                    activeFaq === i ? "#6366f1" : "rgba(255,255,255,0.15)",
                  transform: activeFaq === i ? "scale(1.4)" : "scale(1)", // ← add here
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. CTA — pinned text slider
          Texts slide out LEFT, next from RIGHT
          Button always visible — never moves
          pin:true  pinSpacing:true ✓
      ══════════════════════════════════════ */}
      <section
        ref={ctaSectionRef}
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "0",
          textAlign: "center",
          background:
            "linear-gradient(135deg,rgba(99,102,241,0.14),rgba(139,92,246,0.1))",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="dot-grid" />

        <div
          ref={ctaInnerRef}
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "700px",
            margin: "0 auto",
            padding: "110px 24px 100px",
          }}
        >
          {/* ── Text slide stack — clipped container ── */}
          <div
            style={{
              position: "relative",
              height: "160px",
              overflowX: "hidden",
              overflowY: "visible",
              marginBottom: "32px",
            }}
          >
            <div
              className="cta-slide"
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div className="tag-pill" style={{ marginBottom: "12px" }}>
                🚀 Get Started
              </div>
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "clamp(1.6rem,3.5vw,2.7rem)",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                }}
              >
                Ready to Make a{" "}
                <span className="gradient-text">Difference?</span>
              </h2>
            </div>

            <div
              className="cta-slide"
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div className="tag-pill" style={{ marginBottom: "12px" }}>
                🌟 Lead the Way
              </div>
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "clamp(1.6rem,3.5vw,2.7rem)",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                }}
              >
                Express Your <span className="gradient-text">Leadership</span>
              </h2>
            </div>

            <div
              className="cta-slide"
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div className="tag-pill" style={{ marginBottom: "12px" }}>
                ✦ Stand Out
              </div>
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "clamp(1.6rem,3.5vw,2.7rem)",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                }}
              >
                Stand Out from the <span className="gradient-text">Crowd</span>
              </h2>
            </div>

            <div
              className="cta-slide"
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div className="tag-pill" style={{ marginBottom: "12px" }}>
                🎓 Your Campus
              </div>
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "clamp(1.6rem,3.5vw,2.7rem)",
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                }}
              >
                Become the <span className="gradient-text">Voice</span> of Your
                Campus
              </h2>
            </div>
          </div>

          {/* ── Static subtitle ── */}
          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              fontSize: "1rem",
              marginBottom: "36px",
            }}
          >
            Applications close soon. Join the Student Council today.
          </p>

          {/* ── Button — always visible, outside slide stack ── */}
          <button
            className="btn-grad cta-apply-btn"
            onClick={() => navigate("/positions")}
            style={{ fontSize: "16px", padding: "15px 44px" }}
          >
            Apply Now →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. FOOTER
      ══════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "28px",
          textAlign: "center",
          color: "#334155",
          fontSize: "0.82rem",
        }}
      >
        © 2026 Student Council Portal
      </footer>
    </div>
  );
}

export default Home;
