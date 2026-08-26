import { API_BASE_URL } from "../config/api";
import { getAccessToken } from "../utils/decodeToken";
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
    return text ? JSON.parse(text) : { success: false, data: null };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getNguoiThueApi = async (maNd) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/chi-tiet-nguoi-thue?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, data: null };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getChuNhaTroApi = async (maNd) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/chi-tiet-chu-tro?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, data: null };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getNhaCungCapApi = async (maNd) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/chi-tiet-nha-cung-cap?maNd=${maNd}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();
    return text ? JSON.parse(text) : { success: false, data: null };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const updateNguoiThueApi = async (formData) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/cap-nhat-nguoi-thue`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const text = await res.text();
    return text ? JSON.parse(text) : { success: true, message: "Cập nhật thành công" };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const updateChuNhaTroApi = async (formData) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/cap-nhat-chu-tro`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const text = await res.text();
    return text ? JSON.parse(text) : { success: true, message: "Cập nhật thành công" };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const updateNhaCungCapApi = async (formData) => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/NguoiDung/cap-nhat-nha-cung-cap`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const text = await res.text();
    return text ? JSON.parse(text) : { success: true, message: "Cập nhật thành công" };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const changePasswordApi = (data) => {
  if (__DEV__) console.info("[USER] Change-password API request started");
  return api.put("/NguoiDung/change-password", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};
