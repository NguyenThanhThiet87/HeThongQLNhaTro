export const VAI_TRO_NGUOI_THUE = {
    NGUOI_DAI_DIEN: "1", // Người ký hợp đồng, chịu trách nhiệm pháp lý chính
    THANH_VIEN: "2",     // Người ở cùng, có quyền sử dụng App tương đương
};
export const TEN_VAI_TRO_NGUOI_THUE = {
    NGUOI_DAI_DIEN: "Người đại diện",
    THANH_VIEN: "Thành viên",
};

export function getTenVaiTroNguoiThueByValue(value) {
    const key = Object.keys(VAI_TRO_NGUOI_THUE).find(k => VAI_TRO_NGUOI_THUE[k] == value);
    return TEN_VAI_TRO_NGUOI_THUE[key] || "";
}
