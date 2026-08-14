using Microsoft.AspNetCore.Mvc;
using BillingService.Models;
using BillingService.Services.VNPay;
using BillingService.Models.VnPay;
using Microsoft.EntityFrameworkCore;
using BillingService.Data;
using BillingService.Constants;
using Microsoft.AspNetCore.SignalR;
using BillingService.Hubs;

namespace BillingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VnPayController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly BillingDbContext _contextDB;
        private readonly IHubContext<ChatHub> _hubContext;
        public VnPayController(IVnPayService vnPayService, BillingDbContext contextDB, IHubContext<ChatHub> hubContext)
        {
            _vnPayService = vnPayService;
            _contextDB = contextDB;
            _hubContext = hubContext;
        }

        [HttpPost("create-payment-url")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {
            try
            {
                var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
                return Ok(new { paymentUrl = url });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Xảy ra lỗi: {ex.Message}" });
            }
        }

        [HttpGet("payment-callback")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            try
            {
                PaymentResponseModel response = _vnPayService.PaymentExecute(Request.Query);
                string rawOrderId = response.OrderId?.Split('_')[0] ?? "0";
                int orderId = int.Parse(rawOrderId);
                var hoaDon = await _contextDB.HoaDons
                    .Where(hd => hd.MaHoaDon == orderId)
                    .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.MaPhongNavigation)
                    .FirstOrDefaultAsync();

                if (hoaDon != null && response.VnPayResponseCode == "00")
                {
                    // Cập nhật trạng thái hóa đơn
                    hoaDon.MaTthoaDon = TrangThaiHoaDonConstant.DaThanhToan; // Đã thanh toán
                    
                    _contextDB.HoaDons.Update(hoaDon);

                    // Thêm lịch sử thanh toán
                    var lichSu = new LichSuThanhToan
                    {
                        MaGiaoDich = response.TransactionId,
                        MaHoaDon = hoaDon.MaHoaDon,
                        SoTien = (decimal)hoaDon.TongTien,
                        MaPttt = PhuongThucThanhToanConstant.VnPay, // VNPay
                        NgayThanhToan = DateTime.Now,
                        GhiChu = response.OrderDescription
                    };

                    await _contextDB.LichSuThanhToans.AddAsync(lichSu);
                    await _contextDB.SaveChangesAsync();

                    var thongBao = new ThongBao
                    {
                        MaNd = (int)hoaDon.MaHopDongNavigation.MaChuNt, // mã chủ nhà trọ
                        NoiDung = $"Hóa đơn phòng {hoaDon.MaHopDongNavigation.MaPhong} đã được thanh toán!",
                        NgayTao = DateTime.Now,
                        TieuDe = "Tiền đã về! 💰",
                        DaDoc = false,
                        MaThucThe = lichSu.MaLstt,
                        LoaiTb = "HoaDon"
                    };
                    _contextDB.ThongBaos.Add(thongBao);
                    await _contextDB.SaveChangesAsync();

                    await _hubContext.Clients.User(hoaDon.MaHopDongNavigation.MaChuNt.ToString())
                    .SendAsync("ReceivePaymentNotification", new
                    {
                        message = $"Hóa đơn phòng đã được thanh toán!",
                        hoaDonId = hoaDon.MaHoaDon,
                        tongTien = hoaDon.TongTien,
                        ngayThanhToan = hoaDon.NgayLap
                    });

                    return Ok(new { success = true, message = "Thanh toán thành công", vnp_ResponseCode = response.VnPayResponseCode, transactionId = response.TransactionId });
                }
                else
                {
                    string message = response.VnPayResponseCode switch
                    {
                        "09" => "Thẻ/Tài khoản chưa đăng ký InternetBanking.",
                        "10" => "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.",
                        "11" => "Đã hết hạn chờ thanh toán.",
                        "12" => "Thẻ/Tài khoản bị khóa.",
                        "13" => "Sai mật khẩu xác thực giao dịch (OTP).",
                        "24" => "Khách hàng hủy giao dịch.",
                        "51" => "Tài khoản không đủ số dư.",
                        "65" => "Vượt quá hạn mức giao dịch trong ngày.",
                        "75" => "Ngân hàng thanh toán đang bảo trì.",
                        "79" => "Sai mật khẩu thanh toán quá số lần quy định.",
                        _ => "Các lỗi khác."
                    };
                    return BadRequest(new { success = false, message, vnp_ResponseCode = response.VnPayResponseCode });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Xảy ra lỗi: {ex.Message}" });
            }
        }
    }
}
