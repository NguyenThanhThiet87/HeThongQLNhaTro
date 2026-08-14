using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Models;

[Table("Phong")]
[Index("MaDayNt", "SoPhong", Name = "UQ_Phong_Day_SoPhong", IsUnique = true)]
public partial class Phong
{
    [Key]
    public int MaPhong { get; set; }

    [Column("MaDayNT")]
    public int MaDayNt { get; set; }

    public int MaLoaiP { get; set; }

    [StringLength(20)]
    public string SoPhong { get; set; } = null!;

    [Column(TypeName = "decimal(18, 0)")]
    public decimal GiaThucTe { get; set; }

    [Column("MaTTPhong")]
    public int? MaTtphong { get; set; }

    [Column("MaTTrPhong")]
    public int? MaTtrPhong { get; set; }

    [InverseProperty("MaPhongNavigation")]
    public virtual ICollection<AnhPhong> AnhPhongs { get; set; } = new List<AnhPhong>();


    [ForeignKey("MaDayNt")]
    [InverseProperty("Phongs")]
    public virtual DayNhaTro MaDayNtNavigation { get; set; } = null!;

    [ForeignKey("MaLoaiP")]
    [InverseProperty("Phongs")]
    public virtual LoaiPhong MaLoaiPNavigation { get; set; } = null!;

    [ForeignKey("MaTtphong")]
    [InverseProperty("Phongs")]
    public virtual TrangThaiPhong? MaTtphongNavigation { get; set; }

    [ForeignKey("MaTtrPhong")]
    [InverseProperty("Phongs")]
    public virtual TinhTrangPhong? MaTtrPhongNavigation { get; set; }

    [InverseProperty("MaPhongNavigation")]
    public virtual ICollection<PhongThietBi> PhongThietBis { get; set; } = new List<PhongThietBi>();
}
