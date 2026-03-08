import apiClient from "./apiClient";

export const sendContactMessage = async (data) => {
  const res = await apiClient.post("/contact", data);
  return res.data;
};

export const getAllMessages = async () => {
  const res = await apiClient.get("/contact");
  return res.data;
};