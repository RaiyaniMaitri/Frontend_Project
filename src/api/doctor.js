import api from "./axios";

export const getDoctorQueue = () => api.get("/doctor/queue");
export const addPrescription = (appointmentId, data) =>
  api.post(`/prescriptions/${appointmentId}`, data);
export const addReport = (appointmentId, data) =>
  api.post(`/reports/${appointmentId}`, data);
export const getMyPrescriptions = () => api.get("/prescriptions/my");
export const getMyReports = () => api.get("/reports/my");