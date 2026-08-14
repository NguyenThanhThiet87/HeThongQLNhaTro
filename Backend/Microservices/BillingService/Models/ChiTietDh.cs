using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BillingService.Models;

[Table("ChiTietDH")]
[Index("MaDh", Name = "IX_ChiTietDH_MaDH")]
public partial class ChiTietDh
{
    [Key]
    [Column("PK")]
    public int Pk { get; set; }

    [Column("MaDH")]
    public int MaDh { get; set; }

    [Column("MaDV")]
    public int MaDv { get; set; }

    public int? SoLuong { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? ThanhTien { get; set; }

    [ForeignKey("MaDh")]
    [InverseProperty("ChiTietDhs")]
    public virtual DonHangDv MaDhNavigation { get; set; } = null!;

    [ForeignKey("MaDv")]
    public virtual DichVu MaDvNavigation { get; set; }

}
