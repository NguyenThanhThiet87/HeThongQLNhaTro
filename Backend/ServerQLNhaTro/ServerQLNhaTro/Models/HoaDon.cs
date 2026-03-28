using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("HoaDon")]
[Index("MaHopDong", Name = "IX_HoaDon_MaHopDong")]
[Index("MaTthoaDon", Name = "IX_HoaDon_TrangThai")]
public partial class HoaDon
{
    [Key]
    public int MaHoaDon { get; set; }

    public int MaHopDong { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayLap { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TienDien { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TienNuoc { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TienPhong { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TongTien { get; set; }

    [Column("MaTTHoaDon")]
    public int MaTthoaDon { get; set; }

    public int? MaChiSo { get; set; }

    [InverseProperty("MaHoaDonNavigation")]
    public virtual ICollection<LichSuThanhToan> LichSuThanhToans { get; set; } = new List<LichSuThanhToan>();

    [ForeignKey("MaChiSo")]
    [InverseProperty("HoaDons")]
    public virtual ChiSoDienNuoc? MaChiSoNavigation { get; set; }

    [ForeignKey("MaHopDong")]
    [InverseProperty("HoaDons")]
    public virtual HopDongThue MaHopDongNavigation { get; set; } = null!;

    [ForeignKey("MaTthoaDon")]
    [InverseProperty("HoaDons")]
    public virtual TrangThaiHoaDon MaTthoaDonNavigation { get; set; } = null!;
}
