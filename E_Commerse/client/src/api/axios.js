import axios from "axios"



const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
);

export default api;