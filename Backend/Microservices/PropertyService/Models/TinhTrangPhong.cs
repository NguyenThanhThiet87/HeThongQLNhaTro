using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Models;

[Table("TinhTrangPhong")]
[Index("TenTtrPhong", Name = "UQ_TinhTrangPhong_Ten", IsUnique = true)]
public partial class TinhTrangPhong
{
    [Key]
    [Column("MaTTrPhong")]
    public int MaTtrPhong { get; set; }

    [Column("TenTTrPhong")]
    [StringLength(50)]
    public string TenTtrPhong { get; set; } = null!;

    [InverseProperty("MaTtrPhongNavigation")]
    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
