import axios from "axios";
import { getCookieData } from "~/functions";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.LOCAL_BACKEND_URL ||
    import.meta.env.PROD_BACKEND_URL ||
    import.meta.env.VITE_LOCAL_BACKEND_URL ||
    import.meta.env.VITE_PROD_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      return config;
    }

    if (typeof window !== "undefined") {
      const token = getCookieData("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
