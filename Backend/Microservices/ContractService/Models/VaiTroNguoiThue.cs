using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ContractService.Models;

[Table("VaiTroNguoiThue")]
[Index("TenVaiTro", Name = "UQ_VaiTroNguoiThue_Ten", IsUnique = true)]
public partial class VaiTroNguoiThue
{
    [Key]
    public int MaVaiTro { get; set; }

    [StringLength(50)]
    public string TenVaiTro { get; set; } = null!;

    [InverseProperty("MaVaiTroNavigation")]
    public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();
}
