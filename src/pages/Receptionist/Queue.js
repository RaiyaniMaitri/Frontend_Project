import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getDailyQueue, updateQueueStatus } from "../../api/queue";

const statusColors = {
  waiting: "black",
  "in-progress": "blue",
  done: "gray",
  skipped: "red",
};

const nextStatus = {
  waiting: ["in-progress", "skipped"],
  "in-progress": ["done"],
};

export default function Queue() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDailyQueue(date);
      setQueue(res.data);
      setFetched(true);
    } catch {
      setError("Failed to load queue.");
    } finally {
      setLoading(false);
    }
  };

const handleStatusUpdate = async (id, status) => {
  try {
    await updateQueueStatus(id, status);
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  } catch (err) {
    const data = err.response?.data;
    console.log("Update error:", JSON.stringify(data, null, 2));
    alert(
      "API Error: " + (data?.message || data?.error || JSON.stringify(data))
      + "\nSent status: " + status
      + "\nQueue ID: " + id
    );
  }
};

  const counts = queue.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2 style={styles.heading}>Daily Queue</h2>

        <div style={styles.filterRow}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.dateInput}
          />
          <button style={styles.fetchBtn} onClick={fetchQueue} disabled={loading}>
            {loading ? "Loading..." : "Load Queue"}
          </button>
        </div>

        <ErrorMsg msg={error} />

        {fetched && !loading && (
          <div style={styles.statsRow}>
            {Object.entries(statusColors).map(([s, color]) => (
              <div key={s} style={styles.statChip}>
                {counts[s] || 0} {s.replace(/_|-/g, " ")}
              </div>
            ))}
            <div style={{ ...styles.statChip, background: "#eee" }}>
              {queue.length} total
            </div>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : fetched ? (
          queue.length === 0 ? (
            <p style={{ color: "#666" }}>No queue entries for this date.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Token", "Patient", "Time Slot", "Status", "Actions"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queue.map((q) => (
                  <tr key={q.id} style={styles.tr}>
                    <td style={styles.td}>#{q.tokenNumber || q.token}</td>
                    <td style={styles.td}>{q.appointment?.patient?.name || q.patientName || "—"}</td>
                    <td style={styles.td}>{q.appointment?.timeSlot || q.timeSlot || "—"}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color: statusColors[q.status] || "#000", borderColor: statusColors[q.status] || "#000" }}>
                        {q.status?.replace(/_|-/g, " ")}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {(nextStatus[q.status] || []).map((s) => (
                        <button
                          key={s}
                          style={{
                            ...styles.actionBtn,
                            color: statusColors[s] || "#000",
                            borderColor: statusColors[s] || "#666"
                          }}
                          onClick={() => handleStatusUpdate(q.id, s)}
                        >
                          → {s.replace(/_|-/g, " ")}
                        </button>
                      ))}
                      {!nextStatus[q.status] && (
                        <span style={{ color: "#666", fontSize: 13 }}>No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : null}
      </div>
    </>
  );
}

const styles = {
  page: { padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" },
  heading: { margin: "0 0 15px", color: "#000" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "15px", alignItems: "center" },
  dateInput: { padding: "4px", border: "1px solid #ccc" },
  fetchBtn: {
    background: "#f0f0f0", color: "#000", border: "1px solid #ccc",
    padding: "4px 10px", cursor: "pointer",
  },
  statsRow: { display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" },
  statChip: {
    padding: "4px 8px", border: "1px solid #ccc", background: "#fff",
    color: "#000", textTransform: "capitalize", fontSize: "14px"
  },
  table: {
    width: "100%", borderCollapse: "collapse", border: "1px solid #ccc",
  },
  th: {
    background: "#e0e0e0", padding: "8px", textAlign: "left",
    borderBottom: "1px solid #ccc", borderRight: "1px solid #ccc", fontWeight: "normal"
  },
  tr: { borderBottom: "1px solid #ccc" },
  td: { padding: "8px", borderRight: "1px solid #ccc", fontSize: "14px" },
  badge: {
    padding: "2px 5px", border: "1px solid #000", background: "#fff",
    color: "#000", textTransform: "capitalize", fontSize: "13px"
  },
  actionBtn: {
    background: "#fff", border: "1px solid #000", padding: "2px 6px",
    cursor: "pointer", marginRight: "6px", fontSize: "13px"
  },
};