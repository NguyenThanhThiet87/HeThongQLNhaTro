using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.Constants;
using ServerQLNhaTro.Controllers;
using ServerQLNhaTro.DTOs;
using ServerQLNhaTro.DTOs.ResponseDtos;
using ServerQLNhaTro.Models;
using System.Threading.Tasks;
using System.Transactions;
using static System.Runtime.InteropServices.JavaScript.JSType;

[Route("api/[controller]")]
[ApiController]
public class HopDongController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ChatBoxController chatBoxController;
    public HopDongController(AppDbContext context, IConfiguration iConfig)
    {
        _context = context;
        chatBoxController = new ChatBoxController(new ServerQLNhaTro.Services.ChatService(iConfig), context);
    }

    [HttpPost("tao-hop-dong")]
    public async Task<IActionResult> CreateHopDong([FromBody] HopDongCreateDto model)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Tạo hợp đồng
            var hd = new HopDongThue
            {
                MaPhong = model.MaPhong,
                MaChuNt = model.MaChuNt,
                NgayBdhl = DateOnly.FromDateTime(model.NgayBdhl),
                NgayKthl = DateOnly.FromDateTime((DateTime)model.NgayKthl),
                GiaThue = model.GiaThue,
                TienDatCoc = model.TienDatCoc,
                GiaDien = model.GiaDien,
                GiaNuoc = model.GiaNuoc,
                DonViDien = model.DonViDien,
                DonViNuoc = model.DonViNuoc,
                NgayTao = DateTime.Now,
                MaTthopDong = model.TienDatCoc == null ? 1 : 2
            };

            _context.HopDongThues.Add(hd);
            await _context.SaveChangesAsync(); // Lấy MaHopDong

            // 2. Tạo người thuê chính
            var ndModel = model.DanhSachNguoiThue.First();

            var existedNguoiDung = await _context.NguoiDungs.Include(nd => nd.NguoiThueTro).FirstOrDefaultAsync(x => x.SoDt == ndModel.SoDt);
            NguoiDung nguoiDung;

            if (existedNguoiDung != null)
            {
                // Kiểm tra hợp đồng còn hạn
                var hopDongConHan = await _context.HopDongNguoiThues
                    .Where(hdnt => hdnt.MaNt == existedNguoiDung.MaNd)
                    .Join(_context.HopDongThues,
                          hdnt => hdnt.MaHopDong,
                          hd => hd.MaHopDong,
                          (hdnt, hd) => hd)
                    .AnyAsync(hd => hd.NgayKthl >= DateOnly.FromDateTime(DateTime.Now));

                if (hopDongConHan)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new ApiResponse<object>(
                        false,
                        "Người dùng đã có hợp đồng còn hiệu lực!",
                        null
                    ));
                }
                nguoiDung = existedNguoiDung;
            }
            else
            {
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(ndModel.Password);

                nguoiDung = new NguoiDung
                {
                    HoTen = ndModel.HoTen,
                    SoCccd = ndModel.SoCccd,
                    SoDt = ndModel.SoDt,
                    GioiTinh = ndModel.GioiTinh,
                    NgaySinh = ndModel.NgaySinh,
                    MatKhau = passwordHash,
                    DiaChi = ndModel.DiaChi,
                    KichHoat = true,
                    MaVaiTro = VaiTroHeThongConstant.NguoiThue,
                    NgayTao = DateTime.Now
                };
                _context.NguoiDungs.Add(nguoiDung);
                await _context.SaveChangesAsync();

                var nguoiThueTro = new NguoiThueTro
                {
                    MaNt = nguoiDung.MaNd,
                    NgheNghiep = ndModel.NgheNghiep
                };

                _context.NguoiThueTros.Add(nguoiThueTro);
                await _context.SaveChangesAsync();
            }

            // 3. Thêm danh sách người thuê vào hợp đồng
            if (model.DanhSachNguoiThue != null)
            {
                foreach (var nt in model.DanhSachNguoiThue)
                {
                    _context.HopDongNguoiThues.Add(new HopDongNguoiThue
                    {
                        MaHopDong = hd.MaHopDong,
                        MaNt = nguoiDung.NguoiThueTro.MaNt, // dùng ID vừa tạo
                        MaVaiTro = VaiTroNguoiThueConstant.NguoiDaiDien,
                        MaTttamTru = TrangThaiTamTruConstant.ChuaDKTamTru,
                        NgayVao = DateOnly.FromDateTime(model.NgayBdhl)
                    });
                }
            }

            // 4. Cập nhật trạng thái phòng
            var phong = await _context.Phongs.FindAsync(model.MaPhong);
            if (phong != null)
            {
                phong.MaTtphong = 2; // Đang thuê
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();


            return Ok(new ApiResponse<int>(
                true,
                "Tạo hợp đồng thành công",
                hd.MaHopDong
            ));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(
                false,
                "Tạo hợp đồng thất bại: " + ex.Message,
                null
            ));
        }
    }

    [HttpGet("HopDongs")]
    public async Task<IActionResult> GetAllHopDong([FromQuery] int maDayNt, [FromQuery] int? trangThai)
    {
        try
        {
            List<HopDongThue> data = await _context.HopDongThues.Where(hd => hd.MaPhongNavigation.MaDayNt == maDayNt)
           .Include(h => h.MaPhongNavigation)
               .ThenInclude(p => p.MaDayNtNavigation)
           .Include(h => h.MaTthopDongNavigation)
           .Include(h => h.HopDongNguoiThues)
               .ThenInclude(hnt => hnt.MaNtNavigation.MaNtNavigation) // Lấy tên người thuê
           .ToListAsync();

            if (trangThai != null)
            {
                data = data.Where(hd => hd.MaTthopDong == trangThai).ToList();
            }

            var lstHopDong = data.Select(data => new HopDongThueDto
            {
                MaHopDong = data.MaHopDong,
                MaPhong = data.MaPhong,
                NgayTao = data.NgayTao,
                NgayBdhl = data.NgayBdhl,
                NgayKthl = data.NgayKthl,
                GiaThue = data.GiaThue,
                TienDatCoc = data.TienDatCoc,
                //AnhHopDong = data.AnhHopDong,
                MaTthopDong = data.MaTthopDong,
                GiaDien = data.GiaDien,
                GiaNuoc = data.GiaNuoc,
                DonViDien = data.DonViDien,
                DonViNuoc = data.DonViNuoc,
                SoPhong = data.MaPhongNavigation.SoPhong,
                TenDayNhaTro = data.MaPhongNavigation.MaDayNtNavigation.TenDayNt,
                TenTrangThaiHopDong = data.MaTthopDongNavigation.TenTthopDong,
                HopDongNguoiThues = data.HopDongNguoiThues.Where(hdnt => hdnt.MaVaiTro == VaiTroNguoiThueConstant.NguoiDaiDien).Select(hnt => new HopDongNguoiThueDto
                {
                    MaNt = hnt.MaNt,
                    HoTenNguoiThue = hnt.MaNtNavigation.MaNtNavigation.HoTen,
                }).ToList()
            });

            return Ok(
                new ApiResponse<object>(
                    true,
                    "Lấy danh sách hợp đồng thành công",
                    lstHopDong
                )
                );
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Lấy danh sách hợp đồng thất bại: " + ex.Message,
                null
            ));
        }
    }

    [HttpGet("HopDong")]
    public async Task<IActionResult> GetHopDong([FromQuery] int maHopDong)
    {
        try
        {
            var temp = await _context.HopDongThues
    .Where(hdt => hdt.MaHopDong == maHopDong)
    .Include(h => h.MaPhongNavigation)
        .ThenInclude(p => p.MaDayNtNavigation)
    .Include(h => h.MaTthopDongNavigation)
    .Include(h => h.HopDongNguoiThues)
        .ThenInclude(hnt => hnt.MaNtNavigation)
            .ThenInclude(nt => nt.MaNtNavigation)
    .Include(h => h.MaChuNtNavigation)
        .ThenInclude(cnt => cnt.MaChuNtNavigation)
    .FirstOrDefaultAsync();

            HopDongThueDto hopDong = new HopDongThueDto
            {
                MaHopDong = temp.MaHopDong,
                MaChuNhaTro = temp.MaChuNt,
                TenChuNhaTro = temp.MaChuNtNavigation.MaChuNtNavigation.HoTen,
                MaPhong = temp.MaPhong,
                NgayTao = temp.NgayTao,
                NgayBdhl = temp.NgayBdhl,
                NgayKthl = temp.NgayKthl,
                GiaThue = temp.GiaThue,
                TienDatCoc = temp.TienDatCoc,
                AnhHopDong = temp.AnhHopDong,
                MaTthopDong = temp.MaTthopDong,
                GiaDien = temp.GiaDien,
                GiaNuoc = temp.GiaNuoc,
                DonViDien = temp.DonViDien,
                DonViNuoc = temp.DonViNuoc,
                SoPhong = temp.MaPhongNavigation.SoPhong,
                TenDayNhaTro = temp.MaPhongNavigation.MaDayNtNavigation.TenDayNt,
                TenTrangThaiHopDong = temp.MaTthopDongNavigation.TenTthopDong,
                HopDongNguoiThues = temp.HopDongNguoiThues.Select(hnt => new HopDongNguoiThueDto
                {
                    MaNt = hnt.MaNt,
                    HoTenNguoiThue = hnt.MaNtNavigation.MaNtNavigation.HoTen,
                    SoDtNguoiThue = hnt.MaNtNavigation.MaNtNavigation.SoDt,
                    Avatar = hnt.MaNtNavigation.MaNtNavigation.Avatar

                }).ToList()
            };

            return Ok(
                new ApiResponse<object>(
                    true,
                    "Lấy thông tin hợp đồng thành công",
                    hopDong
                )
                );
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Lấy danh sách hợp đồng thất bại: " + ex.Message,
                null
            ));
        }
    }

    [HttpPost("them-thanh-vien")]
    public async Task<IActionResult> AddThanhVien([FromBody] HopDongNguoiThueCreateDto model)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            HopDongThue hdt = _context.HopDongThues.Where(hdt => hdt.MaHopDong == model.MaHopDong).FirstOrDefault();
            if (hdt == null)
            {
                return BadRequest(new ApiResponse<object>(false, "Hợp đồng không tồn tại", null));
            }
            if (hdt.MaTthopDong != TrangThaiHopDongConstant.DangHieuLuc)
            {
                return BadRequest(new ApiResponse<object>(false, "Hợp đồng hiện không khả dụng", null));
            }

            NguoiDung nd = _context.NguoiDungs.Where(nd => nd.SoDt == model.nguoiDung.SoDt).FirstOrDefault();

            if (nd == null)
            {
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.nguoiDung.Password);

                nd = new NguoiDung
                {
                    HoTen = model.nguoiDung.HoTen,
                    DiaChi = model.nguoiDung.DiaChi,
                    SoCccd = model.nguoiDung.SoCccd,
                    SoDt = model.nguoiDung.SoDt,
                    MatKhau = passwordHash,
                    NgaySinh = model.nguoiDung.NgaySinh,
                    GioiTinh = model.nguoiDung.GioiTinh,
                    NgayTao = DateTime.Now,
                    KichHoat = true,
                    MaVaiTro = VaiTroHeThongConstant.NguoiThue
                };
                _context.NguoiDungs.Add(nd);

                await _context.SaveChangesAsync();

                NguoiThueTro nt = new NguoiThueTro
                {
                    MaNt = nd.MaNd,
                    NgheNghiep = model.nguoiDung.NgheNghiep
                };
                _context.NguoiThueTros.Add(nt);
                await _context.SaveChangesAsync();

                _context.HopDongNguoiThues.Add(new HopDongNguoiThue
                {
                    MaHopDong = model.MaHopDong,
                    MaNt = nt.MaNt,
                    MaVaiTro = VaiTroNguoiThueConstant.NguoiOCung,
                    MaTttamTru = TrangThaiTamTruConstant.ChuaDKTamTru,
                    NgayVao = DateOnly.FromDateTime(DateTime.Now)
                });
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(
                new ApiResponse<object>(
                    true,
                    "Thêm thành viên thành công",
                    null
                )
                );
            }
            else
            {
                return BadRequest(new ApiResponse<object>(
                false,
                "Người dùng đã tồn tại",
                null
            ));
            }
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(
                false,
                "Thêm thành viên thất bại: " + ex.Message,
                null
            ));
        }
    }

    [HttpPost("them-thanh-vien-existed")]
    public async Task<IActionResult> AddThanhVienExisted([FromBody] HopDongNguoiThueCreateDto model)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            HopDongThue hdt = _context.HopDongThues.Where(hdt => hdt.MaHopDong == model.MaHopDong).FirstOrDefault();
            if (hdt == null)
            {
                return BadRequest(new ApiResponse<object>(false, "Hợp đồng không tồn tại", null));
            }
            if (hdt.MaTthopDong != TrangThaiHopDongConstant.DangHieuLuc)
            {
                return BadRequest(new ApiResponse<object>(false, "Hợp đồng hiện không khả dụng", null));
            }

            NguoiDung nd = _context.NguoiDungs.Where(nd => nd.SoDt == model.nguoiDung.SoDt).Include(nd => nd.NguoiThueTro).FirstOrDefault();

            if (nd != null)
            {
                bool hasValidHopDong = await _context.HopDongNguoiThues
                 .AnyAsync(hdnt =>
                     hdnt.MaNt == nd.MaNd &&
                     (
                         hdnt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.DangHieuLuc ||
                         hdnt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.SapHetHan ||
                         hdnt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.ChoXacNhan
                     )
                 );
                if (hasValidHopDong)
                {
                    return Ok( new ApiResponse<object>( false,  "Người dùng đã có hợp đồng hợp lệ", null));
                }

                _context.HopDongNguoiThues.Add(new HopDongNguoiThue
                {
                    MaHopDong = model.MaHopDong,
                    MaNt = nd.NguoiThueTro.MaNt,
                    MaVaiTro = VaiTroNguoiThueConstant.NguoiOCung,
                    MaTttamTru = TrangThaiTamTruConstant.ChuaDKTamTru,
                    NgayVao = DateOnly.FromDateTime(DateTime.Now)
                });
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(
                new ApiResponse<object>(
                    true,
                    "Thêm thành viên thành công",
                    null
                )
                );
            }
            else
            {
                return BadRequest(new ApiResponse<object>(
                false,
                "Người dùng đã tồn tại",
                null
            ));
            }
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(
                false,
                "Thêm thành viên thất bại: " + ex.Message,
                null
            ));
        }
    }

    [HttpDelete("xoa-thanh-vien")]
    public async Task<IActionResult> DeleteThanhVien([FromBody] HopDongNguoiThueDto model)
    {
        try
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            HopDongNguoiThue hopDong_NguoiThue = _context.HopDongNguoiThues
                .Where(hdnt => hdnt.MaHopDong == model.MaHopDong && hdnt.MaNt == model.MaNt)
                .FirstOrDefault();
            if (hopDong_NguoiThue == null)
            {
                return Ok(
                new ApiResponse<object>(
                    false,
                    "Thành viên không tồn tại trong hợp đồng",
                    null
                )
                );
            }

            if (hopDong_NguoiThue.MaVaiTro == VaiTroNguoiThueConstant.NguoiDaiDien)
                return Ok(
                new ApiResponse<object>(
                    false,
                    "Thành viên là người đại diện không phải thành viên",
                    null
                )
                );

            _context.HopDongNguoiThues.Remove(hopDong_NguoiThue);
            await _context.SaveChangesAsync();

            NguoiDung nd = _context.NguoiDungs.Where(nd => nd.MaNd == hopDong_NguoiThue.MaNt)
                .Include(nd => nd.NguoiThueTro)
                .FirstOrDefault();
            nd.KichHoat = false;
            
            _context.NguoiDungs.Update(nd);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(
                new ApiResponse<object>(
                    true,
                    "Xóa thành viên khỏi hợp đồng thành công",
                    null
                )
                );
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Xóa thành viên thất bại: " + ex.Message,
                null
            ));
        }
    }

    //TRANG THAI HỢP ĐỒNG
    [HttpPut("trang-thai/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, int maTrangThai)
    {
        var hd = await _context.HopDongThues.FindAsync(id);
        if (hd == null) return NotFound();
        hd.MaTthopDong = maTrangThai;
        await _context.SaveChangesAsync();
        return Ok();
    }
    [HttpPut("huy-hop-dong")]
    public async Task<IActionResult> HuyHopDong([FromQuery] int maHopDong)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var hd = await _context.HopDongThues
                .Include(h => h.MaPhongNavigation)
                .Include(h => h.HopDongNguoiThues)
                .FirstOrDefaultAsync(h => h.MaHopDong == maHopDong);

            if (hd == null)
            {
                return NotFound(new ApiResponse<object>(false, "Hợp đồng không tồn tại", null));
            }

            // 1. Cập nhật trạng thái hợp đồng thành Châm Dứt Sớm (5)
            hd.MaTthopDong = TrangThaiHopDongConstant.ChamDutSom;

            // 2. Cập nhật trạng thái phòng thành Trống (1)
            if (hd.MaPhongNavigation != null)
            {
                hd.MaPhongNavigation.MaTtphong = TrangThaiPhongConstant.Trong;
            }

            // 3. Ngừng kích hoạt tài khoản của các thành viên trong hợp đồng
            var maNts = hd.HopDongNguoiThues.Select(hnt => hnt.MaNt).ToList();
            var nguoiDungs = await _context.NguoiDungs.Where(nd => maNts.Contains(nd.MaNd)).ToListAsync();
            foreach (var nd in nguoiDungs)
            {
                nd.KichHoat = false;
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new ApiResponse<object>(true, "Hủy hợp đồng thành công", null));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(false, "Hủy hợp đồng thất bại: " + ex.Message, null));
        }
    }
}