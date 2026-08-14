using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BillingService.Models
{
    public class ThongBao
    {
        [Key]
        public int MaTb { get; set; }
        public string TieuDe { get; set; }
        public string NoiDung { get; set; }
        public int? MaNd { get; set; }
        public int? MaThucThe { get; set; }
        public int? MaNgNhan { get; set; }
        public DateTime? NgayTao { get; set; }
        public bool? DaDoc { get; set; }
        public string LoaiTb { get; set; }
    }

    public class HopDongNguoiThue
    {
        public int MaHopDong { get; set; }
        public int MaNt { get; set; }
        public int? MaVaiTro { get; set; }
        public DateTime? NgayVao { get; set; }
        public virtual NguoiThueTro MaNtNavigation { get; set; }
        public virtual HopDongThue MaHopDongNavigation { get; set; }
    }

    public class HopDongThue
    {
        [Key]
        public int MaHopDong { get; set; }
        public int MaPhong { get; set; }
        public int? MaChuNt { get; set; }
        public int? MaTthopDong { get; set; }
        public decimal? GiaDien { get; set; }
        public decimal? GiaNuoc { get; set; }
        public decimal? GiaThue { get; set; }
        public virtual Phong MaPhongNavigation { get; set; }
        public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();
        public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();
    }

    public class Phong
    {
        [Key]
        public int MaPhong { get; set; }
        public string TenPhong { get; set; }
        public string SoPhong { get; set; }
        public int? MaTtphong { get; set; }
        public int MaDayNt { get; set; }
        public virtual DayNhaTro MaDayNtNavigation { get; set; }
    }

    public class DayNhaTro
    {
        [Key]
        public int MaDayNt { get; set; }
        public int? MaChuNt { get; set; }
        public string TenDayNt { get; set; }
        public string DiaChi { get; set; }
    }

    public class ChiSoDienNuoc
    {
        [Key]
        public int MaChiSo { get; set; }
        public int MaPhong { get; set; }
        public int? Thang { get; set; }
        public int? Nam { get; set; }
        public int? CsdienCu { get; set; }
        public int? CsdienMoi { get; set; }
        public int? CsnuocCu { get; set; }
        public int? CsnuocMoi { get; set; }
        public virtual Phong MaPhongNavigation { get; set; }
        public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();
    }

    public class DichVu
    {
        [Key]
        public int MaDv { get; set; }
        public string TenDv { get; set; }
        public decimal? GiaTien { get; set; }
        public string HinhAnh { get; set; }
        public int? MaNcc { get; set; }
        public virtual NhaCungCap MaNccNavigation { get; set; }
    }

    public class NhaCungCap
    {
        [Key]
        public int MaNcc { get; set; }
        public string TenNcc { get; set; }
        public virtual NguoiDung MaNccNavigation { get; set; }
    }

    public class NguoiThueTro
    {
        [Key]
        public int MaNt { get; set; }
        public virtual NguoiDung MaNtNavigation { get; set; }
    }

    public class NguoiDung
    {
        [Key]
        public int MaNd { get; set; }
        public string HoTen { get; set; }
        public string SoDt { get; set; }
        public string Avatar { get; set; }
    }
}
