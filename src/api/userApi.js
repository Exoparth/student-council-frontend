import apiClient from "./apiClient";

export const getAllUsers = async () => {
  const res = await apiClient.get("/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await apiClient.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await apiClient.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
};