import { createDonHangApi, createManualDonHangApi, getTrangThaiDonHangApi, getDonHangsByStatusApi, getDonHangByIdApi, updateOrderStatusApi, getDonHangStatsApi, getRevenueChartApi } from "../api/DonHang";

export const createDonHangService = async (data) => {
    try {
        const response = await createDonHangApi(data);
        return response;
    } catch (error) {
        console.error("createDonHangService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const createManualDonHangService = async (data) => {
    try {
        const response = await createManualDonHangApi(data);
        return response;
    } catch (error) {
        console.error("createManualDonHangService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getTrangThaiDonHangService = async () => {
    try {
        const response = await getTrangThaiDonHangApi();
        return response;
    } catch (error) {
        console.error("getTrangThaiDonHangService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getDonHangsByStatusService = async (maNcc, status) => {
    try {
        const response = await getDonHangsByStatusApi(maNcc, status);
        return response;
    } catch (error) {
        console.error("getDonHangsByStatusService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getDonHangByIdService = async (id) => {
    try {
        const response = await getDonHangByIdApi(id);
        return response;
    } catch (error) {
        console.error("getDonHangByIdService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const updateOrderStatusService = async (id, status) => {
    try {
        const response = await updateOrderStatusApi(id, status);
        return response;
    } catch (error) {
        console.error("updateOrderStatusService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getDonHangStatsService = async (maNcc) => {
    try {
        const response = await getDonHangStatsApi(maNcc);
        return response;
    } catch (error) {
        console.error("getDonHangStatsService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getRevenueChartService = async (maNcc, days = 7) => {
    try {
        const response = await getRevenueChartApi(maNcc, days);
        return response;
    } catch (error) {
        console.error("getRevenueChartService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};
