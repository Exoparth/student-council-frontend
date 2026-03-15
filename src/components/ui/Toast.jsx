import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: {
      border: "rgba(16,185,129,0.5)",
      bg: "rgba(16,185,129,0.12)",
      icon: "✓",
    },
    error: {
      border: "rgba(239,68,68,0.5)",
      bg: "rgba(239,68,68,0.12)",
      icon: "⚠",
    },
    info: {
      border: "rgba(99,102,241,0.5)",
      bg: "rgba(99,102,241,0.12)",
      icon: "ℹ",
    },
  };

  const style = colors[type];

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        background: "rgba(15,17,26,0.9)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${style.border}`,
        borderRadius: "14px",
        padding: "14px 18px",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08)",
        animation: "toastSlide 0.35s ease",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          color: "#a5b4fc",
        }}
      >
        {style.icon}
      </span>

      <span style={{ fontSize: "14px" }}>{message}</span>

      <style>{`
        @keyframes toastSlide {
          from {
            transform: translateX(40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;
