import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const backend = axios.create({
  baseURL: "/api",
  withCredentials: true
});

backend.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const response = await axios.get("/api/auth/get_token", {
                withCredentials: true
            });
            if (response.status === 200) {
                config.headers["CSRF-Token"] = response.data.csrfToken;
            }
        } catch (error) {
          console.error("Error fetching CSRF token!", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default backend;
