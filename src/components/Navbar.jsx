import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Prevent navbar rendering before auth finishes
  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-center flex justify-between items-center py-3">
        <Link to="/" className="text-xl font-bold text-primary">
          Council Portal
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>

         <Link to="/positions" className="hover:text-primary">
  Positions
</Link>

<Link to="/contact" className="hover:text-primary">
  Contact
</Link>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-primary font-semibold">
                Login
              </Link>

              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <img
                src={
                  user.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full object-cover border cursor-pointer"
              />

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/my-application");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Application
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
