import axios from "axios";

const baseURL = import.meta.env.VITE_USER_SERVICE_URL || "https://login.solutions.local/user-service/api";

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_admin");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token_admin");
      localStorage.removeItem("usuario_admin");

      // if (!window.location.pathname.includes("login")) {
      //   window.location.href = "/login"
      // }
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);