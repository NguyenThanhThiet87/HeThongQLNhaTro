using Microsoft.EntityFrameworkCore;
using PropertyService.Models;

namespace PropertyService.Data;

public class PropertyDbContext : DbContext
{
    public PropertyDbContext(DbContextOptions<PropertyDbContext> options) : base(options) { }

    public DbSet<Phong> Phongs { get; set; }
    public DbSet<DayNhaTro> DayNhaTros { get; set; }
    public DbSet<LoaiPhong> LoaiPhongs { get; set; }
    public DbSet<TrangThaiPhong> TrangThaiPhongs { get; set; }
    public DbSet<ThietBi> ThietBis { get; set; }
    public DbSet<PhongThietBi> PhongThietBis { get; set; }
    public DbSet<AnhPhong> AnhPhongs { get; set; }
    public DbSet<ChuNhaTro> ChuNhaTros { get; set; } // We might need this for DayNhaTro -> MaChuNt

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
