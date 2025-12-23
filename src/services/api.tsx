// api.tsx
import axios from "axios";
import { toast } from "react-hot-toast";

// Create axios instance
const api = axios.create({
  baseURL: "http://10.0.0.25/backend/api/",
  //  baseURL: "https://angular-dev.smaketsolutions.com/backend/api",
  headers: { "Content-Type": "application/json" },
});

// Attach AccessToken before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AccessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → retry with RefreshToken → else logout
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("RefreshToken");

      if (!refreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        // Retry same API request with RefreshToken
        originalRequest.headers.Authorization = `Bearer ${refreshToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        logoutUser();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export function logoutUser() {
  toast.error("Session expired. Please login again.");

  localStorage.clear();

  // Redirect to login
  window.location.href = "/";
}

export default api;
