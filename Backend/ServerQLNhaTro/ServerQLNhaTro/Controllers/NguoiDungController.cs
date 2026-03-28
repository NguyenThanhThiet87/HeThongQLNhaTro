using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.Constants;
using ServerQLNhaTro.Controllers;
using ServerQLNhaTro.DTOs;
using ServerQLNhaTro.DTOs.ResponseDtos;
using ServerQLNhaTro.Models;
using ServerQLNhaTro.Services;

[Route("api/[controller]")]
[ApiController]
public class NguoiDungController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenService _jwtService;
    private readonly ChatBoxController chatBoxController;
    private readonly IPhotoService _photoService; 
    public NguoiDungController(AppDbContext context, JwtTokenService jwtService, IConfiguration config, IPhotoService photoService  )
    {
        _context = context;
        _jwtService = jwtService;
        chatBoxController = new ChatBoxController(new ServerQLNhaTro.Services.ChatService(config), context);
        _photoService = photoService;
    }

    //--- QUẢN LÝ NGƯỜI DÙNG CHUNG ---
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

        var existingUser = await _context.NguoiDungs
            .FirstOrDefaultAsync(x => x.SoDt == phoneFromFirebase);

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

            _context.NguoiDungs.Add(user);

            await _context.SaveChangesAsync(); // tạo MaNd

            if (user.MaVaiTro == 2)
            {
                var cnt = new ChuNhaTro
                {
                    MaChuNt = user.MaNd
                };

                _context.ChuNhaTros.Add(cnt);
            }
            else if (user.MaVaiTro == 4)
            {
                var ncc = new NhaCungCap
                {
                    MaNcc = user.MaNd
                };

                _context.NhaCungCaps.Add(ncc);
            }

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok(new ApiResponse<int>(true, "Tạo tài khoản thành công", user.MaNd));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();

            return BadRequest(new ApiResponse<object>(true, ex.Message,  null));
        }
    }

    [HttpPut("update-profile/{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] NguoiDungUpdateDto model)
    {
        var user = await _context.NguoiDungs.FindAsync(id);
        if (user == null) return NotFound();

        user.HoTen = model.HoTen;
        user.DiaChi = model.DiaChi;
        if (model.NgaySinh.HasValue)
        {
            user.NgaySinh = DateOnly.FromDateTime(model.NgaySinh.Value);
        }

        // Nếu là người thuê, update thêm bảng con
        var nguoiThue = await _context.NguoiThueTros.FindAsync(id);
        if (nguoiThue != null && model.NguoiThueInfo != null)
        {
            nguoiThue.NgheNghiep = model.NguoiThueInfo.NgheNghiep;
        }

        await _context.SaveChangesAsync();
        return Ok("Cập nhật thành công");
    }

    [HttpGet("list-nguoi-thue")]
    public async Task<IActionResult> GetListNguoiThue()
    {
        var list = await _context.NguoiThueTros
            .Include(nt => nt.MaNtNavigation) // Join với bảng cha NguoiDung
            .Select(nt => new
            {
                nt.MaNt,
                nt.MaNtNavigation.HoTen,
                nt.MaNtNavigation.SoDt,
                nt.NgheNghiep
            }).ToListAsync();
        return Ok(list);
    }

    // --- LIÊN HỆ KHẨN CẤP ---
    [HttpPost("khan-cap")]
    public async Task<IActionResult> AddContact([FromBody] NguoiLienHeKhanCap model)
    {
        _context.NguoiLienHeKhanCaps.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    // --- ĐĂNG NHẬP CHUNG ---
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var user = await _context.NguoiDungs
            .FirstOrDefaultAsync(u => u.SoDt == model.SoDt);


        if (user == null || !BCrypt.Net.BCrypt.Verify(model.MatKhau, user.MatKhau))
        {
            return Unauthorized(
                new ApiResponse<object>(false, "Sai thông tin đăng nhập")
            );
        }

        if (user.KichHoat == false)
            return Unauthorized(
            new ApiResponse<object>(false, "Tài khoản không có quyền truy cập")
        );

        var accessToken = _jwtService.GenerateToken(
            user.MaNd,
            user.HoTen,
            user.SoDt,
            user.MaVaiTro.ToString()
        );

        var refreshTokenString = _jwtService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            MaNd = user.MaNd,
            Token = refreshTokenString,
            HetHanLuc = DateTime.Now.AddDays(7),
            NgayTao = DateTime.Now
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return Ok(
            new ApiResponse<object>(
                true,
                "Đăng nhập thành công",
                new
                {
                    accessToken,
                    refreshToken = refreshTokenString
                }
            )
        );
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .Include(x => x.MaNdNavigation)
            .FirstOrDefaultAsync(x => x.Token == refreshToken);

        if (storedToken == null ||
            storedToken.BiThuHoi == true ||
            storedToken.HetHanLuc < DateTime.Now)
        {
            return Unauthorized("Refresh token không hợp lệ");
        }

        var user = storedToken.MaNdNavigation;

        var newAccessToken = _jwtService.GenerateToken(
            user.MaNd,
            user.HoTen,
            user.SoDt,
            user.MaVaiTro.ToString()
        );

        return Ok(new
        {
            accessToken = newAccessToken
        });
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == refreshToken);

        if (storedToken == null)
            return NotFound();

        storedToken.BiThuHoi = true;

        await _context.SaveChangesAsync();

        return Ok("Đã logout");
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

        // ✅ Lúc này mới cho đổi mật khẩu trong DB
        var user = _context.NguoiDungs.FirstOrDefault(u => u.SoDt == resetPassDto.SoDt);
        if (user == null)
            return NotFound();

        user.MatKhau = BCrypt.Net.BCrypt.HashPassword(resetPassDto.NewPass);
        _context.NguoiDungs.Update(user);
        await _context.SaveChangesAsync();

        return Ok("Đổi mật khẩu thành công");
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePassDto model)
    {
        try
        {
            NguoiDung user = _context.NguoiDungs.FirstOrDefault(nd => nd.MaNd == model.MaNd);

            if (user == null)
                return NotFound();


            if (!BCrypt.Net.BCrypt.Verify(model.OldPass, user.MatKhau))
                return Ok(new ApiResponse<Object>(false, "Mật khẩu hiện tại chưa đúng", null));

            user.MatKhau = BCrypt.Net.BCrypt.HashPassword(model.NewPass);

            _context.NguoiDungs.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<Object>(true, "Đổi mật khẩu thành công", null));
        }catch(Exception ex)
        {
            return BadRequest(new ApiResponse<Object>(false, "Xảy ra lỗi: "+ex.Message, false));
        }
    }

    [HttpPost("is-exist-account")]
    public async Task<IActionResult> IsExistAccount([FromBody] string sdt)
    {
        // Tìm người dùng theo số điện thoại
        var nd = await _context.NguoiDungs
            .FirstOrDefaultAsync(x => x.SoDt == sdt);

        // Nếu không tìm thấy tài khoản
        if (nd == null)
        {
            return Ok(new ApiResponse<object>(
                false,
                "Tài khoản không tồn tại",
                new { isExist = false, isNguoiThue = false, hasValidHopDong = false }
            ));
        }

        // Kiểm tra nếu là người thuê trọ
        bool isNguoiThue = nd.MaVaiTro == VaiTroHeThongConstant.NguoiThue;
        bool hasValidHopDong = false;

        if (isNguoiThue)
        {
            hasValidHopDong = await _context.HopDongNguoiThues
                .AnyAsync(hdnt =>
                    hdnt.MaNt == nd.MaNd &&
                    (
                        hdnt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.DangHieuLuc ||
                        hdnt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.SapHetHan ||
                        hdnt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.ChoXacNhan
                    )
                );
        }

        return Ok(new ApiResponse<object>(
            true,
            "Tài khoản đã tồn tại",
            new
            {
                isExist = true,
                isNguoiThue,
                hasValidHopDong
            }
        ));
    }

    [HttpGet("nguoi-dung")]
    public async Task<IActionResult> getNguoiDung([FromQuery] int maNd)
    {
        try
        {
            NguoiDung nd = _context.NguoiDungs
                             .Where(nd => nd.MaNd == maNd).FirstOrDefault();
            return Ok(new ApiResponse<object>(
                        true,
                        "Lấy thông tin người dùng thành công",
                        nd
                    )
                    );
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Thông tin người đùng xảy ra lỗi: " + ex.Message,
                null
            ));
        }
    }
    [HttpGet("chi-tiet-nguoi-thue")]
    public async Task<IActionResult> getChiTietNguoiThue([FromQuery] int maNd)
    {
        try
        {
            NguoiThueTro nd = _context.NguoiThueTros
                             .Where(nd => nd.MaNt == maNd)
                             .Include(nd => nd.MaNtNavigation).FirstOrDefault();

            HopDongNguoiThue hdnt = _context.HopDongNguoiThues.Where(hdnt => hdnt.MaNt == maNd)
                .Include(hdnt => hdnt.MaHopDongNavigation)
                .ThenInclude(hdnt => hdnt.HopDongNguoiThues)
                .Include(hdnt => hdnt.MaHopDongNavigation)
                .ThenInclude(hd => hd.MaPhongNavigation)
                .ThenInclude(p => p.MaDayNtNavigation)
                .FirstOrDefault();

            NguoiLienHeKhanCap nlh = _context.NguoiLienHeKhanCaps.Where(i => i.MaNt == maNd).FirstOrDefault();

            NguoiThueTroDto nthue = new NguoiThueTroDto
            {
                MaNt = nd.MaNt,
                Avatar = nd.MaNtNavigation.Avatar,
                HoTen = nd.MaNtNavigation.HoTen,
                NgaySinh = nd.MaNtNavigation.NgaySinh,
                DiaChi = nd.MaNtNavigation.DiaChi,
                GioiTinh = nd.MaNtNavigation.GioiTinh,
                SoCccd = nd.MaNtNavigation.SoCccd,
                SoDt = nd.MaNtNavigation.SoDt,
                NgheNghiep = nd.NgheNghiep,
                dayNhaTro = hdnt.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation.TenDayNt,
                NgayVaoO = hdnt.NgayVao,
                MaPhong = hdnt.MaHopDongNavigation.MaPhong,
                SoPhong = hdnt.MaHopDongNavigation.MaPhongNavigation.SoPhong,
                soNguoiO = hdnt.MaHopDongNavigation.HopDongNguoiThues.Count,
                TrangThaiTamTru = hdnt.MaTttamTru == 0 ? false : true,
                HoTenNguoiLienHe = nlh?.HoTen,
                QuanHeNguoiLienHe = nlh?.QuanHe,
                SdtNguoiLienHe = nlh?.SoDt,
                MaHopDong = hdnt?.MaHopDong,
                TrangThaiHopDong = hdnt?.MaHopDongNavigation.MaTthopDong,
                ngayBdhl = hdnt?.MaHopDongNavigation.NgayBdhl,
                ngayKthl = hdnt?.MaHopDongNavigation.NgayKthl,
                tienCoc = hdnt?.MaHopDongNavigation.TienDatCoc,
                VaiTroNguoiThue = hdnt?.MaVaiTro
            };

            return Ok(new ApiResponse<object>(
                        true,
                        "Lấy thông tin người thuê thành công",
                        nthue
                    )
             );
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Thông tin người thuê xảy ra lỗi: " + ex.Message,
                null
            ));
        }
    }

    [HttpGet("chi-tiet-chu-tro")]
    public async Task<IActionResult> getChiTietChuTro([FromQuery] int maNd)
    {
        try
        {
            ChuNhaTro nd = _context.ChuNhaTros
                             .Where(nd => nd.MaChuNt == maNd)
                             .Include(nd => nd.MaChuNtNavigation).FirstOrDefault();

            ChuNhaTroDto nthue = new ChuNhaTroDto
            {
                MaChuNt = nd.MaChuNt,
                Avatar = nd.MaChuNtNavigation.Avatar,
                HoTen = nd.MaChuNtNavigation.HoTen,
                NgaySinh = nd.MaChuNtNavigation.NgaySinh,
                DiaChi = nd.MaChuNtNavigation.DiaChi,
                GioiTinh = nd.MaChuNtNavigation.GioiTinh,
                SoCccd = nd.MaChuNtNavigation.SoCccd,
                SoDt = nd.MaChuNtNavigation.SoDt,
                SoGpkd = nd.SoGpkd,
                SoTk = nd.SoTk,
                TenNh = nd.TenNh
            };

            return Ok(new ApiResponse<object>(
                        true,
                        "Lấy thông tin chủ trọ thành công",
                        nthue
                    )
             );
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Thông tin chủ trọ xảy ra lỗi: " + ex.Message,
                null
            ));
        }
    }

    [HttpGet("chi-tiet-nha-cung-cap")]
    public async Task<IActionResult> getChiTietNhaCungCap([FromQuery] int maNd)
    {
        try
        {
            NhaCungCap nd = _context.NhaCungCaps
                                .Where(n => n.MaNcc == maNd)
                                .Include(n => n.MaNccNavigation)
                                .FirstOrDefault();

            if (nd == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy nhà cung cấp", null));

            NhaCungCapDto ncc = new NhaCungCapDto
            {
                MaNcc = nd.MaNcc,
                Avatar = nd.MaNccNavigation.Avatar,
                HoTen = nd.MaNccNavigation.HoTen,
                SoDt = nd.MaNccNavigation.SoDt,
                DiaChi = nd.MaNccNavigation.DiaChi,
                NgaySinh = nd.MaNccNavigation.NgaySinh,
                GioiTinh = nd.MaNccNavigation.GioiTinh,
                SoCccd = nd.MaNccNavigation.SoCccd,
                MoTaDv = nd.MoTaDv,
                SanSang = nd.SanSang,
                DanhGiaTb = nd.DanhGiaTb,
                KhuVucPv = nd.KhuVucPv
            };

            return Ok(new ApiResponse<object>(
                true,
                "Lấy thông tin nhà cung cấp thành công",
                ncc
            ));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Thông tin nhà cung cấp xảy ra lỗi: " + ex.Message,
                null
            ));
        }
    }


    [HttpPut("cap-nhat-sdt")]
    public async Task<IActionResult> updateSoDienThoai([FromBody] NguoiDungDto model)
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
                return Unauthorized(new ApiResponse<object>(
                   false,
                   "Số điện thoại không khớp",
                   null
               ));
            }

            bool isExist = await _context.NguoiDungs.AnyAsync(nd => nd.SoDt == model.SoDt);
            if (isExist)
            {
                return Ok(new ApiResponse<object>(
                   false,
                   "Số điện thoại đã được sử dụng",
                   null
               ));
            }
            else
            {
                var nguoiDung = _context.NguoiDungs.FirstOrDefault(nd => nd.MaNd == model.MaNd);
                nguoiDung.SoDt = model.SoDt;
                _context.NguoiDungs.Update(nguoiDung);
                await _context.SaveChangesAsync();
                return Ok(new ApiResponse<object>(
                   true,
                   "Cập nhật số điện thoại thành công",
                   null
               ));
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Cập nhật số điện thoại xảy ra lỗi: " + ex.Message,
                null
            ));

        }
    }

    [HttpPut("cap-nhat-nguoi-thue")]
    public async Task<IActionResult> updateNguoiThue([FromForm] NguoiThueTroCreateDto model)
    {
        string imageUrl = null;

        // 2. DÙNG SERVICE ĐỂ UPLOAD ẢNH BÌA DÃY TRỌ
        if (model.Avatar != null && model.Avatar.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.Avatar, "quan-ly-nha-tro/nguoi-dung/nguoi-thue");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        // 3. LƯU DATABASE
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var nguoiDung = await _context.NguoiDungs.FirstOrDefaultAsync(nd => nd.MaNd == model.MaNt);
            if (nguoiDung == null) 
                return BadRequest(new ApiResponse<object>(false, "Không tìm thấy người dùng", null));

            nguoiDung.HoTen = model.HoTen;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.NgaySinh = model.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SoCccd = model.SoCccd;

            if (imageUrl != null)
            {
                if (nguoiDung.Avatar != null)
                {
                    await _photoService.DeletePhotoAsync(nguoiDung.Avatar);
                }
                nguoiDung.Avatar = imageUrl;
            }
            _context.NguoiDungs.Update(nguoiDung);
            await _context.SaveChangesAsync();

            var nguoiThue = await _context.NguoiThueTros
                .Where(nt => nt.MaNt == model.MaNt)
                .Include(nt => nt.NguoiLienHeKhanCaps)
                .FirstOrDefaultAsync();

            if (nguoiThue == null)
                return BadRequest(new ApiResponse<object>(false, "Không tìm thấy thông tin người thuê", null));

            nguoiThue.NgheNghiep = model.NgheNghiep;
            _context.NguoiThueTros.Update(nguoiThue);
            await _context.SaveChangesAsync();

            var nguoiLienHeKhanCap = nguoiThue.NguoiLienHeKhanCaps.FirstOrDefault();
            if (nguoiLienHeKhanCap == null)
            {
                nguoiLienHeKhanCap = new NguoiLienHeKhanCap
                {
                    MaNt = model.MaNt,
                    HoTen = model.HoTenNguoiLienHe,
                    QuanHe = model.QuanHeNguoiLienHe,
                    SoDt = model.SdtNguoiLienHe
                };
                _context.NguoiLienHeKhanCaps.Add(nguoiLienHeKhanCap);
            }
            else
            {
                nguoiLienHeKhanCap.HoTen = model.HoTenNguoiLienHe;
                nguoiLienHeKhanCap.QuanHe = model.QuanHeNguoiLienHe;
                nguoiLienHeKhanCap.SoDt = model.SdtNguoiLienHe;
                _context.NguoiLienHeKhanCaps.Update(nguoiLienHeKhanCap);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new ApiResponse<object>(true, "Cập nhật thông tin thành công", null));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(false, "Lỗi khi cập nhật database: " + ex.Message, null));
        }
    }

    [HttpPut("cap-nhat-chu-tro")]
    public async Task<IActionResult> updateChuTro([FromForm] ChuNhaTroCreateDto model)
    {
        string imageUrl = null;

        // 2. DÙNG SERVICE ĐỂ UPLOAD ẢNH
        if (model.Avatar != null && model.Avatar.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.Avatar, "quan-ly-nha-tro/nguoi-dung/chu-tro");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        // 3. LƯU DATABASE
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var nguoiDung = await _context.NguoiDungs.FirstOrDefaultAsync(nd => nd.MaNd == model.MaChuNt);
            if (nguoiDung == null) return NotFound();

            nguoiDung.HoTen = model.HoTen;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.NgaySinh = model.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SoCccd = model.SoCccd;

            if (imageUrl != null)
            {
                if (nguoiDung.Avatar != null)
                {
                    await _photoService.DeletePhotoAsync(nguoiDung.Avatar);
                }
                nguoiDung.Avatar = imageUrl;
            }
            _context.NguoiDungs.Update(nguoiDung);
            await _context.SaveChangesAsync();

            var chuNhaTro = await _context.ChuNhaTros.FirstOrDefaultAsync(nt => nt.MaChuNt == model.MaChuNt);
            if (chuNhaTro != null)
            {
                chuNhaTro.TenNh = model.TenNh;
                chuNhaTro.SoGpkd = model.SoGpkd;
                chuNhaTro.SoTk = model.SoTk;
                chuNhaTro.DaDkkd = model.DaDkkd;
                _context.ChuNhaTros.Update(chuNhaTro);
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return Ok(new ApiResponse<Object>(true, "Cập nhật thông tin thành công", null));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<Object>(false, ex.Message, null));
        }
    }

    [HttpPut("cap-nhat-nha-cung-cap")]
    public async Task<IActionResult> updateNhaCungCap([FromForm] NhaCungCapCreateDto model)
    {
        string imageUrl = null;

        // 2. DÙNG SERVICE ĐỂ UPLOAD ẢNH
        if (model.Avatar != null && model.Avatar.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.Avatar, "quan-ly-nha-tro/nguoi-dung/nha-cung-cap");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        // 3. LƯU DATABASE
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var nguoiDung = await _context.NguoiDungs.FirstOrDefaultAsync(nd => nd.MaNd == model.MaNcc);
            if (nguoiDung == null) return NotFound();

            nguoiDung.HoTen = model.HoTen;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.NgaySinh = model.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SoCccd = model.SoCccd;

            if (imageUrl != null)
            {
                if (nguoiDung.Avatar != null)
                {
                    await _photoService.DeletePhotoAsync(nguoiDung.Avatar);
                }
                nguoiDung.Avatar = imageUrl;
            }
            _context.NguoiDungs.Update(nguoiDung);
            await _context.SaveChangesAsync();

            var ncc = await _context.NhaCungCaps.FirstOrDefaultAsync(n => n.MaNcc == model.MaNcc);
            if (ncc != null)
            {
                ncc.MoTaDv = model.MoTaDv;
                ncc.SanSang = model.SanSang;
                ncc.KhuVucPv = model.KhuVucPv;
                _context.NhaCungCaps.Update(ncc);
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return Ok(new ApiResponse<Object>(true, "Cập nhật thông tin thành công", null));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<Object>(false, ex.Message, null));
        }
    }
}
