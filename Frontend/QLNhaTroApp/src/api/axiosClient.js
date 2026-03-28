import axios from "axios";
import * as SecureStore from "expo-secure-store";

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

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response.data,
  (error) => {

    if (error.response) {
      console.log("API Error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;