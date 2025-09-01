import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_PORT || "http://localhost:3070",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
