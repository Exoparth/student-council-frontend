import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">

      <div className="card text-center max-w-xl">

        <h1 className="text-3xl font-bold text-primary mb-4">
          Student Council Portal
        </h1>

        <p className="text-gray-600 mb-6">
          Apply for student council positions and track your application status.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            to="/login"
            className="btn-primary"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Home;