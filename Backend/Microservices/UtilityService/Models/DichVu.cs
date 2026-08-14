using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace UtilityService.Models;

[Table("DichVu")]
public partial class DichVu
{
    [Key]
    [Column("MaDV")]
    public int MaDv { get; set; }

    [Column("MaNCC")]
    public int MaNcc { get; set; }

    [ForeignKey("MaNcc")]
    public virtual NhaCungCap MaNccNavigation { get; set; }

    [Column("TenDV")]
    [StringLength(100)]
    public string TenDv { get; set; } = null!;

    [Column("MoTaCT")]
    public string? MoTaCt { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? GiaTien { get; set; }

    [StringLength(20)]
    public string? DonViTinh { get; set; }

    [Column("TTCungCap")]
    [StringLength(255)]
    public string? TtcungCap { get; set; }

    [StringLength(255)]
    public string? HinhAnh { get; set; }

}
