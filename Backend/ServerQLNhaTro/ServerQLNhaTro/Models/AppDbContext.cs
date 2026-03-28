using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ServerQLNhaTro.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AnhPhong> AnhPhongs { get; set; }

    public virtual DbSet<BaoCaoSuCo> BaoCaoSuCos { get; set; }

    public virtual DbSet<ChiSoDienNuoc> ChiSoDienNuocs { get; set; }

    public virtual DbSet<ChiTietDh> ChiTietDhs { get; set; }

    public virtual DbSet<ChiTietSuCo> ChiTietSuCos { get; set; }

    public virtual DbSet<ChuNhaTro> ChuNhaTros { get; set; }

    public virtual DbSet<DayNhaTro> DayNhaTros { get; set; }

    public virtual DbSet<DichVu> DichVus { get; set; }

    public virtual DbSet<DonHangDv> DonHangDvs { get; set; }

    public virtual DbSet<HoaDon> HoaDons { get; set; }

    public virtual DbSet<HopDongNguoiThue> HopDongNguoiThues { get; set; }

    public virtual DbSet<HopDongThue> HopDongThues { get; set; }

    public virtual DbSet<LichSuBaoTri> LichSuBaoTris { get; set; }

    public virtual DbSet<LichSuThanhToan> LichSuThanhToans { get; set; }

    public virtual DbSet<LoaiPhong> LoaiPhongs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NguoiLienHeKhanCap> NguoiLienHeKhanCaps { get; set; }

    public virtual DbSet<NguoiThueTro> NguoiThueTros { get; set; }

    public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; }

    public virtual DbSet<Phong> Phongs { get; set; }

    public virtual DbSet<PhongThietBi> PhongThietBis { get; set; }

    public virtual DbSet<PhuongThucThanhToan> PhuongThucThanhToans { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<ThietBi> ThietBis { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }

    public virtual DbSet<TinhTrangPhong> TinhTrangPhongs { get; set; }

    public virtual DbSet<TrangThaiHoaDon> TrangThaiHoaDons { get; set; }

    public virtual DbSet<TrangThaiHopDong> TrangThaiHopDongs { get; set; }

    public virtual DbSet<TrangThaiPhong> TrangThaiPhongs { get; set; }

    public virtual DbSet<TrangThaiTamTru> TrangThaiTamTrus { get; set; }

    public virtual DbSet<TrangThaiXuLy> TrangThaiXuLies { get; set; }

    public virtual DbSet<VaiTroHeThong> VaiTroHeThongs { get; set; }

    public virtual DbSet<VaiTroNguoiThue> VaiTroNguoiThues { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=THANHTHIET;Initial Catalog=QLPHONGTRO;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AnhPhong>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__AnhPhong__356240DF01004A08");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ThuTu).HasDefaultValue(0);

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.AnhPhongs).HasConstraintName("FK__AnhPhong__MaPhon__72C60C4A");
        });

        modelBuilder.Entity<BaoCaoSuCo>(entity =>
        {
            entity.HasKey(e => e.MaSuCo).HasName("PK__BaoCaoSu__A69DF79F6E206802");

            entity.Property(e => e.ThoiGian).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TongPhi).HasDefaultValue(0m);

            entity.HasOne(d => d.MaNtNavigation).WithMany(p => p.BaoCaoSuCos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BaoCaoSuCo__MaNT__1BC821DD");

            entity.HasOne(d => d.MaTtxuLyNavigation).WithMany(p => p.BaoCaoSuCos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BaoCaoSuC__MaTTX__1CBC4616");
        });

        modelBuilder.Entity<ChiSoDienNuoc>(entity =>
        {
            entity.HasKey(e => e.MaChiSo).HasName("PK__ChiSoDie__EBA18E15BD49E950");

            entity.Property(e => e.CsdienCu).HasDefaultValue(0);
            entity.Property(e => e.CsdienMoi).HasDefaultValue(0);
            entity.Property(e => e.CsnuocCu).HasDefaultValue(0);
            entity.Property(e => e.CsnuocMoi).HasDefaultValue(0);

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.ChiSoDienNuocs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiSoDien__MaPho__0A9D95DB");
        });

        modelBuilder.Entity<ChiTietDh>(entity =>
        {
            entity.HasKey(e => e.Pk).HasName("PK__ChiTietD__32150787B1EDEF1C");

            entity.Property(e => e.SoLuong).HasDefaultValue(1);

            entity.HasOne(d => d.MaDhNavigation).WithMany(p => p.ChiTietDhs).HasConstraintName("FK__ChiTietDH__MaDH__160F4887");

            entity.HasOne(d => d.MaDvNavigation).WithMany(p => p.ChiTietDhs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDH__MaDV__17036CC0");
        });

        modelBuilder.Entity<ChiTietSuCo>(entity =>
        {
            entity.HasKey(e => e.Pk).HasName("PK__ChiTietS__32150787725BCD87");

            entity.Property(e => e.CpphatSinh).HasDefaultValue(0m);

            entity.HasOne(d => d.MaBcscNavigation).WithMany(p => p.ChiTietSuCos).HasConstraintName("FK__ChiTietSu__MaBCS__208CD6FA");

            entity.HasOne(d => d.MaPhongThietBiNavigation).WithMany(p => p.ChiTietSuCos).HasConstraintName("FK__ChiTietSu__MaPho__2180FB33");
        });

        modelBuilder.Entity<ChuNhaTro>(entity =>
        {
            entity.HasKey(e => e.MaChuNt).HasName("PK__ChuNhaTr__3584D713DF8D60E2");

            entity.Property(e => e.MaChuNt).ValueGeneratedNever();
            entity.Property(e => e.DaDkkd).HasDefaultValue(false);

            entity.HasOne(d => d.MaChuNtNavigation).WithOne(p => p.ChuNhaTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChuNhaTro__MaChu__5070F446");
        });

        modelBuilder.Entity<DayNhaTro>(entity =>
        {
            entity.HasKey(e => e.MaDayNt).HasName("PK__DayNhaTr__6AFF93F183A235C0");

            entity.Property(e => e.Slphong).HasDefaultValue(0);
            entity.Property(e => e.TrangThaiNt).HasDefaultValue(true);

            entity.HasOne(d => d.MaChuNtNavigation).WithMany(p => p.DayNhaTros).HasConstraintName("FK_DAYNHATRO_CHUTRO");
        });

        modelBuilder.Entity<DichVu>(entity =>
        {
            entity.HasKey(e => e.MaDv).HasName("PK__DichVu__27258657ACB68300");

            entity.HasOne(d => d.MaNccNavigation).WithMany(p => p.DichVus)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DichVu__MaNCC__0D7A0286");
        });

        modelBuilder.Entity<DonHangDv>(entity =>
        {
            entity.HasKey(e => e.MaDh).HasName("PK__DonHangD__272586616AF2D7DB");

            entity.Property(e => e.NgayDat).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TongTien).HasDefaultValue(0m);

            entity.HasOne(d => d.MaNccNavigation).WithMany(p => p.DonHangDvs).HasConstraintName("FK_NhaCungCap");

            entity.HasOne(d => d.MaNtNavigation).WithMany(p => p.DonHangDvs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHangDV__MaNT__123EB7A3");
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.MaHoaDon).HasName("PK__HoaDon__835ED13B730A6EC3");

            entity.Property(e => e.NgayLap).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaChiSoNavigation).WithMany(p => p.HoaDons).HasConstraintName("FK_CSDN");

            entity.HasOne(d => d.MaHopDongNavigation).WithMany(p => p.HoaDons)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaHopDon__29221CFB");

            entity.HasOne(d => d.MaTthoaDonNavigation).WithMany(p => p.HoaDons)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaTTHoaD__2A164134");
        });

        modelBuilder.Entity<HopDongNguoiThue>(entity =>
        {
            entity.HasKey(e => e.Pk).HasName("PK__HopDong___321507878828ACDA");

            entity.HasOne(d => d.MaHopDongNavigation).WithMany(p => p.HopDongNguoiThues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong_N__MaHop__00200768");

            entity.HasOne(d => d.MaNtNavigation).WithMany(p => p.HopDongNguoiThues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong_Ng__MaNT__01142BA1");

            entity.HasOne(d => d.MaTttamTruNavigation).WithMany(p => p.HopDongNguoiThues).HasConstraintName("FK__HopDong_N__MaTTT__02FC7413");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.HopDongNguoiThues).HasConstraintName("FK__HopDong_N__MaVai__02084FDA");
        });

        modelBuilder.Entity<HopDongThue>(entity =>
        {
            entity.HasKey(e => e.MaHopDong).HasName("PK__HopDongT__36DD434283790263");

            entity.Property(e => e.DonViDien).HasDefaultValue("kWh");
            entity.Property(e => e.DonViNuoc).HasDefaultValue("m3");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaChuNtNavigation).WithMany(p => p.HopDongThues).HasConstraintName("FK_CHUHD");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.HopDongThues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDongTh__MaPho__7C4F7684");

            entity.HasOne(d => d.MaTthopDongNavigation).WithMany(p => p.HopDongThues)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDongTh__MaTTH__7D439ABD");
        });

        modelBuilder.Entity<LichSuBaoTri>(entity =>
        {
            entity.HasKey(e => e.MaBt).HasName("PK__LichSuBa__27247597D22ED589");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.LichSuBaoTris).HasConstraintName("FK__LichSuBao__MaPho__245D67DE");

            entity.HasOne(d => d.MaPhongThietBiNavigation).WithMany(p => p.LichSuBaoTris).HasConstraintName("FK__LichSuBao__MaPho__25518C17");
        });

        modelBuilder.Entity<LichSuThanhToan>(entity =>
        {
            entity.HasKey(e => e.MaLstt).HasName("PK__LichSuTh__78751B4E6CD70C5E");

            entity.Property(e => e.NgayThanhToan).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaHoaDonNavigation).WithMany(p => p.LichSuThanhToans)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichSuTha__MaHoa__2DE6D218");

            entity.HasOne(d => d.MaPtttNavigation).WithMany(p => p.LichSuThanhToans).HasConstraintName("FK_PTTT");
        });

        modelBuilder.Entity<LoaiPhong>(entity =>
        {
            entity.HasKey(e => e.MaLoaiP).HasName("PK__LoaiPhon__A3C2167F16A19434");

            entity.Property(e => e.GiaChuan).HasDefaultValue(0m);
            entity.Property(e => e.SnguoiToiDa).HasDefaultValue(1);

            entity.HasOne(d => d.MaChuNtNavigation).WithMany(p => p.LoaiPhongs).HasConstraintName("FK_LoaiPhong_ChuNhaTro");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNd).HasName("PK__NguoiDun__2725D724E0910B4B");

            entity.Property(e => e.KichHoat).HasDefaultValue(true);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs).HasConstraintName("FK_VaiTro");
        });

        modelBuilder.Entity<NguoiLienHeKhanCap>(entity =>
        {
            entity.HasKey(e => e.MaNlh).HasName("PK__NguoiLie__3A1B928B337A03AA");

            entity.HasOne(d => d.MaNtNavigation).WithMany(p => p.NguoiLienHeKhanCaps)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiLienH__MaNT__6477ECF3");
        });

        modelBuilder.Entity<NguoiThueTro>(entity =>
        {
            entity.HasKey(e => e.MaNt).HasName("PK__NguoiThu__2725D7344A83E22E");

            entity.Property(e => e.MaNt).ValueGeneratedNever();

            entity.HasOne(d => d.MaNtNavigation).WithOne(p => p.NguoiThueTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiThueT__MaNT__534D60F1");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.MaNcc).HasName("PK__NhaCungC__3A185DEB4A000ED1");

            entity.Property(e => e.MaNcc).ValueGeneratedNever();
            entity.Property(e => e.DanhGiaTb).HasDefaultValue(0.0);
            entity.Property(e => e.SanSang).HasDefaultValue(true);

            entity.HasOne(d => d.MaNccNavigation).WithOne(p => p.NhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NhaCungCa__MaNCC__5812160E");
        });

        modelBuilder.Entity<Phong>(entity =>
        {
            entity.HasKey(e => e.MaPhong).HasName("PK__Phong__20BD5E5B26528388");

            entity.HasOne(d => d.MaDayNtNavigation).WithMany(p => p.Phongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Phong__MaDayNT__6B24EA82");

            entity.HasOne(d => d.MaLoaiPNavigation).WithMany(p => p.Phongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Phong__MaLoaiP__6C190EBB");

            entity.HasOne(d => d.MaTtphongNavigation).WithMany(p => p.Phongs).HasConstraintName("FK__Phong__MaTTPhong__6D0D32F4");

            entity.HasOne(d => d.MaTtrPhongNavigation).WithMany(p => p.Phongs).HasConstraintName("FK__Phong__MaTTrPhon__6E01572D");
        });

        modelBuilder.Entity<PhongThietBi>(entity =>
        {
            entity.HasKey(e => e.MaPhongThietBi).HasName("PK__Phong_Th__7E2FB1622B035E2B");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.PhongThietBis).HasConstraintName("FK__Phong_Thi__MaPho__75A278F5");

            entity.HasOne(d => d.MaThBiNavigation).WithMany(p => p.PhongThietBis)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Phong_Thi__MaThB__76969D2E");
        });

        modelBuilder.Entity<PhuongThucThanhToan>(entity =>
        {
            entity.HasKey(e => e.MaPttt).HasName("PK__PhuongTh__B30A28026C2BC9B2");

            entity.Property(e => e.MaPttt).ValueGeneratedNever();
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.MaRt).HasName("PK__RefreshT__2725F7BB353034DA");

            entity.Property(e => e.BiThuHoi).HasDefaultValue(false);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaNdNavigation).WithMany(p => p.RefreshTokens)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RefreshTok__MaND__5CD6CB2B");
        });

        modelBuilder.Entity<ThietBi>(entity =>
        {
            entity.HasKey(e => e.MaThBi).HasName("PK__ThietBi__9CCBC9EB5C7C6969");
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaTb).HasName("PK__ThongBao__2725006F0A22503A");

            entity.Property(e => e.DaDoc).HasDefaultValue(false);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaNdNavigation).WithMany(p => p.ThongBaos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThongBao__MaND__619B8048");
        });

        modelBuilder.Entity<TinhTrangPhong>(entity =>
        {
            entity.HasKey(e => e.MaTtrPhong).HasName("PK__TinhTran__8B70289EA7AEC283");
        });

        modelBuilder.Entity<TrangThaiHoaDon>(entity =>
        {
            entity.HasKey(e => e.MaTthoaDon).HasName("PK__TrangTha__6B9028B5148308FC");
        });

        modelBuilder.Entity<TrangThaiHopDong>(entity =>
        {
            entity.HasKey(e => e.MaTthopDong).HasName("PK__TrangTha__36F9B529BA3DE885");
        });

        modelBuilder.Entity<TrangThaiPhong>(entity =>
        {
            entity.HasKey(e => e.MaTtphong).HasName("PK__TrangTha__202AAD1E8A783F0D");
        });

        modelBuilder.Entity<TrangThaiTamTru>(entity =>
        {
            entity.HasKey(e => e.MaTttamTru).HasName("PK__TrangTha__9E097DCA6E7B0A26");
        });

        modelBuilder.Entity<TrangThaiXuLy>(entity =>
        {
            entity.HasKey(e => e.MaTtxuLy).HasName("PK__TrangTha__A40A7F160B9D8C79");
        });

        modelBuilder.Entity<VaiTroHeThong>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PK__VaiTroHe__C24C41CF3A38CCC1");
        });

        modelBuilder.Entity<VaiTroNguoiThue>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PK__VaiTroNg__C24C41CF28328E39");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
