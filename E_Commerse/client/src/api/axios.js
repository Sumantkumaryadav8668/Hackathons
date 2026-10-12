import axios from "axios"



const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
const backendUrl = rawBackendUrl.replace(/\/$/, "")

if (
  typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname) &&
  backendUrl.includes("localhost")
) {
  console.warn(
    `⚠️ [DigitalMart API Configuration] Frontend is running on '${window.location.origin}', but API baseURL is '${backendUrl}'.\n` +
    `To connect to your live backend on Vercel/cloud hosting, set the environment variable VITE_BACKEND_URL in your hosting platform dashboard.`
  )
}

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