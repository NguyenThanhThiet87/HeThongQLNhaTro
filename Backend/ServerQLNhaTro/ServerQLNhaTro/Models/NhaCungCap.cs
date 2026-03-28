using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("NhaCungCap")]
public partial class NhaCungCap
{
    [Key]
    [Column("MaNCC")]
    public int MaNcc { get; set; }

    [Column("MoTaDV")]
    public string? MoTaDv { get; set; }

    public bool? SanSang { get; set; }

    [Column("DanhGiaTB")]
    public double? DanhGiaTb { get; set; }

    [Column("KhuVucPV")]
    [StringLength(255)]
    public string? KhuVucPv { get; set; }

    [Column(TypeName = "decimal(18, 10)")]
    public decimal? ViDo { get; set; }

    [Column(TypeName = "decimal(18, 10)")]
    public decimal? KinhDo { get; set; }

    [InverseProperty("MaNccNavigation")]
    public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();

    [InverseProperty("MaNccNavigation")]
    public virtual ICollection<DonHangDv> DonHangDvs { get; set; } = new List<DonHangDv>();

    [ForeignKey("MaNcc")]
    [InverseProperty("NhaCungCap")]
    public virtual NguoiDung MaNccNavigation { get; set; } = null!;
}
