
import axios from "axios";

const rawBackendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

const backendUrl = rawBackendUrl.replace(/\/+$/, "");

if (
  typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname) &&
  backendUrl.includes("localhost")
) {
  console.warn(
    `Frontend is running on '${window.location.origin}', but API baseURL is '${backendUrl}'. Check VITE_BACKEND_URL in Vercel.`
  );
}

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
