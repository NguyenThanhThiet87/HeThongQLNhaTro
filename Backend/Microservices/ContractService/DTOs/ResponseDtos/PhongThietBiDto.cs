namespace ContractService.DTOs.ResponseDtos;

public class PhongThietBiDto
{
    public int MaPhongThietBi { get; set; }
    public int MaPhong { get; set; }
    public int MaThBi { get; set; }
    public string? TrangThai { get; set; }
    public string? MoTa { get; set; }

    // Flatten từ ThietBi
    public string? TenThietBi { get; set; }
    public string? AnhThietBi { get; set; }
}
