using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("ChiTietSuCo")]
public partial class ChiTietSuCo
{
    [Key]
    [Column("PK")]
    public int Pk { get; set; }

    [Column("MaBCSC")]
    public int MaBcsc { get; set; }

    [Column("MaPhong_ThietBi")]
    public int? MaPhongThietBi { get; set; }

    public string? MoTaSuCo { get; set; }

    public string? MinhChung { get; set; }

    [Column("CPPhatSinh", TypeName = "decimal(18, 0)")]
    public decimal? CpphatSinh { get; set; }

    [ForeignKey("MaBcsc")]
    [InverseProperty("ChiTietSuCos")]
    public virtual BaoCaoSuCo MaBcscNavigation { get; set; } = null!;

    [ForeignKey("MaPhongThietBi")]
    [InverseProperty("ChiTietSuCos")]
    public virtual PhongThietBi? MaPhongThietBiNavigation { get; set; }
}
