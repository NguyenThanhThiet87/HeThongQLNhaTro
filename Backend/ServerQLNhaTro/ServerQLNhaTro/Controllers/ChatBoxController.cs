using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.Constants;
using ServerQLNhaTro.Controllers;
using ServerQLNhaTro.DTOs;
using ServerQLNhaTro.DTOs.ResponseDtos;
using ServerQLNhaTro.Models;
using ServerQLNhaTro.Models.ChatBox;
using ServerQLNhaTro.Services;

[Route("api/[controller]")]
[ApiController]
public class ChatBoxController : ControllerBase
{
    
    private readonly ChatService _chatService;
    private readonly AppDbContext _context;

    public ChatBoxController(ChatService chatService, AppDbContext context)
    {
        _chatService = chatService;
        _context = context;
    }

    [HttpPost("Ask")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest req)
    {
        var hopDongtemp = _context.HopDongNguoiThues.Where(hd => hd.MaNt == req.MaNd && hd.MaHopDongNavigation.MaTthopDong == TrangThaiHopDongConstant.DangHieuLuc)
                                                .Include(hd => hd.MaHopDongNavigation)
                                                .ThenInclude(hd => hd.MaChuNtNavigation)
                                                .ThenInclude(cnt => cnt.MaChuNtNavigation)
                                                .Include(hd => hd.MaHopDongNavigation)
                                                .ThenInclude(hd => hd.MaPhongNavigation)
                                                .ThenInclude(p => p.MaDayNtNavigation)
                                                .FirstOrDefault();

        var chuNhaTro = hopDongtemp.MaHopDongNavigation.MaChuNtNavigation.MaChuNtNavigation;
        var dayNhaTro = hopDongtemp.MaHopDongNavigation.MaPhongNavigation.MaDayNtNavigation;
        var phong = hopDongtemp.MaHopDongNavigation.MaPhongNavigation;
        var hopDong = hopDongtemp.MaHopDongNavigation;

        var content = $"""
            Chủ nhà trọ: 
                - Họ tên: {chuNhaTro.HoTen}
                - Số điện thoại: {chuNhaTro.SoDt}
                - Địa chỉ: {chuNhaTro.DiaChi}
            Dãy nhà trọ: 
                - Nhà trọ: {dayNhaTro.TenDayNt}
                - Địa chỉ: {dayNhaTro.DiaChi}
                - Số lượng phòng: {dayNhaTro.Slphong} phòng
            Phòng đang ở: 
                - Số phòng: {phong.SoPhong}
            HopDong: 
                - Giá điện: {hopDong.GiaDien}{hopDong.DonViDien}
                - Giá nước: {hopDong.GiaNuoc}{hopDong.DonViNuoc}
                - Giá phòng đang thuê: {hopDong.GiaThue}
                - Tiền đặt cọc: {hopDong.TienDatCoc}
                - Thời hạn hợp đồng: {hopDong.NgayBdhl} - {hopDong.NgayKthl}
            """;
       
        var answer = await _chatService.AskLLM(req.Message, content);

        return Ok(new ApiResponse<object>(
            success: true,
            message: "",
            data: new
            {
                question = req.Message,
                answer = answer
            }
        ));
    }
}