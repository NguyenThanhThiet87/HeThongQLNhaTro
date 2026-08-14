namespace ContractService.DTOs.ResponseDtos;

public class ChiSoDienNuocDto
{
    public int MaChiSo { get; set; }
    public int MaPhong { get; set; }
    public int? Thang { get; set; }
    public int? Nam { get; set; }
    public int? CsdienCu { get; set; }
    public int? CsdienMoi { get; set; }
    public int? CsnuocCu { get; set; }
    public int? CsnuocMoi { get; set; }
    public decimal? GiaDien { get; set; }
    public decimal? GiaNuoc { get; set; }

    // Flatten từ Phong
    public string? SoPhong { get; set; }
}
