using MaintenanceService.DTOs.ResponseDtos;
using MaintenanceService.DTOs.ResponseDtos;
namespace MaintenanceService.DTOs
{
    public class BaoCaoSuCoCreateDto
    {
        public int MaNt { get; set; }
        public List<ChiTietSuCoCreateDto> ChiTietSuCos { get; set; }
    }
}
