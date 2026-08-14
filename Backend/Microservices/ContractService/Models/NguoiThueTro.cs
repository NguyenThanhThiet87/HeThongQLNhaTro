using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ContractService.Models;

[Table("NguoiThueTro")]
public partial class NguoiThueTro
{
    [Key]
    [Column("MaNT")]
    public int MaNt { get; set; }

    [StringLength(100)]
    public string? NgheNghiep { get; set; }

    [ForeignKey("MaNt")]
    [InverseProperty("NguoiThueTro")]
    public virtual ContractService.Models.ReadReplicas.UserReadReplica MaNtNavigation { get; set; }

    public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();


    [InverseProperty("MaNtNavigation")]
    public virtual ICollection<NguoiLienHeKhanCap> NguoiLienHeKhanCaps { get; set; } = new List<NguoiLienHeKhanCap>();
}
