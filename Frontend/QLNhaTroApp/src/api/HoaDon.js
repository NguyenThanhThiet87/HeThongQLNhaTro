import { getAccessToken } from "../utils/decodeToken";

export const getDienNuocCuApi = async (maPhong, month, year) => {
    console.log("Calling getDienNuocCuApi with params:", { maPhong, month, year });
    try {
        const token = await getAccessToken();
        const res = await fetch(`https://eveline-prenasal-concha.ngrok-free.dev/api/HoaDonThanhToan/dien-nuoc-cu?maPhong=${maPhong}&monthCurrent=${month}&yearCurrent=${year}`, {
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

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/HoaDonThanhToan/hoa-dons?maDayNt=${maDayNt}&month=${month}&year=${year}&trangThai=${trangThai}`;

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
    console.log("Calling getHoaDonApi with params:", { maHd });
    const token = await getAccessToken();

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/HoaDonThanhToan/hoa-don?maHd=${maHd}`;

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

    const url = `https://eveline-prenasal-concha.ngrok-free.dev/api/HoaDonThanhToan/danh-sach-thang?maDayNt=${maDayNt}`;

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
        const res = await fetch(`https://eveline-prenasal-concha.ngrok-free.dev/api/HoaDonThanhToan/chot-dien-nuoc`, {
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