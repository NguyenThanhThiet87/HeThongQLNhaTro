import axios from "axios";
import { API_BASE_URL, requireApiBaseUrl } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL ?? undefined,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

import { getAccessToken } from "../utils/decodeToken";

api.interceptors.request.use(
  async (config) => {
    config.baseURL = config.baseURL ?? requireApiBaseUrl();
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
      const logMessage = `[AXIOS] ✗ ${(config.method ?? "GET").toUpperCase()} ${config.url ?? ""} · ${status} · ${durationMs}ms · ${message}`;

      // 4xx là phản hồi nghiệp vụ dự kiến (ví dụ đăng nhập sai), không phải crash.
      // Expo Go hiển thị console.error thành màn hình/cảnh báo đỏ, nên chỉ dùng
      // mức error cho lỗi máy chủ hoặc lỗi mạng thực sự.
      if (typeof status === "number" && status >= 400 && status < 500) {
        console.warn(logMessage);
      } else {
        console.error(logMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
