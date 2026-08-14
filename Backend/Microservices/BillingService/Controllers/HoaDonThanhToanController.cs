using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using BillingService.Data;
using BillingService.Constants;
using BillingService.DTOs;
using BillingService.DTOs.ResponseDtos;
using BillingService.Hubs;
using BillingService.Models;
using MassTransit;
using Shared.Integration.Protos;
using Shared.Integration.Commands;

[Route("api/[controller]")]
[ApiController]
public class HoaDonThanhToanController : ControllerBase
{
    private readonly BillingDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly UtilityIndexService.UtilityIndexServiceClient _utilityClient;
    private readonly ContractQueryService.ContractQueryServiceClient _contractClient;
    private readonly ISendEndpointProvider _sendEndpoint;

    public HoaDonThanhToanController(
        BillingDbContext context, 
        IHubContext<ChatHub> hubContext,
        UtilityIndexService.UtilityIndexServiceClient utilityClient,
        ContractQueryService.ContractQueryServiceClient contractClient,
        ISendEndpointProvider sendEndpoint)
    {
        _context = context;
        _hubContext = hubContext;
        _utilityClient = utilityClient;
        _contractClient = contractClient;
        _sendEndpoint = sendEndpoint;
    }

    [HttpPost("lap-hoa-don-grpc")]
    public async Task<IActionResult> LapHoaDonGrpc(int roomId, int month, int year)
    {
        var contractResp = await _contractClient.GetActiveContractAsync(new ActiveContractRequest { RoomId = roomId });
        if (!contractResp.HasContract)
        {
            return BadRequest(new ApiResponse<object>(false, "Không tìm thấy hợp đồng cho phòng này", null));
        }

        var utilityResp = await _utilityClient.GetUtilityIndexAsync(new UtilityIndexRequest { RoomId = roomId, Month = month, Year = year });
        if (!utilityResp.Exists)
        {
            return BadRequest(new ApiResponse<object>(false, "Chưa chốt chỉ số điện nước tháng này", null));
        }

        double tongTien = contractResp.Deposit + (utilityResp.ElectricityNew - utilityResp.ElectricityOld) * 3500;
        
        var endpoint = await _sendEndpoint.GetSendEndpoint(new Uri("queue:notification-queue"));
        await endpoint.Send<ISendNotificationCommand>(new 
        {
            UserId = contractResp.TenantId,
            Title = $"Hóa đơn tháng {month}/{year}",
            Message = $"Số tiền cần thanh toán là {tongTien} VNĐ",
            Type = "Email"
        });

        return Ok(new ApiResponse<object>(true, "Lập hóa đơn và lên lịch gửi email thành công", null));
    }

    [HttpGet("hoa-dons")]
    public async Task<IActionResult> GetHoaDons([FromQuery] int maDayNt, [FromQuery] int month, [FromQuery] int year, [FromQuery] int? trangThai)
    {
        try
        {
            var hdtemp = _context.HoaDons
                .Where(hd => hd.MaHopDongNavigation.MaPhongNavigation.MaDayNt == maDayNt
                    && hd.NgayLap.Value.Month == month
                    && hd.NgayLap.Value.Year == year)
                .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.HopDongNguoiThues)
                    .ThenInclude(hdnt => hdnt.MaNtNavigation)
                    .ThenInclude(nt => nt.MaNtNavigation)
                .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.MaPhongNavigation)
                    .ThenInclude(p => p.MaDayNtNavigation)
                .ToList();

            if (trangThai != null)
            {
                hdtemp = hdtemp.Where(hd => hd.MaTthoaDon == trangThai).ToList();
            }

