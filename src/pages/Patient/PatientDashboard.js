import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getMyAppointments } from "../../api/appointments";
import { getUser } from "../../utils/auth";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to load appointments."))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => a.status === "queued");
  const completed = appointments.filter((a) => a.status === "done");

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>Welcome, {user?.name}</h2>
        <p style={{ color: "#666", marginBottom: 24 }}>Clinic: <b>{user?.clinicName}</b></p>
        <ErrorMsg msg={error} />
        {loading ? <Loader /> : (
          <>
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{appointments.length}</div>
                <div style={styles.statLabel}>Total Appointments</div>
              </div>
              <div style={{ ...styles.statCard, background: "#2196f3" }}>
                <div style={styles.statNum}>{upcoming.length}</div>
                <div style={styles.statLabel}>Queued</div>
              </div>
              <div style={{ ...styles.statCard, background: "#4caf50" }}>
                <div style={styles.statNum}>{completed.length}</div>
                <div style={styles.statLabel}>Completed</div>
              </div>
            </div>
            <div style={styles.quickLinks}>
              <Link to="/patient/appointments" style={styles.card}>
                📅 <span>My Appointments</span>
              </Link>
              <Link to="/patient/prescriptions" style={styles.card}>
                💊 <span>My Prescriptions</span>
              </Link>
              <Link to="/patient/reports" style={styles.card}>
                📋 <span>My Reports</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: "0 auto" },
  heading: { margin: "0 0 4px", color: "#1a1a2e" },
  statsRow: { display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" },
  statCard: { background: "#1a1a2e", color: "#fff", borderRadius: 8, padding: "20px 32px", textAlign: "center", minWidth: 130 },
  statNum: { fontSize: 32, fontWeight: 700 },
  statLabel: { fontSize: 13, opacity: 0.8, marginTop: 4 },
  quickLinks: { display: "flex", gap: 16, flexWrap: "wrap" },
  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: "24px 32px",
    textDecoration: "none",
    color: "#1a1a2e",
    fontSize: 15,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "box-shadow 0.2s",
  },
};