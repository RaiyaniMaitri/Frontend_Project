import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { getDoctorQueue } from "../../api/doctor";
import { getUser } from "../../Utils/auth";

export default function DoctorDashboard() {
  const user = getUser();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorQueue()
      .then((res) => setQueue(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = queue.reduce((acc, q) => {
    const s = q.status || "waiting";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: "Total Patients", value: queue.length, bg: "#1a1a2e" },
    { label: "Waiting", value: counts.waiting || 0, bg: "#2196f3" },
    { label: "In Progress", value: counts["in-progress"] || counts.in_progress || 0, bg: "#9c27b0" },
    { label: "Done", value: counts.done || 0, bg: "#4caf50" },
  ];

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>Welcome, Dr. {user?.name}</h2>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Clinic: <b>{user?.clinicName}</b> &nbsp;|&nbsp;
          Today: <b>{new Date().toISOString().slice(0, 10)}</b>
        </p>

        {loading ? (
          <Loader />
        ) : (
          <div style={styles.statsRow}>
            {statCards.map((s) => (
              <div key={s.label} style={{ ...styles.statCard, background: s.bg }}>
                <div style={styles.statNum}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.quickLinks}>
          <Link to="/doctor/queue" style={styles.card}>
            🩺 <span>Today's Queue</span>
          </Link>
        </div>

        {!loading && queue.length > 0 && (
          <div style={styles.previewSection}>
            <h3 style={{ margin: "0 0 12px", color: "#1a1a2e" }}>Today's Patients</h3>
            <div style={styles.patientList}>
              {queue.slice(0, 5).map((q) => (
                <div key={q.id} style={styles.patientChip}>
                  <span style={styles.tokenBadge}>#{q.token}</span>
                  {q.patientName || q.patient?.name || "Patient"}
                </div>
              ))}
              {queue.length > 5 && (
                <div style={{ ...styles.patientChip, background: "#f0f0f0", color: "#666" }}>
                  +{queue.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 960, margin: "0 auto" },
  heading: { margin: "0 0 4px", color: "#1a1a2e" },
  statsRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 },
  statCard: {
    color: "#fff", borderRadius: 8, padding: "20px 28px",
    textAlign: "center", minWidth: 110,
  },
  statNum: { fontSize: 30, fontWeight: 700 },
  statLabel: { fontSize: 12, opacity: 0.85, marginTop: 4 },
  quickLinks: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 },
  card: {
    background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8,
    padding: "24px 32px", textDecoration: "none", color: "#1a1a2e",
    fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
  },
  previewSection: {
    background: "#fff", border: "1px solid #e0e0e0",
    borderRadius: 8, padding: 20,
  },
  patientList: { display: "flex", gap: 10, flexWrap: "wrap" },
  patientChip: {
    background: "#f0f4f8", borderRadius: 20, padding: "6px 14px",
    fontSize: 13, display: "flex", alignItems: "center", gap: 8,
  },
  tokenBadge: {
    background: "#1a1a2e", color: "#fff", borderRadius: 10,
    padding: "1px 8px", fontSize: 11, fontWeight: 700,
  },
};