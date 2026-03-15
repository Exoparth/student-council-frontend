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
import AdminUsers from "../pages/AdminUsers";
import AdminLayout from "../layouts/AdminLayout";
import AdminMessages from "../pages/AdminMessages";

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
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
