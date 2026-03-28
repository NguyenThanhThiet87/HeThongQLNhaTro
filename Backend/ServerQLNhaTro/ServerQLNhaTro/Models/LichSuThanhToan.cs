using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("LichSuThanhToan")]
public partial class LichSuThanhToan
{
    [Key]
    [Column("MaLSTT")]
    public int MaLstt { get; set; }

    public int MaHoaDon { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal SoTien { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayThanhToan { get; set; }

    [StringLength(255)]
    public string? GhiChu { get; set; }

    [Column("MaPTTT")]
    public int? MaPttt { get; set; }

    [StringLength(50)]
    public string? MaGiaoDich { get; set; }

    [ForeignKey("MaHoaDon")]
    [InverseProperty("LichSuThanhToans")]
    public virtual HoaDon MaHoaDonNavigation { get; set; } = null!;

    [ForeignKey("MaPttt")]
    [InverseProperty("LichSuThanhToans")]
    public virtual PhuongThucThanhToan? MaPtttNavigation { get; set; }
}
