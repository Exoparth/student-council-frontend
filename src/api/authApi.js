import apiClient from "./apiClient";

export const registerUser = async (data) => {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
};