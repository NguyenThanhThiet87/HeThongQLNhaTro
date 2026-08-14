using Microsoft.EntityFrameworkCore;
using CommunicationService.Models;

namespace CommunicationService.Data
{
    public class CommunicationDbContext : DbContext
    {
        public CommunicationDbContext(DbContextOptions<CommunicationDbContext> options) : base(options) { }

        public DbSet<ThongBao> ThongBaos { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        
        // Dummy
        public DbSet<NguoiDung> NguoiDungs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
