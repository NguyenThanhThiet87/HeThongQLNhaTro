using Grpc.Core;
using Shared.Integration.Protos;
using IdentityService.Data;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using Shared.Integration.Events;

namespace IdentityService.Services;

public class GrpcUserService : UserService.UserServiceBase
{
    private readonly IdentityDbContext _context;
    private readonly ILogger<GrpcUserService> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public GrpcUserService(IdentityDbContext context, ILogger<GrpcUserService> logger, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    public override async Task<UserInfoResponse> GetUserInfo(UserInfoRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Received gRPC request to get user info for ID: {UserId}", request.UserId);

        var user = await _context.NguoiDung.FindAsync(request.UserId);

        if (user == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"User with ID {request.UserId} not found."));
        }

        return new UserInfoResponse
        {
            Id = user.MaNd,
            HoTen = user.HoTen ?? string.Empty,
            SoDienThoai = user.SoDt ?? string.Empty
        };
    }

    public override async Task<GetOrCreateUserResponse> GetOrCreateUser(GetOrCreateUserRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Received gRPC request to GetOrCreateUser for Phone: {Phone}", request.SoDienThoai);

        var existingUser = await _context.NguoiDung.FirstOrDefaultAsync(u => u.SoDt == request.SoDienThoai);
        
        if (existingUser != null)
        {
            return new GetOrCreateUserResponse
            {
                UserId = existingUser.MaNd,
                Success = true,
                Message = "User already exists"
            };
        }

        DateOnly? parsedNgaySinh = null;
        if (!string.IsNullOrEmpty(request.NgaySinh) && DateOnly.TryParse(request.NgaySinh, out var ns))
        {
            parsedNgaySinh = ns;
        }

        var newUser = new Models.NguoiDung
        {
            HoTen = request.HoTen,
            SoDt = request.SoDienThoai,
            SoCccd = request.SoCccd,
            DiaChi = request.DiaChi,
            GioiTinh = request.GioiTinh,
            NgaySinh = parsedNgaySinh,
            MatKhau = "temp_hash_password", // Ideally this should be handled properly
            KichHoat = true,
            MaVaiTro = 3, // Nguoi Thue
            NgayTao = DateTime.UtcNow
        };

        _context.NguoiDung.Add(newUser);
        await _context.SaveChangesAsync();

        await _publishEndpoint.Publish<IUserCreatedEvent>(new
        {
            UserId = newUser.MaNd,
            HoTen = newUser.HoTen,
            Email = (string?)null,
            SoDienThoai = newUser.SoDt,
            SoCccd = newUser.SoCccd,
            DiaChi = newUser.DiaChi,
            GioiTinh = newUser.GioiTinh,
            NgaySinh = newUser.NgaySinh
        });

        return new GetOrCreateUserResponse
        {
            UserId = newUser.MaNd,
            Success = true,
            Message = "User created successfully"
        };
    }
}
