import { useEffect, useState } from "react";
import { getMyApplication } from "../api/applicationApi";

function MyApplication() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getMyApplication();
        setApplication(data);
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
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No application found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center py-10">
      <div className="card w-[500px]">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          My Application
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Position:</span>{" "}
            {application.position}
          </p>

          <p>
            <span className="font-semibold">Department:</span>{" "}
            {application.department}
          </p>

          <p>
            <span className="font-semibold">Roll No:</span> {application.rollNo}
          </p>

          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={
                application.status === "shortlisted"
                  ? "text-green-600 font-semibold"
                  : application.status === "rejected"
                    ? "text-red-500 font-semibold"
                    : application.status === "interview_scheduled"
                      ? "text-blue-600 font-semibold"
                      : "text-yellow-600 font-semibold"
              }
            >
              {application.status}
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
    </div>
  );
}

export default MyApplication;
