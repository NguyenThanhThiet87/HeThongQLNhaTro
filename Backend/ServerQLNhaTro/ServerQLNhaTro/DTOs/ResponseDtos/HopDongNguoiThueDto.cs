namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class HopDongNguoiThueDto
{
    public int Pk { get; set; }
    public int MaHopDong { get; set; }
    public int MaNt { get; set; }
    public DateOnly? NgayVao { get; set; }
    public DateOnly? NgayRoi { get; set; }
    public int? MaVaiTro { get; set; }
    public int? MaTttamTru { get; set; }

    // Flatten từ navigation
    public string? HoTenNguoiThue { get; set; }
    public string? SoDtNguoiThue { get; set; }
    public string? TenVaiTro { get; set; }
    public string? TenTrangThaiTamTru { get; set; }
    public string? Avatar { get; set; }
}
