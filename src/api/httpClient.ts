import axios, { AxiosError, type InternalAxiosRequestConfig, AxiosHeaders } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");

    // Assurer que headers est défini correctement
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
httpClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default httpClient;
