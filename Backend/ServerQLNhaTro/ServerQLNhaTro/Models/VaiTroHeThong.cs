using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("VaiTroHeThong")]
[Index("TenVaiTro", Name = "UQ__VaiTroHe__1DA558141B5EFA28", IsUnique = true)]
public partial class VaiTroHeThong
{
    [Key]
    public int MaVaiTro { get; set; }

    [StringLength(50)]
    public string TenVaiTro { get; set; } = null!;

    [InverseProperty("MaVaiTroNavigation")]
    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
}
