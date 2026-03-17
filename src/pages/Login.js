import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { saveAuth } from "../utils/auth";
import ErrorMsg from "../components/ErrorMsg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password);
      const { token, user } = res.data;
      saveAuth(token, user);
      // redirect by role
      const routes = {
        admin: "/admin/dashboard",
        patient: "/patient/dashboard",
        receptionist: "/receptionist/dashboard",
        doctor: "/doctor/dashboard",
      };
      navigate(routes[user.role] || "/login");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Clinic Queue Management</h2>
        <p style={styles.sub}>Sign in to your account</p>
        <ErrorMsg msg={error} />
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4f8",
  },
  card: {
    background: "#fff",
    padding: 36,
    borderRadius: 10,
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
    width: 360,
  },
  logo: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  title: { textAlign: "center", margin: "0 0 4px", color: "#1a1a2e" },
  sub: { textAlign: "center", color: "#888", marginBottom: 20, fontSize: 14 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, marginBottom: 4, color: "#555" },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 4,
  },    
};