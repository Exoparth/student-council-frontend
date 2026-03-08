import { useEffect, useState } from "react";
import { getMyApplication } from "../api/applicationApi";

function MyApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getMyApplication();
        setApplications(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading applications...
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No applications submitted yet.
      </div>
    );
  }

  const statusBadge = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";

    if (status === "rejected") return "bg-red-100 text-red-600";

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container-center">
        <h2 className="text-3xl font-bold text-center mb-12">
          My Applications
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg mb-4">
                {application.position}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {application.department}
                </p>

                <p>
                  <span className="font-semibold">Roll No:</span>{" "}
                  {application.rollNo}
                </p>

                <p className="flex items-center gap-2">
                  <span className="font-semibold">Application:</span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(
                      application.applicationStatus,
                    )}`}
                  >
                    {application.applicationStatus}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <span className="font-semibold">Interview:</span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(
                      application.interviewStatus,
                    )}`}
                  >
                    {application.interviewStatus}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Interview Date:</span>{" "}
                  {application.interviewDate
                    ? new Date(application.interviewDate).toLocaleDateString()
                    : "Not Scheduled"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyApplication;
