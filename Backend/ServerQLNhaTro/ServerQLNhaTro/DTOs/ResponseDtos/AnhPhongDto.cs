namespace ServerQLNhaTro.DTOs.ResponseDtos;

public class AnhPhongDto
{
    public int MaAnh { get; set; }
    public int MaPhong { get; set; }
    public string Url { get; set; } = null!;
    public string? MoTa { get; set; }
    public int? ThuTu { get; set; }
    public DateTime? NgayTao { get; set; }
}
