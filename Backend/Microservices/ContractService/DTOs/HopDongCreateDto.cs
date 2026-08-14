
using System.ComponentModel.DataAnnotations;

using ContractService.DTOs.ResponseDtos;
namespace ContractService.DTOs
{
    public class HopDongCreateDto
    {
        [Required]
        public int MaPhong { get; set; }
        public int MaChuNt { get; set; }
        [Required]
        public DateTime NgayBdhl { get; set; }
        public DateTime? NgayKthl { get; set; } // Null nếu vô thời hạn

        [Range(0, double.MaxValue)]
        public decimal GiaThue { get; set; }
        public decimal TienDatCoc { get; set; }
        public decimal GiaDien { get; set; }
        public decimal GiaNuoc { get; set; }
        public String DonViNuoc { get; set; }
        public String DonViDien { get; set; }

        // Danh sách người ở ghép
        public List<NguoiThueTroDto> DanhSachNguoiThue { get; set; }
}
}
