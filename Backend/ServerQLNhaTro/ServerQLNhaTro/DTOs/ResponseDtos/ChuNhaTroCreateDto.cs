namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class ChuNhaTroCreateDto
{
    public int MaChuNt { get; set; }
    public string? SoTk { get; set; }
    public string? TenNh { get; set; }
    public string? SoGpkd { get; set; }
    public bool? DaDkkd { get; set; }

    // Flatten từ NguoiDung
    public string? HoTen { get; set; }
    public int? GioiTinh { get; set; }
    public string? SoDt { get; set; }
    public string? SoCccd { get; set; }
    public DateOnly? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public IFormFile? Avatar { get; set; }
    public string? Password { get; set; }
}
