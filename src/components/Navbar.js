import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const roleLinks = {
    admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/users", label: "Users" },
    ],
    patient: [
      { to: "/patient/dashboard", label: "Dashboard" },
      { to: "/patient/appointments", label: "Appointments" },
      { to: "/patient/prescriptions", label: "Prescriptions" },
      { to: "/patient/reports", label: "Reports" },
    ],
    receptionist: [
      { to: "/receptionist/dashboard", label: "Dashboard" },
      { to: "/receptionist/queue", label: "Queue" },
    ],
    doctor: [
      { to: "/doctor/dashboard", label: "Dashboard" },
      { to: "/doctor/queue", label: "Queue" },
    ],
  };

  const links = roleLinks[user?.role] || [];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🏥 CMS — {user?.clinicName || "Clinic"}</div>
      <div style={styles.links}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} style={styles.link}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={styles.right}>
        <span style={styles.userInfo}>
          {user?.name} ({user?.role})
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    background: "#1a1a2e",
    color: "#fff",
    padding: "0 24px",
    height: 56,
    gap: 24,
  },
  brand: { fontWeight: 700, fontSize: 16, marginRight: 16, whiteSpace: "nowrap" },
  links: { display: "flex", gap: 16, flex: 1 },
  link: { color: "#a0c4ff", textDecoration: "none", fontSize: 14 },
  right: { display: "flex", alignItems: "center", gap: 12 },
  userInfo: { fontSize: 13, color: "#ccc" },
  logoutBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
  },
};