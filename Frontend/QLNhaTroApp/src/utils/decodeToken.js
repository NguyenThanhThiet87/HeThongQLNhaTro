import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';

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
 * Hàm gọi API Refresh Token lên Backend C#
 */
const refreshAccessToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const accessToken = await SecureStore.getItemAsync("accessToken");

        if (!refreshToken) {
            console.log("No refresh token found.");
            return null;
        }

        const response = await fetch("https://eveline-prenasal-concha.ngrok-free.dev/api/NguoiDung/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                AccessToken: accessToken, 
                RefreshToken: refreshToken 
            })
        });

        // Kiểm tra xem backend có trả về mã lỗi không
        if (!response.ok) {
            console.log("Refresh API returned error status:", response.status);
            await clearTokens(); // Xóa sạch token nếu lỗi
            return null;
        }

        // Kiểm tra Content-Type để tránh lỗi parse khi nhận về Chuỗi (không phải JSON)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            console.error("Refresh API returned non-JSON response:", errorText);
            await clearTokens();
            return null;
        }

        const result = await response.json();

        if (result.success) {
            await SecureStore.setItemAsync("accessToken", result.data.accessToken);
            await SecureStore.setItemAsync("refreshToken", result.data.refreshToken);
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
 * Hàm xóa Tokens khi session hết hạn hoặc refresh thất bại
 */
const clearTokens = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
};


/**
 * Hàm lấy AccessToken - Tự động kiểm tra thời hạn
 */
export const getAccessToken = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) return null;

    const decoded = decodeToken(token);
    
    // Kiểm tra thời gian hết hạn (trừ hao 10 giây để tránh lag mạng)
    const currentTime = Date.now() / 1000;
    if (decoded && decoded.exp < currentTime + 10) {
        console.log("Token sắp hết hạn, đang tiến hành refresh...");
        const newToken = await refreshAccessToken();
        return newToken; // Trả về token mới hoặc null nếu thất bại
    }

    return token;
};

/**
 * Hàm lấy thông tin User từ token mới nhất
 */
export const getCurrentUser = async () => {
    const token = await getAccessToken();
    return decodeToken(token);
};

export default decodeToken;