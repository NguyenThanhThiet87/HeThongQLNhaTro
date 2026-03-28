using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("AnhPhong")]
public partial class AnhPhong
{
    [Key]
    public int MaAnh { get; set; }

    public int MaPhong { get; set; }

    public string Url { get; set; } = null!;

    [StringLength(255)]
    public string? MoTa { get; set; }

    public int? ThuTu { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [ForeignKey("MaPhong")]
    [InverseProperty("AnhPhongs")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;
}
