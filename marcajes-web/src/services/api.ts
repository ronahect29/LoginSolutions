import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4100/marcajes-api/api";

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_marcajes");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token_marcajes");
      localStorage.removeItem("empleado");

      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error);
  }
);