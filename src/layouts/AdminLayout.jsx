import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r shadow-sm p-6">

        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <div className="flex flex-col gap-3 text-sm">

          <button
            onClick={() => navigate("/admin")}
            className="text-left px-3 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="text-left px-3 py-2 rounded hover:bg-gray-100"
          >
            Users
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <h1 className="text-3xl font-bold">
            Admin Panel
          </h1>

          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>

        </div>

        {/* PAGE CONTENT */}
        <Outlet />

      </div>

    </div>
  );
}

export default AdminLayout;