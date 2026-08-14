using PropertyService.Models;

namespace PropertyService.DTOs
{
    public class DayNhaTroCreateDto
    {

        public int MaChuNt { get; set; }
        public string TenDayNt { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public int SlPhong { get; set; }
        public bool TrangThaiHd { get; set; }
        public IFormFile? AnhBia { get; set; }

        public decimal? KinhDo { get; set; }
        public decimal? ViDo { get; set; }

        public List<PhongCreateDto> DanhSachPhong { get; set; } = new List<PhongCreateDto>();

        public static explicit operator DayNhaTroCreateDto(List<DayNhaTro> v)
        {
            throw new NotImplementedException();
        }
    }
}
