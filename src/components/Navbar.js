import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.nav}>
      <h3>Clinic CMS</h3>

      <div>
        {user?.role === "Patient" && (
          <>
            <Link to="/patient" style={styles.link}>Book</Link>
            <Link to="/my-appointments" style={styles.link}>My Appointments</Link>
          </>
        )}

        {user?.role === "Doctor" && (
          <Link to="/doctor" style={styles.link}>Queue</Link>
        )}

        {user?.role === "Receptionist" && (
          <Link to="/reception" style={styles.link}>Queue</Link>
        )}

        {user?.role === "Admin" && (
          <Link to="/admin" style={styles.link}>Dashboard</Link>
        )}

        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
  },
  link: {
    margin: "0 10px",
    color: "#fff",
    textDecoration: "none",
  },
  btn: {
    marginLeft: "10px",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;