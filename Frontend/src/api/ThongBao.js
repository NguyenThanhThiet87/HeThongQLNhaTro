import { API_BASE_URL } from "../config/api";
import { getAccessToken } from "../utils/decodeToken";

export const getNotifications = async (maNd) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(`${API_BASE_URL}/ThongBao/danh-sach/${maNd}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
export const markAsReadApi = async (maTb) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(`${API_BASE_URL}/ThongBao/doc-thong-bao/${maTb}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
