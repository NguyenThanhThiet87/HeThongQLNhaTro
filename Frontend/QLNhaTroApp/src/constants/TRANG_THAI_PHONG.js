// Trạng thái phòng
export const TRANG_THAI_PHONG = {
    TRONG: 1, // Trống
    DANG_THUE: 2, // Đang thuê
    NO_TIEN: 3, // Nợ tiền
    DANG_SUA_CHUA: 4, // Đang sửa chữa
    CHO_DON_VAO: 5, // Chờ dọn vào
};
export const TEN_TRANG_THAI_PHONG = {
    TRONG: "Trống",
    DANG_THUE: "Đang thuê",
    NO_TIEN: "Nợ tiền",
    DANG_SUA_CHUA: "Đang sửa chữa",
    CHO_DON_VAO: "Chờ dọn vào",
};

// Hàm chuyển key sang tên hiển thị
export function getTenTrangThaiPhong(key) {
    return TEN_TRANG_THAI_PHONG[key] || "";
}