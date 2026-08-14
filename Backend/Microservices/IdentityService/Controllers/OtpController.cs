using Microsoft.AspNetCore.Mvc;
using IdentityService.Services;
[ApiController]
[Route("api/otp")]
public class OtpController : ControllerBase
{
    private readonly SpeedSmsService _smsService = new();

    [HttpPost("send")]
    public async Task<IActionResult> SendOtp(string phone)
    {
        var otp = new Random().Next(100000, 999999).ToString();

        var success = await _smsService.SendOtpAsync(phone, otp);

        if (!success)
            return BadRequest("Gui OTP that bai");

        // TODO: lưu OTP vào DB / cache (Redis, MemoryCache...)
        return Ok("Da gui OTP");
    }
}
