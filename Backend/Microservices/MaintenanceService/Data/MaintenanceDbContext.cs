using Microsoft.EntityFrameworkCore;
using MaintenanceService.Models;

namespace MaintenanceService.Data
{
    public class MaintenanceDbContext : DbContext
    {
        public MaintenanceDbContext(DbContextOptions<MaintenanceDbContext> options) : base(options) { }

        public DbSet<BaoCaoSuCo> BaoCaoSuCos { get; set; }
        public DbSet<ChiTietSuCo> ChiTietSuCos { get; set; }
        public DbSet<LichSuBaoTri> LichSuBaoTris { get; set; }
        public DbSet<ThietBi> ThietBis { get; set; }
        public DbSet<PhongThietBi> PhongThietBis { get; set; }
        
        // Dummy
        public DbSet<ThongBao> ThongBaos { get; set; }
        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<NguoiThueTro> NguoiThueTros { get; set; }
        public DbSet<HopDongNguoiThue> HopDongNguoiThues { get; set; }
        public DbSet<HopDongThue> HopDongThues { get; set; }
        public DbSet<Phong> Phongs { get; set; }
        public DbSet<DayNhaTro> DayNhaTros { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Cấu hình các quan hệ ở đây nếu cần, nhưng do đã thiết lập 
            // các Annotation trong các Model nên có thể bỏ qua.
        }
    }
}
