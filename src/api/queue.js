import api from "./axios";

export const getDailyQueue = (date) => api.get(`/queue?date=${date}`);
export const updateQueueStatus = (id, status) =>{
    console.log("Updating queue:", id, "to status:", status);
  return api.patch(`/queue/${id}`, { status });
}