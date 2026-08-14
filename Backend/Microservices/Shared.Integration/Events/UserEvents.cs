namespace Shared.Integration.Events;

public interface IUserCreatedEvent
{
    int UserId { get; set; }
    string HoTen { get; set; }
    string? Email { get; set; }
    string SoDienThoai { get; set; }
    string? SoCccd { get; set; }
    string? DiaChi { get; set; }
    string? Avatar { get; set; }
    int? GioiTinh { get; set; }
    DateOnly? NgaySinh { get; set; }
}

public interface IUserUpdatedEvent
{
    int UserId { get; set; }
    string HoTen { get; set; }
    string? Email { get; set; }
    string SoDienThoai { get; set; }
    string? SoCccd { get; set; }
    string? DiaChi { get; set; }
    string? Avatar { get; set; }
    int? GioiTinh { get; set; }
    DateOnly? NgaySinh { get; set; }
}
