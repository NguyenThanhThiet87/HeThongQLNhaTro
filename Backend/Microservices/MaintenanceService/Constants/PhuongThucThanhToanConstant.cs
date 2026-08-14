namespace MaintenanceService.Constants
{
    public static class PhuongThucThanhToanConstant
    {
        public const int TienMat = 1;      // Mới tạo, khách chưa trả tiền
        public const int ChuyenKhoan = 2;        // Khách đã trả đủ tiền
        public const int VnPay = 3;         // Khách đã chuyển khoản, chủ trọ chưa xác nhận
        public const int Momo = 4;              // Hóa đơn bị hủy do sai sót hoặc khách chuyển đi
    }
}
