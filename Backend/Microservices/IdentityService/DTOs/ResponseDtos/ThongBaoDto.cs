namespace IdentityService.DTOs.ResponseDtos;

public class ThongBaoDto
{
    public int MaTb { get; set; }
    public int MaNd { get; set; }
    public string? TieuDe { get; set; }
    public string? NoiDung { get; set; }
    public bool? DaDoc { get; set; }
    public DateTime? NgayTao { get; set; }
}
