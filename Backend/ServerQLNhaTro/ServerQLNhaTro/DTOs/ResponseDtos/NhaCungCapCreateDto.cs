namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class NhaCungCapCreateDto
{
    public int MaNcc { get; set; }
    public string? MoTaDv { get; set; }
    public bool? SanSang { get; set; }
    public string? KhuVucPv { get; set; }

    // Flatten từ NguoiDung
    public string? HoTen { get; set; }
    public string? SoDt { get; set; }
    public string? DiaChi { get; set; }
    public DateOnly? NgaySinh { get; set; }
    public int? GioiTinh { get; set; }
    public string? SoCccd { get; set; }
    public IFormFile? Avatar { get; set; }
}
