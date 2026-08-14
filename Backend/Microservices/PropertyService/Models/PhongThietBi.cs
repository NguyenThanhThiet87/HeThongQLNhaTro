using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Models;

[Table("Phong_ThietBi")]
public partial class PhongThietBi
{
    [Key]
    [Column("MaPhong_ThietBi")]
    public int MaPhongThietBi { get; set; }

    public int MaPhong { get; set; }

    public int MaThBi { get; set; }

    [StringLength(50)]
    public string? TrangThai { get; set; }

    [StringLength(255)]
    public string? MoTa { get; set; }


    [ForeignKey("MaPhong")]
    [InverseProperty("PhongThietBis")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;

    [ForeignKey("MaThBi")]
    [InverseProperty("PhongThietBis")]
    public virtual ThietBi MaThBiNavigation { get; set; } = null!;
}
