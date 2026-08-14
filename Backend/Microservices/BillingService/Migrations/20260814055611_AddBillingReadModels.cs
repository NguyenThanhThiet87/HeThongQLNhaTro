using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BillingService.Migrations
{
    /// <inheritdoc />
    public partial class AddBillingReadModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DayNhaTros",
                columns: table => new
                {
                    MaDayNt = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaChuNt = table.Column<int>(type: "integer", nullable: true),
                    TenDayNt = table.Column<string>(type: "text", nullable: false),
                    DiaChi = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayNhaTros", x => x.MaDayNt);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDungs",
                columns: table => new
                {
                    MaNd = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HoTen = table.Column<string>(type: "text", nullable: false),
                    SoDt = table.Column<string>(type: "text", nullable: false),
                    Avatar = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDungs", x => x.MaNd);
                });

            migrationBuilder.CreateTable(
                name: "ThongBaos",
                columns: table => new
                {
                    MaTb = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TieuDe = table.Column<string>(type: "text", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    MaNd = table.Column<int>(type: "integer", nullable: true),
                    MaThucThe = table.Column<int>(type: "integer", nullable: true),
                    MaNgNhan = table.Column<int>(type: "integer", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaDoc = table.Column<bool>(type: "boolean", nullable: true),
                    LoaiTb = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBaos", x => x.MaTb);
                });

            migrationBuilder.CreateTable(
                name: "Phongs",
                columns: table => new
                {
                    MaPhong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenPhong = table.Column<string>(type: "text", nullable: false),
                    SoPhong = table.Column<string>(type: "text", nullable: false),
                    MaTtphong = table.Column<int>(type: "integer", nullable: true),
                    MaDayNt = table.Column<int>(type: "integer", nullable: false),
                    MaDayNtNavigationMaDayNt = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phongs", x => x.MaPhong);
                    table.ForeignKey(
                        name: "FK_Phongs_DayNhaTros_MaDayNtNavigationMaDayNt",
                        column: x => x.MaDayNtNavigationMaDayNt,
                        principalTable: "DayNhaTros",
                        principalColumn: "MaDayNt",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NguoiThueTros",
                columns: table => new
                {
                    MaNt = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNtNavigationMaNd = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiThueTros", x => x.MaNt);
                    table.ForeignKey(
                        name: "FK_NguoiThueTros_NguoiDungs_MaNtNavigationMaNd",
                        column: x => x.MaNtNavigationMaNd,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaNd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    MaNcc = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenNcc = table.Column<string>(type: "text", nullable: false),
                    MaNccNavigationMaNd = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCap", x => x.MaNcc);
                    table.ForeignKey(
                        name: "FK_NhaCungCap_NguoiDungs_MaNccNavigationMaNd",
                        column: x => x.MaNccNavigationMaNd,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaNd",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiSoDienNuocs",
                columns: table => new
                {
                    MaChiSo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    Thang = table.Column<int>(type: "integer", nullable: true),
                    Nam = table.Column<int>(type: "integer", nullable: true),
                    CsdienCu = table.Column<int>(type: "integer", nullable: true),
                    CsdienMoi = table.Column<int>(type: "integer", nullable: true),
                    CsnuocCu = table.Column<int>(type: "integer", nullable: true),
                    CsnuocMoi = table.Column<int>(type: "integer", nullable: true),
                    MaPhongNavigationMaPhong = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiSoDienNuocs", x => x.MaChiSo);
                    table.ForeignKey(
                        name: "FK_ChiSoDienNuocs_Phongs_MaPhongNavigationMaPhong",
                        column: x => x.MaPhongNavigationMaPhong,
                        principalTable: "Phongs",
                        principalColumn: "MaPhong",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDongThues",
                columns: table => new
                {
                    MaHopDong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    MaChuNt = table.Column<int>(type: "integer", nullable: true),
                    MaTthopDong = table.Column<int>(type: "integer", nullable: true),
                    GiaDien = table.Column<decimal>(type: "numeric", nullable: true),
                    GiaNuoc = table.Column<decimal>(type: "numeric", nullable: true),
                    GiaThue = table.Column<decimal>(type: "numeric", nullable: true),
                    MaPhongNavigationMaPhong = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDongThues", x => x.MaHopDong);
                    table.ForeignKey(
                        name: "FK_HopDongThues_Phongs_MaPhongNavigationMaPhong",
                        column: x => x.MaPhongNavigationMaPhong,
                        principalTable: "Phongs",
                        principalColumn: "MaPhong",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DichVus",
                columns: table => new
                {
                    MaDv = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenDv = table.Column<string>(type: "text", nullable: false),
                    GiaTien = table.Column<decimal>(type: "numeric", nullable: true),
                    HinhAnh = table.Column<string>(type: "text", nullable: false),
                    MaNcc = table.Column<int>(type: "integer", nullable: true),
                    MaNccNavigationMaNcc = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DichVus", x => x.MaDv);
                    table.ForeignKey(
                        name: "FK_DichVus_NhaCungCap_MaNccNavigationMaNcc",
                        column: x => x.MaNccNavigationMaNcc,
                        principalTable: "NhaCungCap",
                        principalColumn: "MaNcc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDongNguoiThues",
                columns: table => new
                {
                    MaHopDong = table.Column<int>(type: "integer", nullable: false),
                    MaNt = table.Column<int>(type: "integer", nullable: false),
                    MaVaiTro = table.Column<int>(type: "integer", nullable: true),
                    NgayVao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MaNtNavigationMaNt = table.Column<int>(type: "integer", nullable: false),
                    MaHopDongNavigationMaHopDong = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDongNguoiThues", x => new { x.MaHopDong, x.MaNt });
                    table.ForeignKey(
                        name: "FK_HopDongNguoiThues_HopDongThues_MaHopDongNavigationMaHopDong",
                        column: x => x.MaHopDongNavigationMaHopDong,
                        principalTable: "HopDongThues",
                        principalColumn: "MaHopDong",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HopDongNguoiThues_NguoiThueTros_MaNtNavigationMaNt",
                        column: x => x.MaNtNavigationMaNt,
                        principalTable: "NguoiThueTros",
                        principalColumn: "MaNt",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaChiSo",
                table: "HoaDon",
                column: "MaChiSo");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangDV_MaNcc",
                table: "DonHangDV",
                column: "MaNcc");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDH_MaDV",
                table: "ChiTietDH",
                column: "MaDV");

            migrationBuilder.CreateIndex(
                name: "IX_ChiSoDienNuocs_MaPhongNavigationMaPhong",
                table: "ChiSoDienNuocs",
                column: "MaPhongNavigationMaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_DichVus_MaNccNavigationMaNcc",
                table: "DichVus",
                column: "MaNccNavigationMaNcc");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongNguoiThues_MaHopDongNavigationMaHopDong",
                table: "HopDongNguoiThues",
                column: "MaHopDongNavigationMaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongNguoiThues_MaNtNavigationMaNt",
                table: "HopDongNguoiThues",
                column: "MaNtNavigationMaNt");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongThues_MaPhongNavigationMaPhong",
                table: "HopDongThues",
                column: "MaPhongNavigationMaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiThueTros_MaNtNavigationMaNd",
                table: "NguoiThueTros",
                column: "MaNtNavigationMaNd");

            migrationBuilder.CreateIndex(
                name: "IX_NhaCungCap_MaNccNavigationMaNd",
                table: "NhaCungCap",
                column: "MaNccNavigationMaNd");

            migrationBuilder.CreateIndex(
                name: "IX_Phongs_MaDayNtNavigationMaDayNt",
                table: "Phongs",
                column: "MaDayNtNavigationMaDayNt");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiSoDienNuocs");

            migrationBuilder.DropTable(
                name: "DichVus");

            migrationBuilder.DropTable(
                name: "HopDongNguoiThues");

            migrationBuilder.DropTable(
                name: "ThongBaos");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "HopDongThues");

            migrationBuilder.DropTable(
                name: "NguoiThueTros");

            migrationBuilder.DropTable(
                name: "Phongs");

            migrationBuilder.DropTable(
                name: "NguoiDungs");

            migrationBuilder.DropTable(
                name: "DayNhaTros");

            migrationBuilder.DropIndex(
                name: "IX_HoaDon_MaChiSo",
                table: "HoaDon");

            migrationBuilder.DropIndex(
                name: "IX_DonHangDV_MaNcc",
                table: "DonHangDV");

            migrationBuilder.DropIndex(
                name: "IX_ChiTietDH_MaDV",
                table: "ChiTietDH");
        }
    }
}
