namespace ContractService.DTOs.ResponseDtos;

public class LichSuBaoTriDto
{
    public int MaBt { get; set; }
    public int? MaPhong { get; set; }
    public int? MaPhongThietBi { get; set; }
    public string? MoTa { get; set; }
    public decimal? ChiPhi { get; set; }
    public DateTime? NgayBd { get; set; }
    public DateTime? NgayKt { get; set; }
    public string? TrangThai { get; set; }

    // Flatten từ navigation
    public string? SoPhong { get; set; }
    public string? TenThietBi { get; set; }
}
