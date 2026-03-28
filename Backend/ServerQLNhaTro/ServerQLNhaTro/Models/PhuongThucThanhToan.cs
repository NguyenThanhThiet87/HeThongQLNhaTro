using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("PhuongThucThanhToan")]
public partial class PhuongThucThanhToan
{
    [Key]
    [Column("MaPTTT")]
    public int MaPttt { get; set; }

    [Column("TenPTTT")]
    [StringLength(100)]
    public string TenPttt { get; set; } = null!;

    [InverseProperty("MaPtttNavigation")]
    public virtual ICollection<LichSuThanhToan> LichSuThanhToans { get; set; } = new List<LichSuThanhToan>();
}
