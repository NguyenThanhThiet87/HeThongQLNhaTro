import axios from "axios";
import * as SecureStore from "expo-secure-store";

const axiosClient = axios.create({
    baseURL: "https://eveline-prenasal-concha.ngrok-free.dev/api/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        // gắn token nếu có
        const token = await SecureStore.getItemAsync("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 401) {

            const refreshToken = await SecureStore.getItemAsync("refreshToken");

            const res = await axios.post("http://your-api/refresh", refreshToken);

            const newAccessToken = res.data.accessToken;

            await SecureStore.setItemAsync("accessToken", newAccessToken);

            error.config.headers.Authorization = `Bearer ${newAccessToken}`;

            return axios(error.config);
        }

        Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
