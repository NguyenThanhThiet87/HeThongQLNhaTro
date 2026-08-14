namespace IdentityService.DTOs
{
    public class NguoiDungUpdateDto
    {
        public string HoTen { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }

        // Object con để update thông tin riêng
        public NguoiThueInfoUpdateDto? NguoiThueInfo { get; set; }
    }
}
