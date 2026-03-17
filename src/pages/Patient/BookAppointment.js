import React , { useState } from "react";
import API from "../../api/axios";

function BookAppointment() {
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");

    const handleBook = async () => {
        try {
            await API.post("/appointments", { date, timeSlot });
            alert("Appointment Booked");
        } 
        catch {
            alert("Error booking appointment");
        }  
    };

    return(
        <div>
            <h2>Book Appointment</h2>

            <input type="date" onChange={(e)=>setDate(e.target.value)} />
            <input placeholder="Time Slot" onChange={(e)=>setTimeSlot(e.target.value)} />

            <button onClick={handleBook}>Book</button>
        </div>
    );
}

export default BookAppointment;