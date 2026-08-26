import { getNguoiThueApi, updateNguoiThueApi, changePasswordApi, getChuNhaTroApi, updateChuNhaTroApi, getNhaCungCapApi, updateNhaCungCapApi, getNguoiDungApi } from "../api/NguoiDung";
import { getCurrentUser } from "../utils/decodeToken";

let cachedCntProfile = null;
let cachedNtProfile = null;
let cachedNccProfile = null;

export const getCachedCntProfile = () => cachedCntProfile;
export const setCachedCntProfile = (data) => { cachedCntProfile = data; };

export const getCachedNtProfile = () => cachedNtProfile;
export const setCachedNtProfile = (data) => { cachedNtProfile = data; };

export const getCachedNccProfile = () => cachedNccProfile;
export const setCachedNccProfile = (data) => { cachedNccProfile = data; };

export const clearProfileCache = () => {
    cachedCntProfile = null;
    cachedNtProfile = null;
    cachedNccProfile = null;
};

// NGƯỜI THUÊ
export const getUserNtProfileService = async () => {
    const user = await getCurrentUser();
    if (!user || !user.maNd) return cachedNtProfile;

    try {
        const response = await getNguoiThueApi(user.maNd);
        if (!response.success) {
            if (cachedNtProfile) return cachedNtProfile;
            throw new Error(response.message);
        }
        cachedNtProfile = response.data;
        return response.data;
    } catch (err) {
        if (cachedNtProfile) return cachedNtProfile;
        throw err;
    }
};

export const updateNtProfileService = async (data) => {
    try {
        const user = await getCurrentUser();
        const resolvedMaNt = data?.MaNt || data?.maNt || data?.MaNd || data?.maNd || user?.maNd;

        const formData = new FormData();

        if (resolvedMaNt) formData.append("MaNt", resolvedMaNt);
        if (data?.HoTen) formData.append("HoTen", data.HoTen);
        if (data?.SoDt) formData.append("SoDt", data.SoDt);
        if (data?.GioiTinh !== undefined && data?.GioiTinh !== null) formData.append("GioiTinh", data.GioiTinh);
        if (data?.SoCccd && data.SoCccd !== 'null') formData.append("SoCccd", data.SoCccd);
        if (data?.DiaChi && data.DiaChi !== 'null') formData.append("DiaChi", data.DiaChi);
        if (data?.NgaySinh && data.NgaySinh !== 'null') formData.append("NgaySinh", data.NgaySinh);
        if (data?.NgheNghiep && data.NgheNghiep !== 'null') formData.append("NgheNghiep", data.NgheNghiep);
        if (data?.HoTenNguoiLienHe && data.HoTenNguoiLienHe !== 'null') formData.append("HoTenNguoiLienHe", data.HoTenNguoiLienHe);
        if (data?.SdtNguoiLienHe && data.SdtNguoiLienHe !== 'null') formData.append("SdtNguoiLienHe", data.SdtNguoiLienHe);
        if (data?.QuanHeNguoiLienHe && data.QuanHeNguoiLienHe !== 'null') formData.append("QuanHeNguoiLienHe", data.QuanHeNguoiLienHe);

        if (data.Avatar && typeof data.Avatar === 'string' && (data.Avatar.startsWith('file://') || data.Avatar.startsWith('content://') || data.Avatar.startsWith('ph://'))) {
            const filename = data.Avatar.split('/').pop() || 'avatar.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("Avatar", {
                uri: data.Avatar,
                name: filename,
                type: type,
            });
        }

        const res = await updateNguoiThueApi(formData);
        if (res.data || res.success) {
            cachedNtProfile = {
                ...cachedNtProfile,
                ...data,
                hoTen: data.HoTen,
                soDt: data.SoDt,
                gioiTinh: data.GioiTinh,
                soCccd: data.SoCccd,
                diaChi: data.DiaChi,
                ngaySinh: data.NgaySinh,
                ngheNghiep: data.NgheNghiep,
                avatar: data.Avatar || cachedNtProfile?.avatar
            };
        }
        return res.data || res;

    } catch (error) {
        console.error("updateNtProfileService error:", error);
        return {
            success: false,
            message: error.message
        };
    }
};

export const changePasswordService = async (data) => {
    if (__DEV__) console.info("[USER] Change-password request started");
    try {
        const user = await getCurrentUser();
        const res = await changePasswordApi({
            MaNd: user?.maNd,
            OldPass: data.oldPassword,
            NewPass: data.newPassword
        });
        return res;
    } catch (err) {
        if (__DEV__) console.error("[USER] Change-password request failed:", err);
        return {
            success: false,
            message: err.response?.data?.message || err.message
        };
    }
};

// CHỦ NHÀ TRỌ
export const getUserCntProfileService = async () => {
    const user = await getCurrentUser();
    if (!user || !user.maNd) return cachedCntProfile;

    try {
        const response = await getChuNhaTroApi(user.maNd);
        if (response && (response.success || response.data)) {
            const profileData = response.data || response;
            cachedCntProfile = profileData;
            return profileData;
        }
    } catch (error) {
        console.log("getChuNhaTroApi fallback to getNguoiDungApi:", error.message);
    }

    // Fallback sang thông tin người dùng chung
    try {
        const ndRes = await getNguoiDungApi(user.maNd);
        if (ndRes && (ndRes.success || ndRes.data)) {
            const data = ndRes.data || ndRes;
            const profile = {
                maChuNt: data.maNd || user.maNd,
                maNguoiDung: data.maNd || user.maNd,
                hoTen: data.hoTen || user.hoTen,
                avatar: data.avatar,
                soDt: data.soDt || user.soDt,
                gioiTinh: data.gioiTinh,
                soCccd: data.soCccd,
                diaChi: data.diaChi,
                ngaySinh: data.ngaySinh,
                maVaiTro: data.maVaiTro || user.maVaiTro
            };
            cachedCntProfile = profile;
            return profile;
        }
    } catch (e) {
        console.log("getNguoiDungApi fallback error:", e.message);
    }

    const fallback = {
        maChuNt: user.maNd,
        maNguoiDung: user.maNd,
        hoTen: user.hoTen,
        soDt: user.soDt,
        maVaiTro: user.maVaiTro
    };
    cachedCntProfile = fallback;
    return fallback;
};

