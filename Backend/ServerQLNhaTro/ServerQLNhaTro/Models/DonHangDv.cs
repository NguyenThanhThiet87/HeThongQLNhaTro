using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("DonHangDV")]
[Index("MaNt", Name = "IX_DonHangDV_MaNT")]
public partial class DonHangDv
{
    [Key]
    [Column("MaDH")]
    public int MaDh { get; set; }

    [Column("MaNT")]
    public int MaNt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayDat { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TongTien { get; set; }

    [Column("TrangThaiDH")]
    [StringLength(50)]
    public string? TrangThaiDh { get; set; }

    [StringLength(255)]
    public string? GhiChu { get; set; }

    public int? MaNcc { get; set; }

    [InverseProperty("MaDhNavigation")]
    public virtual ICollection<ChiTietDh> ChiTietDhs { get; set; } = new List<ChiTietDh>();

    [ForeignKey("MaNcc")]
    [InverseProperty("DonHangDvs")]
    public virtual NhaCungCap? MaNccNavigation { get; set; }

    [ForeignKey("MaNt")]
    [InverseProperty("DonHangDvs")]
    public virtual NguoiThueTro MaNtNavigation { get; set; } = null!;
}
