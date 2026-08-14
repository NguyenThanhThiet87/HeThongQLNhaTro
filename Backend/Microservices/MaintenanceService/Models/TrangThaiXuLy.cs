using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MaintenanceService.Models;

[Table("TrangThaiXuLy")]
[Index("TenTtxuLy", Name = "UQ_TrangThaiXuLy_Ten", IsUnique = true)]
public partial class TrangThaiXuLy
{
    [Key]
    [Column("MaTTXuLy")]
    public int MaTtxuLy { get; set; }

    [Column("TenTTXuLy")]
    [StringLength(50)]
    public string TenTtxuLy { get; set; } = null!;

    [InverseProperty("MaTtxuLyNavigation")]
    public virtual ICollection<BaoCaoSuCo> BaoCaoSuCos { get; set; } = new List<BaoCaoSuCo>();
}
