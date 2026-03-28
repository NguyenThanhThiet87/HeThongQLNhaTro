using ServerQLNhaTro.DTOs.ResponseDtos;
using ServerQLNhaTro.Models;

namespace ServerQLNhaTro.DTOs;

/// <summary>
/// Extension methods để chuyển đổi từ Model (Entity) sang DTO (Response).
/// Giúp tránh vòng lặp vô hạn (Circular Reference) khi serialize JSON.
/// </summary>
public static class MappingExtensions
{
    //// ─── NguoiDung ──────────────────────────────────────────────
    //public static NguoiDungDto ToDto(this NguoiDung entity)
    //{
    //    return new NguoiDungDto
    //    {
    //        MaNd = entity.MaNd,
    //        HoTen = entity.HoTen,
    //        SoDt = entity.SoDt,
    //        SoCccd = entity.SoCccd,
    //        NgaySinh = entity.NgaySinh,
    //        DiaChi = entity.DiaChi,
    //        KichHoat = entity.KichHoat,
    //        NgayTao = entity.NgayTao,
    //        Avatar = entity.Avatar,
    //        MaVaiTro = entity.MaVaiTro,
    //        TenVaiTro = entity.MaVaiTroNavigation?.TenVaiTro
    //    };
    //}

    //// ─── ChuNhaTro ─────────────────────────────────────────────
    //public static ChuNhaTroDto ToDto(this ChuNhaTro entity)
    //{
    //    return new ChuNhaTroDto
    //    {
    //        MaChuNt = entity.MaChuNt,
    //        SoTk = entity.SoTk,
    //        TenNh = entity.TenNh,
    //        SoGpkd = entity.SoGpkd,
    //        DaDkkd = entity.DaDkkd,
    //        HoTen = entity.MaChuNtNavigation?.HoTen,
    //        SoDt = entity.MaChuNtNavigation?.SoDt,
    //        Avatar = entity.MaChuNtNavigation?.Avatar
    //    };
    //}

    //// ─── NguoiThueTro ───────────────────────────────────────────
    //public static NguoiThueTroDto ToDto(this NguoiThueTro entity)
    //{
    //    return new NguoiThueTroDto
    //    {
    //        MaNt = entity.MaNt,
    //        NgheNghiep = entity.NgheNghiep,
    //        BienSoXe = entity.BienSoXe,
    //        HoTen = entity.MaNtNavigation?.HoTen,
    //        SoDt = entity.MaNtNavigation?.SoDt,
    //        SoCccd = entity.MaNtNavigation?.SoCccd,
    //        NgaySinh = entity.MaNtNavigation?.NgaySinh,
    //        DiaChi = entity.MaNtNavigation?.DiaChi,
    //        Avatar = entity.MaNtNavigation?.Avatar
    //    };
    //}

    //// ─── DayNhaTro ──────────────────────────────────────────────
    //public static DayNhaTroDto ToDto(this DayNhaTro entity)
    //{
    //    return new DayNhaTroDto
    //    {
    //        MaDayNt = entity.MaDayNt,
    //        TenDayNt = entity.TenDayNt,
    //        DiaChi = entity.DiaChi,
    //        Slphong = entity.Slphong,
    //        TrangThaiNt = entity.TrangThaiNt,
    //        MaChuNt = entity.MaChuNt,
    //        UrlAnh = entity.UrlAnh,
    //        TenChuNhaTro = entity.MaChuNtNavigation?.MaChuNtNavigation?.HoTen
    //    };
    //}

    //// ─── LoaiPhong ──────────────────────────────────────────────
    //public static LoaiPhongDto ToDto(this LoaiPhong entity)
    //{
    //    return new LoaiPhongDto
    //    {
    //        MaLoaiP = entity.MaLoaiP,
    //        TenLoaiP = entity.TenLoaiP,
    //        GiaChuan = entity.GiaChuan,
    //        SnguoiToiDa = entity.SnguoiToiDa,
    //        MaChuNt = entity.MaChuNt,
    //        MoTa = entity.MoTa
    //    };
    //}

