import { API_BASE_URL } from "../config/api";
import { getAccessToken } from "../utils/decodeToken";
export const createPaymentUrlPayOS = async (maHd) => {
    try {
        console.log("Creating payment URL with info:", maHd);
        const token = await getAccessToken();

        const res = await fetch(`${API_BASE_URL}/PayOS/create-payment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ maHd })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const data = await res.json();
        if (!data.checkoutUrl) {
            throw new Error("Không thể tạo URL thanh toán PayOS. Vui lòng thử lại sau.");
        }
        return {
            success: true,
            message: "",
            data: data.checkoutUrl
        };
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};