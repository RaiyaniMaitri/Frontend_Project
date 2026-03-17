import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { getDailyQueue } from "../../api/queue";
import { getUser } from "../../Utils/auth";

export default function ReceptionistDashboard() {
  const user = getUser();
  const today = new Date().toISOString().slice(0, 10);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyQueue(today)
      .then((res) => setQueue(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [today]);

  const counts = queue.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: "Total Today", value: queue.length, bg: "#1a1a2e" },
    { label: "Waiting", value: counts.waiting || 0, bg: "#2196f3" },
    { label: "In Progress", value: counts["in-progress"] || counts.in_progress || 0, bg: "#9c27b0" },
    { label: "Done", value: counts.done || 0, bg: "#4caf50" },
    { label: "Skipped", value: counts.skipped || 0, bg: "#f44336" },
  ];

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>Welcome, {user?.name}</h2>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Clinic: <b>{user?.clinicName}</b> &nbsp;|&nbsp; Today: <b>{today}</b>
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
          <Link to="/receptionist/queue" style={styles.card}>
            📋 <span>Manage Queue</span>
          </Link>
        </div>
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
  quickLinks: { display: "flex", gap: 16, flexWrap: "wrap" },
  card: {
    background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8,
    padding: "24px 32px", textDecoration: "none", color: "#1a1a2e",
    fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
  },
};