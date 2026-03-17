import { getNguoiThueApi, updateNguoiThueApi, changePasswordApi } from "../api/NguoiDung";
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
    console.log("changePasswordService - Received data:", data);
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