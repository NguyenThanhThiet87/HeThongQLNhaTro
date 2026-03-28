using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("ThongBao")]
public partial class ThongBao
{
    [Key]
    [Column("MaTB")]
    public int MaTb { get; set; }

    [Column("MaND")]
    public int MaNd { get; set; }

    [StringLength(255)]
    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public bool? DaDoc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [Column("LoaiTB")]
    [StringLength(30)]
    public string? LoaiTb { get; set; }

    public int? MaThucThe { get; set; }

    [ForeignKey("MaNd")]
    [InverseProperty("ThongBaos")]
    public virtual NguoiDung MaNdNavigation { get; set; } = null!;
}
