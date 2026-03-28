import { getDichVusByNccApi, createDichVuApi, updateDichVuApi, deleteDichVuApi, updateDichVuStatusApi, getProvidersNearMeApi, getDichVuByIdApi, getTenantHomeApi } from "../api/DichVu";

export const getDichVusByNccService = async (maNcc) => {
    try {
        const response = await getDichVusByNccApi(maNcc);
        if (!response.success) throw new Error(response.message);
        return response.data;
    } catch (error) {
        console.error("getDichVusByNccService error:", error);
        throw error;
    }
};

export const createDichVuService = async (data) => {
    try {
        const response = await createDichVuApi(data);
        return response;
    } catch (error) {
        console.error("createDichVuService error:", error);
        return { success: false, message: error.message };
    }
};

export const updateDichVuService = async (id, data) => {
    try {
        const response = await updateDichVuApi(id, data);
        return response;
    } catch (error) {
        console.error("updateDichVuService error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteDichVuService = async (id) => {
    try {
        const response = await deleteDichVuApi(id);
        return response;
    } catch (error) {
        console.error("deleteDichVuService error:", error);
        return { success: false, message: error.message };
    }
};

export const updateDichVuStatusService = async (id, status) => {
    try {
        const response = await updateDichVuStatusApi(id, status);
        return response;
    } catch (error) {
        console.error("updateDichVuStatusService error:", error);
        return { success: false, message: error.message };
    }
};

export const getProvidersNearMeService = async () => {
    try {
        const response = await getProvidersNearMeApi();
        return response;
    } catch (error) {
        console.error("getProvidersNearMeService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getDichVuByIdService = async (id) => {
    try {
        const response = await getDichVuByIdApi(id);
        return response;
    } catch (error) {
        console.error("getDichVuByIdService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getTenantHomeService = async (maNt) => {
    try {
        const response = await getTenantHomeApi(maNt);
        return response;
    } catch (error) {
        console.error("getTenantHomeService error:", error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};
