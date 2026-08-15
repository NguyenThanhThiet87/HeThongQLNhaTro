import axios from "axios";

const api = axios.create({
  baseURL: "https://eveline-prenasal-concha.ngrok-free.dev/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

import { getAccessToken } from "../utils/decodeToken";

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      config.metadata = { startedAt: Date.now() };
      console.info(`[AXIOS] → ${(config.method ?? "GET").toUpperCase()} ${config.baseURL ?? ""}${config.url ?? ""}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      const durationMs = Date.now() - (response.config.metadata?.startedAt ?? Date.now());
      const requestId = response.headers?.["x-request-id"];
      console.info(
        `[AXIOS] ✓ ${(response.config.method ?? "GET").toUpperCase()} ${response.config.url ?? ""} · ${response.status} · ${durationMs}ms${requestId ? ` · requestId=${requestId}` : ""}`,
      );
    }

    return response.data;
  },
  (error) => {
    if (__DEV__) {
      const config = error.config ?? {};
      const durationMs = Date.now() - (config.metadata?.startedAt ?? Date.now());
      const status = error.response?.status ?? "network error";
      const message = error.response?.data?.message ?? error.message;
      console.error(
        `[AXIOS] ✗ ${(config.method ?? "GET").toUpperCase()} ${config.url ?? ""} · ${status} · ${durationMs}ms · ${message}`,
      );
    }

    return Promise.reject(error);
  }
);

export default api;
