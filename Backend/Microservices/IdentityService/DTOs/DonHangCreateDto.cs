namespace IdentityService.DTOs
{
    public class DonHangCreateDto
    {
        public int MaNt { get; set; } // Người đặt
        public List<ChiTietDonHangDto> ChiTiet { get; set; }
        public string? GhiChu { get; set; }
    }

    public class ManualOrderCreateDto
    {
        public string? HoTen { get; set; }
        public string? SoDt { get; set; }
        public string? SoPhong { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietDonHangDto> ChiTiet { get; set; }
    }
}
