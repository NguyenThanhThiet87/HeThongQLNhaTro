using Microsoft.AspNetCore.SignalR;

namespace ServerQLNhaTro.Hubs
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            // Trích xuất userId từ chuỗi truy vấn (query string)
            return connection.GetHttpContext()?.Request.Query["userId"];
        }
    }
}
