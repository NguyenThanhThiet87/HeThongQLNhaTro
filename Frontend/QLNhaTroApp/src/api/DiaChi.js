// api/DiaChi.js

const BASE_URL = "https://provinces.open-api.vn/api";

/**
 * Lấy danh sách 63 Tỉnh / Thành phố
 */
export const getTinhThanhApi = async () => {
  try {
    const res = await fetch(`${BASE_URL}/p/`);
    const data = await res.json();
    
    // Đổi chuẩn dữ liệu cho Dropdown
    return data.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  } catch (error) {
    console.error("Lỗi lấy Tỉnh/Thành:", error);
    return []; // Trả về mảng rỗng nếu lỗi để app không bị crash
  }
};

/**
 * Lấy danh sách Quận / Huyện dựa vào Mã Tỉnh
 */
export const getQuanHuyenApi = async (tinhCode) => {
  try {
    const res = await fetch(`${BASE_URL}/p/${tinhCode}?depth=2`);
    const data = await res.json();
    
    return data.districts.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  } catch (error) {
    console.error("Lỗi lấy Quận/Huyện:", error);
    return [];
  }
};

/**
 * Lấy danh sách Phường / Xã dựa vào Mã Quận
 */
export const getPhuongXaApi = async (quanCode) => {
  try {
    const res = await fetch(`${BASE_URL}/d/${quanCode}?depth=2`);
    const data = await res.json();
    
    return data.wards.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  } catch (error) {
    console.error("Lỗi lấy Phường/Xã:", error);
    return [];
  }
};