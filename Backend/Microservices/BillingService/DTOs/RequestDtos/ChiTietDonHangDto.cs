using System.ComponentModel.DataAnnotations;

namespace BillingService.DTOs
{
    public class ChiTietDonHangDto
    {
        public int MaDv { get; set; }
        [Range(1, 100)]
        public int SoLuong { get; set; }
    }
}
