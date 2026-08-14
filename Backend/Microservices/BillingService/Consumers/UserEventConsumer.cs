using MassTransit;
using Shared.Integration.Events;
using BillingService.Data;
using BillingService.Models;

namespace BillingService.Consumers;

public class UserEventConsumer : 
    IConsumer<IUserCreatedEvent>,
    IConsumer<IUserUpdatedEvent>
{
    private readonly BillingDbContext _context;

    public UserEventConsumer(BillingDbContext context)
    {
        _context = context;
    }

    public async Task Consume(ConsumeContext<IUserCreatedEvent> context)
    {
        var msg = context.Message;
        
        var user = new NguoiDung
        {
            MaNd = msg.UserId,
            HoTen = msg.HoTen,
            SoDt = msg.SoDienThoai
        };

        _context.NguoiDungs.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task Consume(ConsumeContext<IUserUpdatedEvent> context)
    {
        var msg = context.Message;
        
        var user = await _context.NguoiDungs.FindAsync(msg.UserId);
        if (user != null)
        {
            user.HoTen = msg.HoTen;
            user.SoDt = msg.SoDienThoai;
            await _context.SaveChangesAsync();
        }
    }
}
