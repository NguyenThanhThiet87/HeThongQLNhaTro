using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MaintenanceService.Models
{
    public class NguoiDung
    {
        [Key]
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string Sdt { get; set; }
        public string SoDt { get; set; }
    }

    public class NguoiThueTro
    {
        [Key]
        public int MaNt { get; set; }
        public int? MaNguoiDung { get; set; }
        public virtual NguoiDung MaNtNavigation { get; set; }
        public virtual ICollection<BaoCaoSuCo> BaoCaoSuCos { get; set; } = new List<BaoCaoSuCo>();
        public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();
    }

    public class ThongBao
    {
        [Key]
        public int MaThongBao { get; set; }
        public string TieuDe { get; set; }
        public string NoiDung { get; set; }
        public DateTime? NgayTao { get; set; }
        public bool? DaDoc { get; set; }
        public string LoaiTb { get; set; }
        public int? MaNd { get; set; }
        public int? MaThucThe { get; set; }
    }

    public class HopDongNguoiThue
    {
        [Key]
        public int MaHopDong { get; set; }
        public int MaNt { get; set; }
        public virtual NguoiThueTro MaNtNavigation { get; set; }
        public virtual HopDongThue MaHopDongNavigation { get; set; }
    }

    public class HopDongThue
    {
        [Key]
        public int MaHopDong { get; set; }
        public int MaPhong { get; set; }
        public int? MaTthopDong { get; set; }
        public int? MaChuNt { get; set; }
        public virtual Phong MaPhongNavigation { get; set; }
    }

    public class Phong
    {
        [Key]
        public int MaPhong { get; set; }
        public int? MaTthopDong { get; set; }
        public string SoPhong { get; set; }
        public int? MaDayNt { get; set; }
        public virtual DayNhaTro MaDayNtNavigation { get; set; }
        public virtual ICollection<HopDongThue> HopDongThues { get; set; } = new List<HopDongThue>();
        public virtual ICollection<PhongThietBi> PhongThietBis { get; set; } = new List<PhongThietBi>();
        public virtual ICollection<LichSuBaoTri> LichSuBaoTris { get; set; } = new List<LichSuBaoTri>();
    }

    public class DayNhaTro
    {
        [Key]
        public int MaDayNt { get; set; }
        public string TenDayNt { get; set; }
        public int? MaChuNt { get; set; }
        public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
    }
}
