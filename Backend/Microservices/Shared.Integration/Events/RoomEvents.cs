namespace Shared.Integration.Events;

public interface IRoomStatusChangedEvent
{
    int RoomId { get; set; }
    string OldStatus { get; set; } // "Trống", "Đã Thuê", "Bảo Trì"
    string NewStatus { get; set; }
}
