using Grpc.Core;
using Shared.Integration.Protos;
using PropertyService.Data;
using Microsoft.EntityFrameworkCore;

namespace PropertyService.Services;

public class GrpcRoomService : RoomService.RoomServiceBase
{
    private readonly PropertyDbContext _context;

    public GrpcRoomService(PropertyDbContext context)
    {
        _context = context;
    }

    public override async Task<RoomAvailabilityResponse> CheckRoomAvailability(RoomRequest request, ServerCallContext context)
    {
        var room = await _context.Phongs.FindAsync(request.RoomId);

        if (room == null)
        {
            return new RoomAvailabilityResponse { IsAvailable = false, Price = 0 };
        }

        bool isAvailable = room.MaTtphong == 1; // 1 = Trống
        return new RoomAvailabilityResponse 
        { 
            IsAvailable = isAvailable, 
            Price = (double)room.GiaThucTe
        };
    }
}
