using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using BillingService.Data;
using Microsoft.EntityFrameworkCore.Storage;
using BillingService.DTOs;
using BillingService.Hubs;
using BillingService.Models;

[Route("api/[controller]")]
[ApiController]
public class DichVuDonHangController : ControllerBase
{
    private readonly BillingDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public DichVuDonHangController(BillingDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // --- DỊCH VỤ ---
    [HttpGet("dich-vu")]
    public async Task<IActionResult> GetDichVus()
    {
        return Ok(await _context.DichVus.Include(d => d.MaNccNavigation.MaNccNavigation).ToListAsync());
    }

    // --- ĐƠN HÀNG ---
    [HttpPost("dat-hang")]
    public async Task<IActionResult> CreateDonHang([FromBody] DonHangCreateDto model)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Kiểm tra và tự động tạo NguoiThueTro nếu chưa có (dành cho các user cũ)
            var existingTenant = await _context.NguoiThueTros
                .Include(nt => nt.MaNtNavigation)
                .FirstOrDefaultAsync(nt => nt.MaNt == model.MaNt);

            if (existingTenant == null)
            {
                var user = await _context.NguoiDungs.FindAsync(model.MaNt);
                if (user == null)
                    return BadRequest(new ApiResponse<object>(false, "Không tìm thấy thông tin người dùng", null));

                existingTenant = new NguoiThueTro { MaNt = model.MaNt };
                _context.NguoiThueTros.Add(existingTenant);
                await _context.SaveChangesAsync();

                // Load lại để có thông tin navigation HoTen
                existingTenant.MaNtNavigation = user;
            }

            var dh = new DonHangDv
            {
                MaNt = model.MaNt,
                TrangThaiDh = "Mới",
                TongTien = 0,
                NgayDat = DateTime.Now,
                GhiChu = model.GhiChu
            };
            _context.DonHangDvs.Add(dh);
            await _context.SaveChangesAsync();

            decimal tongTien = 0;
            int? maNccDauTien = null;
            string tenDvDauTien = "";

            if (model.ChiTiet != null && model.ChiTiet.Count > 0)
            {
                foreach (var item in model.ChiTiet)
                {
                    var dv = await _context.DichVus.FindAsync(item.MaDv);
                    if (dv == null) continue;

                    // Lấy nhà cung cấp của dịch vụ đầu tiên để gửi thông báo
                    if (maNccDauTien == null)
                    {
                        maNccDauTien = dv.MaNcc;
                        tenDvDauTien = dv.TenDv;
                    }

                    decimal thanhTien = (dv.GiaTien ?? 0) * item.SoLuong;

                    _context.ChiTietDhs.Add(new ChiTietDh
                    {
                        MaDh = dh.MaDh,
                        MaDv = item.MaDv,
                        SoLuong = item.SoLuong,
                        ThanhTien = thanhTien
                    });
                    tongTien += thanhTien;
                }
            }

            dh.TongTien = tongTien;
            dh.MaNcc = maNccDauTien; // Lưu lại MaNcc chính của đơn hàng
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // 2. Tạo thông báo cho Nhà Cung Cấp
            if (dh.MaNcc.HasValue)
            {
                string hoTenKhach = existingTenant?.MaNtNavigation?.HoTen ?? "Khách hàng";
                var thongBao = new ThongBao
                {
                    MaNd = dh.MaNcc.Value,
                    TieuDe = "Có đơn hàng dịch vụ mới! 📦",
                    NoiDung = $"{hoTenKhach} vừa đặt đơn hàng: {tenDvDauTien}...",
                    NgayTao = DateTime.Now,
                    DaDoc = false,
                    MaThucThe = dh.MaDh,
                    LoaiTb = "DonHang"
                };
                _context.ThongBaos.Add(thongBao);
                await _context.SaveChangesAsync();

                // Gửi thông báo real-time qua SignalR tới Provider
                await _hubContext.Clients.User(dh.MaNcc.Value.ToString())
                    .SendAsync("ReceiveNotification", new
                    {
                        title = thongBao.TieuDe,
                        message = thongBao.NoiDung,
                        maDh = dh.MaDh,
                        type = "NEW_ORDER", // Quan trọng: Để frontend nhận biết và reload dữ liệu
                        tongTien = dh.TongTien,
                        ngayDat = dh.NgayDat
                    });
            }

            return Ok(new ApiResponse<object>(true, "Đặt hàng thành công", new { 
                MaDh = dh.MaDh,
                TongTien = dh.TongTien
            }));
        }
        catch (Exception ex)
        {
            if (transaction.GetDbTransaction() != null)
                await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpPost("manual-dat-hang")]
    public async Task<IActionResult> CreateManualDonHang([FromBody] ManualOrderCreateDto model)
    {
        // 1. Tìm MaNt từ SĐT và Số Phòng
        var nguoiThue = await _context.HopDongNguoiThues
            .Include(h => h.MaNtNavigation.MaNtNavigation)
            .Include(h => h.MaHopDongNavigation.MaPhongNavigation)
            .OrderByDescending(h => h.NgayVao) // Lấy hợp đồng mới nhất
            .FirstOrDefaultAsync(h => h.MaNtNavigation.MaNtNavigation.SoDt == model.SoDt);

        if (nguoiThue == null)
            return BadRequest(new ApiResponse<object>(false, "Không tìm thấy người thuê trọ khớp với thông tin cung cấp", null));

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var dh = new DonHangDv
            {
                MaNt = nguoiThue.MaNt,
                TrangThaiDh = "Đã hoàn thành", // Manual order thường là lập khi đã xong hoặc chắc chắn giao
                TongTien = 0,
                NgayDat = DateTime.Now,
                GhiChu = model.GhiChu
            };

            _context.DonHangDvs.Add(dh);
            await _context.SaveChangesAsync();

            decimal tongTien = 0;
            if (model.ChiTiet != null)
            {
                foreach (var item in model.ChiTiet)
                {
                    var dv = await _context.DichVus.FindAsync(item.MaDv);
                    if (dv == null) continue;

                    decimal thanhTien = (decimal)(dv.GiaTien * item.SoLuong);

                    _context.ChiTietDhs.Add(new ChiTietDh
                    {
                        MaDh = dh.MaDh,
                        MaDv = item.MaDv,
                        SoLuong = item.SoLuong,
                        ThanhTien = thanhTien
                    });
                    tongTien += thanhTien;
                }
            }

            dh.TongTien = tongTien;
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new ApiResponse<object>(true, "Lập đơn hàng thành công", dh));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new ApiResponse<object>(false, ex.Message, null));
        }
    }

    [HttpGet("trang-thai")]
    public async Task<IActionResult> GetTrangThai()
    {
        try
        {
            // Lấy các trạng thái hiện có trong DB
            var existingStatuses = await _context.DonHangDvs
                .Select(d => d.TrangThaiDh)
                .Where(s => s != null)
                .Distinct()
                .ToListAsync();

            // Danh sách trạng thái chuẩn cần có
            var standardStatuses = new List<string> { "Mới", "Đang xử lý", "Đang giao", "Đã hoàn thành", "Đã hủy" };

            // Hợp nhất và giữ thứ tự chuẩn
            var result = standardStatuses.Union(existingStatuses).ToList();

            return Ok(new ApiResponse<List<string>>(true, "Lấy danh sách trạng thái thành công", result));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("ncc/{maNcc}/status")]
    public async Task<IActionResult> GetDonHangsByNccAndStatus(int maNcc, [FromQuery] string status)
    {
        try
        {
            var orders = await _context.DonHangDvs
                .Include(d => d.MaNtNavigation.MaNtNavigation)
                .Include(d => d.ChiTietDhs)
                    .ThenInclude(ct => ct.MaDvNavigation)
                .Where(d => d.TrangThaiDh == status && d.ChiTietDhs.Any(ct => ct.MaDvNavigation.MaNcc == maNcc))
                .OrderByDescending(d => d.NgayDat)
                .Select(d => new
                {
                    d.MaDh,
                    HoTen = d.MaNtNavigation.MaNtNavigation.HoTen,
                    SoDt = d.MaNtNavigation.MaNtNavigation.SoDt,
                    NgayDat = d.NgayDat,
                    TongTien = d.TongTien,
                    TrangThaiDh = d.TrangThaiDh,
                    GhiChu = d.GhiChu,
                    // Lấy số phòng từ hợp đồng mới nhất của người thuê
                    SoPhong = _context.HopDongNguoiThues
                        .Include(h => h.MaHopDongNavigation.MaPhongNavigation)
                        .Where(h => h.MaNt == d.MaNt)
                        .OrderByDescending(h => h.NgayVao)
                        .Select(h => h.MaHopDongNavigation.MaPhongNavigation.SoPhong)
                        .FirstOrDefault(),
                    ChiTiet = d.ChiTietDhs.Select(ct => new
                    {
                        ct.MaDv,
                        ct.MaDvNavigation.TenDv,
                        ct.MaDvNavigation.HinhAnh,
                        ct.SoLuong,
                        ct.ThanhTien
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(true, "Lấy danh sách đơn hàng thành công", orders));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDonHangById(int id)
    {
        try
        {
            var order = await _context.DonHangDvs
                .Include(d => d.MaNtNavigation.MaNtNavigation)
                .Include(d => d.ChiTietDhs)
                    .ThenInclude(ct => ct.MaDvNavigation)
                .Where(d => d.MaDh == id)
                .Select(d => new
                {
                    d.MaDh,
                    HoTen = d.MaNtNavigation.MaNtNavigation.HoTen,
                    SoDt = d.MaNtNavigation.MaNtNavigation.SoDt,
                    NgayDat = d.NgayDat,
                    TongTien = d.TongTien,
                    TrangThaiDh = d.TrangThaiDh,
                    GhiChu = d.GhiChu,
                    ThongTinPhong = _context.HopDongNguoiThues
                        .Include(h => h.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation)
                        .Where(h => h.MaNt == d.MaNt)
                        .OrderByDescending(h => h.NgayVao)
                        .Select(h => new
                        {
                            SoPhong = h.MaHopDongNavigation.MaPhongNavigation.SoPhong,
                            TenDay = h.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation.TenDayNt,
                            DiaChi = h.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation.DiaChi
                        })
                        .FirstOrDefault(),
                    ChiTiet = d.ChiTietDhs.Select(ct => new
                    {
                        ct.MaDv,
                        ct.MaDvNavigation.TenDv,
                        ct.MaDvNavigation.HinhAnh,
                        ct.MaDvNavigation.GiaTien,
                        ct.SoLuong,
                        ct.ThanhTien
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy đơn hàng", null));

            return Ok(new ApiResponse<object>(true, "Lấy chi tiết đơn hàng thành công", order));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("tenant/{maNt}")]
    public async Task<IActionResult> GetDonHangsByTenant(int maNt)
    {
        try
        {
            var orders = await _context.DonHangDvs
                .Include(d => d.ChiTietDhs)
                    .ThenInclude(ct => ct.MaDvNavigation)
                        .ThenInclude(dv => dv.MaNccNavigation.MaNccNavigation)
                .Where(d => d.MaNt == maNt)
                .OrderByDescending(d => d.NgayDat)
                .Select(d => new
                {
                    d.MaDh,
                    d.NgayDat,
                    d.TongTien,
                    d.TrangThaiDh,
                    d.GhiChu,
                    ChiTiet = d.ChiTietDhs.Select(ct => new
                    {
                        ct.MaDv,
                        ct.MaDvNavigation.TenDv,
                        ct.MaDvNavigation.HinhAnh,
                        HoTenNcc = ct.MaDvNavigation.MaNccNavigation.MaNccNavigation.HoTen, 
                        ct.SoLuong,
                        ct.ThanhTien
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(true, "Lấy danh sách đơn hàng thành công", orders));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto model)
    {
        try
        {
            var order = await _context.DonHangDvs.FindAsync(id);
            if (order == null)
                return NotFound(new ApiResponse<object>(false, "Không tìm thấy đơn hàng", null));

            string oldStatus = order.TrangThaiDh;
            order.TrangThaiDh = model.Status;
            await _context.SaveChangesAsync();

            // Notify tenant when provider starts delivery
            if (model.Status == "Đang giao" && oldStatus != "Đang giao")
            {
                var orderDetail = await _context.DonHangDvs
                    .Include(d => d.MaNccNavigation)
                        .ThenInclude(ncc => ncc.MaNccNavigation)
                    .FirstOrDefaultAsync(d => d.MaDh == id);

                if (orderDetail != null)
                {
                    string providerName = orderDetail.MaNccNavigation?.MaNccNavigation?.HoTen ?? "Người cung cấp";
                    var thongBao = new ThongBao
                    {
                        MaNd = orderDetail.MaNt,
                        TieuDe = "Đơn hàng đang giao 🚚",
                        NoiDung = $"Đơn hàng #{id} của bạn đã bắt đầu được giao bởi {providerName}.",
                        NgayTao = DateTime.Now,
                        DaDoc = false,
                        MaThucThe = id,
                        LoaiTb = "DonHang"
                    };
                    _context.ThongBaos.Add(thongBao);
                    await _context.SaveChangesAsync();

                    // Gửi thông báo SignalR và bọc trong try-catch để không làm treo API nếu SignalR gặp sự cố
                    try 
                    {
                        await _hubContext.Clients.User(orderDetail.MaNt.ToString())
                            .SendAsync("ReceiveNotification", new
                            {
                                title = "Đơn hàng của bạn đang đến",
                                message = thongBao.NoiDung,
                                maDh = id,
                                status = "Đang giao"
                            });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("SignalR error: " + ex.Message);
                    }
                }
            }

            return Ok(new ApiResponse<object>(true, "Cập nhật trạng thái thành công", order));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("ncc/{maNcc}/stats")]
    public async Task<IActionResult> GetDonHangStats(int maNcc)
    {
        try
        {
            var today = DateTime.Today;

            var newOrdersCount = await _context.DonHangDvs
                .Where(d => d.TrangThaiDh == "Mới" && d.ChiTietDhs.Any(ct => ct.MaDvNavigation.MaNcc == maNcc))
                .CountAsync();

            var todayRevenue = await _context.DonHangDvs
                .Where(d => d.NgayDat == today
                       && d.TrangThaiDh != "Đã hủy"
                       && d.ChiTietDhs.Any(ct => ct.MaDvNavigation.MaNcc == maNcc))
                .SumAsync(d => d.TongTien);

            var stats = new
            {
                NewOrders = newOrdersCount,
                TodayRevenue = todayRevenue
            };

            return Ok(new ApiResponse<object>(true, "Lấy thống kê thành công", stats));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }

    [HttpGet("ncc/{maNcc}/revenue-chart")]
    public async Task<IActionResult> GetRevenueChart(int maNcc, [FromQuery] int days = 7)
    {
        try
        {
            var endDate = DateTime.Today;
            var startDate = endDate.AddDays(-(days - 1));

            var orders = await _context.DonHangDvs
                .Where(d => d.NgayDat >= startDate && d.NgayDat <= endDate
                       && d.TrangThaiDh != "Đã hủy"
                       && d.ChiTietDhs.Any(ct => ct.MaDvNavigation.MaNcc == maNcc))
                .Select(d => new { d.NgayDat, d.TongTien })
                .ToListAsync();

            var chartData = Enumerable.Range(0, days)
                .Select(offset =>
                {
                    var date = startDate.AddDays(offset);
                    return new
                    {
                        Label = date.ToString("dd/MM"),
                        Value = (double)orders.Where(o => o.NgayDat == date).Sum(o => o.TongTien)
                    };
                })
                .ToList();

            return Ok(new ApiResponse<object>(true, "Lấy dữ liệu biểu đồ thành công", chartData));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(false, "Lỗi: " + ex.Message, null));
        }
    }
}

public class OrderStatusUpdateDto
{
    public string Status { get; set; }
}