    //// ─── Phong ──────────────────────────────────────────────────
    //public static PhongDto ToDto(this Phong entity)
    //{
    //    return new PhongDto
    //    {
    //        MaPhong = entity.MaPhong,
    //        MaDayNt = entity.MaDayNt,
    //        MaLoaiP = entity.MaLoaiP,
    //        SoPhong = entity.SoPhong,
    //        GiaThucTe = entity.GiaThucTe,
    //        MaTtphong = entity.MaTtphong,
    //        MaTtrPhong = entity.MaTtrPhong,
    //        TenDayNhaTro = entity.MaDayNtNavigation?.TenDayNt,
    //        TenLoaiPhong = entity.MaLoaiPNavigation?.TenLoaiP,
    //        TenTrangThaiPhong = entity.MaTtphongNavigation?.TenTtphong,
    //        TenTinhTrangPhong = entity.MaTtrPhongNavigation?.TenTtrPhong,
    //        AnhPhongs = entity.AnhPhongs?.Select(a => a.ToDto()).ToList(),
    //        PhongThietBis = entity.PhongThietBis?.Select(p => p.ToDto()).ToList()
    //    };
    //}

    //// ─── AnhPhong ───────────────────────────────────────────────
    //public static AnhPhongDto ToDto(this AnhPhong entity)
    //{
    //    return new AnhPhongDto
    //    {
    //        MaAnh = entity.MaAnh,
    //        MaPhong = entity.MaPhong,
    //        Url = entity.Url,
    //        MoTa = entity.MoTa,
    //        ThuTu = entity.ThuTu,
    //        NgayTao = entity.NgayTao
    //    };
    //}

    //// ─── ThietBi ────────────────────────────────────────────────
    //public static ThietBiDto ToDto(this ThietBi entity)
    //{
    //    return new ThietBiDto
    //    {
    //        MaThBi = entity.MaThBi,
    //        TenThBi = entity.TenThBi,
    //        AnhThBi = entity.AnhThBi
    //    };
    //}

    //// ─── PhongThietBi ───────────────────────────────────────────
    //public static PhongThietBiDto ToDto(this PhongThietBi entity)
    //{
    //    return new PhongThietBiDto
    //    {
    //        MaPhongThietBi = entity.MaPhongThietBi,
    //        MaPhong = entity.MaPhong,
    //        MaThBi = entity.MaThBi,
    //        TrangThai = entity.TrangThai,
    //        MoTa = entity.MoTa,
    //        TenThietBi = entity.MaThBiNavigation?.TenThBi,
    //        AnhThietBi = entity.MaThBiNavigation?.AnhThBi
    //    };
    //}

    //// ─── HopDongThue ────────────────────────────────────────────
    //public static HopDongThueDto ToDto(this HopDongThue entity)
    //{
    //    return new HopDongThueDto
    //    {
    //        MaHopDong = entity.MaHopDong,
    //        MaPhong = entity.MaPhong,
    //        NgayTao = entity.NgayTao,
    //        NgayBdhl = entity.NgayBdhl,
    //        NgayKthl = entity.NgayKthl,
    //        GiaThue = entity.GiaThue,
    //        TienDatCoc = entity.TienDatCoc,
    //        AnhHopDong = entity.AnhHopDong,
    //        MaTthopDong = entity.MaTthopDong,
    //        GiaDien = entity.GiaDien,
    //        GiaNuoc = entity.GiaNuoc,
    //        DonViDien = entity.DonViDien,
    //        DonViNuoc = entity.DonViNuoc,
    //        SoPhong = entity.MaPhongNavigation?.SoPhong,
    //        TenDayNhaTro = entity.MaPhongNavigation?.MaDayNtNavigation?.TenDayNt,
    //        TenTrangThaiHopDong = entity.MaTthopDongNavigation?.TenTthopDong,
    //        HopDongNguoiThues = entity.HopDongNguoiThues?.Select(h => h.ToDto()).ToList()
    //    };
    //}

    //// ─── HopDongNguoiThue ───────────────────────────────────────
    //public static HopDongNguoiThueDto ToDto(this HopDongNguoiThue entity)
    //{
    //    return new HopDongNguoiThueDto
    //    {
    //        Pk = entity.Pk,
    //        MaHopDong = entity.MaHopDong,
    //        MaNt = entity.MaNt,
    //        NgayVao = entity.NgayVao,
    //        NgayRoi = entity.NgayRoi,
    //        MaVaiTro = entity.MaVaiTro,
    //        MaTttamTru = entity.MaTttamTru,
    //        HoTenNguoiThue = entity.MaNtNavigation?.MaNtNavigation?.HoTen,
    //        SoDtNguoiThue = entity.MaNtNavigation?.MaNtNavigation?.SoDt,
    //        TenVaiTro = entity.MaVaiTroNavigation?.TenVaiTro,
    //        TenTrangThaiTamTru = entity.MaTttamTruNavigation?.TenTttamTru
    //    };
    //}

