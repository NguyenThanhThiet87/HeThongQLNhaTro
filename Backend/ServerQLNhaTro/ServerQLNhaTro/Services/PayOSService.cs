using PayOS;
using PayOS.Models;
using PayOS.Models.V2.PaymentRequests;

namespace ServerQLNhaTro.Services
{
    public class PayOSService
    {
        private readonly PayOSClient _client;

        public PayOSService(IConfiguration config)
        {
            _client = new PayOSClient(
                config["PayOS:ClientId"],
                config["PayOS:ApiKey"],
                config["PayOS:ChecksumKey"]
            );
        }

        public async Task<string> CreatePaymentLink(long orderCode, int amount)
        {
            var paymentRequest = new CreatePaymentLinkRequest
            {
                OrderCode = orderCode,
                Amount = amount,
                Description = $"hoa don {orderCode}",
                ReturnUrl = "https://yourdomain.com/success",
                CancelUrl = "https://yourdomain.com/cancel"
            };

            var paymentLink = await _client.PaymentRequests.CreateAsync(paymentRequest);

            return paymentLink.CheckoutUrl;
        }
    }
}