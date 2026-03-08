import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    fullName:"",
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      setLoading(true);
      setError("");

      await registerUser(formData);

      navigate("/login");

    }catch(err){

      setError(err.response?.data?.message || "Registration failed");

    }finally{
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="card w-[380px]">

        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="border p-2 rounded-md"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

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

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-sm mt-4 text-center">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-primary font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;