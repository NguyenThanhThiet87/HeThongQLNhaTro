namespace IdentityService.DTOs.ResponseDtos
{
    public class ChangePassDto
    {
        public int MaNd { get; set; }
        public string OldPass { get; set; } = null!;
        public string NewPass { get; set; } = null!;

    }
}
