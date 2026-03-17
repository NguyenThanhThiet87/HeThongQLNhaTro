export const ROLES = {
    ADMIN: "1",
    CHU_TRO: "2",
    NGUOI_THUE: "3",
    NHA_CUNG_CAP: "4",
};

export const TEN_ROLE = {
    ADMIN: "Quản trị viên",
    CHU_TRO: "Chủ trọ",
    NGUOI_THUE: "Người thuê",
    NHA_CUNG_CAP: "Nhà cung cấp",
};

// Hàm chuyển key sang tên hiển thị
export function getTenRole(maVaiTro) {
    const key = Object.keys(ROLES).find(k => ROLES[k] === maVaiTro);
    return key ? TEN_ROLE[key] : "";
}

export function getTenRoleByValue(value) {
    const strValue = String(value);
    const key = Object.keys(ROLES).find(k => ROLES[k] === strValue);
    return key ? TEN_ROLE[key] : "";
}