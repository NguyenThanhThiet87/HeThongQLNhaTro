using Microsoft.EntityFrameworkCore;
using BillingService.Models;

namespace BillingService.Data
{
    public class BillingDbContext : DbContext
    {
        public BillingDbContext(DbContextOptions<BillingDbContext> options) : base(options) { }

        public DbSet<HoaDon> HoaDons { get; set; }
        public DbSet<TrangThaiHoaDon> TrangThaiHoaDons { get; set; }
        public DbSet<ChiTietDh> ChiTietDhs { get; set; }
        public DbSet<DonHangDv> DonHangDvs { get; set; }
        public DbSet<PhuongThucThanhToan> PhuongThucThanhToans { get; set; }
        public DbSet<LichSuThanhToan> LichSuThanhToans { get; set; }
        public DbSet<ThongBao> ThongBaos { get; set; }
        public DbSet<HopDongNguoiThue> HopDongNguoiThues { get; set; }
        public DbSet<HopDongThue> HopDongThues { get; set; }
        public DbSet<Phong> Phongs { get; set; }
        public DbSet<ChiSoDienNuoc> ChiSoDienNuocs { get; set; }
        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<DayNhaTro> DayNhaTros { get; set; }
        public DbSet<NguoiThueTro> NguoiThueTros { get; set; }
        public DbSet<DichVu> DichVus { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HopDongNguoiThue>()
                .HasKey(x => new { x.MaHopDong, x.MaNt });

            base.OnModelCreating(modelBuilder);
        }
    }
}
