using System.ComponentModel.DataAnnotations;

namespace ServerQLNhaTro.DTOs
{
    public class LoginDto
    {
        [Required]
        public string SoDt { get; set; }
        [Required]
        public string MatKhau { get; set; }
    }
}
