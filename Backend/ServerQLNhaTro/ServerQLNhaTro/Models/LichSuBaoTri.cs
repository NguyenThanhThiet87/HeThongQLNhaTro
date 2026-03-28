using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("LichSuBaoTri")]
public partial class LichSuBaoTri
{
    [Key]
    [Column("MaBT")]
    public int MaBt { get; set; }

    public int? MaPhong { get; set; }

    [Column("MaPhong_ThietBi")]
    public int? MaPhongThietBi { get; set; }

    public string? MoTa { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? ChiPhi { get; set; }

    [Column("NgayBD", TypeName = "datetime")]
    public DateTime? NgayBd { get; set; }

    [Column("NgayKT", TypeName = "datetime")]
    public DateTime? NgayKt { get; set; }

    [StringLength(50)]
    public string? TrangThai { get; set; }

    [ForeignKey("MaPhong")]
    [InverseProperty("LichSuBaoTris")]
    public virtual Phong? MaPhongNavigation { get; set; }

    [ForeignKey("MaPhongThietBi")]
    [InverseProperty("LichSuBaoTris")]
    public virtual PhongThietBi? MaPhongThietBiNavigation { get; set; }
}
