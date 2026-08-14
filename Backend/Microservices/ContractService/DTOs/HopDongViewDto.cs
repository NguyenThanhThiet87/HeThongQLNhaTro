namespace ContractService.DTOs
{
    public class HopDongViewDto
    {
        public int MaHopDong { get; set; }
        public string TenPhong { get; set; }
        public DateTime NgayBd { get; set; }
        public DateTime? NgayKt { get; set; }
        public string TrangThai { get; set; }
        public int SoNguoiO { get; set; }
    }
}
