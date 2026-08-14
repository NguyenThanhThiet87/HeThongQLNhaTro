namespace IdentityService.DTOs.ResponseDtos;

public class ChiTietDhDto
{
    public int Pk { get; set; }
    public int MaDh { get; set; }
    public int MaDv { get; set; }
    public int? SoLuong { get; set; }
    public decimal? ThanhTien { get; set; }

    // Flatten từ DichVu
    public string? TenDichVu { get; set; }
    public decimal? GiaTien { get; set; }
}
