using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CommunicationService.Models
{
    public class NguoiDung
    {
        [Key]
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();
    }
}
