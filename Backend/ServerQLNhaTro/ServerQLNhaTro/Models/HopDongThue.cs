using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("HopDongThue")]
[Index("MaPhong", Name = "IX_HopDong_MaPhong")]
public partial class HopDongThue
{
    [Key]
    public int MaHopDong { get; set; }

    public int MaPhong { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [Column("NgayBDHL")]
    public DateOnly NgayBdhl { get; set; }

    [Column("NgayKTHL")]
    public DateOnly? NgayKthl { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal GiaThue { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TienDatCoc { get; set; }

    public string? AnhHopDong { get; set; }

    [Column("MaTTHopDong")]
    public int MaTthopDong { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal GiaDien { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal GiaNuoc { get; set; }

    [StringLength(20)]
    public string? DonViDien { get; set; }

    [StringLength(20)]
    public string? DonViNuoc { get; set; }

    [Column("MaChuNT")]
    public int? MaChuNt { get; set; }

    [InverseProperty("MaHopDongNavigation")]
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    [InverseProperty("MaHopDongNavigation")]
    public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();

    [ForeignKey("MaChuNt")]
    [InverseProperty("HopDongThues")]
    public virtual ChuNhaTro? MaChuNtNavigation { get; set; }

    [ForeignKey("MaPhong")]
    [InverseProperty("HopDongThues")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;

    [ForeignKey("MaTthopDong")]
    [InverseProperty("HopDongThues")]
    public virtual TrangThaiHopDong MaTthopDongNavigation { get; set; } = null!;
}
