import { API_BASE_URL } from "../config/api";
import { getAccessToken } from "../utils/decodeToken";
export const createPaymentUrl = async (paymentInfo) => {
    try {
        console.log("Creating payment URL with info:", paymentInfo);
        const token = await getAccessToken();

        const res = await fetch(`${API_BASE_URL}/VNPay/create-payment-url`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paymentInfo)
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const data = await res.json();
        if (!data.paymentUrl) {
            throw new Error("Không thể tạo URL thanh toán VNPay. Vui lòng thử lại sau.");
        }
        return {
            success: true,
            message: "",
            data: data.paymentUrl
        };
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const paymentCallbackVnpay = async (callbackUrl) => {
    try {
        console.log("Processing VNPay callback with URL:", callbackUrl);
        const token = await getAccessToken();
        const queryString = callbackUrl.split("?")[1];
        const res = await fetch(
            `${API_BASE_URL}/VNPay/payment-callback?${queryString}`,
            {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        const text = await res.text();
        console.log("Raw result:", text);
        try {
            const data = JSON.parse(text);
            if (res.ok) return { success: true, data };
            return { success: false, message: data.message || "Thanh toán thất bại" };
        } catch (e) {
            return { success: false, message: "Lỗi Server (S): " + text.substring(0, 50) };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};