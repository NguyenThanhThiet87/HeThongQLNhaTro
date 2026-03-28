using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

[Table("RefreshToken")]
[Index("Token", Name = "IX_RefreshToken_Token", IsUnique = true)]
public partial class RefreshToken
{
    [Key]
    [Column("MaRT")]
    public int MaRt { get; set; }

    [Column("MaND")]
    public int MaNd { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string Token { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime HetHanLuc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    public bool? BiThuHoi { get; set; }

    [ForeignKey("MaNd")]
    [InverseProperty("RefreshTokens")]
    public virtual NguoiDung MaNdNavigation { get; set; } = null!;
}
