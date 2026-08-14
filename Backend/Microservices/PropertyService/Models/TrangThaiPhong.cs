using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Models;

[Table("TrangThaiPhong")]
[Index("TenTtphong", Name = "UQ_TrangThaiPhong_Ten", IsUnique = true)]
public partial class TrangThaiPhong
{
    [Key]
    [Column("MaTTPhong")]
    public int MaTtphong { get; set; }

    [Column("TenTTPhong")]
    [StringLength(50)]
    public string TenTtphong { get; set; } = null!;

    [InverseProperty("MaTtphongNavigation")]
    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
