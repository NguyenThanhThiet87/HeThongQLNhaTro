using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("NguoiThueTro")]
public partial class NguoiThueTro
{
    [Key]
    [Column("MaNT")]
    public int MaNt { get; set; }

    [StringLength(100)]
    public string? NgheNghiep { get; set; }

    [InverseProperty("MaNtNavigation")]
    public virtual ICollection<BaoCaoSuCo> BaoCaoSuCos { get; set; } = new List<BaoCaoSuCo>();

    [InverseProperty("MaNtNavigation")]
    public virtual ICollection<DonHangDv> DonHangDvs { get; set; } = new List<DonHangDv>();

    [InverseProperty("MaNtNavigation")]
    public virtual ICollection<HopDongNguoiThue> HopDongNguoiThues { get; set; } = new List<HopDongNguoiThue>();

    [ForeignKey("MaNt")]
    [InverseProperty("NguoiThueTro")]
    public virtual NguoiDung MaNtNavigation { get; set; } = null!;

    [InverseProperty("MaNtNavigation")]
    public virtual ICollection<NguoiLienHeKhanCap> NguoiLienHeKhanCaps { get; set; } = new List<NguoiLienHeKhanCap>();
}
