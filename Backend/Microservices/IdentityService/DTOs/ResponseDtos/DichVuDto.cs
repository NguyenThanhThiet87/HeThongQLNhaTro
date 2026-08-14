namespace IdentityService.DTOs.ResponseDtos;

public class DichVuDto
{
    public int MaDv { get; set; }
    public int MaNcc { get; set; }
    public string TenDv { get; set; } = null!;
    public string? MoTaCt { get; set; }
    public decimal? GiaTien { get; set; }
    public string? DonViTinh { get; set; }
    public string? TtcungCap { get; set; }

    // Flatten từ NhaCungCap
    public string? TenNhaCungCap { get; set; }
}
