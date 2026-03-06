export const TRANG_THAI_HOA_DON = {
    CHO_XAC_NHAN: "3",      // Chờ xác nhận
    CHUA_THANH_TOAN: "1",   // Chưa thanh toán
    DA_GUI: "6",            // Đã gửi
    DA_HUY: "4",            // Đã hủy
    DA_THANH_TOAN: "2",     // Đã thanh toán
    QUA_HAN: "5",           // Quá hạn
};

export const TEN_TRANG_THAI_HOA_DON = {
    CHO_XAC_NHAN: "Chờ xác nhận",
    CHUA_THANH_TOAN: "Chưa thanh toán",
    DA_GUI: "Đã gửi",
    DA_HUY: "Đã hủy",
    DA_THANH_TOAN: "Đã thanh toán",
    QUA_HAN: "Quá hạn",
};

// Hàm chuyển key sang tên hiển thị
export function getTenTrangThaiHoaDon(key) {
    return TEN_TRANG_THAI_HOA_DON[key] || "";
}
export function getTenTrangThaiHoaDonByValue(value) {
    const key = Object.keys(TRANG_THAI_HOA_DON).find(k => TRANG_THAI_HOA_DON[k] == value);
    return TEN_TRANG_THAI_HOA_DON[key] || "";
}
export const DANH_SACH_TRANG_THAI_HOA_DON = [
    { label: "Chờ xác nhận", value: TRANG_THAI_HOA_DON.CHO_XAC_NHAN },      // "3"
    { label: "Chưa thanh toán", value: TRANG_THAI_HOA_DON.CHUA_THANH_TOAN },// "1"
    { label: "Đã gửi", value: TRANG_THAI_HOA_DON.DA_GUI },                  // "6"
    { label: "Đã hủy", value: TRANG_THAI_HOA_DON.DA_HUY },                  // "4"
    { label: "Đã thanh toán", value: TRANG_THAI_HOA_DON.DA_THANH_TOAN },    // "2"
    { label: "Quá hạn", value: TRANG_THAI_HOA_DON.QUA_HAN },                // "5"
];