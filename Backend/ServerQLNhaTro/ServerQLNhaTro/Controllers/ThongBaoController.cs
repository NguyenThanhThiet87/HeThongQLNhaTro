using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerQLNhaTro.Models;

[Route("api/[controller]")]
[ApiController]
public class ThongBaoController : ControllerBase
{
    private readonly AppDbContext _context;

    public ThongBaoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("gui-thong-bao")]
    public async Task<IActionResult> SendNotification([FromBody] ThongBao model)
    {
        model.NgayTao = DateTime.Now;
        model.DaDoc = false;
        _context.ThongBaos.Add(model);
        await _context.SaveChangesAsync();
        return Ok("Đã gửi thông báo");
    }

    [HttpGet("danh-sach/{maNd}")]
    public async Task<IActionResult> GetNotifications(int maNd)
    {
        var list = await _context.ThongBaos
            .Where(t => t.MaNd == maNd)
            .OrderByDescending(t => t.NgayTao)
            .ToListAsync();
        return Ok(list);
    }

    // Quản lý Refresh Token (Thường dùng trong Auth Flow, nhưng demo CRUD ở đây)
    [HttpGet("refresh-tokens/{maNd}")]
    public async Task<IActionResult> GetTokens(int maNd)
    {
        var tokens = await _context.RefreshTokens
            .Where(t => t.MaNd == maNd)
            .ToListAsync();
        return Ok(tokens);
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] string token)
    {
        var rt = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
        if (rt == null) return NotFound();

        rt.BiThuHoi = true;
        await _context.SaveChangesAsync();
        return Ok("Token đã bị thu hồi");
    }
    [HttpPut("doc-thong-bao/{maTb}")]
    public async Task<IActionResult> MarkAsRead(int maTb)
    {
        var tb = await _context.ThongBaos.FindAsync(maTb);
        if (tb == null) return NotFound();

        tb.DaDoc = true;
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }
}