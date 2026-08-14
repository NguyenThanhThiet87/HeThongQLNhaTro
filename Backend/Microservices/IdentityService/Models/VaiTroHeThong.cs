using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Models;

[Table("VaiTroHeThong")]
[Index(nameof(TenVaiTro), Name = "UQ__VaiTroHe__B6DF2646272E568F", IsUnique = true)]
public partial class VaiTroHeThong
{
    [Key]
    public int MaVaiTro { get; set; }

    [StringLength(50)]
    public string TenVaiTro { get; set; } = null!;

    [StringLength(255)]
    public string? MoTa { get; set; }

    [InverseProperty("MaVaiTroNavigation")]
    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
}
