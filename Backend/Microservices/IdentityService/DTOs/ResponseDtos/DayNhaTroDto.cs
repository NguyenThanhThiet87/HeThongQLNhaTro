namespace IdentityService.DTOs.ResponseDtos;

public class DayNhaTroDto
{
    public int MaDayNt { get; set; }
    public string TenDayNt { get; set; } = null!;
    public string? DiaChi { get; set; }
    public int? Slphong { get; set; }
    public bool? TrangThaiNt { get; set; }
    public int? MaChuNt { get; set; }
    public string? UrlAnh { get; set; }
    public decimal? KinhDo { get; set; }
    public decimal? ViDo { get; set; }

    // Flatten từ ChuNhaTro
    public string? TenChuNhaTro { get; set; }
    //
    public double? TyLeLapDay { get; set; }
}
