using Grpc.Core;
using Shared.Integration.Protos;
using UtilityService.Data;
using UtilityService.Models;
using Microsoft.EntityFrameworkCore;

namespace UtilityService.Services
{
    public class GrpcUtilityService : UtilityIndexService.UtilityIndexServiceBase
    {
        private readonly UtilityDbContext _context;
        private readonly ILogger<GrpcUtilityService> _logger;

        public GrpcUtilityService(UtilityDbContext context, ILogger<GrpcUtilityService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public override async Task<UtilityIndexResponse> GetUtilityIndex(UtilityIndexRequest request, ServerCallContext context)
        {
            _logger.LogInformation("Received request to get utility index for Room: {RoomId}, Month: {Month}, Year: {Year}", request.RoomId, request.Month, request.Year);

            int monthOld = request.Month;
            int yearOld = request.Year;
            if (monthOld == 1)
            {
                monthOld = 12;
                yearOld -= 1;
            }
            else
            {
                monthOld -= 1;
            }

            var csdnOld = await _context.ChiSoDienNuocs
                .Where(c => c.MaPhong == request.RoomId && c.Thang == monthOld && c.Nam == yearOld)
                .FirstOrDefaultAsync();

            if (csdnOld == null)
            {
                return new UtilityIndexResponse
                {
                    Exists = false,
                    ElectricityOld = 0,
                    WaterOld = 0,
                    ElectricityNew = 0,
                    WaterNew = 0
                };
            }

            return new UtilityIndexResponse
            {
                Exists = true,
                ElectricityOld = csdnOld.CsdienMoi ?? 0,
                WaterOld = csdnOld.CsnuocMoi ?? 0,
                ElectricityNew = 0, // Not determined yet
                WaterNew = 0
            };
        }

        public override async Task<RecordUtilityIndexResponse> RecordUtilityIndex(RecordUtilityIndexRequest request, ServerCallContext context)
        {
            _logger.LogInformation("Received request to record utility index for Room: {RoomId}", request.RoomId);

            var existingIndex = await _context.ChiSoDienNuocs
                .Where(c => c.MaPhong == request.RoomId && c.Thang == request.Month && c.Nam == request.Year)
                .FirstOrDefaultAsync();

            if (existingIndex != null)
            {
                return new RecordUtilityIndexResponse
                {
                    Success = false,
                    Message = "Chỉ số điện nước cho tháng này đã được ghi",
                    UtilityIndexId = existingIndex.MaChiSo
                };
            }

            var newIndex = new ChiSoDienNuoc
            {
                MaPhong = request.RoomId,
                Thang = request.Month,
                Nam = request.Year,
                CsdienCu = request.ElectricityOld,
                CsnuocCu = request.WaterOld,
                CsdienMoi = request.ElectricityNew,
                CsnuocMoi = request.WaterNew
            };

            _context.ChiSoDienNuocs.Add(newIndex);
            await _context.SaveChangesAsync();

            return new RecordUtilityIndexResponse
            {
                Success = true,
                Message = "Ghi nhận chỉ số điện nước thành công",
                UtilityIndexId = newIndex.MaChiSo
            };
        }
    }
}
