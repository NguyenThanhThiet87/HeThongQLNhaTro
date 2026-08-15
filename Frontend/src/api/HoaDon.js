import { API_BASE_URL } from "../config/api";
import { getAccessToken } from "../utils/decodeToken";

export const getDienNuocCuApi = async (maPhong, month, year) => {
    console.log("Calling getDienNuocCuApi with params:", { maPhong, month, year });
    try {
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE_URL}/HoaDonThanhToan/dien-nuoc-cu?maPhong=${maPhong}&monthCurrent=${month}&yearCurrent=${year}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};

export const getHoaDonsApi = async (maDayNt, month, year, trangThai) => {
  try {
    console.log("Calling getHoaDonsApi with params:", { maDayNt, month, year, trangThai });
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/hoa-dons?maDayNt=${maDayNt}&month=${month}&year=${year}&trangThai=${trangThai}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getHoaDonApi = async (maHd) => {
  try {
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/hoa-don?maHd=${maHd}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};


export const getHoaDonNewApi = async (maNd) => {
  try {
    console.log("Calling getHoaDonNewApi with params:", { maNd });
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/hoa-don-moi?maNd=${maNd}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getThangNamHDApi = async (maDayNt) => {
  try {
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/danh-sach-thang?maDayNt=${maDayNt}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);

  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const saveDienNuocMoiApi = async (maPhong, month, year, soDienMoi, soNuocMoi) => {
    try {
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE_URL}/HoaDonThanhToan/chot-dien-nuoc`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                maPhong,
                thang: month,
                nam: year,
                CsdienMoi: soDienMoi,
                CsnuocMoi: soNuocMoi
            })
        });

        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend
    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};


export const getDoanhThuApi = async (maNd) => {
    try {
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE_URL}/HoaDonThanhToan/doanh-thu?maNd=${maNd}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        return result; // Trả về ApiResponse từ Backend

    } catch (error) {
        return {
            success: false,
            message: "Lỗi kết nối: " + error.message,
            data: null
        };
    }
};


export const getLichSuThanhToanGanApi = async (maNd) => {
  try {
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/lich-su-thanh-toan-gan?maNd=${maNd}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getThongKeChiTieuApi = async (maNd) => {
  try {
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/thong-ke-chi-tieu?maNd=${maNd}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};

export const getChiTietGiaoDichApi = async (maLstt) => {
  try {
    const token = await getAccessToken();

    const url = `${API_BASE_URL}/HoaDonThanhToan/chi-tiet-giao-dich?maLstt=${maLstt}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await res.text();

    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: "Lỗi kết nối: " + error.message,
      data: null
    };
  }
};