using Microsoft.AspNetCore.SignalR;

namespace MaintenanceService.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public async Task SendInvoiceNotification(string userId, object invoiceInfo)
        {
            await Clients.User(userId).SendAsync("ReceiveInvoiceNotification", invoiceInfo);
        }
    }
}
