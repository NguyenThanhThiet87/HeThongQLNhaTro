using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("NguoiLienHeKhanCap")]
public partial class NguoiLienHeKhanCap
{
    [Key]
    [Column("MaNLH")]
    public int MaNlh { get; set; }

    [Column("MaNT")]
    public int MaNt { get; set; }

    [StringLength(100)]
    public string? HoTen { get; set; }

    [StringLength(50)]
    public string? QuanHe { get; set; }

    [Column("SoDT")]
    [StringLength(15)]
    [Unicode(false)]
    public string? SoDt { get; set; }

    [ForeignKey("MaNt")]
    [InverseProperty("NguoiLienHeKhanCaps")]
    public virtual NguoiThueTro MaNtNavigation { get; set; } = null!;
}
