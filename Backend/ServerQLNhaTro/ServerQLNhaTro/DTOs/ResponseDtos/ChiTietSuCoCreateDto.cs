namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class ChiTietSuCoCreateDto
{
    public int Pk { get; set; }
    public int MaBcsc { get; set; }
    public int? MaPhongThietBi { get; set; }
    public string? MoTaSuCo { get; set; }
    public IFormFile? MinhChung { get; set; }
    public decimal? CpphatSinh { get; set; }

    // Flatten từ PhongThietBi
    public string? TenThietBi { get; set; }
    public string? TrangThaiThietBi { get; set; }
}
