using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ContractService.Models;

[Table("HopDong_NguoiThue")]
[Index("MaHopDong", Name = "IX_HDNguoiThue_MaHopDong")]
[Index("MaNt", Name = "IX_HDNguoiThue_MaNT")]
[Index("MaHopDong", "MaNt", Name = "UQ_HDNguoiThue", IsUnique = true)]
public partial class HopDongNguoiThue
{
    [Key]
    [Column("PK")]
    public int Pk { get; set; }

    public int MaHopDong { get; set; }

    [Column("MaNT")]
    public int MaNt { get; set; }

    public DateOnly? NgayVao { get; set; }

    public DateOnly? NgayRoi { get; set; }

    public int? MaVaiTro { get; set; }

    [Column("MaTTTamTru")]
    public int? MaTttamTru { get; set; }

    [ForeignKey("MaHopDong")]
    [InverseProperty("HopDongNguoiThues")]
    public virtual HopDongThue MaHopDongNavigation { get; set; } = null!;

    [ForeignKey("MaNt")]
    [InverseProperty("HopDongNguoiThues")]
    public virtual NguoiThueTro MaNtNavigation { get; set; } = null!;

    [ForeignKey("MaTttamTru")]
    [InverseProperty("HopDongNguoiThues")]
    public virtual TrangThaiTamTru? MaTttamTruNavigation { get; set; }

    [ForeignKey("MaVaiTro")]
    [InverseProperty("HopDongNguoiThues")]
    public virtual VaiTroNguoiThue? MaVaiTroNavigation { get; set; }
}
