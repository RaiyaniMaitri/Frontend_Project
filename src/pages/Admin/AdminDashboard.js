import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getClinicInfo, listUsers } from "../../api/admin";

export default function AdminDashboard(){
    const [clinic, setClinic] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, uRes] = await Promise.all([getClinicInfo(), listUsers()]);
        setClinic(cRes.data);
        setUsers(uRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

   const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

    return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>Admin Dashboard</h2>
        <ErrorMsg msg={error} />
        {loading ? (
          <Loader />
        ) : (
          <>
            {clinic && (
              <div style={styles.clinicCard}>
                <h3 style={{ margin: "0 0 8px" }}>{clinic.name}</h3>
                <p style={styles.meta}>Code: <b>{clinic.code}</b></p>
                {clinic.address && <p style={styles.meta}>Address: {clinic.address}</p>}
              </div>
            )}
            <div style={styles.statsRow}>
              {["doctor", "receptionist", "patient"].map((role) => (
                <div key={role} style={styles.statCard}>
                  <div style={styles.statNum}>{roleCounts[role] || 0}</div>
                  <div style={styles.statLabel}>{role.charAt(0).toUpperCase() + role.slice(1)}s</div>
                </div>
              ))}
              <div style={styles.statCard}>
                <div style={styles.statNum}>{users.length}</div>
                <div style={styles.statLabel}>Total Users</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}


const styles = {
  page: { padding: 24, maxWidth: 900, margin: "0 auto" },
  heading: { marginBottom: 20, color: "#1a1a2e" },
  clinicCard: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  meta: { margin: "4px 0", color: "#555", fontSize: 14 },
  statsRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  statCard: {
    background: "#1a1a2e",
    color: "#fff",
    borderRadius: 8,
    padding: "20px 32px",
    textAlign: "center",
    minWidth: 120,
  },
  statNum: { fontSize: 32, fontWeight: 700 },
  statLabel: { fontSize: 13, marginTop: 4, opacity: 0.8 },
};