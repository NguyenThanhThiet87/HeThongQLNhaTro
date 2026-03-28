using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.DTOs;
using ServerQLNhaTro.DTOs.RequestDtos;
using ServerQLNhaTro.Models;
using ServerQLNhaTro.Services;

namespace ServerQLNhaTro.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DichVuController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPhotoService _photoService;

    public DichVuController(AppDbContext context, IPhotoService photoService)
    {
        _context = context;
        _photoService = photoService;
    }

    [HttpGet("ncc/{maNcc}")]
    public async Task<IActionResult> GetDichVusByNcc(int maNcc)
    {
        try
        {
            var services = await _context.DichVus
                                .Where(d => d.MaNcc == maNcc)
                                .ToListAsync();
            return Ok(new ApiResponse<object>(true, "Lấy danh sách dịch vụ thành công", services));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDichVuById(int id)
    {
        try
        {
            var service = await _context.DichVus
                .Include(d => d.MaNccNavigation)
                .ThenInclude(n => n.MaNccNavigation)
                .FirstOrDefaultAsync(d => d.MaDv == id);

            if (service == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy dịch vụ", null));

            var result = new
            {
                service.MaDv,
                service.TenDv,
                service.HinhAnh,
                service.GiaTien,
                service.DonViTinh,
                service.MoTaCt,
                service.TtcungCap,
                Provider = new
                {
                    service.MaNccNavigation.MaNcc,
                    service.MaNccNavigation.MaNccNavigation.HoTen,
                    service.MaNccNavigation.MaNccNavigation.Avatar,
                    service.MaNccNavigation.MaNccNavigation.SoDt,
                    service.MaNccNavigation.KhuVucPv,
                    service.MaNccNavigation.DanhGiaTb
                }
            };

            return Ok(new ApiResponse<object>(true, "Lấy chi tiết dịch vụ thành công", result));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateDichVu([FromForm] DichVuCreateDto model, IFormFile? HinhAnhFile)
    {
        try
        {
            var dv = new DichVu
            {
                MaNcc = model.MaNcc,
                TenDv = model.TenDv,
                MoTaCt = model.MoTaCt,
                GiaTien = model.GiaTien,
                DonViTinh = model.DonViTinh,
                TtcungCap = model.TtcungCap,
            };

            if (HinhAnhFile != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(HinhAnhFile, "products");
                if (uploadResult.Error != null)
                {
                    return BadRequest(new ApiResponse<object>(false, "Lỗi upload ảnh: " + uploadResult.Error.Message, null));
                }
                dv.HinhAnh = uploadResult.SecureUrl.AbsoluteUri;
            }

            _context.DichVus.Add(dv);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object>(true, "Thêm dịch vụ thành công", dv));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi khi thêm dịch vụ: " + ex.Message, null));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDichVu(int id, [FromForm] DichVuCreateDto model, IFormFile? HinhAnhFile)
    {
        try
        {
            var dv = await _context.DichVus.FindAsync(id);
            if (dv == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy dịch vụ", null));

            dv.TenDv = model.TenDv;
            dv.MoTaCt = model.MoTaCt;
            dv.GiaTien = model.GiaTien;
            dv.DonViTinh = model.DonViTinh;
            dv.TtcungCap = model.TtcungCap;

            if (HinhAnhFile != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(HinhAnhFile, "products");
                if (uploadResult.Error != null)
                {
                    return BadRequest(new ApiResponse<object>(false, "Lỗi upload ảnh: " + uploadResult.Error.Message, null));
                }
                dv.HinhAnh = uploadResult.SecureUrl.AbsoluteUri;
            }

            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object>(true, "Cập nhật dịch vụ thành công", dv));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi khi cập nhật: " + ex.Message, null));
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDichVu(int id)
    {
        try
        {
            var dv = await _context.DichVus.FindAsync(id);
            if (dv == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy dịch vụ", null));

            _context.DichVus.Remove(dv);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object>(true, "Xóa dịch vụ thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi khi xóa: " + ex.Message, null));
        }
    }

    [HttpPut("trang-thai/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        try
        {
            var dv = await _context.DichVus.FindAsync(id);
            if (dv == null) return NotFound(new ApiResponse<object>(false, "Không tìm thấy dịch vụ", null));

            dv.TtcungCap = status;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Cập nhật trạng thái thành công", null));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("near-me")]
    public async Task<IActionResult> GetProvidersNearMe()
    {
        try
        {
            var providers = await _context.NhaCungCaps
                .Include(n => n.MaNccNavigation)
                .Include(n => n.DichVus)
                .Where(n => n.SanSang == true)
                .Select(n => new
                {
                    n.MaNcc,
                    n.MaNccNavigation.HoTen,
                    n.MaNccNavigation.Avatar,
                    n.MaNccNavigation.SoDt,
                    n.KhuVucPv,
                    n.MoTaDv,
                    n.DanhGiaTb,
                    ViDo = n.ViDo ?? (decimal)(10.762622 + new Random().NextDouble() * 0.01),
                    KinhDo = n.KinhDo ?? (decimal)(106.660172 + new Random().NextDouble() * 0.01),
                    // Giả lập khoảng cách
                    Distance = new Random().Next(100, 5000), // mét
                    Services = n.DichVus.Where(dv => dv.TtcungCap == "Sẵn sàng").Select(dv => new {
                        dv.MaDv,
                        dv.TenDv,
                        dv.HinhAnh,
                        dv.GiaTien,
                        dv.DonViTinh,
                        dv.MoTaCt
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(true, "Lấy danh sách nhà cung cấp thành công", providers));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("tenant-home/{maNt}")]
    public async Task<IActionResult> GetTenantHome(int maNt)
    {
        try
        {
            var home = await _context.HopDongNguoiThues
                .Where(h => h.MaNt == maNt)
                .Include(h => h.MaHopDongNavigation)
                   .ThenInclude(hd => hd.MaPhongNavigation)
                   .ThenInclude(p => p.MaDayNtNavigation)
                .Select(h => h.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation)
                .FirstOrDefaultAsync();

            if (home == null)
            {
                // Return a default center if no home found
                return Ok(new ApiResponse<object>(true, "Không tìm thấy thông tin nhà trọ", new {
                    MaDayNt = 0,
                    TenDayNt = "Vị trí của bạn",
                    KinhDo = 10.762622m,
                    ViDo = 106.660172m
                }));
            }

            return Ok(new ApiResponse<object>(true, "Lấy vị trí nhà trọ thành công", new {
                home.MaDayNt,
                home.TenDayNt,
                home.DiaChi,
                KinhDo = home.KinhDo ?? 10.762622m,
                ViDo = home.ViDo ?? 106.660172m
            }));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }
}
