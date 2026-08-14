using MassTransit;
using Shared.Integration.Events;
using ContractService.Data;
using ContractService.Models.ReadReplicas;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ContractService.Consumers
{
    public class UserEventConsumer : IConsumer<IUserCreatedEvent>
    {
        private readonly ContractDbContext _context;
        private readonly ILogger<UserEventConsumer> _logger;

        public UserEventConsumer(ContractDbContext context, ILogger<UserEventConsumer> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<IUserCreatedEvent> context)
        {
            var message = context.Message;
            _logger.LogInformation("Received UserCreatedEvent for UserId: {UserId}", message.UserId);

            var existingUser = await _context.NguoiDungs.FindAsync(message.UserId);
            if (existingUser == null)
            {
                var newUser = new UserReadReplica
                {
                    MaNd = message.UserId,
                    HoTen = message.HoTen,
                    SoDt = message.SoDienThoai,
                    Avatar = message.Avatar
                };
                _context.NguoiDungs.Add(newUser);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Successfully inserted Read Replica for UserId: {UserId}", message.UserId);
            }
        }
    }
}
