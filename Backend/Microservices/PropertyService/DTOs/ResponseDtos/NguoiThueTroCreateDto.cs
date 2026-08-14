namespace PropertyService.DTOs.ResponseDtos;

public class NguoiThueTroDto
{
    public int MaNt { get; set; }
    public string? NgheNghiep { get; set; }

    // Flatten từ NguoiDung
    public string? HoTen { get; set; }
    public int? GioiTinh { get; set; }
    public string? SoDt { get; set; }
    public string? SoCccd { get; set; }
    public DateOnly? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public string? Avatar { get; set; }
    public string? Password { get; set; }
    //Thông tin cư trú
    public int? MaPhong { get; set; }
    public string? dayNhaTro { get; set; }
    public string? SoPhong { get; set; }
    public DateOnly? NgayVaoO { get; set; }
    public bool TrangThaiTamTru { get; set; }
    public int? soNguoiO { get; set; }
    //Thông tin người liên hệ khẩn cấp
    public string? HoTenNguoiLienHe { get; set; }
    public string? SdtNguoiLienHe { get; set; }
    public string? QuanHeNguoiLienHe { get; set; }
    //Hợp đồng
    public int? MaHopDong { get; set; }
    public int? TrangThaiHopDong { get; set; }
    public int? VaiTroNguoiThue { get; set; }
    public DateOnly? ngayBdhl { get; set; }
    public DateOnly? ngayKthl { get; set; }
    public decimal? tienCoc { get; set; }

}
