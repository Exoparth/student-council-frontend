import { useEffect, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateInterviewStatus,
} from "../api/applicationApi";
import { getDashboardStats } from "../api/statsApi";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
  });

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
      <div className="flex items-center justify-center h-64">
        Loading applications...
      </div>
    );
  }

  const accepted = applications.filter(
    (a) => a.applicationStatus === "accepted",
  ).length;

  const rejected = applications.filter(
    (a) => a.applicationStatus === "rejected",
  ).length;

  const statusBadge = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div>
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {stats.totalUsers || "--"}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Applications</p>
          <h2 className="text-3xl font-bold text-indigo-600">
            {stats.totalApplications || "--"}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Accepted</p>
          <h2 className="text-3xl font-bold text-green-600">{accepted}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Rejected</p>
          <h2 className="text-3xl font-bold text-red-600">{rejected}</h2>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="All">All Positions</option>
          <option>General Secretary</option>
          <option>Assistant General Secretary</option>
          <option>Joint Secretary</option>
          <option>Assistant Joint Secretary</option>
        </select>
      </div>

      {/* APPLICATION TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Student</th>
              <th>Email</th>
              <th>Department</th>
              <th>Roll</th>
              <th>Year</th>
              <th>Pointer</th>
              <th>KTs</th>
              <th>Position</th>
              <th>Form</th>
              <th>Interview</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApps.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{app.student?.fullName}</td>

                <td>{app.student?.email}</td>

                <td>{app.department}</td>

                <td>{app.rollNo}</td>

                <td>Year {app.currentYear}</td>

                <td>{app.pointer}</td>

                <td>{app.kts}</td>

                <td className="font-semibold text-blue-600">{app.position}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(
                      app.applicationStatus,
                    )}`}
                  >
                    {app.applicationStatus}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(
                      app.interviewStatus,
                    )}`}
                  >
                    {app.interviewStatus}
                  </span>
                </td>

                <td>
                  {app.interviewDate
                    ? new Date(app.interviewDate).toLocaleDateString()
                    : "Not Scheduled"}
                </td>

                <td className="flex gap-2 p-2">
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
                        className="bg-gray-800 text-white px-3 py-1 rounded"
                        onClick={() => handleInterview(app._id)}
                      >
                        Schedule
                      </button>
                    )}

                  {app.interviewDate && app.interviewStatus === "pending" && (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
