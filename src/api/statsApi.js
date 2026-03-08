import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  const res = await apiClient.get("/stats/dashboard");
  return res.data;
};