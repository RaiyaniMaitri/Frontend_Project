import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getAppointmentById } from "../../api/appointments";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAppointmentById(id)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load appointment details."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        <h2 style={styles.heading}>Appointment Details</h2>
        <ErrorMsg msg={error} />
        {loading ? <Loader /> : data && (
          <>
            <div style={styles.card}>
              <Row label="Date" value={data.date} />
              <Row label="Time Slot" value={data.timeSlot} />
              <Row label="Status" value={data.status} />
              {data.queueToken && <Row label="Queue Token" value={`#${data.queueToken}`} />}
            </div>

            {data.prescription && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>💊 Prescription</h3>
                {data.prescription.notes && <p style={styles.notes}>{data.prescription.notes}</p>}
                {data.prescription.medicines?.length > 0 && (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {["Medicine", "Dosage", "Duration", "Instructions"].map((h) => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.prescription.medicines.map((m, i) => (
                        <tr key={i}>
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
            )}

            {data.report && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>📋 Report</h3>
                <Row label="Diagnosis" value={data.report.diagnosis} />
                {data.report.tests && <Row label="Tests" value={data.report.tests} />}
                {data.report.remarks && <Row label="Remarks" value={data.report.remarks} />}
              </div>
            )}

            {!data.prescription && !data.report && (
              <p style={{ color: "#888", marginTop: 16 }}>No prescription or report added yet.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
      <span style={{ minWidth: 120, color: "#888", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 500, fontSize: 14 }}>{value}</span>
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 800, margin: "0 auto" },
  backBtn: { background: "none", border: "none", color: "#2196f3", cursor: "pointer", padding: 0, marginBottom: 12, fontSize: 14 },
  heading: { margin: "0 0 20px", color: "#1a1a2e" },
  card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 16 },
  sectionTitle: { margin: "0 0 12px", color: "#1a1a2e" },
  notes: { color: "#555", fontSize: 14, marginBottom: 12 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f5f5f5", padding: "8px 12px", textAlign: "left", fontSize: 13, borderBottom: "1px solid #eee" },
  td: { padding: "8px 12px", fontSize: 14, borderBottom: "1px solid #f5f5f5" },
};