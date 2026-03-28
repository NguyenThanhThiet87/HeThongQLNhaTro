using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("BaoCaoSuCo")]
public partial class BaoCaoSuCo
{
    [Key]
    public int MaSuCo { get; set; }

    [Column("MaNT")]
    public int MaNt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ThoiGian { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TongPhi { get; set; }

    [Column("MaTTXuLy")]
    public int MaTtxuLy { get; set; }

    [InverseProperty("MaBcscNavigation")]
    public virtual ICollection<ChiTietSuCo> ChiTietSuCos { get; set; } = new List<ChiTietSuCo>();

    [ForeignKey("MaNt")]
    [InverseProperty("BaoCaoSuCos")]
    public virtual NguoiThueTro MaNtNavigation { get; set; } = null!;

    [ForeignKey("MaTtxuLy")]
    [InverseProperty("BaoCaoSuCos")]
    public virtual TrangThaiXuLy MaTtxuLyNavigation { get; set; } = null!;
}
