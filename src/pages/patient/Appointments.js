import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { getMyAppointments, bookAppointment } from "../../api/appointments";

const statusColors = {
  queued: "#ff9800",
  waiting: "#2196f3",
  "in-progress": "#9c27b0",
  done: "#4caf50",
  skipped: "#f44336",
  scheduled: "#ff9800",
};

// Time slots as ranges — exactly what the API expects
const TIME_SLOTS = [
  "09:00-09:15", "09:15-09:30", "09:30-09:45", "09:45-10:00",
  "10:00-10:15", "10:15-10:30", "10:30-10:45", "10:45-11:00",
  "11:00-11:15", "11:15-11:30", "11:30-11:45", "11:45-12:00",
  "14:00-14:15", "14:15-14:30", "14:30-14:45", "14:45-15:00",
  "15:00-15:15", "15:15-15:30", "15:30-15:45", "15:45-16:00",
  "16:00-16:15", "16:15-16:30", "16:30-16:45", "16:45-17:00",
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ appointmentDate: "", timeSlot: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchAppointments = () => {
    setLoading(true);
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to load appointments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    const payload = {
      appointmentDate: form.appointmentDate,  // e.g. "2026-03-25"
      timeSlot: form.timeSlot,               // e.g. "10:00-10:15"
    };

    console.log("Sending payload:", JSON.stringify(payload));

    try {
      await bookAppointment(payload);
      setFormSuccess("Appointment booked successfully!");
      setForm({ appointmentDate: "", timeSlot: "" });
      fetchAppointments();
    } catch (err) {
      const data = err.response?.data;
      console.log("Full error:", JSON.stringify(data, null, 2));
      setFormError(
        data?.message || data?.error ||
        Object.values(data || {}).join(", ") ||
        "Booking failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.header}>
          <h2 style={styles.heading}>My Appointments</h2>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Book Appointment"}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ marginTop: 0 }}>Book New Appointment</h3>
            <ErrorMsg msg={formError} />
            {formSuccess && <div style={styles.successMsg}>{formSuccess}</div>}
            <form onSubmit={handleBook} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={form.appointmentDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Time Slot</label>
                <select
                  style={styles.input}
                  value={form.timeSlot}
                  onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                  required
                >
                  <option value="">Select a slot</option>
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button style={styles.submitBtn} type="submit" disabled={submitting}>
                {submitting ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        )}

        <ErrorMsg msg={error} />
        {loading ? (
          <Loader />
        ) : (
          <div style={styles.list}>
            {appointments.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center" }}>No appointments found.</p>
            ) : (
              appointments.map((a) => (
                <div key={a.id} style={styles.apptCard}>
                  <div style={styles.apptLeft}>
                    <div style={styles.apptDate}>
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleDateString()
                        : a.date}
                    </div>
                    <div style={styles.apptTime}>{a.timeSlot}</div>
                  </div>
                  <div style={styles.apptMid}>
                    {a.queueEntry?.tokenNumber && (
                      <div style={styles.token}>
                        Token #{a.queueEntry.tokenNumber}
                      </div>
                    )}
                    <span style={{ ...styles.badge, background: statusColors[a.status] || "#999" }}>
                      {a.status}
                    </span>
                  </div>
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/patient/appointments/${a.id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 900, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { margin: 0, color: "#1a1a2e" },
  addBtn: { background: "#1a1a2e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer" },
  formCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 20 },
  form: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column", flex: 1, minWidth: 160 },
  label: { fontSize: 13, marginBottom: 4, color: "#555" },
  input: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 },
  submitBtn: { background: "#2196f3", color: "#fff", border: "none", padding: "9px 20px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap" },
  successMsg: { background: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: 4, marginBottom: 12, fontSize: 14 },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  apptCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 },
  apptLeft: { minWidth: 120 },
  apptDate: { fontWeight: 600, fontSize: 15 },
  apptTime: { fontSize: 13, color: "#666" },
  apptMid: { flex: 1, display: "flex", gap: 12, alignItems: "center" },
  token: { background: "#f0f4f8", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  badge: { color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  viewBtn: { background: "#fff", border: "1px solid #1a1a2e", color: "#1a1a2e", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
};