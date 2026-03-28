using System.ComponentModel.DataAnnotations;

namespace ServerQLNhaTro.DTOs
{
    public class NguoiThueCreateDto
    {
        [Required]
        public string HoTen { get; set; } = null!;
        [Required]
        [Phone]
        public string SoDt { get; set; } = null!;
        [Required]
        [MinLength(6)]
        public string MatKhau { get; set; } = null!;
        public string? SoCccd { get; set; }
        public string? NgheNghiep { get; set; }
        public string? BienSoXe { get; set; }
    }
}
