namespace IdentityService.DTOs.ResponseDtos;

public class RefreshTokenDto
{
    public int MaRt { get; set; }
    public int MaNd { get; set; }
    public string Token { get; set; } = null!;
    public DateTime HetHanLuc { get; set; }
    public DateTime? NgayTao { get; set; }
    public bool? BiThuHoi { get; set; }
}
