using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("TrangThaiHopDong")]
[Index("TenTthopDong", Name = "UQ_TrangThaiHopDong_Ten", IsUnique = true)]
public partial class TrangThaiHopDong
{
    [Key]
    [Column("MaTTHopDong")]
    public int MaTthopDong { get; set; }

    [Column("TenTTHopDong")]
    [StringLength(50)]
    public string TenTthopDong { get; set; } = null!;

    [InverseProperty("MaTthopDongNavigation")]
    public virtual ICollection<HopDongThue> HopDongThues { get; set; } = new List<HopDongThue>();
}
