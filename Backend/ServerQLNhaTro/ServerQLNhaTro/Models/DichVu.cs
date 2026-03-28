using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("DichVu")]
public partial class DichVu
{
    [Key]
    [Column("MaDV")]
    public int MaDv { get; set; }

    [Column("MaNCC")]
    public int MaNcc { get; set; }

    [Column("TenDV")]
    [StringLength(100)]
    public string TenDv { get; set; } = null!;

    [Column("MoTaCT")]
    public string? MoTaCt { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? GiaTien { get; set; }

    [StringLength(20)]
    public string? DonViTinh { get; set; }

    [Column("TTCungCap")]
    [StringLength(255)]
    public string? TtcungCap { get; set; }

    [StringLength(255)]
    public string? HinhAnh { get; set; }

    [InverseProperty("MaDvNavigation")]
    public virtual ICollection<ChiTietDh> ChiTietDhs { get; set; } = new List<ChiTietDh>();

    [ForeignKey("MaNcc")]
    [InverseProperty("DichVus")]
    public virtual NhaCungCap MaNccNavigation { get; set; } = null!;
}
