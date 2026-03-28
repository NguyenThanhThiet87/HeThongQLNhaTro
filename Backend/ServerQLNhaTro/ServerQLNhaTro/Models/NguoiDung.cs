using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("NguoiDung")]
[Index("SoDt", Name = "UQ__NguoiDun__BC3D04C9FCD6C293", IsUnique = true)]
public partial class NguoiDung
{
    [Key]
    [Column("MaND")]
    public int MaNd { get; set; }

    [StringLength(100)]
    public string HoTen { get; set; } = null!;

    [Column("SoDT")]
    [StringLength(15)]
    [Unicode(false)]
    public string SoDt { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string MatKhau { get; set; } = null!;

    [Column("SoCCCD")]
    [StringLength(20)]
    [Unicode(false)]
    public string? SoCccd { get; set; }

    public DateOnly? NgaySinh { get; set; }

    [StringLength(255)]
    public string? DiaChi { get; set; }

    public bool? KichHoat { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [StringLength(255)]
    public string? Avatar { get; set; }

    public int? MaVaiTro { get; set; }

    public int? GioiTinh { get; set; }

    [InverseProperty("MaChuNtNavigation")]
    public virtual ChuNhaTro? ChuNhaTro { get; set; }

    [ForeignKey("MaVaiTro")]
    [InverseProperty("NguoiDungs")]
    public virtual VaiTroHeThong? MaVaiTroNavigation { get; set; }

    [InverseProperty("MaNtNavigation")]
    public virtual NguoiThueTro? NguoiThueTro { get; set; }

    [InverseProperty("MaNccNavigation")]
    public virtual NhaCungCap? NhaCungCap { get; set; }

    [InverseProperty("MaNdNavigation")]
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    [InverseProperty("MaNdNavigation")]
    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();
}
