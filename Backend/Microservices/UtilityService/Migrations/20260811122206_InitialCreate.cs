using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UtilityService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChiSoDienNuoc",
                columns: table => new
                {
                    MaChiSo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    Thang = table.Column<int>(type: "integer", nullable: true),
                    Nam = table.Column<int>(type: "integer", nullable: true),
                    CSDienCu = table.Column<int>(type: "integer", nullable: true),
                    CSDienMoi = table.Column<int>(type: "integer", nullable: true),
                    CSNuocCu = table.Column<int>(type: "integer", nullable: true),
                    CSNuocMoi = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiSoDienNuoc", x => x.MaChiSo);
                });

            migrationBuilder.CreateTable(
                name: "DichVu",
                columns: table => new
                {
                    MaDV = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNCC = table.Column<int>(type: "integer", nullable: false),
                    TenDV = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MoTaCT = table.Column<string>(type: "text", nullable: true),
                    GiaTien = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    DonViTinh = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    TTCungCap = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    HinhAnh = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DichVu", x => x.MaDV);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiSo_MaPhong",
                table: "ChiSoDienNuoc",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "UQ_ChiSo_Phong_ThangNam",
                table: "ChiSoDienNuoc",
                columns: new[] { "MaPhong", "Thang", "Nam" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiSoDienNuoc");

            migrationBuilder.DropTable(
                name: "DichVu");
        }
    }
}
