import axios from "axios"



const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});



export default api;