import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

/* reuse the same STYLES block from AdminDashboard — or import a shared one */
const STYLES = `
  .adm-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
  }
  .adm-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 14px;
    color: #e2e8f0;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .adm-input::placeholder { color: #475569; }
  .adm-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .adm-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 14px;
    color: #e2e8f0;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
    width: 100%;
  }
  .adm-select option { background: #0f1117; color: #e2e8f0; }

  .adm-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
  .adm-tbl thead tr { border-bottom: 1px solid rgba(255,255,255,0.07); }
  .adm-tbl th {
    padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.6px; text-transform: uppercase; color: #475569;
  }
  .adm-tbl td {
    padding: 13px 16px; color: #cbd5e1;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .adm-tbl tbody tr { transition: background 0.15s; }
  .adm-tbl tbody tr:hover { background: rgba(255,255,255,0.025); }
  .adm-tbl tbody tr:last-child td { border-bottom: none; }

  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 600;
  }
  .badge-admin   { background: rgba(99,102,241,0.15); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }
  .badge-student { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }

  .act-btn {
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; transition: opacity 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .act-btn:hover { opacity: 0.82; transform: translateY(-1px); }
  .act-btn-blue  { background: rgba(99,102,241,0.15); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }
  .act-btn-green { background: rgba(34,197,94,0.12);  color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
  .act-btn-gray  { background: rgba(255,255,255,0.07); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
  .act-btn-red   { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

  .create-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .tbl-wrap {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow-x: auto;
  }

  .inline-input {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: 8px;
    padding: 6px 10px;
    color: #e2e8f0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    width: 140px;
  }
  .inline-select {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: 8px;
    padding: 6px 10px;
    color: #e2e8f0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
  }
  .inline-select option { background: #0f1117; }

  .create-btn {
    padding: 10px 22px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 14px; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 6px 20px rgba(99,102,241,0.3);
  }
  .create-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(99,102,241,0.45); }

  .loading-spin {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      setCreateError("All fields are required.");
      return;
    }
    setCreateError("");
    try {
      await createUser(newUser);
      fetchUsers();
      setNewUser({ fullName: "", email: "", password: "", role: "student" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(editingUser._id, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            gap: "16px",
            flexDirection: "column",
          }}
        >
          <div className="loading-spin" />
          <p style={{ color: "#475569", fontSize: "14px" }}>Loading users…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* ── CREATE USER ── */}
      <div className="create-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              boxShadow: "0 0 6px rgba(99,102,241,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "#f1f5f9",
            }}
          >
            Create New User
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <input
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
            className="adm-input"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="adm-input"
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="adm-input"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="adm-select"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {createError && (
          <p
            style={{ fontSize: "12px", color: "#f87171", marginBottom: "10px" }}
          >
            ⚠ {createError}
          </p>
        )}

        <button className="create-btn" onClick={handleCreate}>
          + Create User
        </button>
      </div>

      {/* ── USERS TABLE ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#f1f5f9",
          }}
        >
          All Users
        </span>
        <span style={{ fontSize: "12px", color: "#475569" }}>
          {users.length} user{users.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="tbl-wrap">
        <table className="adm-tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#475569",
                  }}
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  {/* NAME */}
                  <td style={{ fontWeight: 600, color: "#f1f5f9" }}>
                    {editingUser?._id === user._id ? (
                      <input
                        value={editingUser.fullName}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            fullName: e.target.value,
                          })
                        }
                        className="inline-input"
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, hsl(${(user.fullName?.charCodeAt(0) * 5) % 360},60%,35%), hsl(${((user.fullName?.charCodeAt(0) * 5) % 360) + 40},60%,25%))`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#f1f5f9",
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {user.fullName?.[0]?.toUpperCase()}
                        </div>
                        {user.fullName}
                      </div>
                    )}
                  </td>

                  {/* EMAIL */}
                  <td style={{ color: "#64748b", fontSize: "12px" }}>
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td>
                    {editingUser?._id === user._id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                        className="inline-select"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`badge ${user.role === "admin" ? "badge-admin" : "badge-student"}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {editingUser?._id === user._id ? (
                        <>
                          <button
                            className="act-btn act-btn-green"
                            onClick={handleUpdate}
                          >
                            Save
                          </button>
                          <button
                            className="act-btn act-btn-gray"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="act-btn act-btn-blue"
                            onClick={() => setEditingUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="act-btn act-btn-red"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminUsers;
