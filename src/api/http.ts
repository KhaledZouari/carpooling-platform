import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const isPublicAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/register");
};

api.interceptors.request.use((config) => {
  if (isPublicAuthEndpoint(config.url)) {
    if (config.headers && "Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export default api;
