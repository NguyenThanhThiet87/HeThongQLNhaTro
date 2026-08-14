using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Models;

[Table("NguoiDung")]
[Index(nameof(SoDt), Name = "UQ__NguoiDun__BC3D04C9FCD6C293", IsUnique = true)]
public partial class NguoiDung
{
    [Key]
    [Column("MaND")]
    public int MaNd { get; set; }

    [StringLength(100)]
    public string HoTen { get; set; } = null!;

    [Column("SoDT")]
    [StringLength(15)]
    public string SoDt { get; set; } = null!;

    [StringLength(255)]
    public string MatKhau { get; set; } = null!;

    [Column("SoCCCD")]
    [StringLength(20)]
    public string? SoCccd { get; set; }

    public DateOnly? NgaySinh { get; set; }

    [StringLength(255)]
    public string? DiaChi { get; set; }

    public bool? KichHoat { get; set; }

    [Column(TypeName = "timestamp without time zone")]
    public DateTime? NgayTao { get; set; }

    [StringLength(255)]
    public string? Avatar { get; set; }

    public int? MaVaiTro { get; set; }

    public int? GioiTinh { get; set; }

    [ForeignKey("MaVaiTro")]
    [InverseProperty("NguoiDungs")]
    public virtual VaiTroHeThong? MaVaiTroNavigation { get; set; }

    [InverseProperty("MaNdNavigation")]
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
