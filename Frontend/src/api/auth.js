import { API_BASE_URL } from "../config/api";
import api from "./axiosClient";

export const loginApi = async (phone, password) => {
  try {
    return await api.post("/NguoiDung/login", {
      SoDt: phone,
      MatKhau: password,
    });
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message ?? error.message,
      data: null
    };
  }
};


export const registerApi = (data) => {
  return api.post("/auth/register", data);
};

export const resetPasswordApi = async (phone, newPassword, idToken) => {
  return await fetch(`${API_BASE_URL}/NguoiDung/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({
      phone,
      newPassword
    })
  });
}

export const isExistAccount = (sdt) => {
  return api.post("/NguoiDung/is-exist-account", sdt);
}


export const createAccount = (name, phone, password, role, idToken) => {
  return api.post(
    "/NguoiDung/register/account",
    {
      HoTen: name,
      SoDt: phone,
      MatKhau: password,
      MaVaiTro: role
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );
};

export const updateSoDt = async (maNd, soDt, idToken) => {
  try {
    const res = await fetch(`${API_BASE_URL}/NguoiDung/cap-nhat-sdt`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        MaNd: maNd,
        SoDt: soDt
      })
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
