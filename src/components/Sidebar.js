import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  return (
    <div style={{ width: "200px", background: "#eee", height: "100vh" }}>
      <h3>{user.role}</h3>

      {user.role === "admin" && (
        <>
          <Link to="/admin">Dashboard</Link><br />
          <Link to="/admin/users">Users</Link>
        </>
      )}

      {user.role === "patient" && (
        <>
          <Link to="/patient">Dashboard</Link><br />
          <Link to="/appointments">My Appointments</Link>
        </>
      )}

      {user.role === "receptionist" && (
        <>
          <Link to="/receptionist">Queue</Link>
        </>
      )}

      {user.role === "doctor" && (
        <>
          <Link to="/doctor">Doctor Queue</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;