using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

// Old monolith context
using ServerQLNhaTro.Models;

// New microservices contexts
using IdentityService.Data;
using PropertyService.Data;
using ContractService.Data;
using UtilityService.Data;
using BillingService.Data;
using MaintenanceService.Data;
using CommunicationService.Data;

namespace MigrationTool
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting Data Migration...");

            var sqlServerConn = "Server=localhost;Database=QLPHONGTRO;Integrated Security=True;TrustServerCertificate=True";
            
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(sqlServerConn);
            
            using var oldDb = new AppDbContext(optionsBuilder.Options);

            // Connect to PostgreSQL Microservices Databases
            var identityDb = new IdentityDbContext(new DbContextOptionsBuilder<IdentityDbContext>().UseNpgsql("Host=localhost;Database=identity_db;Username=admin;Password=admin_password").Options);
            var propertyDb = new PropertyDbContext(new DbContextOptionsBuilder<PropertyDbContext>().UseNpgsql("Host=localhost;Database=property_db;Username=admin;Password=admin_password").Options);
            var contractDb = new ContractDbContext(new DbContextOptionsBuilder<ContractDbContext>().UseNpgsql("Host=localhost;Database=contract_db;Username=admin;Password=admin_password").Options);
            var utilityDb = new UtilityDbContext(new DbContextOptionsBuilder<UtilityDbContext>().UseNpgsql("Host=localhost;Database=utility_db;Username=admin;Password=admin_password").Options);
            var billingDb = new BillingDbContext(new DbContextOptionsBuilder<BillingDbContext>().UseNpgsql("Host=localhost;Database=billing_db;Username=admin;Password=admin_password").Options);
            var maintenanceDb = new MaintenanceDbContext(new DbContextOptionsBuilder<MaintenanceDbContext>().UseNpgsql("Host=localhost;Database=maintenance_db;Username=admin;Password=admin_password").Options);
            var commDb = new CommunicationDbContext(new DbContextOptionsBuilder<CommunicationDbContext>().UseNpgsql("Host=localhost;Database=communication_db;Username=admin;Password=admin_password").Options);

            // Create databases if not exists, though they should be created by migrations
            
            try
            {
                // Identity Service
                MigrateTable<ServerQLNhaTro.Models.VaiTroHeThong, IdentityService.Models.VaiTroHeThong>(oldDb, identityDb);
                MigrateTable<ServerQLNhaTro.Models.NguoiDung, IdentityService.Models.NguoiDung>(oldDb, identityDb);

                // Property Service
                MigrateTable<ServerQLNhaTro.Models.ChuNhaTro, PropertyService.Models.ChuNhaTro>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.DayNhaTro, PropertyService.Models.DayNhaTro>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.LoaiPhong, PropertyService.Models.LoaiPhong>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.TinhTrangPhong, PropertyService.Models.TinhTrangPhong>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.TrangThaiPhong, PropertyService.Models.TrangThaiPhong>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.ThietBi, PropertyService.Models.ThietBi>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.Phong, PropertyService.Models.Phong>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.PhongThietBi, PropertyService.Models.PhongThietBi>(oldDb, propertyDb);
                MigrateTable<ServerQLNhaTro.Models.AnhPhong, PropertyService.Models.AnhPhong>(oldDb, propertyDb);
                
                // Contract Service
                MigrateTable<ServerQLNhaTro.Models.TrangThaiHopDong, ContractService.Models.TrangThaiHopDong>(oldDb, contractDb);
                MigrateTable<ServerQLNhaTro.Models.TrangThaiTamTru, ContractService.Models.TrangThaiTamTru>(oldDb, contractDb);
                MigrateTable<ServerQLNhaTro.Models.VaiTroNguoiThue, ContractService.Models.VaiTroNguoiThue>(oldDb, contractDb);
                MigrateTable<ServerQLNhaTro.Models.NguoiThueTro, ContractService.Models.NguoiThueTro>(oldDb, contractDb);
                MigrateTable<ServerQLNhaTro.Models.NguoiLienHeKhanCap, ContractService.Models.NguoiLienHeKhanCap>(oldDb, contractDb);
                MigrateTable<ServerQLNhaTro.Models.HopDongThue, ContractService.Models.HopDongThue>(oldDb, contractDb);
                MigrateTable<ServerQLNhaTro.Models.HopDongNguoiThue, ContractService.Models.HopDongNguoiThue>(oldDb, contractDb);
                
                // Utility Service
                MigrateTable<ServerQLNhaTro.Models.DichVu, UtilityService.Models.DichVu>(oldDb, utilityDb);
                MigrateTable<ServerQLNhaTro.Models.ChiSoDienNuoc, UtilityService.Models.ChiSoDienNuoc>(oldDb, utilityDb);
                
                // Billing Service
                MigrateTable<ServerQLNhaTro.Models.TrangThaiHoaDon, BillingService.Models.TrangThaiHoaDon>(oldDb, billingDb);
                MigrateTable<ServerQLNhaTro.Models.PhuongThucThanhToan, BillingService.Models.PhuongThucThanhToan>(oldDb, billingDb);
                MigrateTable<ServerQLNhaTro.Models.HoaDon, BillingService.Models.HoaDon>(oldDb, billingDb);
                MigrateTable<ServerQLNhaTro.Models.DonHangDv, BillingService.Models.DonHangDv>(oldDb, billingDb);
                MigrateTable<ServerQLNhaTro.Models.ChiTietDh, BillingService.Models.ChiTietDh>(oldDb, billingDb);
                MigrateTable<ServerQLNhaTro.Models.LichSuThanhToan, BillingService.Models.LichSuThanhToan>(oldDb, billingDb);
                
                // Maintenance Service
                MigrateTable<ServerQLNhaTro.Models.TrangThaiXuLy, MaintenanceService.Models.TrangThaiXuLy>(oldDb, maintenanceDb);
                MigrateTable<ServerQLNhaTro.Models.NhaCungCap, MaintenanceService.Models.NhaCungCap>(oldDb, maintenanceDb);
                MigrateTable<ServerQLNhaTro.Models.BaoCaoSuCo, MaintenanceService.Models.BaoCaoSuCo>(oldDb, maintenanceDb);
                MigrateTable<ServerQLNhaTro.Models.ChiTietSuCo, MaintenanceService.Models.ChiTietSuCo>(oldDb, maintenanceDb);
                MigrateTable<ServerQLNhaTro.Models.LichSuBaoTri, MaintenanceService.Models.LichSuBaoTri>(oldDb, maintenanceDb);
                
                // Communication Service
                MigrateTable<ServerQLNhaTro.Models.ThongBao, CommunicationService.Models.ThongBao>(oldDb, commDb);
                
                Console.WriteLine("Data Migration Completed Successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during migration: " + ex.Message);
                if (ex.InnerException != null) {
                    Console.WriteLine("Inner Exception: " + ex.InnerException.Message);
                }
            }
        }

        static void MigrateTable<TOld, TNew>(DbContext oldContext, DbContext newContext) 
            where TOld : class 
            where TNew : class, new()
        {
            var tableName = typeof(TOld).Name;
            Console.WriteLine($"Migrating table {tableName}...");
            
            var oldData = oldContext.Set<TOld>().AsNoTracking().ToList();
            if (!oldData.Any()) return;

            var newData = new List<TNew>();
            var oldProps = typeof(TOld).GetProperties().Where(p => p.PropertyType.IsPrimitive || p.PropertyType.IsValueType || p.PropertyType == typeof(string)).ToList();
            var newProps = typeof(TNew).GetProperties().Where(p => p.PropertyType.IsPrimitive || p.PropertyType.IsValueType || p.PropertyType == typeof(string)).ToList();

            foreach (var oldItem in oldData)
            {
                var newItem = new TNew();
                foreach (var oldProp in oldProps)
                {
                    var newProp = newProps.FirstOrDefault(p => p.Name == oldProp.Name && p.PropertyType == oldProp.PropertyType);
                    if (newProp != null && newProp.CanWrite)
                    {
                        var value = oldProp.GetValue(oldItem);
                        newProp.SetValue(newItem, value);
                    }
                }
                newData.Add(newItem);
            }

            using var transaction = newContext.Database.BeginTransaction();
            
            try 
            {
                var entityType = newContext.Model.FindEntityType(typeof(TNew));
                var pgTableName = entityType.GetTableName();
                newContext.Database.ExecuteSqlRaw($"TRUNCATE TABLE \"{pgTableName}\" CASCADE;");
            } 
            catch { }
            
            newContext.Set<TNew>().AddRange(newData);
            newContext.SaveChanges();
            transaction.Commit();
            
            try 
            {
                // Update Sequence in PostgreSQL
                var entityType = newContext.Model.FindEntityType(typeof(TNew));
                var pgTableName = entityType.GetTableName();
                var pkProperty = entityType.FindPrimaryKey().Properties.First();
                var pkName = pkProperty.GetColumnName();
                
                // If it's an integer/long PK, it likely has a sequence
                if (pkProperty.ClrType == typeof(int) || pkProperty.ClrType == typeof(long))
                {
                    var sql = $"SELECT setval(pg_get_serial_sequence('\"{pgTableName}\"', '{pkName}'), coalesce(max(\"{pkName}\"), 1), true) FROM \"{pgTableName}\";";
                    newContext.Database.ExecuteSqlRaw(sql);
                }
            } 
            catch (Exception ex) 
            {
                Console.WriteLine($"Warning: Could not update sequence for {tableName}. This is normal if it doesn't use sequences. ({ex.Message})");
            }
        }
    }
}