export const updateCntProfileService = async (data) => {
    try {
        console.log("updateCntProfileService - Received data:", data);
        const user = await getCurrentUser();
        const resolvedMaChuNt = data?.MaChuNt || data?.maChuNt || data?.MaNd || data?.maNd || user?.maNd;

        const formData = new FormData();

        if (resolvedMaChuNt) formData.append("MaChuNt", resolvedMaChuNt);
        if (data?.HoTen) formData.append("HoTen", data.HoTen);
        if (data?.SoDt) formData.append("SoDt", data.SoDt);
        if (data?.GioiTinh !== undefined && data?.GioiTinh !== null) {
            formData.append("GioiTinh", data.GioiTinh);
        }
        if (data?.SoCccd && data.SoCccd !== 'null') formData.append("SoCccd", data.SoCccd);
        if (data?.DiaChi && data.DiaChi !== 'null') formData.append("DiaChi", data.DiaChi);
        if (data?.NgaySinh && data.NgaySinh !== 'null') formData.append("NgaySinh", data.NgaySinh);
        if (data?.TenNh && data.TenNh !== 'null') formData.append("TenNh", data.TenNh);
        if (data?.SoTk && data.SoTk !== 'null') formData.append("SoTk", data.SoTk);
        if (data?.SoGpkd && data.SoGpkd !== 'null') formData.append("SoGpkd", data.SoGpkd);

        if (data.Avatar && typeof data.Avatar === 'string' && (data.Avatar.startsWith('file://') || data.Avatar.startsWith('content://') || data.Avatar.startsWith('ph://'))) {
            const filename = data.Avatar.split('/').pop() || 'avatar.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("Avatar", {
                uri: data.Avatar,
                name: filename,
                type: type,
            });
        }

        const res = await updateChuNhaTroApi(formData);
        if (res.data || res.success) {
            cachedCntProfile = {
                ...cachedCntProfile,
                ...data,
                hoTen: data.HoTen,
                soDt: data.SoDt,
                gioiTinh: data.GioiTinh,
                soCccd: data.SoCccd,
                diaChi: data.DiaChi,
                ngaySinh: data.NgaySinh,
                tenNh: data.TenNh,
                soTk: data.SoTk,
                soGpkd: data.SoGpkd,
                avatar: data.Avatar || cachedCntProfile?.avatar
            };
        }
        return res.data || res;

    } catch (error) {
        console.error("updateCntProfileService error:", error);
        return {
            success: false,
            message: error.message
        };
    }
};

// NHÀ CUNG CẤP
export const getUserNccProfileService = async (maNd) => {
    let targetId = maNd;
    if (!targetId) {
        const user = await getCurrentUser();
        targetId = user?.maNd;
    }
    if (!targetId) return cachedNccProfile;

    try {
        const response = await getNhaCungCapApi(targetId);
        if (!response.success) {
            if (cachedNccProfile) return cachedNccProfile;
            throw new Error(response.message);
        }
        cachedNccProfile = response.data;
        return response.data;
    } catch (err) {
        if (cachedNccProfile) return cachedNccProfile;
        throw err;
    }
};

export const updateNccProfileService = async (data) => {
    try {
        const formData = new FormData();
        formData.append("MaNcc", data?.MaNcc);
        formData.append("HoTen", data?.HoTen);
        formData.append("SoDt", data?.SoDt);
        if (data?.GioiTinh !== undefined) formData.append("GioiTinh", data.GioiTinh);
        formData.append("SoCccd", data?.SoCccd);
        formData.append("DiaChi", data?.DiaChi);
        if (data?.NgaySinh) formData.append("NgaySinh", data.NgaySinh);
        formData.append("MoTaDv", data?.MoTaDv);
        formData.append("KhuVucPv", data?.KhuVucPv);
        if (data?.SanSang !== undefined) formData.append("SanSang", data.SanSang);

        if (data.Avatar && data.Avatar.startsWith('file://')) {
            const filename = data.Avatar.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;
            formData.append("Avatar", {
                uri: data.Avatar,
                name: filename,
                type: type,
            });
        }

        const res = await updateNhaCungCapApi(formData);
        if (res.data || res.success) {
            cachedNccProfile = {
                ...cachedNccProfile,
                ...data,
                hoTen: data.HoTen,
                soDt: data.SoDt,
                gioiTinh: data.GioiTinh,
                soCccd: data.SoCccd,
                diaChi: data.DiaChi,
                ngaySinh: data.NgaySinh,
                moTaDv: data.MoTaDv,
                khuVucPv: data.KhuVucPv,
                sanSang: data.SanSang,
                avatar: data.Avatar || cachedNccProfile?.avatar
            };
        }
        return res;
    } catch (error) {
        console.error("updateNccProfileService error:", error);
        return { success: false, message: error.message };
    }
};

