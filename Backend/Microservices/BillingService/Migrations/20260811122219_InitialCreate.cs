using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BillingService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DonHangDV",
                columns: table => new
                {
                    MaDH = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNT = table.Column<int>(type: "integer", nullable: false),
                    NgayDat = table.Column<DateTime>(type: "timestamp", nullable: true),
                    TongTien = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    TrangThaiDH = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    GhiChu = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    MaNcc = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonHangDV", x => x.MaDH);
                });

            migrationBuilder.CreateTable(
                name: "PhuongThucThanhToan",
                columns: table => new
                {
                    MaPTTT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenPTTT = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhuongThucThanhToan", x => x.MaPTTT);
                });

            migrationBuilder.CreateTable(
                name: "TrangThaiHoaDon",
                columns: table => new
                {
                    MaTTHoaDon = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTTHoaDon = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiHoaDon", x => x.MaTTHoaDon);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietDH",
                columns: table => new
                {
                    PK = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaDH = table.Column<int>(type: "integer", nullable: false),
                    MaDV = table.Column<int>(type: "integer", nullable: false),
                    SoLuong = table.Column<int>(type: "integer", nullable: true),
                    ThanhTien = table.Column<decimal>(type: "numeric(18,0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietDH", x => x.PK);
                    table.ForeignKey(
                        name: "FK_ChiTietDH_DonHangDV_MaDH",
                        column: x => x.MaDH,
                        principalTable: "DonHangDV",
                        principalColumn: "MaDH",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HoaDon",
                columns: table => new
                {
                    MaHoaDon = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaHopDong = table.Column<int>(type: "integer", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "timestamp", nullable: true),
                    TienDien = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    TienNuoc = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    TienPhong = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    TongTien = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    MaTTHoaDon = table.Column<int>(type: "integer", nullable: false),
                    MaChiSo = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDon", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HoaDon_TrangThaiHoaDon_MaTTHoaDon",
                        column: x => x.MaTTHoaDon,
                        principalTable: "TrangThaiHoaDon",
                        principalColumn: "MaTTHoaDon",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LichSuThanhToan",
                columns: table => new
                {
                    MaLSTT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaHoaDon = table.Column<int>(type: "integer", nullable: false),
                    SoTien = table.Column<decimal>(type: "numeric(18,0)", nullable: false),
                    NgayThanhToan = table.Column<DateTime>(type: "timestamp", nullable: true),
                    GhiChu = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    MaPTTT = table.Column<int>(type: "integer", nullable: true),
                    MaGiaoDich = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LichSuThanhToan", x => x.MaLSTT);
                    table.ForeignKey(
                        name: "FK_LichSuThanhToan_HoaDon_MaHoaDon",
                        column: x => x.MaHoaDon,
                        principalTable: "HoaDon",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LichSuThanhToan_PhuongThucThanhToan_MaPTTT",
                        column: x => x.MaPTTT,
                        principalTable: "PhuongThucThanhToan",
                        principalColumn: "MaPTTT");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDH_MaDH",
                table: "ChiTietDH",
                column: "MaDH");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangDV_MaNT",
                table: "DonHangDV",
                column: "MaNT");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaHopDong",
                table: "HoaDon",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_TrangThai",
                table: "HoaDon",
                column: "MaTTHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuThanhToan_MaHoaDon",
                table: "LichSuThanhToan",
                column: "MaHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuThanhToan_MaPTTT",
                table: "LichSuThanhToan",
                column: "MaPTTT");

            migrationBuilder.CreateIndex(
                name: "UQ_TrangThaiHoaDon_Ten",
                table: "TrangThaiHoaDon",
                column: "TenTTHoaDon",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietDH");

            migrationBuilder.DropTable(
                name: "LichSuThanhToan");

            migrationBuilder.DropTable(
                name: "DonHangDV");

            migrationBuilder.DropTable(
                name: "HoaDon");

            migrationBuilder.DropTable(
                name: "PhuongThucThanhToan");

            migrationBuilder.DropTable(
                name: "TrangThaiHoaDon");
        }
    }
}
