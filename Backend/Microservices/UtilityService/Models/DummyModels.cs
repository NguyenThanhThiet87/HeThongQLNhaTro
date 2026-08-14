using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UtilityService.Models
{
    public class NhaCungCap
    {
        [Key]
        public int MaNcc { get; set; }
        public string TenNcc { get; set; }
        public string HoTen { get; set; }
        public string Avatar { get; set; }
        public string SoDt { get; set; }
        public string KhuVucPv { get; set; }
        public double? DanhGiaTb { get; set; }
        public bool? SanSang { get; set; }
        public string MoTaDv { get; set; }
        public decimal? ViDo { get; set; }
        public decimal? KinhDo { get; set; }
        public NhaCungCap MaNccNavigation { get; set; }
        public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();
    }

    public class HopDongNguoiThue
    {
        [Key]
        public int MaHopDong { get; set; }
        public int MaNt { get; set; }
        public virtual HopDongThue MaHopDongNavigation { get; set; }
    }

    public class HopDongThue
    {
        [Key]
        public int MaPhong { get; set; }
        public virtual Phong MaPhongNavigation { get; set; }
    }

    public class Phong
    {
        [Key]
        public int MaPhong { get; set; }
        public virtual DayNhaTro MaDayNtNavigation { get; set; }
    }

    public class DayNhaTro
    {
        [Key]
        public int MaDayNt { get; set; }
        public int MaChuNt { get; set; }
        public string TenDayNt { get; set; }
        public string DiaChi { get; set; }
        public decimal? KinhDo { get; set; }
        public decimal? ViDo { get; set; }
        public virtual ChuNhaTro MaChuNtNavigation { get; set; }
    }

    public class ChuNhaTro
    {
        [Key]
        public int MaChuNt { get; set; }
    }
}