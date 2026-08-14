using Microsoft.EntityFrameworkCore;
using UtilityService.Models;

namespace UtilityService.Data
{
    public class UtilityDbContext : DbContext
    {
        public UtilityDbContext(DbContextOptions<UtilityDbContext> options) : base(options) { }

        public DbSet<DichVu> DichVus { get; set; }
        public DbSet<ChiSoDienNuoc> ChiSoDienNuocs { get; set; }
        public DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public DbSet<HopDongNguoiThue> HopDongNguoiThues { get; set; }
    }
}
