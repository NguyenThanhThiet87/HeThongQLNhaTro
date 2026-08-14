namespace Shared.Integration.Commands;

public interface ISendNotificationCommand
{
    int UserId { get; set; }
    string Title { get; set; }
    string Message { get; set; }
    string Type { get; set; } // e.g., "Email", "SMS", "InApp"
}
