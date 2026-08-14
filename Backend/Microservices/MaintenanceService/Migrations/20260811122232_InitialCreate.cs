using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MaintenanceService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LichSuBaoTri",
                columns: table => new
                {
                    MaBT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: true),
                    MaPhong_ThietBi = table.Column<int>(type: "integer", nullable: true),
                    MoTa = table.Column<string>(type: "text", nullable: true),
                    ChiPhi = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    NgayBD = table.Column<DateTime>(type: "timestamp", nullable: true),
                    NgayKT = table.Column<DateTime>(type: "timestamp", nullable: true),
                    TrangThai = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LichSuBaoTri", x => x.MaBT);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    MaNCC = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MoTaDV = table.Column<string>(type: "text", nullable: true),
                    SanSang = table.Column<bool>(type: "boolean", nullable: true),
                    DanhGiaTB = table.Column<double>(type: "double precision", nullable: true),
                    KhuVucPV = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ViDo = table.Column<decimal>(type: "numeric(18,10)", nullable: true),
                    KinhDo = table.Column<decimal>(type: "numeric(18,10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCap", x => x.MaNCC);
                });

            migrationBuilder.CreateTable(
                name: "TrangThaiXuLy",
                columns: table => new
                {
                    MaTTXuLy = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTTXuLy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiXuLy", x => x.MaTTXuLy);
                });

            migrationBuilder.CreateTable(
                name: "BaoCaoSuCo",
                columns: table => new
                {
                    MaSuCo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNT = table.Column<int>(type: "integer", nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "timestamp", nullable: true),
                    TongPhi = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    MaTTXuLy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaoCaoSuCo", x => x.MaSuCo);
                    table.ForeignKey(
                        name: "FK_BaoCaoSuCo_TrangThaiXuLy_MaTTXuLy",
                        column: x => x.MaTTXuLy,
                        principalTable: "TrangThaiXuLy",
                        principalColumn: "MaTTXuLy",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietSuCo",
                columns: table => new
                {
                    PK = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaBCSC = table.Column<int>(type: "integer", nullable: false),
                    MaPhong_ThietBi = table.Column<int>(type: "integer", nullable: true),
                    MoTaSuCo = table.Column<string>(type: "text", nullable: true),
                    MinhChung = table.Column<string>(type: "text", nullable: true),
                    CPPhatSinh = table.Column<decimal>(type: "numeric(18,0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietSuCo", x => x.PK);
                    table.ForeignKey(
                        name: "FK_ChiTietSuCo_BaoCaoSuCo_MaBCSC",
                        column: x => x.MaBCSC,
                        principalTable: "BaoCaoSuCo",
                        principalColumn: "MaSuCo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaoCaoSuCo_MaTTXuLy",
                table: "BaoCaoSuCo",
                column: "MaTTXuLy");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietSuCo_MaBCSC",
                table: "ChiTietSuCo",
                column: "MaBCSC");

            migrationBuilder.CreateIndex(
                name: "UQ_TrangThaiXuLy_Ten",
                table: "TrangThaiXuLy",
                column: "TenTTXuLy",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietSuCo");

            migrationBuilder.DropTable(
                name: "LichSuBaoTri");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "BaoCaoSuCo");

            migrationBuilder.DropTable(
                name: "TrangThaiXuLy");
        }
    }
}
