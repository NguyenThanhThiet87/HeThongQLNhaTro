namespace ServerQLNhaTro.DTOs
{
    public class ChiTietSuCoDto
    {
        public int? MaPhongThietBi { get; set; } // Null nếu hỏng tường/sàn
        public string MoTa { get; set; }
        public string? AnhMinhChung { get; set; } // URL ảnh
    }
}
