namespace MaintenanceService.Constants
{
    public static class TrangThaiHoaDonConstant
    {
        public const int ChuaThanhToan = 1;      // Mới tạo, khách chưa trả tiền
        public const int DaThanhToan = 2;        // Khách đã trả đủ tiền
        public const int ChoXacNhan = 3;         // Khách đã chuyển khoản, chủ trọ chưa xác nhận
        public const int DaHuy = 4;              // Hóa đơn bị hủy do sai sót hoặc khách chuyển đi
        public const int QuaHan = 5;             // Đến hạn mà chưa thanh toán
        public const int DaGui = 6;              // Hóa đơn đã gửi cho khách, chờ thanh toán
    }
}
