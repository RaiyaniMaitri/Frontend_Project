import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getMyReports } from "../../api/doctor";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyReports()
      .then((res) => setReports(res.data))
      .catch(() => setError("Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>My Reports</h2>
        <ErrorMsg msg={error} />
        {loading ? <Loader /> : (
          reports.length === 0 ? (
            <p style={{ color: "#888" }}>No reports found.</p>
          ) : (
            reports.map((r, i) => (
              <div key={r.id || i} style={styles.card}>
                <Row label="Date" value={r.date || r.createdAt?.slice(0, 10)} />
                <Row label="Diagnosis" value={r.diagnosis} />
                {r.tests && <Row label="Tests" value={r.tests} />}
                {r.remarks && <Row label="Remarks" value={r.remarks} />}
              </div>
            ))
          )
        )}
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
      <span style={{ minWidth: 100, color: "#888", fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: "0 auto" },
  heading: { margin: "0 0 20px", color: "#1a1a2e" },
  card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 18, marginBottom: 14 },
};