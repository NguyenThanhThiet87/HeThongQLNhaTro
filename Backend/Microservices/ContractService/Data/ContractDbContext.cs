using Microsoft.EntityFrameworkCore;
using ContractService.Models;

namespace ContractService.Data;

public class ContractDbContext : DbContext
{
    public ContractDbContext(DbContextOptions<ContractDbContext> options) : base(options) { }

    public DbSet<HopDongThue> HopDongThues { get; set; }
    public DbSet<HopDongNguoiThue> HopDongNguoiThues { get; set; }
    public DbSet<TrangThaiHopDong> TrangThaiHopDongs { get; set; }
    public DbSet<NguoiThueTro> NguoiThueTros { get; set; }
    public DbSet<VaiTroNguoiThue> VaiTroNguoiThues { get; set; }
    public DbSet<TrangThaiTamTru> TrangThaiTamTrus { get; set; }
    public DbSet<NguoiLienHeKhanCap> NguoiLienHeKhanCaps { get; set; }
    public DbSet<ContractService.Models.ReadReplicas.UserReadReplica> NguoiDungs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
