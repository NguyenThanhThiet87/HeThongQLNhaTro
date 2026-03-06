export const TRANG_THAI_HOP_DONG = {
    CHO_XAC_NHAN: "1",   // Hợp đồng mới tạo, khách chưa ký/cọc
    DANG_HIEU_LUC: "2",  // Khách đang ở (Trạng thái bình thường)
    SAP_HET_HAN: "3",    // Còn dưới 15-30 ngày (Cần nhắc gia hạn)
    DA_THANH_LY: "4",    // Kết thúc đúng hạn, đã dọn đi
    CHAM_DUT_SOM: "5",   // Hủy hợp đồng do vi phạm hoặc lý do khác
};

export const TEN_TRANG_THAI_HOP_DONG = {
    CHO_XAC_NHAN: "Chờ xác nhận",
    DANG_HIEU_LUC: "Đang hiệu lực",
    SAP_HET_HAN: "Sắp hết hạn",
    DA_THANH_LY: "Đã thanh lý",
    CHAM_DUT_SOM: "Chấm dứt sớm",
};

// Hàm chuyển key sang tên hiển thị
export function getTenTrangThaiHopDong(key) {
    return TEN_TRANG_THAI_HOP_DONG[key] || "";
}
export function getTenTrangThaiHopDongByValue(value) {
    const key = Object.keys(TRANG_THAI_HOP_DONG).find(k => TRANG_THAI_HOP_DONG[k] == value);
    return TEN_TRANG_THAI_HOP_DONG[key] || "";
}

export const DANH_SACH_TRANG_THAI_HOP_DONG = [
    { label: "Chờ xác nhận", value: TRANG_THAI_HOP_DONG.CHO_XAC_NHAN },      // "3"
    { label: "Đang hiệu lực", value: TRANG_THAI_HOP_DONG.DANG_HIEU_LUC },// "1"
    { label: "Sắp hết hạn", value: TRANG_THAI_HOP_DONG.SAP_HET_HAN },                  // "6"
    { label: "Đã thanh lý", value: TRANG_THAI_HOP_DONG.DA_THANH_LY },                  // "4"
    { label: "Chấm dứt sớm", value: TRANG_THAI_HOP_DONG.CHAM_DUT_SOM },    // "2"
];

export function getColorTrangThaiHopDong(maTrangThai) {
    switch (maTrangThai) {
        case TRANG_THAI_HOP_DONG.CHO_XAC_NHAN: // "1"
            return "#f59e0b"; // vàng (Chờ xác nhận)
        case TRANG_THAI_HOP_DONG.DANG_HIEU_LUC: // "2"
            return "#10b981"; // xanh lá (Đang hiệu lực)
        case TRANG_THAI_HOP_DONG.SAP_HET_HAN: // "3"
            return "#3b82f6"; // xanh dương (Sắp hết hạn)
        case TRANG_THAI_HOP_DONG.DA_THANH_LY: // "4"
            return "#64748b"; // xám (Đã thanh lý)
        case TRANG_THAI_HOP_DONG.CHAM_DUT_SOM: // "5"
            return "#ef4444"; // đỏ (Chấm dứt sớm)
        default:
            return "#888"; // màu mặc định
    }
}