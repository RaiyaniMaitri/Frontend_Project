import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

import PatientDashboard from "./pages/patient/PatientDashboard";
import Appointments from "./pages/patient/Appointments";
import AppointmentDetail from "./pages/patient/AppointmentDetail";
import Prescriptions from "./pages/patient/Prescriptions";
import Reports from "./pages/patient/Reports";

import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import Queue from "./pages/receptionist/Queue";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorQueue from "./pages/doctor/DoctorQueue";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments/:id"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <AppointmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/reports"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Receptionist Routes */}
        <Route
          path="/receptionist/dashboard"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/queue"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <Queue />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/queue"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorQueue />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}