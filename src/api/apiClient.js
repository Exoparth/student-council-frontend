import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // attach token if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {

    const status = error.response?.status;

    if (status === 401) {

      // remove invalid token
      localStorage.removeItem("token");

      // redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

    }

    return Promise.reject(error);
  }
);

export default apiClient;