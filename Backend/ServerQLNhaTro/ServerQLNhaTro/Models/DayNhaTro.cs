using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("DayNhaTro")]
public partial class DayNhaTro
{
    [Key]
    [Column("MaDayNT")]
    public int MaDayNt { get; set; }

    [Column("TenDayNT")]
    [StringLength(100)]
    public string TenDayNt { get; set; } = null!;

    [StringLength(255)]
    public string? DiaChi { get; set; }

    [Column("SLPhong")]
    public int? Slphong { get; set; }

    [Column("TrangThaiNT")]
    public bool? TrangThaiNt { get; set; }

    [Column("MaChuNT")]
    public int? MaChuNt { get; set; }

    [StringLength(255)]
    public string? UrlAnh { get; set; }

    [Column(TypeName = "decimal(18, 10)")]
    public decimal? KinhDo { get; set; }

    [Column(TypeName = "decimal(18, 10)")]
    public decimal? ViDo { get; set; }

    [ForeignKey("MaChuNt")]
    [InverseProperty("DayNhaTros")]
    public virtual ChuNhaTro? MaChuNtNavigation { get; set; }

    [InverseProperty("MaDayNtNavigation")]
    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
