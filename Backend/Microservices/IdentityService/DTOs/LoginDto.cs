using System.ComponentModel.DataAnnotations;

namespace IdentityService.DTOs
{
    public class LoginDto
    {
        [Required]
        public string SoDt { get; set; }
        [Required]
        public string MatKhau { get; set; }
    }
}
