import { API_BASE_URL } from "../config/api";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';

let cachedAccessToken = null;
let cachedDecodedUser = null;
let cachedExp = null;

const decodeToken = (token) => {
    try {
        if (!token) return null;
        const decoded = jwtDecode(token);
        
        return {
            maNd: decoded.maNd,    
            hoTen: decoded.hoTen, 
            soDt: decoded.soDt, 
            maVaiTro: decoded.VaiTro,
            exp: decoded.exp
        };
    } catch (error) {
        return null;
    }
};

/**
 * Cập nhật In-Memory Cache và SecureStore khi Login hoặc Refresh
 */
export const setCachedTokens = async (accessToken, refreshToken) => {
    cachedAccessToken = accessToken;
    if (accessToken) {
        const decoded = decodeToken(accessToken);
        cachedDecodedUser = decoded;
        cachedExp = decoded?.exp || null;
        await SecureStore.setItemAsync("accessToken", accessToken);
    } else {
        cachedDecodedUser = null;
        cachedExp = null;
        await SecureStore.deleteItemAsync("accessToken");
    }
    if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    } else {
        await SecureStore.deleteItemAsync("refreshToken");
    }
};

/**
 * Hàm gọi API Refresh Token lên Backend C#
 */
const refreshAccessToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const accessToken = cachedAccessToken || await SecureStore.getItemAsync("accessToken");

        if (!refreshToken) {
            console.log("No refresh token found.");
            await clearTokens();
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/NguoiDung/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                AccessToken: accessToken, 
                RefreshToken: refreshToken 
            })
        });

        if (!response.ok) {
            console.log("Refresh API returned error status:", response.status);
            await clearTokens();
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            console.error("Refresh API returned non-JSON response:", errorText);
            await clearTokens();
            return null;
        }

        const result = await response.json();

        if (result.success && result.data?.accessToken) {
            await setCachedTokens(result.data.accessToken, result.data.refreshToken);
            return result.data.accessToken;
        }
        
        console.log("Refresh token failed (business logic):", result.message);
        await clearTokens();
        return null;
    } catch (error) {
        console.error("Lỗi khi gọi Refresh API:", error);
        await clearTokens();
        return null;
    }
};

/**
 * Hàm xóa Tokens khi session hết hạn hoặc logout
 */
export const clearTokens = async () => {
    cachedAccessToken = null;
    cachedDecodedUser = null;
    cachedExp = null;
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
};

/**
 * Hàm lấy AccessToken - Trả về ngay từ Memory Cache (0ms) nếu còn hạn
 */
export const getAccessToken = async () => {
    const currentTime = Date.now() / 1000;
    
    // Nếu token đã có trong memory và còn hạn (> 10s), trả về ngay lập tức
    if (cachedAccessToken && cachedExp && cachedExp > currentTime + 10) {
        return cachedAccessToken;
    }

    // Nếu chưa có trong memory hoặc sắp hết hạn, nạp từ SecureStore
    let token = cachedAccessToken;
    if (!token) {
        token = await SecureStore.getItemAsync("accessToken");
        if (!token) {
            cachedAccessToken = null;
            cachedDecodedUser = null;
            cachedExp = null;
            return null;
        }
        const decoded = decodeToken(token);
        cachedAccessToken = token;
        cachedDecodedUser = decoded;
        cachedExp = decoded?.exp || null;
    }

    // Kiểm tra thời gian hết hạn (trừ hao 10 giây để tránh lag mạng)
    if (cachedExp && cachedExp < currentTime + 10) {
        console.log("Token sắp hết hạn, đang tiến hành refresh...");
        const newToken = await refreshAccessToken();
        return newToken;
    }

    return token;
};

/**
 * Hàm lấy thông tin User từ token mới nhất (Trả về ngay từ Memory Cache)
 */
export const getCurrentUser = async () => {
    if (cachedDecodedUser && cachedAccessToken) {
        const currentTime = Date.now() / 1000;
        if (cachedExp && cachedExp > currentTime + 10) {
            return cachedDecodedUser;
        }
    }
    const token = await getAccessToken();
    if (!token) return null;
    if (!cachedDecodedUser) {
        cachedDecodedUser = decodeToken(token);
    }
    return cachedDecodedUser;
};

export default decodeToken;