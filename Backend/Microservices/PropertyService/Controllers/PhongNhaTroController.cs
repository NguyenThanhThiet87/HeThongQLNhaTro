using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PropertyService.DTOs;
using PropertyService.Models;
using PropertyService.Data;
using PropertyService.Constants;
using PropertyService;
using PropertyService.Services;
using System.Text.Json;
using PropertyService.DTOs.ResponseDtos;
using System.Reflection.PortableExecutable;
using PropertyService.Constants;
using System.Net;


[Route("api/[controller]")]
[ApiController]
public class PhongNhaTroController : ControllerBase
{
    private readonly PropertyDbContext _context;
    private readonly IPhotoService _photoService; // <--- SỬ DỤNG SERVICE MỚI
    public PhongNhaTroController(PropertyDbContext context, IPhotoService photoService, IConfiguration config)
    {
        _context = context;
        _photoService = photoService; // <--- INJECT VÀO ĐÂY
    }

    // ==========================================
    // 1. DÃY NHÀ TRỌ
    // ==========================================

    [HttpGet("day-nha-tros")]
    public async Task<IActionResult> GetDayNhaTros([FromQuery] int maChuNt)
    {
        try
        {
            List<DayNhaTro> lstTemp = await _context.DayNhaTros.Where(dnt => dnt.MaChuNt == maChuNt).Include(dnt => dnt.Phongs).ToListAsync();

            var lstDayNhaTro = lstTemp.Select(dnt => new DayNhaTroDto
            {
                MaDayNt = dnt.MaDayNt,
                TenDayNt = dnt.TenDayNt,
                DiaChi = dnt.DiaChi,
                Slphong = dnt.Phongs.Count,
                TrangThaiNt = dnt.TrangThaiNt,
                UrlAnh = dnt.UrlAnh,
                MaChuNt = dnt.MaChuNt,
                TyLeLapDay = dnt.Phongs.Count == 0 ? 0 : (((double)dnt.Phongs.Count(p => p.MaTtphong == TrangThaiPhongConstant.DangThue) / dnt.Phongs.Count) * 100)
            }).ToList();

            return Ok(new ApiResponse<List<DayNhaTroDto>>(
                true,
                "Lấy danh sách dãy nhà trọ thành công",
                lstDayNhaTro
            ));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("day-nha-tro")]
    public async Task<IActionResult> GetDayNhaTro([FromQuery] int maDayNt)
    {
        var result = await _context.DayNhaTros
        .Where(d => d.MaDayNt == maDayNt)
        .Select(d => new
        {
            dayNhaTro = new DayNhaTroDto
            {
                MaDayNt = d.MaDayNt,
                TenDayNt = d.TenDayNt,
                DiaChi = d.DiaChi,
                Slphong = d.Phongs.Count(),
                TrangThaiNt = d.TrangThaiNt,
                UrlAnh = d.UrlAnh,
                MaChuNt = d.MaChuNt
            },

            lstPhong = d.Phongs.Select(p => new PhongDto
            {
                MaPhong = p.MaPhong,
                MaDayNt = p.MaDayNt,
                SoPhong = p.SoPhong,
                GiaThucTe = p.GiaThucTe,
                MaLoaiP = p.MaLoaiP,
                MaTtphong = p.MaTtphong,
                TenTrangThaiPhong = p.MaTtphongNavigation.TenTtphong,
                MaTtrPhong = p.MaTtrPhong,
                TenTinhTrangPhong = p.MaTtrPhongNavigation.TenTtrPhong,
                TenLoaiPhong = p.MaLoaiPNavigation.TenLoaiP
            }).ToList()
        })
        .FirstOrDefaultAsync();

        if (result == null)
        {
            return NotFound(new ApiResponse<object>(
                false,
                "Không tìm thấy dãy nhà trọ",
                null
            ));
        }

        return Ok(new ApiResponse<object>(
            true,
            "Lấy thông tin dãy nhà trọ thành công",
            result
        ));
    }

    // API TẠO DÃY TRỌ + DANH SÁCH PHÒNG + ẢNH BÌA
    [HttpPost("tao-day-tro")]
    public async Task<IActionResult> CreateDayNhaTros([FromForm] DayNhaTroCreateDto model)
    {
        string imageUrl = null;

        // 2. DÙNG SERVICE ĐỂ UPLOAD ẢNH BÌA DÃY TRỌ
        if (model.AnhBia != null && model.AnhBia.Length > 0)
        {
            var uploadResult = await _photoService.AddPhotoAsync(model.AnhBia, "quan-ly-nha-tro/day-tro");
            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
            imageUrl = uploadResult.SecureUrl?.ToString();
        }

        // 3. LƯU DATABASE
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Lấy dữ liệu từ model.DayNhaTro (Chuẩn DTO của má)
            var newDayNhaTro = new DayNhaTro
            {
                MaChuNt = model.MaChuNt,
                TenDayNt = model.TenDayNt,
                DiaChi = model.DiaChi,
                Slphong = model.SlPhong,
                TrangThaiNt = model.TrangThaiHd,
                UrlAnh = imageUrl,
                KinhDo = model.KinhDo,
                ViDo = model.ViDo
            };

            _context.DayNhaTros.Add(newDayNhaTro);
            await _context.SaveChangesAsync();

            // Lấy dữ liệu từ model.DanhSachPhong (Chuẩn DTO của má)
            foreach (var phong in model.DanhSachPhong)
            {
                Phong p = new Phong
                {
                    MaDayNt = newDayNhaTro.MaDayNt, // Nối khóa ngoại
                    MaLoaiP = phong.MaLoaiP,
                    GiaThucTe = phong.GiaThucTe,
                    SoPhong = phong.SoPhong,
                    MaTtphong = phong.MaTtphong,
                    MaTtrPhong = phong.MaTtrPhong
                };
                _context.Phongs.Add(p);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { success = true, dayNhaTroId = newDayNhaTro.MaDayNt, imageUrl });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPut("sua-day-tro")]
    public async Task<IActionResult> UpdateDayNhaTro([FromForm] DayNhaTroCreateDto model, [FromQuery] int maDayNt)
    {
        try
        {
            var dayNhaTro = await _context.DayNhaTros.FindAsync(maDayNt);
            if (dayNhaTro == null) return NotFound(new { success = false, message = "Không tìm thấy dãy nhà trọ" });

            if (model.AnhBia != null && model.AnhBia.Length > 0)
            {
                var uploadResult = await _photoService.AddPhotoAsync(model.AnhBia, "quan-ly-nha-tro/day-tro");
                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                dayNhaTro.UrlAnh = uploadResult.SecureUrl?.ToString();
            }

            dayNhaTro.TenDayNt = model.TenDayNt;
            dayNhaTro.DiaChi = model.DiaChi;
            dayNhaTro.TrangThaiNt = model.TrangThaiHd;
            dayNhaTro.KinhDo = model.KinhDo;
            dayNhaTro.ViDo = model.ViDo;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Cập nhật thành công", urlAnh = dayNhaTro.UrlAnh });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // ==========================================
    // 2. PHÒNG TRỌ
    // ==========================================

    [HttpGet("phongs")]
    public async Task<IActionResult> GetPhongs([FromQuery] int? maDayNt)
    {
        try
        {
            List<Phong> lstTemp = await _context.Phongs.Where(p => p.MaDayNt == maDayNt).ToListAsync();
            var lstPhongTro = lstTemp.Select(p => new PhongDto
            {
                MaPhong = p.MaPhong,
                SoPhong = p.SoPhong,
                GiaThucTe = p.GiaThucTe,
                MaTtphong = p.MaTtphong
            }).ToList();

            return Ok(new ApiResponse<List<PhongDto>>(
                true,
                "Lấy danh sách phòng trọ thành công",
                lstPhongTro
            ));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("phong")]
    public async Task<IActionResult> GetPhong([FromQuery] int? maPhong)
    {
        var result = await _context.Phongs
            .Where(p => p.MaPhong == maPhong)
            .Select(p => new
            {
                Phong = new PhongDto
                {
                    MaPhong = p.MaPhong,
                    MaDayNt = p.MaDayNt,
                    SoPhong = p.SoPhong,
                    GiaThucTe = p.GiaThucTe,
                    MaLoaiP = p.MaLoaiP,
                    MaTtphong = p.MaTtphong,
                    TenTrangThaiPhong = p.MaTtphongNavigation.TenTtphong,
                    MaTtrPhong = p.MaTtrPhong,
                    TenTinhTrangPhong = p.MaTtrPhongNavigation.TenTtrPhong,
                    TenLoaiPhong = p.MaLoaiPNavigation.TenLoaiP
                },
                HopDongThue = (object)null // Tạm thời set null do bảng này đã dời sang ContractService
            })
            .FirstOrDefaultAsync();

        if (result == null)
        {
            return NotFound(new ApiResponse<object>(
                false,
                "Phòng không tồn tại",
                null
            ));
        }

        return Ok(new ApiResponse<object>(
            true,
            "Lấy thông tin phòng trọ thành công",
            result
        ));
    }


    [HttpPost("phong")]
    public async Task<IActionResult> CreatePhong([FromForm] PhongCreateDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var isExist = _context.Phongs.Where(p => p.MaDayNt == model.MaDayNt && p.SoPhong.ToLower().Equals( model.SoPhong.ToLower())).FirstOrDefault();

        if (isExist != null)
            return Ok(new  ApiResponse<Object>( false, "Số phòng đã tồn tại", null ));

        using var transaction = _context.Database.BeginTransaction();
        try
        {
            var phong = new Phong
            {
                MaDayNt = model.MaDayNt,
                MaLoaiP = model.MaLoaiP,
                SoPhong = model.SoPhong,
                GiaThucTe = model.GiaThucTe,
                MaTtphong = model.MaTtphong,
                MaTtrPhong = model.MaTtrPhong
            };
            _context.Phongs.Add(phong);
            await _context.SaveChangesAsync();

            if (model.ThietBis != null && model.ThietBis.Any())
            {
                foreach (var item in model.ThietBis)
                {
                    _context.PhongThietBis.Add(new PhongThietBi
                    {
                        MaPhong = phong.MaPhong,
                        MaThBi = item.MaThBi,
                        TrangThai = item.TrangThai,
                        MoTa = item.MoTa
                    });
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new ApiResponse<Object>( true , "Tạo phòng thành công", phong.MaPhong ));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { Error = ex.Message });
        }
    }

    // --- PHẦN 2: THIẾT BỊ TRONG PHÒNG ---

    [HttpPost("phong-thietbi")]
    public async Task<IActionResult> AddThietBiToPhong([FromBody] PhongThietBi model)
    {
        _context.PhongThietBis.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    [HttpDelete("phong-thietbi/{id}")]
    public async Task<IActionResult> RemoveThietBiFromPhong(int id)
    {
        var item = await _context.PhongThietBis.FindAsync(id);
        if (item == null) return NotFound();
        _context.PhongThietBis.Remove(item);
        await _context.SaveChangesAsync();
        return Ok();
    }

    // --- LOẠI PHÒNG ---
    [HttpGet("danh-sach-loai-phong")]
    public async Task<IActionResult> GetLoaiPhongs([FromQuery] int maChuNt) // GET phải dùng FromQuery
    {
        try
        {
            var lstLoaiPhong = await _context.LoaiPhongs
                .Where(lp => lp.MaChuNt == maChuNt)
                .ToListAsync();

            return Ok(new ApiResponse<List<LoaiPhong>>(true, "Lấy danh sách loại phòng thành công", lstLoaiPhong));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("loai-phong")]
    public async Task<IActionResult> GetLoaiPhong([FromQuery] int maLoaiP) // GET phải dùng FromQuery
    {
        try
        {
            LoaiPhong loaiPhong = await _context.LoaiPhongs.Where(lp => lp.MaLoaiP == maLoaiP).FirstOrDefaultAsync();

            return Ok(new ApiResponse<LoaiPhong>(true, "Lấy danh sách loại phòng thành công", loaiPhong));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpPost("tao-loai-phong")]
    public async Task<IActionResult> CreateLoaiPhong([FromForm] LoaiPhongCreateDto model)
    {
        try
        {
            string imageUrl = null;

            // 2. DÙNG SERVICE ĐỂ UPLOAD ẢNH BÌA DÃY TRỌ
            if (model.UrlAnh != null && model.UrlAnh.Length > 0)
            {
                var uploadResult = await _photoService.AddPhotoAsync(model.UrlAnh, "quan-ly-nha-tro/loai-phong");
                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                imageUrl = uploadResult.SecureUrl?.ToString();
            }

            var newLoaiPhong = new LoaiPhong
            {
                MaChuNt = model.MaChuNt,
                TenLoaiP = model.TenLoaiP,
                GiaChuan = model.GiaChuan,
                MoTa = model.MoTa,
                SnguoiToiDa = model.SnguoiToiDa,
                UrlAnh = imageUrl
            };

            _context.LoaiPhongs.Add(newLoaiPhong);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<LoaiPhong>(true, "Tạo loại phòng thành công", newLoaiPhong));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(false, "Lỗi hệ thống: " + ex.Message, null));
        }
    }

    [HttpPut("sua-loai-phong")]
    public async Task<IActionResult> UpdateLoaiPhong([FromForm] LoaiPhongCreateDto model)
    {
        try
        {
            // 1. Tìm loại phòng trong DB
            var loaiPhong = await _context.LoaiPhongs.FindAsync(model.MaLoaiP);
            if (loaiPhong == null)
            {
                return NotFound(new ApiResponse<string>(false, "Không tìm thấy loại phòng này", null));
            }

            string imageUrl = null;

            // 2. DÙNG SERVICE ĐỂ UPLOAD ẢNH BÌA DÃY TRỌ
            if (model.UrlAnh != null && model.UrlAnh.Length > 0)
            {
                var uploadResult = await _photoService.AddPhotoAsync(model.UrlAnh, "quan-ly-nha-tro/loai-phong");
                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                imageUrl = uploadResult.SecureUrl?.ToString();
            }

            // 2. Cập nhật dữ liệu
            loaiPhong.TenLoaiP = model.TenLoaiP;
            loaiPhong.GiaChuan = model.GiaChuan;
            loaiPhong.MoTa = model.MoTa;
            loaiPhong.UrlAnh = imageUrl;
            loaiPhong.SnguoiToiDa = model.SnguoiToiDa;
            
            _context.LoaiPhongs.Update(loaiPhong);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<LoaiPhong>(true, "Cập nhật thành công", loaiPhong));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpDelete("xoa-loai-phong")]
    public async Task<IActionResult> DeleteLoaiPhong(int maLoaiP)
    {
        try
        {
            var loaiPhong = await _context.LoaiPhongs.FindAsync(maLoaiP);
            if (loaiPhong == null)
            {
                return NotFound(new ApiResponse<string>(false, "Không tìm thấy loại phòng để xóa", null));
            }

            // LƯU Ý QUAN TRỌNG: Kiểm tra xem loại phòng này đã có phòng nào đang xài chưa?
            bool isUsed = await _context.Phongs.AnyAsync(p => p.MaLoaiP == maLoaiP);
            if (isUsed)
            {
                return Ok(new ApiResponse<string>(false, "Không thể xóa! Đang có phòng thuộc loại phòng này.", null));
            }

            _context.LoaiPhongs.Remove(loaiPhong);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<string>(true, "Xóa loại phòng thành công", null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("thong-ke")]
    public async Task<IActionResult> GetThongKe([FromQuery] int maNd)
    {
        try
        {
            // Lấy tất cả dãy nhà trọ của chủ nhà
            var dntList = await _context.DayNhaTros
                .Where(dnt => dnt.MaChuNt == maNd)
                .Select(dnt => dnt.MaDayNt)
                .ToListAsync();

            var phongList = await _context.Phongs
                .Where(p => dntList.Contains(p.MaDayNt))
                .ToListAsync();

            int tongSoPhong = phongList.Count;

            var trangThaiStats = new[]
            {
                 new { MaTtphong = TrangThaiPhongConstant.Trong, TenTrangThai = "Trống", MauSac = "#4CAF50" },         // Xanh lá
                 new { MaTtphong = TrangThaiPhongConstant.DangThue, TenTrangThai = "Đang thuê", MauSac = "#2196F3" }, // Xanh dương
                 new { MaTtphong = TrangThaiPhongConstant.NoTien, TenTrangThai = "Nợ tiền", MauSac = "#F44336" },     // Đỏ
                 new { MaTtphong = TrangThaiPhongConstant.DangSuaChua, TenTrangThai = "Đang sửa chữa", MauSac = "#FFC107" }, // Vàng
                 new { MaTtphong = TrangThaiPhongConstant.ChoDonVao, TenTrangThai = "Chờ dọn vào", MauSac = "#9E9E9E" }     // Xám
            };

            var thongKeTrangThai = trangThaiStats.Select(tt => new
            {
                MaTtphong = tt.MaTtphong,
                TenTrangThai = tt.TenTrangThai,
                SoLuong = phongList.Count(p => p.MaTtphong == tt.MaTtphong),
                MauSac = tt.MauSac
            }).ToList();

            return Ok(
                new ApiResponse<object>(
                    true,
                    "Lấy thống kê phòng thành công",
                    new
                    {
                        tongSoPhong,
                        thongKeTrangThai
                    }
                ));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpDelete("xoa-phong")]
    public async Task<IActionResult> DeletePhong(int maPhong)
    {
        try
        {
            var phong = await _context.Phongs.FindAsync(maPhong);
            if (phong == null)
            {
                return NotFound(new ApiResponse<string>(false, "Không tìm thấy phòng để xóa", null));
            }

            _context.Phongs.Remove(phong);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<string>(true, "Xóa loại phòng thành công", null));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(false, ex.Message, null));
        }
    }
}
