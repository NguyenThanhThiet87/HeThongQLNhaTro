using ServerQLNhaTro.DTOs.ResponseDtos;
using ServerQLNhaTro.DTOs.ResponseDtos;
namespace ServerQLNhaTro.DTOs
{
    public class BaoCaoSuCoCreateDto
    {
        public int MaNt { get; set; }
        public List<ChiTietSuCoCreateDto> ChiTietSuCos { get; set; }
    }
}
