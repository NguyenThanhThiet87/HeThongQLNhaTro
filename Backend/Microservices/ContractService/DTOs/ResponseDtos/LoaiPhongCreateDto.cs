namespace ContractService.DTOs.ResponseDtos;

public class LoaiPhongCreateDto
{
    public int MaLoaiP { get; set; }
    public string TenLoaiP { get; set; } = null!;
    public decimal? GiaChuan { get; set; }
    public int? SnguoiToiDa { get; set; }
    public int? MaChuNt { get; set; }
    public string? MoTa { get; set; }
    public IFormFile? UrlAnh { get; set; }
}
