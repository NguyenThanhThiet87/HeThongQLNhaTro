namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class NguoiDungDto
{
    public int MaNd { get; set; }
    public string? HoTen { get; set; } = null!;
    public int? GioiTinh { get; set; }
    public string SoDt { get; set; } = null!;
    public string? SoCccd { get; set; }
    public DateOnly? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public bool? KichHoat { get; set; }
    public DateTime? NgayTao { get; set; }
    public string? Avatar { get; set; }
    public int? MaVaiTro { get; set; }
    public string? TenVaiTro { get; set; }
}
