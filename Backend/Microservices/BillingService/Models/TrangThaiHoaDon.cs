using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BillingService.Models;

[Table("TrangThaiHoaDon")]
[Index("TenTthoaDon", Name = "UQ_TrangThaiHoaDon_Ten", IsUnique = true)]
public partial class TrangThaiHoaDon
{
    [Key]
    [Column("MaTTHoaDon")]
    public int MaTthoaDon { get; set; }

    [Column("TenTTHoaDon")]
    [StringLength(50)]
    public string TenTthoaDon { get; set; } = null!;

    [InverseProperty("MaTthoaDonNavigation")]
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();
}
