using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IdentityService.Constants;
using IdentityService.DTOs;
using IdentityService.DTOs.ResponseDtos;
using IdentityService.Models;
using IdentityService.Services;
using IdentityService.Data;

namespace IdentityService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NguoiDungController : ControllerBase
{
    private readonly IdentityDbContext _context;
    private readonly JwtTokenService _jwtService;
    private readonly IConfiguration _config;
    private readonly ILogger<NguoiDungController> _logger;
    // IPhotoService should be added later or we use Cloudinary directly here

    public NguoiDungController(
        IdentityDbContext context,
        JwtTokenService jwtService,
        IConfiguration config,
        ILogger<NguoiDungController> logger)
    {
        _context = context;
        _jwtService = jwtService;
        _config = config;
        _logger = logger;
    }

    [HttpPost("register/account")]
    public async Task<IActionResult> RegisterAccount([FromBody] NguoiDung nd)
    {
        if (nd == null || string.IsNullOrEmpty(nd.SoDt))
            return BadRequest("Dữ liệu không hợp lệ");

        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized();

        var idToken = authHeader.Replace("Bearer ", "");
        FirebaseToken decodedToken;
        try
        {
            decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
        }
        catch
        {
            return Unauthorized("Token không hợp lệ");
        }

        if (!decodedToken.Claims.ContainsKey("phone_number"))
            return Unauthorized("Token không chứa số điện thoại");

        var phoneFromFirebase = decodedToken.Claims["phone_number"].ToString();
        if (phoneFromFirebase != nd.SoDt)
            return Unauthorized("Số điện thoại không khớp");

        var existingUser = await _context.NguoiDung.FirstOrDefaultAsync(x => x.SoDt == phoneFromFirebase);
        if (existingUser != null)
            return BadRequest("Tài khoản đã tồn tại");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(nd.MatKhau);

            var user = new NguoiDung
            {
                SoDt = phoneFromFirebase,
                MatKhau = passwordHash,
                HoTen = nd.HoTen,
                MaVaiTro = nd.MaVaiTro,
                NgayTao = DateTime.UtcNow
            };

            _context.NguoiDung.Add(user);
            await _context.SaveChangesAsync();

            // Note: Creation of ChuNhaTro / NhaCungCap / NguoiThueTro records should now be 
            // handled via asynchronous events (RabbitMQ) or synchronous API calls to PropertyService 
            // since those tables no longer exist in Identity_DB. For now, we only create the user.

            await transaction.CommitAsync();
            return Ok(new ApiResponse<int>(true, "Tạo tài khoản thành công", user.MaNd));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(false, ex.Message, null));
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        try
        {
            var user = await _context.NguoiDung.FirstOrDefaultAsync(u => u.SoDt == model.SoDt);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.MatKhau, user.MatKhau))
                return Unauthorized(new ApiResponse<object>(false, "Sai thông tin đăng nhập", null));

            if (user.KichHoat == false)
                return Unauthorized(new ApiResponse<object>(false, "Tài khoản không có quyền truy cập", null));

            var accessToken = _jwtService.GenerateToken(user.MaNd, user.HoTen, user.SoDt, user.MaVaiTro.ToString());
            var refreshTokenString = _jwtService.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                MaNd = user.MaNd,
                Token = refreshTokenString,
                HetHanLuc = DateTime.UtcNow.AddDays(7),
                NgayTao = DateTime.UtcNow
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Đăng nhập thành công", new { accessToken, refreshToken = refreshTokenString }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed while accessing the Identity database.");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ApiResponse<object>(false, "Không thể xử lý đăng nhập. Vui lòng thử lại sau.", null));
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var storedToken = await _context.RefreshTokens.Include(x => x.MaNdNavigation).FirstOrDefaultAsync(x => x.Token == refreshToken);
        if (storedToken == null || storedToken.BiThuHoi == true || storedToken.HetHanLuc < DateTime.UtcNow)
            return Unauthorized("Refresh token không hợp lệ");

        var user = storedToken.MaNdNavigation;
        var newAccessToken = _jwtService.GenerateToken(user.MaNd, user.HoTen, user.SoDt, user.MaVaiTro.ToString());

        return Ok(new { accessToken = newAccessToken });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshToken);
        if (storedToken == null) return NotFound();

        storedToken.BiThuHoi = true;
        await _context.SaveChangesAsync();
        return Ok("Đã logout");
    }

    [HttpGet("nguoi-dung")]
    public async Task<IActionResult> GetNguoiDung([FromQuery] int maNd)
    {
        try
        {
            var nd = await _context.NguoiDung.FirstOrDefaultAsync(n => n.MaNd == maNd);
            return Ok(new ApiResponse<object>(true, "Lấy thông tin người dùng thành công", nd));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }
}
