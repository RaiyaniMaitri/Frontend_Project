import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Login from "../pages/Login";
import Navbar from "../components/Navbar";

// Patient
import BookAppointment from "../pages/Patient/BookAppointment";
import MyAppointments from "../pages/Patient/MyAppointments";

// Doctor
import DoctorQueue from "../pages/Doctor/DoctorQueue";

// Receptionist
import Queue from "../pages/Receptionist/Queue";

// Admin (optional)
function AdminDashboard() {
  return <h1>Admin Dashboard</h1>;
}

// Layout Component (Navbar control)
function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Hide Navbar on Login */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Patient */}
        <Route path="/patient" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        {/* Doctor */}
        <Route path="/doctor" element={<DoctorQueue />} />

        {/* Receptionist */}
        <Route path="/reception" element={<Queue />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

// Main Router
function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default AppRoutes;