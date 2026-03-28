namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class LoaiPhongDto
{
    public int MaLoaiP { get; set; }
    public string TenLoaiP { get; set; } = null!;
    public decimal? GiaChuan { get; set; }
    public int? SnguoiToiDa { get; set; }
    public int? MaChuNt { get; set; }
    public string? MoTa { get; set; }
}
