using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ContractService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NguoiThueTro",
                columns: table => new
                {
                    MaNT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NgheNghiep = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiThueTro", x => x.MaNT);
                });

            migrationBuilder.CreateTable(
                name: "TrangThaiHopDong",
                columns: table => new
                {
                    MaTTHopDong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTTHopDong = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiHopDong", x => x.MaTTHopDong);
                });

            migrationBuilder.CreateTable(
                name: "TrangThaiTamTru",
                columns: table => new
                {
                    MaTTTamTru = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTTTamTru = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiTamTru", x => x.MaTTTamTru);
                });

            migrationBuilder.CreateTable(
                name: "VaiTroNguoiThue",
                columns: table => new
                {
                    MaVaiTro = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenVaiTro = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTroNguoiThue", x => x.MaVaiTro);
                });

            migrationBuilder.CreateTable(
                name: "NguoiLienHeKhanCap",
                columns: table => new
                {
                    MaNLH = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNT = table.Column<int>(type: "integer", nullable: false),
                    HoTen = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    QuanHe = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SoDT = table.Column<string>(type: "character varying(15)", unicode: false, maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiLienHeKhanCap", x => x.MaNLH);
                    table.ForeignKey(
                        name: "FK_NguoiLienHeKhanCap_NguoiThueTro_MaNT",
                        column: x => x.MaNT,
                        principalTable: "NguoiThueTro",
                        principalColumn: "MaNT",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDongThue",
                columns: table => new
                {
                    MaHopDong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp", nullable: true),
                    NgayBDHL = table.Column<DateOnly>(type: "date", nullable: false),
                    NgayKTHL = table.Column<DateOnly>(type: "date", nullable: true),
                    GiaThue = table.Column<decimal>(type: "numeric(18,0)", nullable: false),
                    TienDatCoc = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    AnhHopDong = table.Column<string>(type: "text", nullable: true),
                    MaTTHopDong = table.Column<int>(type: "integer", nullable: false),
                    GiaDien = table.Column<decimal>(type: "numeric(18,0)", nullable: false),
                    GiaNuoc = table.Column<decimal>(type: "numeric(18,0)", nullable: false),
                    DonViDien = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    DonViNuoc = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    MaChuNT = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDongThue", x => x.MaHopDong);
                    table.ForeignKey(
                        name: "FK_HopDongThue_TrangThaiHopDong_MaTTHopDong",
                        column: x => x.MaTTHopDong,
                        principalTable: "TrangThaiHopDong",
                        principalColumn: "MaTTHopDong",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDong_NguoiThue",
                columns: table => new
                {
                    PK = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaHopDong = table.Column<int>(type: "integer", nullable: false),
                    MaNT = table.Column<int>(type: "integer", nullable: false),
                    NgayVao = table.Column<DateOnly>(type: "date", nullable: true),
                    NgayRoi = table.Column<DateOnly>(type: "date", nullable: true),
                    MaVaiTro = table.Column<int>(type: "integer", nullable: true),
                    MaTTTamTru = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDong_NguoiThue", x => x.PK);
                    table.ForeignKey(
                        name: "FK_HopDong_NguoiThue_HopDongThue_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDongThue",
                        principalColumn: "MaHopDong",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HopDong_NguoiThue_NguoiThueTro_MaNT",
                        column: x => x.MaNT,
                        principalTable: "NguoiThueTro",
                        principalColumn: "MaNT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HopDong_NguoiThue_TrangThaiTamTru_MaTTTamTru",
                        column: x => x.MaTTTamTru,
                        principalTable: "TrangThaiTamTru",
                        principalColumn: "MaTTTamTru");
                    table.ForeignKey(
                        name: "FK_HopDong_NguoiThue_VaiTroNguoiThue_MaVaiTro",
                        column: x => x.MaVaiTro,
                        principalTable: "VaiTroNguoiThue",
                        principalColumn: "MaVaiTro");
                });

            migrationBuilder.CreateIndex(
                name: "IX_HDNguoiThue_MaHopDong",
                table: "HopDong_NguoiThue",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_HDNguoiThue_MaNT",
                table: "HopDong_NguoiThue",
                column: "MaNT");

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_NguoiThue_MaTTTamTru",
                table: "HopDong_NguoiThue",
                column: "MaTTTamTru");

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_NguoiThue_MaVaiTro",
                table: "HopDong_NguoiThue",
                column: "MaVaiTro");

            migrationBuilder.CreateIndex(
                name: "UQ_HDNguoiThue",
                table: "HopDong_NguoiThue",
                columns: new[] { "MaHopDong", "MaNT" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_MaPhong",
                table: "HopDongThue",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_HopDongThue_MaTTHopDong",
                table: "HopDongThue",
                column: "MaTTHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiLienHeKhanCap_MaNT",
                table: "NguoiLienHeKhanCap",
                column: "MaNT");

            migrationBuilder.CreateIndex(
                name: "UQ_TrangThaiHopDong_Ten",
                table: "TrangThaiHopDong",
                column: "TenTTHopDong",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_TrangThaiTamTru_Ten",
                table: "TrangThaiTamTru",
                column: "TenTTTamTru",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_VaiTroNguoiThue_Ten",
                table: "VaiTroNguoiThue",
                column: "TenVaiTro",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HopDong_NguoiThue");

            migrationBuilder.DropTable(
                name: "NguoiLienHeKhanCap");

            migrationBuilder.DropTable(
                name: "HopDongThue");

            migrationBuilder.DropTable(
                name: "TrangThaiTamTru");

            migrationBuilder.DropTable(
                name: "VaiTroNguoiThue");

            migrationBuilder.DropTable(
                name: "NguoiThueTro");

            migrationBuilder.DropTable(
                name: "TrangThaiHopDong");
        }
    }
}
