using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IdentityService.Constants;
using IdentityService.DTOs;
using IdentityService.DTOs.ResponseDtos;
using IdentityService.Models;
using IdentityService.Services;
using IdentityService.Data;
using MassTransit;
using Shared.Integration.Events;

namespace IdentityService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NguoiDungController : ControllerBase
{
    private readonly IdentityDbContext _context;
    private readonly JwtTokenService _jwtService;
    private readonly IConfiguration _config;
    private readonly ILogger<NguoiDungController> _logger;
    private readonly IPhotoService _photoService;
    private readonly IPublishEndpoint _publishEndpoint;

    public NguoiDungController(
        IdentityDbContext context,
        JwtTokenService jwtService,
        IConfiguration config,
        ILogger<NguoiDungController> logger,
        IPhotoService photoService,
        IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _jwtService = jwtService;
        _config = config;
        _logger = logger;
        _photoService = photoService;
        _publishEndpoint = publishEndpoint;
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

            await _publishEndpoint.Publish<IUserCreatedEvent>(new
            {
                UserId = user.MaNd,
                HoTen = user.HoTen,
                Email = (string?)null,
                SoDienThoai = user.SoDt,
                SoCccd = user.SoCccd,
                DiaChi = user.DiaChi,
                Avatar = user.Avatar,
                GioiTinh = user.GioiTinh,
                NgaySinh = user.NgaySinh
            });

            return Ok(new ApiResponse<int>(true, "Tạo tài khoản thành công", user.MaNd));
        }
        catch (Exception ex)
        {
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

    [HttpPost("is-exist-account")]
    public async Task<IActionResult> IsExistAccount([FromBody] string sdt)
    {
        var nd = await _context.NguoiDung.FirstOrDefaultAsync(x => x.SoDt == sdt);
        if (nd == null)
        {
            return Ok(new ApiResponse<object>(
                false,
                "Tài khoản không tồn tại",
                new { isExist = false, isNguoiThue = false, hasValidHopDong = false }
            ));
        }

        bool isNguoiThue = nd.MaVaiTro == VaiTroHeThongConstant.NguoiThue;
        return Ok(new ApiResponse<object>(
            true,
            "Tài khoản tồn tại",
            new { isExist = true, isNguoiThue = isNguoiThue, hasValidHopDong = false }
        ));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPassDto resetPassDto)
    {
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

        var phoneFromFirebase = decodedToken.Claims["phone_number"]?.ToString();
        if (phoneFromFirebase != resetPassDto.SoDt)
            return Unauthorized("Số điện thoại không khớp");

        var user = await _context.NguoiDung.FirstOrDefaultAsync(u => u.SoDt == resetPassDto.SoDt);
        if (user == null)
            return NotFound();

        user.MatKhau = BCrypt.Net.BCrypt.HashPassword(resetPassDto.NewPass);
        _context.NguoiDung.Update(user);
        await _context.SaveChangesAsync();

        return Ok("Đổi mật khẩu thành công");
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePassDto model)
    {
        try
        {
            var user = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == model.MaNd);
            if (user == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            if (!BCrypt.Net.BCrypt.Verify(model.OldPass, user.MatKhau))
                return Ok(new ApiResponse<object>(false, "Mật khẩu hiện tại chưa đúng", null));

            user.MatKhau = BCrypt.Net.BCrypt.HashPassword(model.NewPass);
            _context.NguoiDung.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Đổi mật khẩu thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Xảy ra lỗi: " + ex.Message, null));
        }
    }

    [HttpPut("cap-nhat-sdt")]
    public async Task<IActionResult> UpdateSoDienThoai([FromBody] NguoiDungDto model)
    {
        try
        {
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

            var phoneFromFirebase = decodedToken.Claims["phone_number"]?.ToString();
            if (phoneFromFirebase != model.SoDt)
            {
                return Unauthorized(new ApiResponse<object>(false, "Số điện thoại không khớp", null));
            }

            bool isExist = await _context.NguoiDung.AnyAsync(nd => nd.SoDt == model.SoDt && nd.MaNd != model.MaNd);
            if (isExist)
            {
                return Ok(new ApiResponse<object>(false, "Số điện thoại đã được sử dụng", null));
            }

            var nguoiDung = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == model.MaNd);
            if (nguoiDung == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            nguoiDung.SoDt = model.SoDt;
            _context.NguoiDung.Update(nguoiDung);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Cập nhật số điện thoại thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Cập nhật số điện thoại xảy ra lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("nguoi-dung")]
    public async Task<IActionResult> GetNguoiDung([FromQuery] int maNd)
    {
        try
        {
            var nd = await _context.NguoiDung.FirstOrDefaultAsync(n => n.MaNd == maNd);
            if (nd == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));
            return Ok(new ApiResponse<object>(true, "Lấy thông tin người dùng thành công", nd));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("chi-tiet-chu-tro")]
    public async Task<IActionResult> GetChiTietChuTro([FromQuery] int maNd)
    {
        try
        {
            var user = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == maNd);
            if (user == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            var chuTroDto = new ChuNhaTroDto
            {
                MaChuNt = user.MaNd,
                Avatar = user.Avatar,
                HoTen = user.HoTen,
                NgaySinh = user.NgaySinh,
                DiaChi = user.DiaChi,
                GioiTinh = user.GioiTinh,
                SoCccd = user.SoCccd,
                SoDt = user.SoDt
            };

            return Ok(new ApiResponse<object>(true, "Lấy thông tin chủ trọ thành công", chuTroDto));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Thông tin chủ trọ xảy ra lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("chi-tiet-nguoi-thue")]
    public async Task<IActionResult> GetChiTietNguoiThue([FromQuery] int maNd)
    {
        try
        {
            var user = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == maNd);
            if (user == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            var nthueDto = new NguoiThueTroDto
            {
                MaNt = user.MaNd,
                Avatar = user.Avatar,
                HoTen = user.HoTen,
                NgaySinh = user.NgaySinh,
                DiaChi = user.DiaChi,
                GioiTinh = user.GioiTinh,
                SoCccd = user.SoCccd,
                SoDt = user.SoDt
            };

            return Ok(new ApiResponse<object>(true, "Lấy thông tin người thuê thành công", nthueDto));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Thông tin người thuê xảy ra lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("chi-tiet-nha-cung-cap")]
    public async Task<IActionResult> GetChiTietNhaCungCap([FromQuery] int maNd)
    {
        try
        {
            var user = await _context.NguoiDung.FirstOrDefaultAsync(n => n.MaNd == maNd);
            if (user == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy nhà cung cấp", null));

            var nccDto = new NhaCungCapDto
            {
                MaNcc = user.MaNd,
                Avatar = user.Avatar,
                HoTen = user.HoTen,
                SoDt = user.SoDt,
                DiaChi = user.DiaChi,
                NgaySinh = user.NgaySinh,
                GioiTinh = user.GioiTinh,
                SoCccd = user.SoCccd
            };

            return Ok(new ApiResponse<object>(true, "Lấy thông tin nhà cung cấp thành công", nccDto));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Thông tin nhà cung cấp xảy ra lỗi: " + ex.Message, null));
        }
    }

    [HttpPut("cap-nhat-chu-tro")]
    public async Task<IActionResult> UpdateChuTro([FromForm] ChuNhaTroCreateDto model)
    {
        string? imageUrl = null;

        if (model.Avatar != null && model.Avatar.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.Avatar, "quan-ly-nha-tro/nguoi-dung/chu-tro");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        try
        {
            var nguoiDung = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == model.MaChuNt);
            if (nguoiDung == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            nguoiDung.HoTen = model.HoTen ?? nguoiDung.HoTen;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.NgaySinh = Helper.ParseDateOnly(model.NgaySinh) ?? nguoiDung.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SoCccd = model.SoCccd;

            if (imageUrl != null)
            {
                if (!string.IsNullOrEmpty(nguoiDung.Avatar))
                {
                    try { await _photoService.DeletePhotoAsync(nguoiDung.Avatar); } catch { }
                }
                nguoiDung.Avatar = imageUrl;
            }
            _context.NguoiDung.Update(nguoiDung);
            await _context.SaveChangesAsync();

            await _publishEndpoint.Publish<IUserUpdatedEvent>(new
            {
                UserId = nguoiDung.MaNd,
                HoTen = nguoiDung.HoTen,
                Email = (string?)null,
                SoDienThoai = nguoiDung.SoDt,
                SoCccd = nguoiDung.SoCccd,
                DiaChi = nguoiDung.DiaChi,
                Avatar = nguoiDung.Avatar,
                GioiTinh = nguoiDung.GioiTinh,
                NgaySinh = nguoiDung.NgaySinh
            });

            return Ok(new ApiResponse<object>(true, "Cập nhật thông tin thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, ex.Message, null));
        }
    }

    [HttpPut("cap-nhat-nguoi-thue")]
    public async Task<IActionResult> UpdateNguoiThue([FromForm] NguoiThueTroCreateDto model)
    {
        string? imageUrl = null;

        if (model.Avatar != null && model.Avatar.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.Avatar, "quan-ly-nha-tro/nguoi-dung/nguoi-thue");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        try
        {
            var nguoiDung = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == model.MaNt);
            if (nguoiDung == null) 
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            nguoiDung.HoTen = model.HoTen ?? nguoiDung.HoTen;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.NgaySinh = Helper.ParseDateOnly(model.NgaySinh) ?? nguoiDung.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SoCccd = model.SoCccd;

            if (imageUrl != null)
            {
                if (!string.IsNullOrEmpty(nguoiDung.Avatar))
                {
                    try { await _photoService.DeletePhotoAsync(nguoiDung.Avatar); } catch { }
                }
                nguoiDung.Avatar = imageUrl;
            }
            _context.NguoiDung.Update(nguoiDung);
            await _context.SaveChangesAsync();

            await _publishEndpoint.Publish<IUserUpdatedEvent>(new
            {
                UserId = nguoiDung.MaNd,
                HoTen = nguoiDung.HoTen,
                Email = (string?)null,
                SoDienThoai = nguoiDung.SoDt,
                SoCccd = nguoiDung.SoCccd,
                DiaChi = nguoiDung.DiaChi,
                Avatar = nguoiDung.Avatar,
                GioiTinh = nguoiDung.GioiTinh,
                NgaySinh = nguoiDung.NgaySinh
            });

            return Ok(new ApiResponse<object>(true, "Cập nhật thông tin thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi khi cập nhật database: " + ex.Message, null));
        }
    }

    [HttpPut("cap-nhat-nha-cung-cap")]
    public async Task<IActionResult> UpdateNhaCungCap([FromForm] NhaCungCapCreateDto model)
    {
        string? imageUrl = null;

        if (model.Avatar != null && model.Avatar.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.Avatar, "quan-ly-nha-tro/nguoi-dung/nha-cung-cap");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        try
        {
            var nguoiDung = await _context.NguoiDung.FirstOrDefaultAsync(nd => nd.MaNd == model.MaNcc);
            if (nguoiDung == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            nguoiDung.HoTen = model.HoTen ?? nguoiDung.HoTen;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.NgaySinh = Helper.ParseDateOnly(model.NgaySinh) ?? nguoiDung.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SoCccd = model.SoCccd;

            if (imageUrl != null)
            {
                if (!string.IsNullOrEmpty(nguoiDung.Avatar))
                {
                    try { await _photoService.DeletePhotoAsync(nguoiDung.Avatar); } catch { }
                }
                nguoiDung.Avatar = imageUrl;
            }
            _context.NguoiDung.Update(nguoiDung);
            await _context.SaveChangesAsync();

            await _publishEndpoint.Publish<IUserUpdatedEvent>(new
            {
                UserId = nguoiDung.MaNd,
                HoTen = nguoiDung.HoTen,
                Email = (string?)null,
                SoDienThoai = nguoiDung.SoDt,
                SoCccd = nguoiDung.SoCccd,
                DiaChi = nguoiDung.DiaChi,
                Avatar = nguoiDung.Avatar,
                GioiTinh = nguoiDung.GioiTinh,
                NgaySinh = nguoiDung.NgaySinh
            });

            return Ok(new ApiResponse<object>(true, "Cập nhật thông tin thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, ex.Message, null));
        }
    }
}
