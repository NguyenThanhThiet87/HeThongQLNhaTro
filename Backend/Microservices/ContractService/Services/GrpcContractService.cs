using Grpc.Core;
using Shared.Integration.Protos;
using ContractService.Data;
using Microsoft.EntityFrameworkCore;
using ContractService.Constants;

namespace ContractService.Services;

public class GrpcContractService : ContractQueryService.ContractQueryServiceBase
{
    private readonly ContractDbContext _context;

    public GrpcContractService(ContractDbContext context)
    {
        _context = context;
    }

    public override async Task<ActiveContractResponse> GetActiveContract(ActiveContractRequest request, ServerCallContext context)
    {
        var contract = await _context.HopDongThues
            .Include(h => h.HopDongNguoiThues)
            .Where(h => h.MaPhong == request.RoomId && h.MaTthopDong == TrangThaiHopDongConstant.DangHieuLuc)
            .FirstOrDefaultAsync();

        if (contract == null)
        {
            return new ActiveContractResponse { HasContract = false };
        }

        var tenantId = contract.HopDongNguoiThues
            .Where(nt => nt.MaVaiTro == VaiTroNguoiThueConstant.NguoiDaiDien)
            .Select(nt => nt.MaNt)
            .FirstOrDefault();

        return new ActiveContractResponse
        {
            HasContract = true,
            ContractId = contract.MaHopDong,
            TenantId = tenantId,
            Deposit = (double)(contract.TienDatCoc ?? 0m),
            RentPrice = (double)contract.GiaThue,
            ElectricityPrice = (double)contract.GiaDien,
            WaterPrice = (double)contract.GiaNuoc,
            RepresentativeId = tenantId
        };
    }
}
