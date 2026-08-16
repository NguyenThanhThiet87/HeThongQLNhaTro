import { API_BASE_URL } from "../config/api";
import axiosClient from "./axiosClient";
import { getAccessToken } from "../utils/decodeToken";
import { getCurrentUser } from "../utils/decodeToken";

export const createHopDongApi = async (hopDongData) => {
  try {
    console.log("Creating HopDong with data:", hopDongData);
    const user = await getCurrentUser();
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/HopDong/tao-hop-dong`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        MaChuNt: user.maNd, // Lấy mã chủ nhà từ token
        MaPhong: hopDongData.maPhong,
        NgayBdhl: hopDongData.ngayBdhl, // ISO string: "2026-02-15T00:00:00"
        NgayKthl: hopDongData.ngayKthl,
        GiaThue: hopDongData.giaThue,
        TienDatCoc: hopDongData.tienDatCoc, // null nếu chưa đặt cọc
        GiaDien: hopDongData.giaDien,
        GiaNuoc: hopDongData.giaNuoc,
        DonViDien: hopDongData.donViDien || "kWh",
        DonViNuoc: hopDongData.donViNuoc || "m3",
        DanhSachNguoiThue: hopDongData.danhSachNguoiThue // [{ HoTen, SoCccd, SoDt, NgaySinh, MatKhau, DiaChi, NgheNghiep }]
      })
    });

    const result = await res.json();
    console.log("Raw response from createHopDongApi:", result);
    return result; // Trả về ApiResponse từ Backend

  } catch (error) {
    console.error("Error in createHopDongApi:", error);
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getHopDongsApi = async (maDayNt, trangThai) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`${API_BASE_URL}/HopDong/HopDongs?maDayNt=${maDayNt}&trangThai=${trangThai}`, {
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

export const getHopDongApi = async (maHopDong) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`${API_BASE_URL}/HopDong/HopDong?maHopDong=${maHopDong}`, {
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

export const addThanhVienHopDongApi = async (thanhVienData) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`${API_BASE_URL}/HopDong/them-thanh-vien`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        MaHopDong: thanhVienData.maHopDong,
        nguoiDung: {
          HoTen: thanhVienData.nguoiDung.hoTen,
          SoCccd: thanhVienData.nguoiDung.soCccd,
          SoDt: thanhVienData.nguoiDung.soDt,
          NgaySinh: thanhVienData.nguoiDung.ngaySinh, // ISO string: "1990-01-01T00:00:00"
          Password: thanhVienData.nguoiDung.password,
          DiaChi: thanhVienData.nguoiDung.diaChi,
          NgheNghiep: thanhVienData.nguoiDung.ngheNghiep
        }
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

export const addThanhVienHopDongExistedApi = async (thanhVienData) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`${API_BASE_URL}/HopDong/them-thanh-vien-existed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        MaHopDong: thanhVienData.maHopDong,
        nguoiDung: {
          HoTen: thanhVienData.nguoiDung.hoTen,
          SoCccd: thanhVienData.nguoiDung.soCccd,
          SoDt: thanhVienData.nguoiDung.soDt,
          NgaySinh: thanhVienData.nguoiDung.ngaySinh, // ISO string: "1990-01-01T00:00:00"
          Password: thanhVienData.nguoiDung.password,
          DiaChi: thanhVienData.nguoiDung.diaChi,
          NgheNghiep: thanhVienData.nguoiDung.ngheNghiep
        }
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

export const deleteThanhVienHopDongApi = async (maHopDong, maNt) => {
  try {
    console.log("Deleting member with MaHopDong:", maHopDong, "MaNt:", maNt);
    const token = await getAccessToken(); 
    const res = await fetch(`${API_BASE_URL}/HopDong/xoa-thanh-vien`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        MaHopDong: maHopDong,
        maNt: maNt
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

export const huyHopDongApi = async (maHopDong) => {
  try {
    const token = await getAccessToken(); 
    const res = await fetch(`${API_BASE_URL}/HopDong/huy-hop-dong?maHopDong=${maHopDong}`, {
      method: "PUT",
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
