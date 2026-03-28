using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.Models;
using ServerQLNhaTro.Models.PayOS;
using ServerQLNhaTro.Services;
namespace ServerQLNhaTro.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayOSController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PayOSService _payOSService;

        public PayOSController(AppDbContext context, PayOSService payOSService)
        {
            _context = context;
            _payOSService = payOSService;
        }
        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest model)
        {
            var hoaDon = _context.HoaDons.FirstOrDefault(hd => hd.MaHoaDon == model.MaHd);
            

            long orderCode = DateTimeOffset.Now.ToUnixTimeMilliseconds();

            var url = await _payOSService.CreatePaymentLink(orderCode, (int)hoaDon.TongTien);

            return Ok(new
            {
                orderCode,
                checkoutUrl = url
            });
        }
    }
}
