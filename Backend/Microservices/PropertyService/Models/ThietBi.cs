using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Models;

[Table("ThietBi")]
[Index("TenThBi", Name = "UQ_ThietBi_Ten", IsUnique = true)]
public partial class ThietBi
{
    [Key]
    public int MaThBi { get; set; }

    [StringLength(100)]
    public string TenThBi { get; set; } = null!;

    public string? AnhThBi { get; set; }

    [InverseProperty("MaThBiNavigation")]
    public virtual ICollection<PhongThietBi> PhongThietBis { get; set; } = new List<PhongThietBi>();
}
