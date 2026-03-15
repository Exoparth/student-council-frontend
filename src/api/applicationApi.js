import apiClient from "./apiClient";


export const applyForCouncil = async (data) => {
  const res = await apiClient.post("/application/apply", data);
  return res.data;
};


export const getMyApplication = async () => {
  const res = await apiClient.get("/application/my");
  return res.data;
};


export const getAllApplications = async () => {
  const res = await apiClient.get("/admin/applications");
  return res.data;
};


export const updateApplicationStatus = async (id, status) => {
  const res = await apiClient.put(`/admin/status/${id}`, { status });
  return res.data;
};


export const scheduleInterview = async (id, date) => {
  const res = await apiClient.put(`/admin/schedule/${id}`, { date });
  return res.data;
};


/* NEW API FOR INTERVIEW RESULT */

export const updateInterviewStatus = async (id, status) => {
  const res = await apiClient.put(`/admin/interview-status/${id}`, { status });
  return res.data;
};

export const deleteApplication = async (id) => {
  const res = await apiClient.delete(`/admin/application/${id}`);
  return res.data;
};