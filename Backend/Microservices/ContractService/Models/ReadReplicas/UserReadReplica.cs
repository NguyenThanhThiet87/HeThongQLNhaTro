using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractService.Models.ReadReplicas
{
    [Table("NguoiDungs")]
    public class UserReadReplica
    {
        [Key]
        [Column("MaND")]
        public int MaNd { get; set; }

        [StringLength(100)]
        public string HoTen { get; set; } = string.Empty;

        [Column("SoDT")]
        [StringLength(15)]
        public string SoDt { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Avatar { get; set; }

        // Mối quan hệ với NguoiThueTro
        public NguoiThueTro NguoiThueTro { get; set; }
    }
}
