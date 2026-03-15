import { useEffect, useState } from "react";
import { getAllMessages } from "../api/contactApi";

function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getAllMessages().then(setMessages).catch(console.log);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Contact Messages</h2>

      {messages.map((msg) => (
        <div
          key={msg._id}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "12px",
          }}
        >
          <div style={{ fontWeight: 600 }}>{msg.name}</div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{msg.email}</div>

          <p style={{ marginTop: "10px", color: "#cbd5e1" }}>{msg.message}</p>

          <div
            style={{ fontSize: "11px", color: "#475569", marginTop: "10px" }}
          >
            {new Date(msg.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminMessages;
