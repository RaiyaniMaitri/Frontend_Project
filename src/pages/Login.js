import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); 
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!role) {
            alert("Please select a role");
            return;
        }

        try {
            const res = await API.post("/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("role", role); 

            if (role === "admin") navigate("/admin");
            else if (role === "doctor") navigate("/doctor");
            else if (role === "reception") navigate("/reception");
            else navigate("/patient");

        } catch (err) {
            console.log(err.response?.data);
            alert("Login Failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <select onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="reception">Receptionist</option>
                <option value="patient">Patient</option>
            </select>

            <br /><br />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;