export const PHUONG_THUC_THANH_TOAN = {
    TIEN_MAT: "1",
    CHUYEN_KHOAN: "2",
    VNPAY: "3",
};

export const TEN_PHUONG_THUC_THANH_TOAN = {
    TIEN_MAT: "Tiền mặt",
    CHUYEN_KHOAN: "Chuyển khoản ngân hàng",
    VNPAY: "VNPay",
};

export const ICON_PHUONG_THUC_THANH_TOAN = {
    TIEN_MAT: "payments",
    CHUYEN_KHOAN: "account-balance",
    VNPAY: "account-balance-wallet",
};

export function getTenPhuongThucThanhToan(value) {
    // Sử dụng == để so sánh cả số (int) và chuỗi (string)
    const key = Object.keys(PHUONG_THUC_THANH_TOAN).find(k => PHUONG_THUC_THANH_TOAN[k] == value);
    return TEN_PHUONG_THUC_THANH_TOAN[key] || "Không xác định";
}

export function getIconPhuongThucThanhToan(value) {
    // Sử dụng == để so sánh cả số (int) và chuỗi (string)
    const key = Object.keys(PHUONG_THUC_THANH_TOAN).find(k => PHUONG_THUC_THANH_TOAN[k] == value);
    return ICON_PHUONG_THUC_THANH_TOAN[key] || "help-outline";
}

export const DANH_SACH_PHUONG_THUC_THANH_TOAN = [
    { id: PHUONG_THUC_THANH_TOAN.CHUYEN_KHOAN, label: "Chuyển khoản ngân hàng", sub: "Hỗ trợ QR-Pay nhanh chóng", icon: "account-balance" },
    { id: PHUONG_THUC_THANH_TOAN.VNPAY, label: "VNPay", sub: "Thanh toán qua ví VNPay hoặc Ngân hàng", icon: "account-balance-wallet", color: "#A50064" },
    { id: PHUONG_THUC_THANH_TOAN.TIEN_MAT, label: "Tiền mặt", sub: "Nộp trực tiếp cho chủ nhà", icon: "payments", color: "#16a34a" },
];
