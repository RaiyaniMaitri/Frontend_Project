import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getMyPrescriptions } from "../../api/doctor";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyPrescriptions()
      .then((res) => setPrescriptions(res.data))
      .catch(() => setError("Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>My Prescriptions</h2>
        <ErrorMsg msg={error} />
        {loading ? <Loader /> : (
          prescriptions.length === 0 ? (
            <p style={{ color: "#888" }}>No prescriptions found.</p>
          ) : (
            prescriptions.map((p, i) => (
              <div key={p.id || i} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.date}>{p.date || p.createdAt?.slice(0, 10)}</span>
                  {p.notes && <span style={styles.notes}>{p.notes}</span>}
                </div>
                {p.medicines?.length > 0 && (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {["Medicine", "Dosage", "Duration", "Instructions"].map((h) => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.medicines.map((m, j) => (
                        <tr key={j}>
                          <td style={styles.td}>{m.name}</td>
                          <td style={styles.td}>{m.dosage}</td>
                          <td style={styles.td}>{m.duration}</td>
                          <td style={styles.td}>{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: "0 auto" },
  heading: { margin: "0 0 20px", color: "#1a1a2e" },
  card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 18, marginBottom: 16 },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  date: { fontWeight: 600, fontSize: 14 },
  notes: { color: "#666", fontSize: 13 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f5f5f5", padding: "8px 12px", textAlign: "left", fontSize: 13, borderBottom: "1px solid #eee" },
  td: { padding: "8px 12px", fontSize: 14, borderBottom: "1px solid #f5f5f5" },
};