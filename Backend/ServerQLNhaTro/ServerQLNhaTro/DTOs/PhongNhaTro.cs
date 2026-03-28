using System.ComponentModel.DataAnnotations;

namespace ServerQLNhaTro.DTOs.PhongNhaTro
{
    // DTO tạo mới phòng
    public class PhongNhaTro
    {
        [Required]
        public int MaDayNt { get; set; }
        [Required]
        public int MaLoaiP { get; set; }
        [Required]
        public string SoPhong { get; set; } = null!;
        [Range(0, double.MaxValue)]
        public decimal GiaThucTe { get; set; }
        public int? MaTtphong { get; set; } // Trống, Đang thuê...
        public int? MaTtrPhong { get; set; } // Sạch, Bẩn...

        // Danh sách ảnh (URL)
        //public List<string>? AnhPhongs { get; set; }

        // Danh sách thiết bị có sẵn
        public List<PhongThietBiCreateDto>? ThietBis { get; set; }
    }
}