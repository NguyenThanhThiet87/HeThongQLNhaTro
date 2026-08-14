namespace IdentityService.DTOs.ResponseDtos;

public class DonHangDvDto
{
    public int MaDh { get; set; }
    public int MaNt { get; set; }
    public DateTime? NgayDat { get; set; }
    public decimal? TongTien { get; set; }
    public string? TrangThaiDh { get; set; }

    // Flatten từ NguoiThueTro
    public string? HoTenNguoiThue { get; set; }

    // Danh sách chi tiết đơn hàng
    public List<ChiTietDhDto>? ChiTietDhs { get; set; }
}
