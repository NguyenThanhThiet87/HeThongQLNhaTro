using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ContractService.Models;

[Table("TrangThaiTamTru")]
[Index("TenTttamTru", Name = "UQ_TrangThaiTamTru_Ten", IsUnique = true)]
public partial class TrangThaiTamTru
{
    [Key]
    [Column("MaTTTamTru")]
    public int MaTttamTru { get; set; }

    [Column("TenTTTamTru")]
    [StringLength(50)]
    public string TenTttamTru { get; set; } = null!;

    [InverseProperty("MaTttamTruNavigation")]
    public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();
}
