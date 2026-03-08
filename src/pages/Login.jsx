import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { setToken } from "../utils/token";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await loginUser(formData);
      console.log("Login Response:", res);

      setToken(res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/apply");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card w-[380px]">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 rounded-md"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
