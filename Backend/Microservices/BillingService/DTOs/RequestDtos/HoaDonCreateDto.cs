namespace BillingService.DTOs
{
    public class HoaDonCreateDto
    {
        public int MaHopDong { get; set; }
        public int Thang { get; set; } // Để tìm chỉ số điện nước tương ứng
        public int Nam { get; set; }
    }
}