    //// ─── HoaDon ─────────────────────────────────────────────────
    //public static HoaDonDto ToDto(this HoaDon entity)
    //{
    //    return new HoaDonDto
    //    {
    //        MaHoaDon = entity.MaHoaDon,
    //        MaHopDong = entity.MaHopDong,
    //        NgayLap = entity.NgayLap,
    //        TienDien = entity.TienDien,
    //        TienNuoc = entity.TienNuoc,
    //        TienPhong = entity.TienPhong,
    //        TongTien = entity.TongTien,
    //        MaTthoaDon = entity.MaTthoaDon,
    //        SoPhong = entity.MaHopDongNavigation?.MaPhongNavigation?.SoPhong,
    //        TenTrangThaiHoaDon = entity.MaTthoaDonNavigation?.TenTthoaDon,
    //        LichSuThanhToans = entity.LichSuThanhToans?.Select(l => l.ToDto()).ToList()
    //    };
    //}

    //// ─── LichSuThanhToan ────────────────────────────────────────
    //public static LichSuThanhToanDto ToDto(this LichSuThanhToan entity)
    //{
    //    return new LichSuThanhToanDto
    //    {
    //        MaLstt = entity.MaLstt,
    //        MaHoaDon = entity.MaHoaDon,
    //        SoTien = entity.SoTien,
    //        PhuongThuc = entity.PhuongThuc,
    //        NgayThanhToan = entity.NgayThanhToan,
    //        GhiChu = entity.GhiChu
    //    };
    //}

    //// ─── ChiSoDienNuoc ─────────────────────────────────────────
    //public static ChiSoDienNuocDto ToDto(this ChiSoDienNuoc entity)
    //{
    //    return new ChiSoDienNuocDto
    //    {
    //        MaChiSo = entity.MaChiSo,
    //        MaPhong = entity.MaPhong,
    //        Thang = entity.Thang,
    //        Nam = entity.Nam,
    //        CsdienCu = entity.CsdienCu,
    //        CsdienMoi = entity.CsdienMoi,
    //        CsnuocCu = entity.CsnuocCu,
    //        CsnuocMoi = entity.CsnuocMoi,
    //        SoPhong = entity.MaPhongNavigation?.SoPhong
    //    };
    //}

    //// ─── NhaCungCap ─────────────────────────────────────────────
    //public static NhaCungCapDto ToDto(this NhaCungCap entity)
    //{
    //    return new NhaCungCapDto
    //    {
    //        MaNcc = entity.MaNcc,
    //        MoTaDv = entity.MoTaDv,
    //        SanSang = entity.SanSang,
    //        DanhGiaTb = entity.DanhGiaTb,
    //        KhuVucPv = entity.KhuVucPv,
    //        HoTen = entity.MaNccNavigation?.HoTen,
    //        SoDt = entity.MaNccNavigation?.SoDt,
    //        Avatar = entity.MaNccNavigation?.Avatar
    //    };
    //}

    //// ─── DichVu ─────────────────────────────────────────────────
    //public static DichVuDto ToDto(this DichVu entity)
    //{
    //    return new DichVuDto
    //    {
    //        MaDv = entity.MaDv,
    //        MaNcc = entity.MaNcc,
    //        TenDv = entity.TenDv,
    //        MoTaCt = entity.MoTaCt,
    //        GiaTien = entity.GiaTien,
    //        DonViTinh = entity.DonViTinh,
    //        TtcungCap = entity.TtcungCap,
    //        TenNhaCungCap = entity.MaNccNavigation?.MaNccNavigation?.HoTen
    //    };
    //}

    //// ─── DonHangDv ──────────────────────────────────────────────
    //public static DonHangDvDto ToDto(this DonHangDv entity)
    //{
    //    return new DonHangDvDto
    //    {
    //        MaDh = entity.MaDh,
    //        MaNt = entity.MaNt,
    //        NgayDat = entity.NgayDat,
    //        TongTien = entity.TongTien,
    //        TrangThaiDh = entity.TrangThaiDh,
    //        HoTenNguoiThue = entity.MaNtNavigation?.MaNtNavigation?.HoTen,
    //        ChiTietDhs = entity.ChiTietDhs?.Select(c => c.ToDto()).ToList()
    //    };
    //}

