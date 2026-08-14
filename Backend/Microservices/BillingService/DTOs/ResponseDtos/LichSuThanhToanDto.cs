namespace BillingService.DTOs.ResponseDtos;

public class LichSuThanhToanDto
{
    public int MaLstt { get; set; }
    public int MaHoaDon { get; set; }
    public decimal SoTien { get; set; }
    public int? MaPhuongThuc { get; set; }
    public DateTime? NgayThanhToan { get; set; }
    public string? MaGiaoDich { get; set; }
    public string? GhiChu { get; set; }
    // hóa đơn
    public DateTime ngayLapHd { get; set; }
    public string soPhong { get; set; }
    public string tenDayNhaTro { get; set; }
}
