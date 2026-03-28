using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("ChuNhaTro")]
public partial class ChuNhaTro
{
    [Key]
    [Column("MaChuNT")]
    public int MaChuNt { get; set; }

    [Column("SoTK")]
    [StringLength(50)]
    [Unicode(false)]
    public string? SoTk { get; set; }

    [Column("TenNH")]
    [StringLength(100)]
    public string? TenNh { get; set; }

    [Column("SoGPKD")]
    [StringLength(50)]
    [Unicode(false)]
    public string? SoGpkd { get; set; }

    [Column("DaDKKD")]
    public bool? DaDkkd { get; set; }

    [InverseProperty("MaChuNtNavigation")]
    public virtual ICollection<DayNhaTro> DayNhaTros { get; set; } = new List<DayNhaTro>();

    [InverseProperty("MaChuNtNavigation")]
    public virtual ICollection<HopDongThue> HopDongThues { get; set; } = new List<HopDongThue>();

    [InverseProperty("MaChuNtNavigation")]
    public virtual ICollection<LoaiPhong> LoaiPhongs { get; set; } = new List<LoaiPhong>();

    [ForeignKey("MaChuNt")]
    [InverseProperty("ChuNhaTro")]
    public virtual NguoiDung MaChuNtNavigation { get; set; } = null!;
}
