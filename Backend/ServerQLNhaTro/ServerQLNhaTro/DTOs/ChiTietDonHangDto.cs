using System.ComponentModel.DataAnnotations;

namespace ServerQLNhaTro.DTOs
{
    public class ChiTietDonHangDto
    {
        public int MaDv { get; set; }
        [Range(1, 100)]
        public int SoLuong { get; set; }
    }
}
