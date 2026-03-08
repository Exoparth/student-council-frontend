import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ApplyForm from "../pages/ApplyForm";
import MyApplication from "../pages/MyApplication";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Positions from "../pages/Positions";
import Contact from "../pages/Contact";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/positions" element={<Positions />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/apply"
        element={
          <ProtectedRoute>
            <ApplyForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-application"
        element={
          <ProtectedRoute>
            <MyApplication />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
