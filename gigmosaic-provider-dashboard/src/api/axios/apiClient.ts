import axios from "axios";
import { getToken } from "./tokenProvider";
// import { useNavigate } from "react-router-dom";

export const apiClient = axios.create({
  baseURL: "http://localhost:3070",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // const navigate = useNavigate();
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);






