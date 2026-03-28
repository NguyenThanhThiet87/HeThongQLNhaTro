import api from "./axiosClient";

export const createDonHangApi = (data) => {
    return api.post("/DichVuDonHang/dat-hang", data);
};

export const createManualDonHangApi = (data) => {
    return api.post("/DichVuDonHang/manual-dat-hang", data);
};

export const getTrangThaiDonHangApi = () => {
    return api.get("/DichVuDonHang/trang-thai");
};

export const getDonHangsByStatusApi = (maNcc, status) => {
    console.log(maNcc, status)
    return api.get(`/DichVuDonHang/ncc/${maNcc}/status`, { params: { status } });
};

export const getDonHangByIdApi = (id) => {
    return api.get(`/DichVuDonHang/${id}`);
};

export const updateOrderStatusApi = (id, status) => {
    return api.put(`/DichVuDonHang/${id}/status`, { status });
};

export const getDonHangStatsApi = (maNcc) => {
    return api.get(`/DichVuDonHang/ncc/${maNcc}/stats`);
};

export const getRevenueChartApi = (maNcc, days = 7) => {
    return api.get(`/DichVuDonHang/ncc/${maNcc}/revenue-chart`, { params: { days } });
};

export const getDonHangsByTenantApi = (maNt) => {
    return api.get(`/DichVuDonHang/tenant/${maNt}`);
};
