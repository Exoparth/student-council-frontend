import { useEffect, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateInterviewStatus,
} from "../api/applicationApi";

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-background p-10">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      <div className="overflow-x-auto card">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr className="text-gray-700">
              <th className="p-3">Student</th>
              <th className="p-3">Email</th>
              <th className="p-3">Position</th>
              <th className="p-3">Form Status</th>
              <th className="p-3">Interview Status</th>
              <th className="p-3">Interview Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b">
                <td className="p-3">{app.student?.fullName}</td>

                <td className="p-3">{app.student?.email}</td>

                <td className="p-3">{app.position}</td>

                {/* Application Status */}

                <td className="p-3">
                  <span
                    className={
                      app.applicationStatus === "accepted"
                        ? "text-green-600 font-semibold"
                        : app.applicationStatus === "rejected"
                          ? "text-red-500 font-semibold"
                          : "text-yellow-600 font-semibold"
                    }
                  >
                    {app.applicationStatus}
                  </span>
                </td>

                {/* Interview Status */}

                <td className="p-3">
                  <span
                    className={
                      app.interviewStatus === "shortlisted"
                        ? "text-green-600 font-semibold"
                        : app.interviewStatus === "rejected"
                          ? "text-red-500 font-semibold"
                          : "text-blue-600 font-semibold"
                    }
                  >
                    {app.interviewStatus}
                  </span>
                </td>

                {/* Interview Date */}

                <td className="p-3">
                  {app.interviewDate
                    ? new Date(app.interviewDate).toLocaleDateString()
                    : "Not Scheduled"}
                </td>

                {/* Actions */}

                <td className="p-3 flex gap-2 flex-wrap">
                  {/* Form Review Stage */}

                  {app.applicationStatus === "pending" && (
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
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

                  {/* Schedule Interview */}

                  {app.applicationStatus === "accepted" &&
                    !app.interviewDate && (
                      <button
                        className="bg-gray-700 text-white px-3 py-1 rounded"
                        onClick={() => handleInterview(app._id)}
                      >
                        Schedule Interview
                      </button>
                    )}

                  {/* Interview Result */}

                  {app.interviewDate && app.interviewStatus === "pending" && (
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
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
