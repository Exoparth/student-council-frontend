import { useEffect, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateInterviewStatus,
} from "../api/applicationApi";
import { getDashboardStats } from "../api/statsApi";

/* ── Shared styles injected once ─────────────────────────────── */
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
    transition: border-color 0.2s;
  }
  .adm-select:focus { border-color: rgba(99,102,241,0.5); }
  .adm-select option { background: #0f1117; color: #e2e8f0; }

  .adm-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
  .adm-tbl thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .adm-tbl th {
    padding: 12px 14px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #475569;
    white-space: nowrap;
  }
  .adm-tbl td {
    padding: 12px 14px;
    color: #cbd5e1;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    white-space: nowrap;
  }
  .adm-tbl tbody tr { transition: background 0.15s; }
  .adm-tbl tbody tr:hover { background: rgba(255,255,255,0.025); }
  .adm-tbl tbody tr:last-child td { border-bottom: none; }

  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.3px;
  }
  .badge-pending  { background: rgba(234,179,8,0.15);  color: #fbbf24; border: 1px solid rgba(234,179,8,0.25); }
  .badge-accepted { background: rgba(34,197,94,0.12);  color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
  .badge-rejected { background: rgba(239,68,68,0.12);  color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
  .badge-shortlisted { background: rgba(99,102,241,0.15); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }

  .act-btn {
    padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; transition: opacity 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .act-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .act-btn-green { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
  .act-btn-red   { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
  .act-btn-indigo{ background: rgba(99,102,241,0.15); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }
  .act-btn-gray  { background: rgba(255,255,255,0.08); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .stat-card:hover { border-color: rgba(99,102,241,0.25); transform: translateY(-2px); }
  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card-blue::before   { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
  .stat-card-indigo::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
  .stat-card-green::before  { background: linear-gradient(90deg, #22c55e, #4ade80); }
  .stat-card-red::before    { background: linear-gradient(90deg, #ef4444, #f87171); }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 16px;
  }

  .tbl-wrap {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow-x: auto;
  }

  .gradient-text {
    background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .loading-pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

/* ── helpers ─────────────────────────────────────────────────── */
const badgeClass = (status) => {
  if (status === "accepted") return "badge badge-accepted";
  if (status === "rejected") return "badge badge-rejected";
  if (status === "shortlisted") return "badge badge-shortlisted";
  return "badge badge-pending";
};

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalApplications: 0 });
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [search, positionFilter, applications]);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats({
        totalUsers: data.totalUsers,
        totalApplications: data.totalApplications,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
      setFilteredApps(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];
    if (search)
      filtered = filtered.filter((app) =>
        app.student?.fullName.toLowerCase().includes(search.toLowerCase()),
      );
    if (positionFilter !== "All")
      filtered = filtered.filter((app) => app.position === positionFilter);
    setFilteredApps(filtered);
  };

  const handleApplicationStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInterview = async (id) => {
    const date = prompt("Enter Interview Date (YYYY-MM-DD)");
    if (!date) return;
    try {
      await scheduleInterview(id, date);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInterviewResult = async (id, status) => {
    try {
      await updateInterviewStatus(id, status);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  const accepted = applications.filter(
    (a) => a.applicationStatus === "accepted",
  ).length;
  const rejected = applications.filter(
    (a) => a.applicationStatus === "rejected",
  ).length;

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
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            className="loading-pulse"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid rgba(99,102,241,0.3)",
              borderTopColor: "#6366f1",
              animation:
                "spin 0.8s linear infinite, pulse 1.5s ease-in-out infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#475569", fontSize: "14px" }}>
            Loading dashboard…
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* ── STATS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Users",
            value: stats.totalUsers || "—",
            cls: "stat-card-blue",
            color: "#a5b4fc",
          },
          {
            label: "Applications",
            value: stats.totalApplications || "—",
            cls: "stat-card-indigo",
            color: "#c4b5fd",
          },
          {
            label: "Accepted",
            value: accepted,
            cls: "stat-card-green",
            color: "#4ade80",
          },
          {
            label: "Rejected",
            value: rejected,
            cls: "stat-card-red",
            color: "#f87171",
          },
        ].map(({ label, value, cls, color }) => (
          <div key={label} className={`stat-card ${cls}`}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: "#475569",
                marginBottom: "10px",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "2.2rem",
                fontWeight: 800,
                color,
                lineHeight: 1,
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#475569",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search student…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adm-input"
            style={{ paddingLeft: "36px", width: "220px" }}
          />
        </div>
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="adm-select"
        >
          <option value="All">All Positions</option>
          <option>General Secretary</option>
          <option>Assistant General Secretary</option>
          <option>Joint Secretary</option>
          <option>Assistant Joint Secretary</option>
        </select>
        <div style={{ marginLeft: "auto", fontSize: "12px", color: "#475569" }}>
          {filteredApps.length} result{filteredApps.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="tbl-wrap">
        <table className="adm-tbl">
          <thead>
            <tr>
              {[
                "Student",
                "Email",
                "Dept",
                "Roll",
                "Yr",
                "Ptr",
                "KTs",
                "Position",
                "Form Status",
                "Interview",
                "Date",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#475569",
                  }}
                >
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 600, color: "#f1f5f9" }}>
                    {app.student?.fullName}
                  </td>
                  <td style={{ color: "#64748b", fontSize: "12px" }}>
                    {app.student?.email}
                  </td>
                  <td>{app.department}</td>
                  <td>{app.rollNo}</td>
                  <td>Y{app.currentYear}</td>
                  <td>{app.pointer}</td>
                  <td>{app.kts}</td>
                  <td>
                    <span
                      style={{
                        color: "#a5b4fc",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    >
                      {app.position}
                    </span>
                  </td>
                  <td>
                    <span className={badgeClass(app.applicationStatus)}>
                      {app.applicationStatus}
                    </span>
                  </td>
                  <td>
                    <span className={badgeClass(app.interviewStatus)}>
                      {app.interviewStatus}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "12px" }}>
                    {app.interviewDate
                      ? new Date(app.interviewDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      {app.applicationStatus === "pending" && (
                        <>
                          <button
                            className="act-btn act-btn-green"
                            onClick={() =>
                              handleApplicationStatus(app._id, "accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="act-btn act-btn-red"
                            onClick={() =>
                              handleApplicationStatus(app._id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.applicationStatus === "accepted" &&
                        !app.interviewDate && (
                          <button
                            className="act-btn act-btn-gray"
                            onClick={() => handleInterview(app._id)}
                          >
                            Schedule
                          </button>
                        )}
                      {app.interviewDate &&
                        app.interviewStatus === "pending" && (
                          <>
                            <button
                              className="act-btn act-btn-indigo"
                              onClick={() =>
                                handleInterviewResult(app._id, "shortlisted")
                              }
                            >
                              Shortlist
                            </button>
                            <button
                              className="act-btn act-btn-red"
                              onClick={() =>
                                handleInterviewResult(app._id, "rejected")
                              }
                            >
                              Reject
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

export default AdminDashboard;
