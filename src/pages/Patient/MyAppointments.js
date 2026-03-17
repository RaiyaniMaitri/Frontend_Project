import React, { useState, useEffect } from "react";
import API from "../../api/axios";

function MyAppointments() {
    const [data, setData] = useState([]);

    useEffect(() => {
        API.get("/appointments/my")
            .then(res => setData(res.data))
            .catch(() => alert("Error loading data"));
        }, []);

    return (
        <div>
            <h2>My Appointments</h2>

            {data.map((item) => (
                <div key={item.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                    <p>Date: {item.date}</p>
                    <p>Status: {item.status}</p>
                </div>
            ))}
        </div>
    );  
}

export default MyAppointments;