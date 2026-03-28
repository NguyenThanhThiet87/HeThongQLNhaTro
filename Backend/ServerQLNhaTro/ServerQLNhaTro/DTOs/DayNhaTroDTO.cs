using ServerQLNhaTro.DTOs.ResponseDtos;

namespace ServerQLNhaTro.DTOs
{
    public class DayNhaTroDTO
    {
            public int MaDayNt { get; set; }
            public string TenDayNt { get; set; } = null!;
            public string? DiaChi { get; set; }
            public int? Slphong { get; set; }
            public bool? TrangThaiNt { get; set; }
            public int? MaChuNt { get; set; }
            public string? UrlAnh { get; set; }

            public ChuNhaTroDto? ChuNhaTro { get; set; }

            public List<PhongDto> Phongs { get; set; } = new();
    }
}
