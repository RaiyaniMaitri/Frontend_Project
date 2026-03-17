import api from "./axios";

export const bookAppointment = (data) => api.post("/appointments", data);
export const getMyAppointments = () => api.get("/appointments/my");
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);