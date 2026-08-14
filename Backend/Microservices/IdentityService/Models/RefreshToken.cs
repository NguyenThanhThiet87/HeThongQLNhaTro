using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Models;

[Table("RefreshToken")]
[Index(nameof(Token), Name = "UQ__RefreshT__1EB4F817105020F1", IsUnique = true)]
public partial class RefreshToken
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    public int? MaNd { get; set; }

    [StringLength(255)]
    public string Token { get; set; } = null!;

    [Column(TypeName = "timestamp without time zone")]
    public DateTime HetHanLuc { get; set; }

    [Column(TypeName = "timestamp without time zone")]
    public DateTime? NgayTao { get; set; }

    public bool? BiThuHoi { get; set; }

    [ForeignKey("MaNd")]
    [InverseProperty("RefreshTokens")]
    public virtual NguoiDung? MaNdNavigation { get; set; }
}
