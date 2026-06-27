import axios from 'axios';

export const weatherClient = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_API_BASE_URL || 'https://api.weatherapi.com/v1',
  timeout: 12000,
});

weatherClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiMessage = error.response?.data?.error?.message;
    if (apiMessage) {
      error.message = apiMessage;
    }
    return Promise.reject(error);
  },
);
