namespace ContractService.DTOs.ResponseDtos;

public class HoaDonDto
{
    public int MaHoaDon { get; set; }
    public int MaHopDong { get; set; }
    public DateTime? NgayLap { get; set; }
    public decimal? TienDien { get; set; }
    public decimal? TienNuoc { get; set; }
    public decimal? TienPhong { get; set; }
    public decimal? TongTien { get; set; }
    public int MaTthoaDon { get; set; }

    // Flatten từ navigation
    public string? SoPhong { get; set; }
    public string? TenTrangThaiHoaDon { get; set; }
    public string? TenNguoiDaiDien { get; set; }
    public string? TenDayNhaTro { get; set; }

    // Danh sách lịch sử thanh toán
    public List<LichSuThanhToanDto>? LichSuThanhToans { get; set; }

    public ChiSoDienNuocDto? ChiSoDienNuoc { get; set; }
    public NguoiThueTroDto? NguoiDaiDien { get; set; }
}
