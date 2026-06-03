import axios from "axios";
import toast from "react-hot-toast";

export const API_URL = import.meta.env.VITE_API_URL || "https://api-blog-af3u.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const contentType = response.headers?.["content-type"] || "";
    const data = typeof response.data === "string" ? response.data.trim().toLowerCase() : "";
    if (contentType.includes("text/html") || data.startsWith("<!doctype html") || data.startsWith("<html")) {
      throw new Error(
        `API returned an HTML page instead of JSON. Check VITE_API_URL (${API_URL}) and make sure it points to the backend server.`,
      );
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:logout"));
      if (!window.location.pathname.includes("/login")) {
        toast.error("Your session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
