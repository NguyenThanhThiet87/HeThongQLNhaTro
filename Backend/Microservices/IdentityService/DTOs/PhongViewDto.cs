namespace IdentityService.DTOs
{
    public class PhongViewDto
    {
        public int MaPhong { get; set; }
        public string TenDayNt { get; set; }
        public string SoPhong { get; set; }
        public string TenLoaiP { get; set; }
        public decimal GiaThucTe { get; set; }
        public string TrangThai { get; set; } // Tên trạng thái (VD: Trống)
        public string AnhDaiDien { get; set; } // Lấy ảnh đầu tiên
    }
}
