namespace BillingService.DTOs
{
    public class ThanhToanDto
    {
        public int MaHoaDon { get; set; }
        public decimal SoTien { get; set; }
        public string PhuongThuc { get; set; } // Tiền mặt/Chuyển khoản
        public string? GhiChu { get; set; }
    }
}
