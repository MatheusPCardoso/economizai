import axiosClient from "./http.service";
import { rootStore } from "@store/root";

axiosClient.interceptors.request.use(
  (config) => {
    const token = rootStore.authStore.authToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
