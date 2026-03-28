import api from "./axiosClient";

export const getDichVusByNccApi = (maNcc) => {
    return api.get(`/DichVu/ncc/${maNcc}`);
};

export const createDichVuApi = (data) => {
    return api.post("/DichVu", data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateDichVuApi = (id, data) => {
    return api.put(`/DichVu/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteDichVuApi = (id) => {
    return api.delete(`/DichVu/${id}`);
};

export const updateDichVuStatusApi = (id, status) => {
    return api.put(`/DichVu/trang-thai/${id}`, `"${status}"`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export const getProvidersNearMeApi = () => {
    return api.get("/DichVu/near-me");
};

export const getDichVuByIdApi = (id) => {
    return api.get(`/DichVu/${id}`);
};

export const getTenantHomeApi = (maNt) => {
    return api.get(`/DichVu/tenant-home/${maNt}`);
};
