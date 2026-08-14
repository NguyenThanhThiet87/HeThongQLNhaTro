using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IdentityService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VaiTroHeThong",
                columns: table => new
                {
                    MaVaiTro = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenVaiTro = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MoTa = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTroHeThong", x => x.MaVaiTro);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HoTen = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SoDT = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    MatKhau = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    SoCCCD = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    NgaySinh = table.Column<DateOnly>(type: "date", nullable: true),
                    DiaChi = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    KichHoat = table.Column<bool>(type: "boolean", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Avatar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    MaVaiTro = table.Column<int>(type: "integer", nullable: true),
                    GioiTinh = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDung", x => x.MaND);
                    table.ForeignKey(
                        name: "FK_NguoiDung_VaiTroHeThong_MaVaiTro",
                        column: x => x.MaVaiTro,
                        principalTable: "VaiTroHeThong",
                        principalColumn: "MaVaiTro");
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNd = table.Column<int>(type: "integer", nullable: true),
                    Token = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    HetHanLuc = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    BiThuHoi = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RefreshToken_NguoiDung_MaNd",
                        column: x => x.MaNd,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND");
                });

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_MaVaiTro",
                table: "NguoiDung",
                column: "MaVaiTro");

            migrationBuilder.CreateIndex(
                name: "UQ__NguoiDun__BC3D04C9FCD6C293",
                table: "NguoiDung",
                column: "SoDT",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_MaNd",
                table: "RefreshToken",
                column: "MaNd");

            migrationBuilder.CreateIndex(
                name: "UQ__RefreshT__1EB4F817105020F1",
                table: "RefreshToken",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__VaiTroHe__B6DF2646272E568F",
                table: "VaiTroHeThong",
                column: "TenVaiTro",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "VaiTroHeThong");
        }
    }
}
