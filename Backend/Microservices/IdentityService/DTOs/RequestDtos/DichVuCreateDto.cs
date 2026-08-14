namespace IdentityService.DTOs.RequestDtos;

public class DichVuCreateDto
{
    public int MaNcc { get; set; }
    public string TenDv { get; set; } = null!;
    public string? MoTaCt { get; set; }
    public decimal? GiaTien { get; set; }
    public string? DonViTinh { get; set; }
    public string? TtcungCap { get; set; }
    public string? DanhMuc { get; set; }
    public string? HinhAnh { get; set; }
}
