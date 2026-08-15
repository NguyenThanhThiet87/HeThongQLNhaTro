import { API_BASE_URL } from "../config/api";
import getAccessToken from "../utils/decodeToken";
import api from "./axiosClient";

export const getNguoiDungApi = async (maNd) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/nguoi-dung?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    console.log("Raw response text:", text);
    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getNguoiThueApi = (maNd) => {
  return api.get(`/NguoiDung/chi-tiet-nguoi-thue?maNd=${maNd}`);
};

export const getChuNhaTroApi = (maNd) => {
  return api.get(`/NguoiDung/chi-tiet-chu-tro?maNd=${maNd}`);
};

export const getNhaCungCapApi = (maNd) => {
  return api.get(`/NguoiDung/chi-tiet-nha-cung-cap?maNd=${maNd}`);
};

export const getChuTroApi = async (maNd) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/chi-tiet-chu-tro?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    console.log("Raw response text:", text);
    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const updateNguoiThueApi = (formData) => {
  return api.put("/NguoiDung/cap-nhat-nguoi-thue", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateChuNhaTroApi = (formData) => {
  return api.put("/NguoiDung/cap-nhat-chu-tro", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateNhaCungCapApi = (formData) => {
  return api.put("/NguoiDung/cap-nhat-nha-cung-cap", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const changePasswordApi = (data) => {
  if (__DEV__) console.info("[USER] Change-password API request started");
  return api.put("/NguoiDung/change-password", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};


// export const updateNguoiThueApi = async (data) => {
//   try {
//     console.log("updateNguoiThueApi - Received data:", data);
//     const token = await getAccessToken();

//     const formData = new FormData();

//     formData.append("MaNt", data.MaNd);
//     formData.append("HoTen", data?.HoTen);
//     formData.append("SoDt", data?.SoDt);
//     formData.append("GioiTinh", data?.GioiTinh);
//     formData.append("SoCccd", data?.SoCccd);
//     formData.append("DiaChi", data?.DiaChi);
//     formData.append("NgaySinh", data?.NgaySinh);
//     formData.append("NgheNghiep", data?.NgheNghiep);
//     formData.append("HoTenNguoiLienHe", data?.HoTenNguoiLienHe);
//     formData.append("SdtNguoiLienHe", data?.SdtNguoiLienHe);
//     formData.append("QuanHeNguoiLienHe", data?.QuanHeNguoiLienHe);

//     // ==========================================
//     // 2. Xử lý ảnh bìa (NẾU CÓ)
//     // ==========================================
//     if (data.Avatar) {
//       const filename = data.Avatar.split('/').pop();
//       const match = /\.(\w+)$/.exec(filename);
//       const type = match ? `image/${match[1]}` : `image/jpeg`;

//       formData.append("Avatar", {
//         uri: data.Avatar,
//         name: filename,
//         type: type,
//       });
//     }

//     const res = await fetch(`${API_BASE_URL}/NguoiDung/cap-nhat-nguoi-thue`, {
//       method: "PUT",
//       headers: {
//         "Authorization": `Bearer ${token}`
//       },
//       body: formData
//     });

//     const text = await res.text();
//     if (!text) {
//       return { success: false, message: "Không có dữ liệu trả về từ server." };
//     }
//     return JSON.parse(text);

//   } catch (error) {
//     console.error("Lỗi Network/Fetch updateNguoiThueApi:", error);
//     return { success: false, message: "Lỗi kết nối mạng: " + error.message };
//   }
// };
