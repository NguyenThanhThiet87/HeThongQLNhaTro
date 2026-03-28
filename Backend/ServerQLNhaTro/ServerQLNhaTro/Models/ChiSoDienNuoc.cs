using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("ChiSoDienNuoc")]
[Index("MaPhong", Name = "IX_ChiSo_MaPhong")]
[Index("MaPhong", "Thang", "Nam", Name = "UQ_ChiSo_Phong_ThangNam", IsUnique = true)]
public partial class ChiSoDienNuoc
{
    [Key]
    public int MaChiSo { get; set; }

    public int MaPhong { get; set; }

    public int? Thang { get; set; }

    public int? Nam { get; set; }

    [Column("CSDienCu")]
    public int? CsdienCu { get; set; }

    [Column("CSDienMoi")]
    public int? CsdienMoi { get; set; }

    [Column("CSNuocCu")]
    public int? CsnuocCu { get; set; }

    [Column("CSNuocMoi")]
    public int? CsnuocMoi { get; set; }

    [InverseProperty("MaChiSoNavigation")]
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    [ForeignKey("MaPhong")]
    [InverseProperty("ChiSoDienNuocs")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;
}
