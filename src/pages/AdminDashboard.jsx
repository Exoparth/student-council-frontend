import { useEffect, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateInterviewStatus,
} from "../api/applicationApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [search, positionFilter, applications]);

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

    if (search) {
      filtered = filtered.filter((app) =>
        app.student?.fullName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (positionFilter !== "All") {
      filtered = filtered.filter((app) => app.position === positionFilter);
    }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading applications...
      </div>
    );
  }

  const total = applications.length;
  const pending = applications.filter(
    (a) => a.applicationStatus === "pending",
  ).length;
  const accepted = applications.filter(
    (a) => a.applicationStatus === "accepted",
  ).length;
  const rejected = applications.filter(
    (a) => a.applicationStatus === "rejected",
  ).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}

      <div className="w-64 bg-white border-r border-border p-6">
        <h2 className="text-xl font-bold text-primary mb-8">Admin Panel</h2>

        <div className="flex flex-col gap-4 text-sm">
          <button className="text-left text-primary font-semibold">
            Dashboard
          </button>

          <button className="text-left text-gray-600 hover:text-primary">
            Applications
          </button>

          <button className="text-left text-gray-600 hover:text-primary">
            Interviews
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">
        {/* TOP HEADER */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>

          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-gray-500 text-sm">Total Applications</p>
            <h2 className="text-3xl font-bold text-primary">{total}</h2>
          </div>

          <div className="card text-center">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-500">{pending}</h2>
          </div>

          <div className="card text-center">
            <p className="text-gray-500 text-sm">Accepted</p>
            <h2 className="text-3xl font-bold text-green-600">{accepted}</h2>
          </div>

          <div className="card text-center">
            <p className="text-gray-500 text-sm">Rejected</p>
            <h2 className="text-3xl font-bold text-red-500">{rejected}</h2>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="card mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border p-2 rounded w-64"
          />

          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="border border-border p-2 rounded"
          >
            <option value="All">All Positions</option>
            <option>General Secretary</option>
            <option>Assistant General Secretary</option>
            <option>Joint Secretary</option>
            <option>Assistant Joint Secretary</option>
          </select>
        </div>

        {/* TABLE */}

        <div className="card overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Roll</th>
                <th className="p-3">Year</th>
                <th className="p-3">Pointer</th>
                <th className="p-3">KTs</th>
                <th className="p-3">Position</th>
                <th className="p-3">Form</th>
                <th className="p-3">Interview</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApps.map((app) => (
                <>
                  <tr key={app._id} className="border-b">
                    <td className="p-3 font-semibold">
                      {app.student?.fullName}
                    </td>

                    <td className="p-3">{app.student?.email}</td>

                    <td className="p-3">{app.department}</td>

                    <td className="p-3">{app.rollNo}</td>

                    <td className="p-3">Year {app.currentYear}</td>

                    <td className="p-3">{app.pointer}</td>

                    <td className="p-3">{app.kts}</td>

                    <td className="p-3 text-primary font-semibold">
                      {app.position}
                    </td>

                    {/* APPLICATION STATUS */}

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.applicationStatus === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.applicationStatus === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.applicationStatus}
                      </span>
                    </td>

                    {/* INTERVIEW STATUS */}

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.interviewStatus === "shortlisted"
                            ? "bg-green-100 text-green-700"
                            : app.interviewStatus === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {app.interviewStatus}
                      </span>
                    </td>

                    {/* INTERVIEW DATE */}

                    <td className="p-3">
                      {app.interviewDate
                        ? new Date(app.interviewDate).toLocaleDateString()
                        : "Not Scheduled"}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-3 flex gap-2 flex-wrap">
                      {app.applicationStatus === "pending" && (
                        <>
                          <button
                            className="btn-primary"
                            onClick={() =>
                              handleApplicationStatus(app._id, "accepted")
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="btn-danger"
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
                            className="bg-gray-700 text-white px-3 py-1 rounded"
                            onClick={() => handleInterview(app._id)}
                          >
                            Schedule
                          </button>
                        )}

                      {app.interviewDate &&
                        app.interviewStatus === "pending" && (
                          <>
                            <button
                              className="btn-primary"
                              onClick={() =>
                                handleInterviewResult(app._id, "shortlisted")
                              }
                            >
                              Shortlist
                            </button>

                            <button
                              className="btn-danger"
                              onClick={() =>
                                handleInterviewResult(app._id, "rejected")
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}
                    </td>
                  </tr>

                  {/* APPLICATION DETAILS */}

                  <tr className="bg-gray-50">
                    <td colSpan="12" className="p-4 text-sm text-gray-600">
                      <b>Statement:</b> {app.statement || "N/A"}
                      <br />
                      <b>Experience:</b> {app.experience || "N/A"}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