    //// ─── ChiTietDh ──────────────────────────────────────────────
    //public static ChiTietDhDto ToDto(this ChiTietDh entity)
    //{
    //    return new ChiTietDhDto
    //    {
    //        Pk = entity.Pk,
    //        MaDh = entity.MaDh,
    //        MaDv = entity.MaDv,
    //        SoLuong = entity.SoLuong,
    //        ThanhTien = entity.ThanhTien,
    //        TenDichVu = entity.MaDvNavigation?.TenDv,
    //        GiaTien = entity.MaDvNavigation?.GiaTien
    //    };
    //}

    //// ─── BaoCaoSuCo ─────────────────────────────────────────────
    //public static BaoCaoSuCoDto ToDto(this BaoCaoSuCo entity)
    //{
    //    return new BaoCaoSuCoDto
    //    {
    //        MaSuCo = entity.MaSuCo,
    //        MaNt = entity.MaNt,
    //        ThoiGian = entity.ThoiGian,
    //        TongPhi = entity.TongPhi,
    //        MaTtxuLy = entity.MaTtxuLy,
    //        HoTenNguoiThue = entity.MaNtNavigation?.MaNtNavigation?.HoTen,
    //        TenTrangThaiXuLy = entity.MaTtxuLyNavigation?.TenTtxuLy,
    //        ChiTietSuCos = entity.ChiTietSuCos?.Select(c => c.ToDto()).ToList()
    //    };
    //}

    //// ─── ChiTietSuCo ───────────────────────────────────────────
    //public static ChiTietSuCoDto ToDto(this ChiTietSuCo entity)
    //{
    //    return new ChiTietSuCoDto
    //    {
    //        Pk = entity.Pk,
    //        MaBcsc = entity.MaBcsc,
    //        MaPhongThietBi = entity.MaPhongThietBi,
    //        MoTaSuCo = entity.MoTaSuCo,
    //        MinhChung = entity.MinhChung,
    //        CpphatSinh = entity.CpphatSinh,
    //        TenThietBi = entity.MaPhongThietBiNavigation?.MaThBiNavigation?.TenThBi,
    //        TrangThaiThietBi = entity.MaPhongThietBiNavigation?.TrangThai
    //    };
    //}

    //// ─── LichSuBaoTri ───────────────────────────────────────────
    //public static LichSuBaoTriDto ToDto(this LichSuBaoTri entity)
    //{
    //    return new LichSuBaoTriDto
    //    {
    //        MaBt = entity.MaBt,
    //        MaPhong = entity.MaPhong,
    //        MaPhongThietBi = entity.MaPhongThietBi,
    //        MoTa = entity.MoTa,
    //        ChiPhi = entity.ChiPhi,
    //        NgayBd = entity.NgayBd,
    //        NgayKt = entity.NgayKt,
    //        TrangThai = entity.TrangThai,
    //        SoPhong = entity.MaPhongNavigation?.SoPhong,
    //        TenThietBi = entity.MaPhongThietBiNavigation?.MaThBiNavigation?.TenThBi
    //    };
    //}

    //// ─── NguoiLienHeKhanCap ─────────────────────────────────────
    //public static NguoiLienHeKhanCapDto ToDto(this NguoiLienHeKhanCap entity)
    //{
    //    return new NguoiLienHeKhanCapDto
    //    {
    //        MaNlh = entity.MaNlh,
    //        MaNt = entity.MaNt,
    //        HoTen = entity.HoTen,
    //        QuanHe = entity.QuanHe,
    //        SoDt = entity.SoDt
    //    };
    //}

    //// ─── ThongBao ───────────────────────────────────────────────
    //public static ThongBaoDto ToDto(this ThongBao entity)
    //{
    //    return new ThongBaoDto
    //    {
    //        MaTb = entity.MaTb,
    //        MaNd = entity.MaNd,
    //        TieuDe = entity.TieuDe,
    //        NoiDung = entity.NoiDung,
    //        DaDoc = entity.DaDoc,
    //        NgayTao = entity.NgayTao
    //    };
    //}

    //// ─── RefreshToken ───────────────────────────────────────────
    //public static RefreshTokenDto ToDto(this RefreshToken entity)
    //{
    //    return new RefreshTokenDto
    //    {
    //        MaRt = entity.MaRt,
    //        MaNd = entity.MaNd,
    //        Token = entity.Token,
    //        HetHanLuc = entity.HetHanLuc,
    //        NgayTao = entity.NgayTao,
    //        BiThuHoi = entity.BiThuHoi
    //    };
    //}
}
