using MassTransit;
using Shared.Integration.Commands;
using CommunicationService.Data;
using CommunicationService.Models;

namespace CommunicationService.Consumers;

public class NotificationCommandConsumer : IConsumer<ISendNotificationCommand>
{
    private readonly CommunicationDbContext _context;
    private readonly ILogger<NotificationCommandConsumer> _logger;

    public NotificationCommandConsumer(CommunicationDbContext context, ILogger<NotificationCommandConsumer> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ISendNotificationCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("Processing SendNotificationCommand for User {UserId}: {Title}", command.UserId, command.Title);

        // Here we can actually send Email/SMS using an external service
        // For now, we save it to the ThongBao table so the user sees it in their app
        var tb = new ThongBao
        {
            TieuDe = command.Title,
            NoiDung = command.Message,
            MaNd = command.UserId,
            LoaiTb = command.Type,
            NgayTao = DateTime.Now,
            DaDoc = false
        };

        _context.ThongBaos.Add(tb);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Notification saved successfully.");
    }
}
