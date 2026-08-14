namespace PropertyService.DTOs.ResponseDtos;

public class HopDongThueDto
{
    public int MaHopDong { get; set; }
    public int MaPhong { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateOnly NgayBdhl { get; set; }
    public DateOnly? NgayKthl { get; set; }
    public decimal GiaThue { get; set; }
    public decimal? TienDatCoc { get; set; }
    public string? AnhHopDong { get; set; }
    public int MaTthopDong { get; set; }
    public decimal GiaDien { get; set; }
    public decimal GiaNuoc { get; set; }
    public string? DonViDien { get; set; }
    public string? DonViNuoc { get; set; }
    
    // Chủ hợp đồng
    public int? MaChuNhaTro { get; set; }
    public string TenChuNhaTro { get; set; }

    // Flatten từ navigation
    public string? SoPhong { get; set; }
    public string? TenDayNhaTro { get; set; }
    public string? TenTrangThaiHopDong { get; set; }

    // Danh sách người thuê trong hợp đồng
    public List<HopDongNguoiThueDto>? HopDongNguoiThues { get; set; }
}
