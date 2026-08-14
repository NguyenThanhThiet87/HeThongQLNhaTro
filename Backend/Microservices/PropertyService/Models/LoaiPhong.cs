using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Models;

[Table("LoaiPhong")]
public partial class LoaiPhong
{
    [Key]
    public int MaLoaiP { get; set; }

    [StringLength(100)]
    public string TenLoaiP { get; set; } = null!;

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? GiaChuan { get; set; }

    [Column("SNguoiToiDa")]
    public int? SnguoiToiDa { get; set; }

    [Column("MaChuNT")]
    public int? MaChuNt { get; set; }

    [StringLength(255)]
    public string? MoTa { get; set; }

    [StringLength(255)]
    public string? UrlAnh { get; set; }

    [ForeignKey("MaChuNt")]
    [InverseProperty("LoaiPhongs")]
    public virtual ChuNhaTro? MaChuNtNavigation { get; set; }

    [InverseProperty("MaLoaiPNavigation")]
    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
