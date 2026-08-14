namespace IdentityService.DTOs.ResponseDtos;

public class BaoCaoSuCoDto
{
    public int MaSuCo { get; set; }
    public int MaNt { get; set; }
    public DateTime? ThoiGian { get; set; }
    public decimal? TongPhi { get; set; }
    public int MaTtxuLy { get; set; }

    // Flatten từ navigation
    public string? HoTenNguoiThue { get; set; }
    public string? TenTrangThaiXuLy { get; set; }

    // Danh sách chi tiết sự cố
    public List<ChiTietSuCoDto>? ChiTietSuCos { get; set; }
}