            List<HoaDonDto> hdList = hdtemp.Select(hd => new HoaDonDto
            {
                MaHoaDon = hd.MaHoaDon,
                MaHopDong = hd.MaHopDong,
                MaTthoaDon = hd.MaTthoaDon,
                TenDayNhaTro = hd.MaHopDongNavigation?.MaPhongNavigation?.MaDayNtNavigation?.TenDayNt ?? "",
                SoPhong = hd.MaHopDongNavigation?.MaPhongNavigation?.SoPhong ?? "",
                TenNguoiDaiDien = hd.MaHopDongNavigation?.HopDongNguoiThues
        ?.Where(hdnt => hdnt.MaVaiTro == VaiTroNguoiThueConstant.NguoiDaiDien)
        .FirstOrDefault()
        ?.MaNtNavigation?.MaNtNavigation?.HoTen ?? "",
                TienDien = hd.TienDien,
                TienNuoc = hd.TienNuoc,
                TongTien = hd.TongTien,
                NgayLap = hd.NgayLap,
            }).ToList();
            return Ok(new ApiResponse<List<HoaDonDto>>(true, "Lấy danh sách hóa đơn thành công", hdList));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("hoa-don")]
    public async Task<IActionResult> GetHoaDon([FromQuery] int maHd)
    {
        try
        {
            HoaDon hdTemp = _context.HoaDons.Where(hd => hd.MaHoaDon == maHd)
                .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.HopDongNguoiThues)
                    .ThenInclude(hdnt => hdnt.MaNtNavigation)
                    .ThenInclude(nt => nt.MaNtNavigation)
                .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.MaPhongNavigation)
                    .ThenInclude(p => p.MaDayNtNavigation)
                .Include(hd => hd.MaChiSoNavigation)
                .FirstOrDefault();

            var nguoiDaiDien = hdTemp.MaHopDongNavigation.HopDongNguoiThues
                               .Where(hdnt => hdnt.MaVaiTro == VaiTroNguoiThueConstant.NguoiDaiDien).FirstOrDefault().MaNtNavigation.MaNtNavigation;

            HoaDonDto hd = new HoaDonDto
            {
                MaHoaDon = hdTemp.MaHoaDon,
                MaHopDong = hdTemp.MaHopDong,
                MaTthoaDon = hdTemp.MaTthoaDon,
                TenDayNhaTro = hdTemp.MaHopDongNavigation?.MaPhongNavigation?.MaDayNtNavigation?.TenDayNt ?? "",
                SoPhong = hdTemp.MaHopDongNavigation?.MaPhongNavigation?.SoPhong ?? "",
                TienDien = hdTemp.TienDien,
                TienNuoc = hdTemp.TienNuoc,
                TongTien = hdTemp.TongTien,
                NgayLap = hdTemp.NgayLap,
                TienPhong = hdTemp.MaHopDongNavigation.GiaThue,
                ChiSoDienNuoc = hdTemp.MaChiSoNavigation != null ? new ChiSoDienNuocDto
                {
                    MaPhong = hdTemp.MaChiSoNavigation.MaPhong,
                    Thang = hdTemp.MaChiSoNavigation.Thang,
                    Nam = hdTemp.MaChiSoNavigation.Nam,
                    CsdienCu = hdTemp.MaChiSoNavigation.CsdienCu,
                    CsnuocCu = hdTemp.MaChiSoNavigation.CsnuocCu,
                    CsdienMoi = hdTemp.MaChiSoNavigation.CsdienMoi,
                    CsnuocMoi = hdTemp.MaChiSoNavigation.CsnuocMoi,
                    GiaDien = hdTemp.MaHopDongNavigation.GiaDien,
                    GiaNuoc = hdTemp.MaHopDongNavigation.GiaNuoc,
                } : null,
                NguoiDaiDien = new NguoiThueTroDto
                {
                    MaNt = nguoiDaiDien.MaNd,
                    HoTen = nguoiDaiDien.HoTen,
                    Avatar = nguoiDaiDien.Avatar
                }
            };

            return Ok(new ApiResponse<HoaDonDto>(true, "Thông tin chi tiết hóa đơn", hd));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpPost("thanh-toan")]
    public async Task<IActionResult> ThanhToanHoaDon([FromBody] LichSuThanhToan model)
    {
        _context.LichSuThanhToans.Add(model);

        var hoaDon = await _context.HoaDons.FindAsync(model.MaHoaDon);
        var daTra = await _context.LichSuThanhToans
            .Where(x => x.MaHoaDon == model.MaHoaDon)
            .SumAsync(x => x.SoTien);

        if (daTra >= hoaDon.TongTien)
        {
            hoaDon.MaTthoaDon = 2; // Đã thanh toán
        }

        await _context.SaveChangesAsync();
        return Ok("Thanh toán thành công");
    }

    [HttpGet("dien-nuoc-cu")]
    public async Task<IActionResult> GetSoDienNuocCu([FromQuery] int maPhong, int monthCurrent, int yearCurrent)
    {
        try
        {
            var request = new Shared.Integration.Protos.UtilityIndexRequest
            {
                RoomId = maPhong,
                Month = monthCurrent,
                Year = yearCurrent
            };
            var response = await _utilityClient.GetUtilityIndexAsync(request);

            if (!response.Exists)
            {
                return Ok(new ApiResponse<Object>(
                    true,
                    "Lấy chỉ số điện nước thành công (phòng chưa có tính điện nước)",
                    new
                    {
                        DienCu = response.ElectricityOld,
                        NuocCu = response.WaterOld
                    }
                ));
            }

            return Ok(new ApiResponse<Object>(
                true,
                "Lấy chỉ số điện nước thành công",
                new
                {
                    DienCu = response.ElectricityOld,
                    NuocCu = response.WaterOld
                }
            ));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpPost("chot-dien-nuoc")]
    public async Task<IActionResult> SaveSoDienNuoc([FromBody] ChiSoDienNuocDto model)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var recordRequest = new Shared.Integration.Protos.RecordUtilityIndexRequest
            {
                RoomId = model.MaPhong,
                Month = model.Thang ?? 0,
                Year = model.Nam ?? 0,
                ElectricityOld = model.CsdienCu ?? 0,
                WaterOld = model.CsnuocCu ?? 0,
                ElectricityNew = model.CsdienMoi ?? 0,
                WaterNew = model.CsnuocMoi ?? 0
            };

            var recordResponse = await _utilityClient.RecordUtilityIndexAsync(recordRequest);

            if (!recordResponse.Success)
            {
                return Ok(new ApiResponse<Object>(
                    false,
                    recordResponse.Message,
                    null
                ));
            }

            var contractResponse = await _contractClient.GetActiveContractAsync(new Shared.Integration.Protos.ActiveContractRequest
            {
                RoomId = model.MaPhong
            });

            if (!contractResponse.HasContract)
            {
                return Ok(new ApiResponse<Object>(
                    false,
                    "Hợp đồng không tồn tại với phòng",
                    null
                ));
            }

            var tienDien = (model.CsdienMoi - (model.CsdienCu ?? 0)) * (decimal)contractResponse.ElectricityPrice;
            var tienNuoc = (model.CsnuocMoi - (model.CsnuocCu ?? 0)) * (decimal)contractResponse.WaterPrice;
            var tongTien = (decimal)contractResponse.RentPrice + tienDien + tienNuoc;

            HoaDon hd = new HoaDon
            {
                MaHopDong = contractResponse.ContractId,
                NgayLap = DateTime.Now,
                TienDien = tienDien,
                TienNuoc = tienNuoc,
                MaTthoaDon = TrangThaiHoaDonConstant.ChuaThanhToan,
                TienPhong = (decimal)contractResponse.RentPrice,
                TongTien = tongTien,
                MaChiSo = recordResponse.UtilityIndexId
            };

            _context.HoaDons.Add(hd);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            var endpoint = await _sendEndpoint.GetSendEndpoint(new Uri("queue:invoice-created-events"));
            await endpoint.Send<Shared.Integration.Events.IInvoiceCreatedEvent>(new
            {
                MaHoaDon = hd.MaHoaDon,
                MaPhong = model.MaPhong,
                SoPhong = "",
                MaNguoiDaiDien = contractResponse.RepresentativeId,
                TongTien = hd.TongTien,
                NgayLap = hd.NgayLap
            });

            await _hubContext.Clients.User(contractResponse.RepresentativeId.ToString())
            .SendAsync("ReceiveInvoiceNotification", new
            {
                message = $"Bạn có hóa đơn mới cho phòng. Tổng cộng: {hd.TongTien:N0}đ. Vui lòng kiểm tra và thanh toán.",
                hoaDonId = hd.MaHoaDon,
                tongTien = hd.TongTien,
                ngayLap = hd.NgayLap
            });

            return Ok(new ApiResponse<Object>(
                true,
                "Chốt điện nước thành công, và đã tạo hóa đơn",
                null
            ));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("danh-sach-thang")]
    public async Task<IActionResult> GetDanhSachThangHoaDon([FromQuery] int maDayNt)
    {
        try
        {
            var minRecord = await _context.ChiSoDienNuocs
                .Where(x => x.MaPhongNavigation.MaDayNt == maDayNt)
                .OrderBy(x => x.Nam)
                .ThenBy(x => x.Thang)
                .Select(x => new { x.Thang, x.Nam })
                .FirstOrDefaultAsync();

            if (minRecord == null)
                return Ok(new ApiResponse<Object>(
                    true,
                    "Hiện chưa có hóa đơn nào",
                    null
                    ));

            var minMonth = minRecord.Thang;
            var minYear = minRecord.Nam;

            var now = DateTime.Now;
            var months = new List<object>();

            var year = minYear;
            var month = minMonth;

            while (year < now.Year || (year == now.Year && month <= now.Month))
            {
                months.Add(new { month, year });

                month++;
                if (month > 12)
                {
                    month = 1;
                    year++;
                }
            }

            return Ok(
                new ApiResponse<Object>(
                    true,
                    "Lấy danh sách tháng hóa đơn thành công",
                    months
                    ));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("doanh-thu")]
    public async Task<IActionResult> GetDoanhThu([FromQuery] int maNd)
    {
        try
        {
            int month = DateTime.Now.Month;
            int year = DateTime.Now.Year;

            int monthPre = month-1;
            int yearPre = year;
            if (month == 1)
            {
                monthPre = 12;
                yearPre -= 1;
            }

            var dntList = await _context.DayNhaTros
                .Where(dnt => dnt.MaChuNt == maNd)
                .Select(dnt => dnt.MaDayNt)
                .ToListAsync();

            var hdList = await _context.HoaDons
                .Where(hd => dntList.Contains(hd.MaHopDongNavigation.MaPhongNavigation.MaDayNt)
                    && hd.NgayLap.HasValue
                    && hd.NgayLap.Value.Month == month
                    && hd.NgayLap.Value.Year == year)
                .ToListAsync();

            var hdListPre = await _context.HoaDons
                .Where(hd => dntList.Contains(hd.MaHopDongNavigation.MaPhongNavigation.MaDayNt)
                    && hd.NgayLap.HasValue
                    && hd.NgayLap.Value.Month == monthPre
                    && hd.NgayLap.Value.Year == yearPre)
                .ToListAsync();

            decimal tongTien = hdList.Sum(hd => hd.TongTien ?? 0);
            decimal tongTienPre = hdListPre.Sum(hd => hd.TongTien ?? 0);

            decimal tyLeTangTruong = tongTienPre == 0
                ? (tongTien > 0 ? 100 : 0)
                : ((tongTien - tongTienPre) / tongTienPre) * 100;

            return Ok(
                new ApiResponse<object>(
                    true,
                    "Lấy doanh thu thành công",
                    new
                    {
                        tongTien,
                        tongTienPre,
                        tyLeTangTruong
                    }
                ));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("hoa-don-moi")]
    public async Task<IActionResult> GetHoaDonNew([FromQuery] int maNd)
    {
        try
        {
            int month = DateTime.Now.Month;
            int year = DateTime.Now.Year;

            HopDongNguoiThue hdnt = await _context.HopDongNguoiThues.Where(hd_nt => hd_nt.MaNt == maNd && hd_nt.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.DangHieuLuc)
                .Include(hdnt => hdnt.MaHopDongNavigation)
                .FirstOrDefaultAsync();

            if(hdnt==null)
                return BadRequest(new ApiResponse<HoaDonDto>(false, "Thông tin không hợp lệ", null));

            HoaDon hdTemp = await _context.HoaDons.Where(hd => hd.MaHopDong == hdnt.MaHopDong && hd.NgayLap.HasValue && hd.NgayLap.Value.Month == month && hd.NgayLap.Value.Year == year && hd.MaTthoaDon != TrangThaiHoaDonConstant.DaThanhToan)
                .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.HopDongNguoiThues)
                    .ThenInclude(hdnt => hdnt.MaNtNavigation)
                    .ThenInclude(nt => nt.MaNtNavigation)
                .Include(hd => hd.MaHopDongNavigation)
                    .ThenInclude(hd => hd.MaPhongNavigation)
                    .ThenInclude(p => p.MaDayNtNavigation)
                .Include(hd => hd.MaChiSoNavigation)
                .FirstOrDefaultAsync();

            if (hdTemp==null)
                return Ok(new ApiResponse<HoaDonDto>(true, "Chưa chốt sổ hóa đơn", null));

            if (hdTemp.MaTthoaDon != TrangThaiHoaDonConstant.ChuaThanhToan)
                return Ok(new ApiResponse<HoaDonDto>(true, "Hóa đơn đã được thanh toán", null));

            HoaDonDto hd = new HoaDonDto
            {
                MaHoaDon = hdTemp.MaHoaDon,
                MaTthoaDon = hdTemp.MaTthoaDon,
                TienDien = hdTemp.TienDien,
                TienNuoc = hdTemp.TienNuoc,
                TienPhong = hdTemp.TienPhong,
                TongTien = hdTemp.TongTien,
                NgayLap = hdTemp.NgayLap,
                SoPhong = hdTemp.MaHopDongNavigation?.MaPhongNavigation?.SoPhong ?? "",
            };
            return Ok(new ApiResponse<HoaDonDto>(true, "Thông tin chi tiết hóa đơn", hd));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("lich-su-thanh-toan-gan")]
    public async Task<IActionResult> GetLichSuThanhToanGan([FromQuery] int maNd)
    {
        try
        {
            List<LichSuThanhToan>  lsLichSuTT = await _context.LichSuThanhToans.Where(lstt => lstt.MaHoaDonNavigation.MaHopDongNavigation.HopDongNguoiThues.First().MaNt == maNd).ToListAsync();

            lsLichSuTT.Sort((a, b) => b.NgayThanhToan.Value.CompareTo(a.NgayThanhToan.Value));

            lsLichSuTT.Capacity = 5;

            List<LichSuThanhToanDto> listLichSu = lsLichSuTT.Select(lstt => new LichSuThanhToanDto
            {
                MaLstt = lstt.MaLstt,
                MaHoaDon = lstt.MaHoaDon,
                SoTien = lstt.SoTien,
                NgayThanhToan = lstt.NgayThanhToan,
                GhiChu = lstt.GhiChu,
                MaPhuongThuc = lstt.MaPttt,
            }).ToList();

            return Ok(new ApiResponse<List<LichSuThanhToanDto>>(true, "Lấy lịch sử thanh toán gần nhất thành công", listLichSu));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("thong-ke-chi-tieu")]
    public async Task<IActionResult> GetThongKeChiTieu([FromQuery] int maNd)
    {
        try
        {
            var lst = await _context.HoaDons
                .Where(hd => hd.MaHopDongNavigation.HopDongNguoiThues.Any(nt => nt.MaNt == maNd))
                .OrderByDescending(hd => hd.NgayLap)
                .Take(6)
                .ToListAsync();

            var lstHd = lst.Select(hd => new HoaDonDto
            {
                MaHoaDon = hd.MaHoaDon,
                NgayLap = hd.NgayLap,
                TongTien = hd.TongTien,
            }).ToList();

            return Ok(new ApiResponse<List<HoaDonDto>>(true, "Lấy lịch sử hóa đ gần nhất thành công", lstHd));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }

    [HttpGet("chi-tiet-giao-dich")]
    public async Task<IActionResult> getChiTietGiaoDich([FromQuery] int maLstt)
    {
        try
        {
            LichSuThanhToan lsttTemp = await _context.LichSuThanhToans.Where(lstt => lstt.MaLstt == maLstt)
                .Include(lstt => lstt.MaHoaDonNavigation)
                .ThenInclude( hd => hd.MaHopDongNavigation)
                .ThenInclude( hd => hd.MaPhongNavigation)
                .ThenInclude( p => p.MaDayNtNavigation)
                .FirstOrDefaultAsync();

            LichSuThanhToanDto lichSu = new LichSuThanhToanDto
            {
                MaLstt = lsttTemp.MaLstt,
                MaHoaDon = lsttTemp.MaHoaDon,
                SoTien = lsttTemp.SoTien,
                NgayThanhToan = lsttTemp.NgayThanhToan,
                MaGiaoDich = lsttTemp.MaGiaoDich,
                GhiChu = lsttTemp.GhiChu,
                MaPhuongThuc = lsttTemp.MaPttt,
                ngayLapHd = (DateTime)(lsttTemp.MaHoaDonNavigation?.NgayLap),
                soPhong = lsttTemp.MaHoaDonNavigation.MaHopDongNavigation.MaPhongNavigation.SoPhong,
                tenDayNhaTro = lsttTemp.MaHoaDonNavigation.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation.TenDayNt
            };

            return Ok(new ApiResponse<LichSuThanhToanDto>(true, "Lấy lịch sử thanh toán gần nhất thành công", lichSu));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>(false, ex.Message, null));
        }
    }
}
