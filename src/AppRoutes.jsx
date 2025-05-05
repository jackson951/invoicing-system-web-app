import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import NotFound from "./pages/notFound";
import ForgotPassword from "./pages/forgotPassword";
import Contact from "./pages/contact";
import VerifyEmail from "./pages/verifyEmail";

// Admin Pages
import AdminDashboard from "./pages/admin/dashBoard";
import AdminUsers from "./pages/admin/Users";
import AdminInvoices from "./pages/admin/Invoices";
import AdminSettings from "./pages/admin/Settings";
import CreateInvoice from "./pages/admin/createInvoice";
import CreateUser from "./pages/admin/CreateUser";

// Protected Route Component for Admin pages
const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allowedRoles = ["Admin", "editor", "subscriber"]; // extend roles here

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route Component for Public pages when logged in
const ProtectedPublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/register"
        element={
          <ProtectedPublicRoute>
            <Register />
          </ProtectedPublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedPublicRoute>
            <Login />
          </ProtectedPublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Admin Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="invoices/create" element={<CreateInvoice />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
