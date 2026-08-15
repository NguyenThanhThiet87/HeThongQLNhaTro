import { getNguoiThueApi, updateNguoiThueApi, changePasswordApi, getChuNhaTroApi, updateChuNhaTroApi, getNhaCungCapApi, updateNhaCungCapApi } from "../api/NguoiDung";

import { getCurrentUser, getAccessToken } from "../utils/decodeToken";

export const getUserNtProfileService = async () => {
    const user = await getCurrentUser();

    const response = await getNguoiThueApi(user.maNd);

    if (!response.success) {
        throw new Error(response.message);
    }

    return response.data;
};

export const updateNtProfileService = async (data) => {
    try {
        const formData = new FormData();

        formData.append("MaNt", data?.MaNd);
        formData.append("HoTen", data?.HoTen);
        formData.append("SoDt", data?.SoDt);
        formData.append("GioiTinh", data?.GioiTinh);
        formData.append("SoCccd", data?.SoCccd);
        formData.append("DiaChi", data?.DiaChi);
        formData.append("NgaySinh", data?.NgaySinh);
        formData.append("NgheNghiep", data?.NgheNghiep);
        formData.append("HoTenNguoiLienHe", data?.HoTenNguoiLienHe);
        formData.append("SdtNguoiLienHe", data?.SdtNguoiLienHe);
        formData.append("QuanHeNguoiLienHe", data?.QuanHeNguoiLienHe);

        if (data.Avatar) {

            const filename = data.Avatar.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("Avatar", {
                uri: data.Avatar,
                name: filename,
                type: type,
            });
        }

        const res = await updateNguoiThueApi(formData);

        return res.data;

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
            MaNd: user.maNd,
            OldPass: data.oldPassword,
            NewPass: data.newPassword
        });
        return res;
    } catch (error) {
        console.error("changePasswordService error:", error);
        return {};
    }
}

//CHỦ NHÀ TRỌ
export const getUserCntProfileService = async () => {
    const user = await getCurrentUser();

    const response = await getChuNhaTroApi(user.maNd);

    if (!response.success) {
        throw new Error(response.message);
    }

    return response.data;
};

export const updateCntProfileService = async (data) => {
    try {
        console.log("updateCntProfileService - Received data:", data);

        const formData = new FormData();

        formData.append("MaChuNt", data?.MaChuNt);
        formData.append("HoTen", data?.HoTen);
        formData.append("SoDt", data?.SoDt);

        if (data?.GioiTinh) {
            formData.append("GioiTinh", data.GioiTinh);
        }
        formData.append("SoCccd", data?.SoCccd);
        formData.append("DiaChi", data?.DiaChi);

        if (data?.NgaySinh) {
            formData.append("NgaySinh", data.NgaySinh);
        }

        formData.append("TenNh", data?.TenNh);
        formData.append("SoTk", data?.SoTk);
        formData.append("SoGpkd", data?.SoGpkd);

        if (data.Avatar) {

            const filename = data.Avatar.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("Avatar", {
                uri: data.Avatar,
                name: filename,
                type: type,
            });
        }

        const res = await updateChuNhaTroApi(formData);

        return res.data;

    } catch (error) {

        console.error("updateCntProfileService error:", error);

        return {
            success: false,
            message: error.message
        };
    }
};

//NHÀ CUNG CẤP
export const getUserNccProfileService = async (maNd) => {
    let targetId = maNd;
    if (!targetId) {
        const user = await getCurrentUser();
        targetId = user.maNd;
    }
    const response = await getNhaCungCapApi(targetId);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};


export const updateNccProfileService = async (data) => {
    try {
        const formData = new FormData();
        formData.append("MaNcc", data?.MaNcc);
        formData.append("HoTen", data?.HoTen);
        formData.append("SoDt", data?.SoDt);
        if (data?.GioiTinh) formData.append("GioiTinh", data.GioiTinh);
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
        return res;
    } catch (error) {
        console.error("updateNccProfileService error:", error);
        return { success: false, message: error.message };
    }
};
