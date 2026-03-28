using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.DTOs;
using ServerQLNhaTro.Models;
using ServerQLNhaTro.Services;
using ServerQLNhaTro.DTOs.ResponseDtos;
using Microsoft.AspNetCore.SignalR;
using ServerQLNhaTro.Constants;
using ServerQLNhaTro.Hubs;

[Route("api/[controller]")]
[ApiController]
public class SuCoBaoTriController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPhotoService _photoService;
    private readonly IHubContext<ChatHub> _hubContext;

    public SuCoBaoTriController(AppDbContext context, IPhotoService photoService, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _photoService = photoService;
        _hubContext = hubContext;
    }

    // Người thuê báo cáo
    [HttpPost("gui-bao-cao")]
    public async Task<IActionResult> ReportSuCo([FromForm] BaoCaoSuCoCreateDto model)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Tạo đơn báo cáo chính
            var bc = new BaoCaoSuCo
            {
                MaNt = model.MaNt, // Mã người thuê
                MaTtxuLy = 1, // Mới tiếp nhận
                ThoiGian = DateTime.Now
            };
            _context.BaoCaoSuCos.Add(bc);
            await _context.SaveChangesAsync();

            // 2. Duyệt qua từng thiết bị bị hư hỏng trong danh sách
            foreach (var item in model.ChiTietSuCos)
            {
                string imageUrl = "";
                if (item.MinhChung != null)
                {
                    var uploadResult = await _photoService.AddPhotoAsync(item.MinhChung, "quan-ly-nha-tro/bao-cao-su-co/minh-chung");
                    if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                    imageUrl = uploadResult.SecureUrl?.ToString();
                }

                var chiTiet = new ChiTietSuCo
                {
                    MaBcsc = bc.MaSuCo,
                    MoTaSuCo = item.MoTaSuCo,
                    MinhChung = imageUrl,
                    MaPhongThietBi = item.MaPhongThietBi
                };
                _context.ChiTietSuCos.Add(chiTiet);
            }
            await _context.SaveChangesAsync();

            // 3. Lấy thông tin hợp đồng để tìm mã chủ nhà
            var hdnt = await _context.HopDongNguoiThues
                .Include(x => x.MaHopDongNavigation)
                .Include(x => x.MaNtNavigation)
                .ThenInclude(x => x.MaNtNavigation)
                .FirstOrDefaultAsync(x => x.MaNt == model.MaNt && x.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.DangHieuLuc);

            if (hdnt != null)
            {
                var maChuNt = hdnt.MaHopDongNavigation.MaChuNt;
                var tenNguoiThue = hdnt.MaNtNavigation.MaNtNavigation.HoTen;

                // 4. Lưu thông báo vào CSDL
                var thongBao = new ThongBao
                {
                    MaNd = (int)maChuNt,
                    TieuDe = "Báo cáo sự cố mới",
                    NoiDung = $"{tenNguoiThue} đã báo cáo sự cố: {model.ChiTietSuCos.FirstOrDefault()?.MoTaSuCo}",
                    NgayTao = DateTime.Now,
                    DaDoc = false,
                    MaThucThe = bc.MaSuCo,
                    LoaiTb = "SuCo"
                };
                _context.ThongBaos.Add(thongBao);
                await _context.SaveChangesAsync();

                // 5. Gửi thông báo Real-time qua SignalR
                // Lưu ý: Sử dụng phương thức chung "ReceiveNotification" để chủ nhà nhận được mọi loại thông báo
                await _hubContext.Clients.User(maChuNt.ToString()).SendAsync("ReceiveNotification", new
                {
                    title = thongBao.TieuDe,
                    message = thongBao.NoiDung,
                    type = "INCIDENT", // Phân loại để Client có thể xử lý điều hướng nếu cần
                    createdAt = thongBao.NgayTao,
                    maSuCo = bc.MaSuCo
                });
            }

            await transaction.CommitAsync();
            return Ok(new { success = true, message = "Đã gửi báo cáo thành công" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
        }
    }



    // Chủ nhà cập nhật trạng thái
    [HttpPut("cap-nhat-trang-thai/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, int maTtXuLy)
    {
        var sc = await _context.BaoCaoSuCos.FindAsync(id);
        if (sc == null) return NotFound();
        sc.MaTtxuLy = maTtXuLy;
        await _context.SaveChangesAsync();
        return Ok();
    }

    // Lịch sử bảo trì
    [HttpGet("lich-su-bao-tri")]
    public async Task<IActionResult> GetMaintenanceHistory(int maPhong)
    {
        var data = await _context.LichSuBaoTris
            .Where(x => x.MaPhong == maPhong)
            .OrderByDescending(x => x.NgayBd)
            .ToListAsync();
        return Ok(data);
    }

    //THIẾT BỊ
    [HttpGet("thiet-bi")]
    public async Task<IActionResult> GetThietBi()
    {
        var data = await _context.ThietBis
            .ToListAsync();
        return Ok(new ApiResponse<Object>(true, "Lấy danh sách thiết bị thành công", data));
    }

    [HttpGet("thiet-bi-phong")]
    public async Task<IActionResult> GetThietBiPhong([FromQuery] int maPhong)
    {
        var data = await _context.PhongThietBis.Where(ptb => ptb.MaPhong == maPhong).Include(ptb => ptb.MaThBiNavigation)
            .ToListAsync();

        List<PhongThietBiDto> lstPtb = data.Select(item => new PhongThietBiDto
        {
            MaPhongThietBi = item.MaPhongThietBi,
            MaPhong = item.MaPhong,
            MaThBi = item.MaThBi,
            TenThietBi = item.MaThBiNavigation.TenThBi,
            AnhThietBi = item.MaThBiNavigation.AnhThBi
        }).ToList();

        return Ok(new ApiResponse<Object>(true, "Lấy danh sách thiết bị trong phòng thành công", lstPtb));
    }

    [HttpPost("gan-thiet-bi")]
    public async Task<IActionResult> GanThietBiPhong([FromQuery] int maPhong, [FromBody] List<int> lstThietBi)
    {
        try
        {
            // 1. Lấy danh sách thiết bị hiện tại của phòng
            var currentDevices = await _context.PhongThietBis
                .Where(ptb => ptb.MaPhong == maPhong)
                .ToListAsync();

            // 2. Xác định những thiết bị cần xóa (Trong DB có nhưng gửi lên không có)
            var toRemove = currentDevices.Where(x => !lstThietBi.Contains(x.MaThBi)).ToList();

            // 3. Xác định những mã thiết bị cần thêm mới (Gửi lên có nhưng trong DB chưa có)
            var currentMaThBis = currentDevices.Select(x => x.MaThBi).ToList();
            var toAddIds = lstThietBi.Where(x => !currentMaThBis.Contains(x)).ToList();

            // THỰC HIỆN XÓA
            if (toRemove.Any())
            {
                _context.PhongThietBis.RemoveRange(toRemove);
            }

            // THỰC HIỆN THÊM MỚI
            foreach (var maThBi in toAddIds)
            {
                _context.PhongThietBis.Add(new PhongThietBi
                {
                    MaPhong = maPhong,
                    MaThBi = maThBi,
                    TrangThai = "Tốt",
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<string>(true, "Cập nhật thiết bị phòng thành công!", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpPost("gan-thiet-bi-phong-all")]
    public async Task<IActionResult> GanThietBiPhongAll([FromQuery] int maDayNt, [FromBody] List<int> lstThietBi)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Lấy tất cả mã phòng thuộc dãy trọ này
            var roomIds = await _context.Phongs
                .Where(p => p.MaDayNt == maDayNt)
                .Select(p => p.MaPhong)
                .ToListAsync();

            if (!roomIds.Any())
            {
                return BadRequest(new ApiResponse<string>(false, "Dãy trọ này hiện không có phòng nào!", null));
            }

            // 2. Lấy toàn bộ bản ghi thiết bị hiện có của các phòng trong dãy này
            var allCurrentDevices = await _context.PhongThietBis
                .Where(ptb => roomIds.Contains(ptb.MaPhong))
                .ToListAsync();

            // 3. Xử lý cho từng phòng
            foreach (var maPhong in roomIds)
            {
                // Thiết bị hiện tại của riêng phòng này
                var roomDevices = allCurrentDevices.Where(x => x.MaPhong == maPhong).ToList();
                var roomMaThBis = roomDevices.Select(x => x.MaThBi).ToList();

                // A. Xác định những thiết bị cần XÓA của phòng này
                // (Trong DB phòng này đang có cái MaThBi mà lstThietBi gửi lên không có)
                var toRemove = roomDevices.Where(x => !lstThietBi.Contains(x.MaThBi)).ToList();
                if (toRemove.Any())
                {
                    _context.PhongThietBis.RemoveRange(toRemove);
                }

                // B. Xác định những thiết bị cần THÊM MỚI cho phòng này
                // (lstThietBi gửi lên có nhưng DB phòng này chưa có)
                var toAddIds = lstThietBi.Where(x => !roomMaThBis.Contains(x)).ToList();
                foreach (var maThBi in toAddIds)
                {
                    _context.PhongThietBis.Add(new PhongThietBi
                    {
                        MaPhong = maPhong,
                        MaThBi = maThBi,
                        TrangThai = "Tốt",
                    });
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new ApiResponse<string>(true, $"Đã cập nhật thiết bị thành công cho {roomIds.Count} phòng thuộc dãy trọ!", null));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<string>(false, "Lỗi xử lý: " + ex.Message, null));
        }
    }

    //THIẾT BỊ
    [HttpGet("lich-su-bao-cao")]
    public async Task<IActionResult> GetLichSuBaoCaoSuCo([FromQuery] int maNt)
    {
        var data = await _context.BaoCaoSuCos.Where(bcsc => bcsc.MaNt == maNt)
            .Include(bcsc => bcsc.ChiTietSuCos)
            .ToListAsync();

        List<BaoCaoSuCoDto> lstBaoCao = data.OrderByDescending(item => item.ThoiGian).Select((item) => new BaoCaoSuCoDto
        {
            MaSuCo = item.MaSuCo,
            MaNt = item.MaNt,
            ThoiGian = item.ThoiGian,
            TenTrangThaiXuLy = item.MaTtxuLy == 1 ? "Đã tiếp nhận" : "Hoàn thành",
            ChiTietSuCos = item.ChiTietSuCos.Select((i) => new ServerQLNhaTro.DTOs.ResponseDtos.ChiTietSuCoDto
            {
                MaPhongThietBi = i.MaPhongThietBi,
                MoTaSuCo = i.MoTaSuCo
            }).ToList()

        }).ToList();

        return Ok(new ApiResponse<Object>(true, "Lấy danh sách thiết bị thành công", lstBaoCao));
    }

    [HttpGet("chi-tiet-bao-cao")]
    public async Task<IActionResult> GetChiTietSuCo([FromQuery] int maSuCo)
    {
        try
        {
            // Sử dụng Include và ThenInclude để đi sâu vào các quan hệ lồng nhau
            var data = await _context.BaoCaoSuCos
                .Include(sc => sc.MaNtNavigation) // Vào bảng NguoiThue
                    .ThenInclude(nt => nt.MaNtNavigation) // Vào bảng NguoiDung (để lấy HoTen, Sdt)
                .Include(sc => sc.MaNtNavigation)
                    .ThenInclude(nt => nt.HopDongNguoiThues) // Vào danh sách Hợp đồng của người thuê
                        .ThenInclude(hdnt => hdnt.MaHopDongNavigation) // Vào thông tin Hợp đồng
                            .ThenInclude(hd => hd.MaPhongNavigation) // Vào thông tin Phòng
                                .ThenInclude(p => p.MaDayNtNavigation) // Vào thông tin Dãy nhà trọ
                .Include(sc => sc.MaTtxuLyNavigation) // Lấy trạng thái xử lý
                .Include(sc => sc.ChiTietSuCos) // Lấy danh sách sự cố chi tiết
                    .ThenInclude(ct => ct.MaPhongThietBiNavigation) // Vào bảng Phòng-Thiết bị
                        .ThenInclude(ptb => ptb.MaThBiNavigation) // Lấy thông tin Thiết bị gốc
                .FirstOrDefaultAsync(sc => sc.MaSuCo == maSuCo);

            if (data == null)
            {
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy báo cáo sự cố", null));
            }

            // Lấy thông tin hợp đồng đầu tiên để lấy số phòng/tên dãy
            var hopDongDauTien = data.MaNtNavigation?.HopDongNguoiThues.FirstOrDefault()?.MaHopDongNavigation;
            var phong = hopDongDauTien?.MaPhongNavigation;

            // Map sang dữ liệu trả về
            var result = new
            {
                MaSuCo = data.MaSuCo,
                HoTenNt = data.MaNtNavigation?.MaNtNavigation?.HoTen ?? "N/A",
                TenPhong = phong?.SoPhong ?? "P.---",
                TenDayNt = phong?.MaDayNtNavigation?.TenDayNt ?? "Dãy ---",
                SdtNt = data.MaNtNavigation?.MaNtNavigation?.SoDt ?? "N/A", // Kiểm tra lại SoDt hay Sdt
                ThoiGian = data.ThoiGian,
                MaTtxuLy = data.MaTtxuLy,
                TenTrangThai = data.MaTtxuLyNavigation?.TenTtxuLy ?? "Chờ xử lý",

                // Lấy danh sách thiết bị chi tiết
                Details = data.ChiTietSuCos.Select(ct => new {
                    MaDevice = ct.MaPhongThietBiNavigation?.MaThBi,
                    TenThietBi = ct.MaPhongThietBiNavigation?.MaThBiNavigation?.TenThBi,
                    MoTa = ct.MoTaSuCo,
                    // Nếu bạn muốn hỗ trợ nhiều ảnh, dùng .Split(';')
                    // Nếu chỉ 1 ảnh chuỗi, dùng trực tiếp ct.MinhChung
                    Image = ct.MinhChung
                }).ToList()
            };

            return Ok(new ApiResponse<object>(true, "Lấy chi tiết sự cố thành công", result));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi hệ thống: " + ex.Message, null));
        }
    }
    [HttpPost("cap-nhat-trang-thai")]
    public async Task<IActionResult> UpdateTrangThai([FromBody]  UpdateStatusRequest model)
    {
        try
        {
            var suCo = await _context.BaoCaoSuCos.FindAsync(model.MaSuCo);
            if (suCo == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy sự cố", null));

            // Cập nhật trạng thái mới
            suCo.MaTtxuLy = model.MaTtxuLy;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Cập nhật trạng thái thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    //THIẾT BỊ
    [HttpGet("bao-cao-su-co-all")]
    public async Task<IActionResult> GetAllBaoCaoSuCo([FromQuery] int maChuNt)
    {
        try
        {
            // 1. Lấy danh sách báo cáo mà người thuê thuộc các dãy nhà của chủ nhà (maChNt)
            var data = await _context.BaoCaoSuCos
                .Include(bcsc => bcsc.MaNtNavigation)
                    .ThenInclude(nt => nt.MaNtNavigation) // Để lấy HoTen người thuê
                .Include(bcsc => bcsc.MaNtNavigation)
                    .ThenInclude(nt => nt.HopDongNguoiThues)
                        .ThenInclude(hdnt => hdnt.MaHopDongNavigation)
                            .ThenInclude(hd => hd.MaPhongNavigation)
                            .ThenInclude(p => p.MaDayNtNavigation)
                .Include(bcsc => bcsc.MaTtxuLyNavigation) // Lấy tên trạng thái từ DB
                .Include(bcsc => bcsc.ChiTietSuCos)
                    .ThenInclude(ct => ct.MaPhongThietBiNavigation)
                        .ThenInclude(ptb => ptb.MaThBiNavigation)
                .Where(bcsc => bcsc.MaNtNavigation.HopDongNguoiThues
                    .Any(hdnt => hdnt.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation.MaChuNt == maChuNt))
                .OrderByDescending(item => item.ThoiGian)
                .ToListAsync();

            // 2. Map sang DTO để trả về Frontend
            var lstBaoCao = data.Select(item => {
                // Lấy thông tin phòng từ hợp đồng đầu tiên
                var phong = item.MaNtNavigation?.HopDongNguoiThues.FirstOrDefault()?.MaHopDongNavigation?.MaPhongNavigation;

                return new
                {
                    MaSuCo = item.MaSuCo,
                    MaNt = item.MaNt,
                    HoTenNt = item.MaNtNavigation?.MaNtNavigation?.HoTen,
                    TenDayNt = phong.MaDayNtNavigation.TenDayNt,
                    SoPhong = phong?.SoPhong ?? "N/A",
                    ThoiGian = item.ThoiGian,
                    MaTtxuLy = item.MaTtxuLy,
                    TenTrangThai = item.MaTtxuLyNavigation?.TenTtxuLy ?? "Mới gửi",
                    // Chuyển danh sách thiết bị
                    Details = item.ChiTietSuCos.Select(i => new {
                        MaPhongThietBi = i.MaPhongThietBi,
                        TenThietBi = i.MaPhongThietBiNavigation?.MaThBiNavigation?.TenThBi,
                        MoTa = i.MoTaSuCo,
                        // Lấy ảnh đầu tiên làm ảnh đại diện nếu có
                        Image = i.MinhChung != null ? i.MinhChung.Split(';').FirstOrDefault() : null
                    }).ToList()
                };
            }).ToList();

            return Ok(new ApiResponse<object>(true, "Lấy danh sách báo cáo sự cố thành công", lstBaoCao));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }
}