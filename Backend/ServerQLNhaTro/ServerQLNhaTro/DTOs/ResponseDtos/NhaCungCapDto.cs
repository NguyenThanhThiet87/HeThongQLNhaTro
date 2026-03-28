namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class NhaCungCapDto
{
    public int MaNcc { get; set; }
    public string? MoTaDv { get; set; }
    public bool? SanSang { get; set; }
    public double? DanhGiaTb { get; set; }
    public string? KhuVucPv { get; set; }
    public string? DiaChi { get; set; }
    public DateOnly? NgaySinh { get; set; }
    public int? GioiTinh { get; set; }
    public string? SoCccd { get; set; }
    public decimal? KinhDo { get; set; }
    public decimal? ViDo { get; set; }

    // Flatten từ NguoiDung
    public string? HoTen { get; set; }
    public string? SoDt { get; set; }
    public string? Avatar { get; set; }
}

