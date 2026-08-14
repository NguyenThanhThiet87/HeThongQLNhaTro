using MassTransit;
using Shared.Integration.Events;
using PropertyService.Data;

namespace PropertyService.Consumers;

public class ContractCreatedConsumer : IConsumer<IContractCreatedEvent>
{
    private readonly PropertyDbContext _context;
    private readonly ILogger<ContractCreatedConsumer> _logger;

    public ContractCreatedConsumer(PropertyDbContext context, ILogger<ContractCreatedConsumer> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<IContractCreatedEvent> context)
    {
        var msg = context.Message;
        _logger.LogInformation("Received ContractCreatedEvent for RoomId: {RoomId}", msg.RoomId);

        var room = await _context.Phongs.FindAsync(msg.RoomId);
        if (room != null)
        {
            room.MaTtphong = 2; // 2 = Đang Thuê
            await _context.SaveChangesAsync();
            _logger.LogInformation("RoomId: {RoomId} status updated to Đã Thuê", msg.RoomId);
        }
    }
}
