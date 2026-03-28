using System.ComponentModel.DataAnnotations.Schema;

namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class PhongDto
{
    public int MaPhong { get; set; }
    public int MaDayNt { get; set; }
    public int MaLoaiP { get; set; }
    public string SoPhong { get; set; } = null!;
    public decimal GiaThucTe { get; set; }
    public int? MaTtphong { get; set; }
    public int? MaTtrPhong { get; set; }

    // Flatten từ navigation
    public string? TenDayNhaTro { get; set; }
    public string? TenLoaiPhong { get; set; }
    public string? TenTrangThaiPhong { get; set; }
    public string? TenTinhTrangPhong { get; set; }

    // Hợp đồng
    public string? MaHopDong { get; set; }
    public DateOnly NgayBdhl { get; set; }
    public DateOnly? NgayKthl { get; set; }
    // Danh sách con (dùng DTO phẳng)
    public List<AnhPhongDto>? AnhPhongs { get; set; }
    public List<PhongThietBiDto>? PhongThietBis { get; set; }
}
