import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import ErrorMsg from "../../components/ErrorMsg";
import { listUsers, createUser } from "../../api/admin";

const initialForm = { name: "", email: "", password: "", role: "doctor" };

export default function AdminUsers(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [filterRole, setFilterRole] = useState("all");

      const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await listUsers();
      setUsers(res.data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => { fetchUsers(); }, []);

      const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);
    try {
      await createUser(form);
      setFormSuccess("User created successfully!");
      setForm(initialForm);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

    const filtered = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

     return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Users</h2>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add User"}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ marginTop: 0 }}>Create New User</h3>
            <ErrorMsg msg={formError} />
            {formSuccess && <div style={styles.successMsg}>{formSuccess}</div>}
            <form onSubmit={handleCreate} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                style={styles.input}
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                style={styles.input}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <select
                style={styles.input}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="patient">Patient</option>
              </select>
              <button style={styles.submitBtn} type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        )}

        <div style={styles.filterRow}>
          {["all", "admin", "doctor", "receptionist", "patient"].map((r) => (
            <button
              key={r}
              style={{ ...styles.filterBtn, ...(filterRole === r ? styles.filterActive : {}) }}
              onClick={() => setFilterRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <ErrorMsg msg={error} />
        {loading ? (
          <Loader />
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Name", "Email", "Role"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...roleBadge(u.role) }}>{u.role}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={3} style={{ ...styles.td, textAlign: "center", color: "#888" }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function roleBadge(role) {
  const map = {
    admin: { background: "#1a1a2e", color: "#fff" },
    doctor: { background: "#2196f3", color: "#fff" },
    receptionist: { background: "#4caf50", color: "#fff" },
    patient: { background: "#ff9800", color: "#fff" },
  };
  return map[role] || {};
}



const styles = {
  page: { padding: 24, maxWidth: 900, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { margin: 0, color: "#1a1a2e" },
  addBtn: { background: "#1a1a2e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer" },
  formCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 20 },
  form: { display: "flex", flexWrap: "wrap", gap: 12 },
  input: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, minWidth: 180, flex: 1 },
  submitBtn: { background: "#2196f3", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 6, cursor: "pointer" },
  successMsg: { background: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: 4, marginBottom: 12, fontSize: 14 },
  filterRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  filterBtn: { padding: "5px 14px", border: "1px solid #ccc", borderRadius: 20, background: "#fff", cursor: "pointer", fontSize: 13 },
  filterActive: { background: "#1a1a2e", color: "#fff", border: "1px solid #1a1a2e" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  th: { background: "#f5f5f5", padding: "10px 14px", textAlign: "left", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #eee" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "10px 14px", fontSize: 14 },
  badge: { padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 },
};