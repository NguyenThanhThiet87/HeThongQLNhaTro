using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MaintenanceService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDummyModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayKT",
                table: "LichSuBaoTri",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayBD",
                table: "LichSuBaoTri",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ThoiGian",
                table: "BaoCaoSuCo",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "DayNhaTros",
                columns: table => new
                {
                    MaDayNt = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenDayNt = table.Column<string>(type: "text", nullable: false),
                    MaChuNt = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayNhaTros", x => x.MaDayNt);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDungs",
                columns: table => new
                {
                    MaNguoiDung = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HoTen = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Sdt = table.Column<string>(type: "text", nullable: false),
                    SoDt = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDungs", x => x.MaNguoiDung);
                });

            migrationBuilder.CreateTable(
                name: "ThietBi",
                columns: table => new
                {
                    MaThBi = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenThBi = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AnhThBi = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThietBi", x => x.MaThBi);
                });

            migrationBuilder.CreateTable(
                name: "ThongBaos",
                columns: table => new
                {
                    MaThongBao = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TieuDe = table.Column<string>(type: "text", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DaDoc = table.Column<bool>(type: "boolean", nullable: true),
                    LoaiTb = table.Column<string>(type: "text", nullable: false),
                    MaNd = table.Column<int>(type: "integer", nullable: true),
                    MaThucThe = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBaos", x => x.MaThongBao);
                });

            migrationBuilder.CreateTable(
                name: "Phongs",
                columns: table => new
                {
                    MaPhong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaTthopDong = table.Column<int>(type: "integer", nullable: true),
                    SoPhong = table.Column<string>(type: "text", nullable: false),
                    MaDayNt = table.Column<int>(type: "integer", nullable: true),
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
                    MaNguoiDung = table.Column<int>(type: "integer", nullable: true),
                    MaNtNavigationMaNguoiDung = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiThueTros", x => x.MaNt);
                    table.ForeignKey(
                        name: "FK_NguoiThueTros_NguoiDungs_MaNtNavigationMaNguoiDung",
                        column: x => x.MaNtNavigationMaNguoiDung,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDongThues",
                columns: table => new
                {
                    MaHopDong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    MaTthopDong = table.Column<int>(type: "integer", nullable: true),
                    MaChuNt = table.Column<int>(type: "integer", nullable: true),
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
                name: "Phong_ThietBi",
                columns: table => new
                {
                    MaPhong_ThietBi = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    MaThBi = table.Column<int>(type: "integer", nullable: false),
                    TrangThai = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    MoTa = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phong_ThietBi", x => x.MaPhong_ThietBi);
                    table.ForeignKey(
                        name: "FK_Phong_ThietBi_Phongs_MaPhong",
                        column: x => x.MaPhong,
                        principalTable: "Phongs",
                        principalColumn: "MaPhong",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Phong_ThietBi_ThietBi_MaThBi",
                        column: x => x.MaThBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThBi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDongNguoiThues",
                columns: table => new
                {
                    MaHopDong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNt = table.Column<int>(type: "integer", nullable: false),
                    MaNtNavigationMaNt = table.Column<int>(type: "integer", nullable: false),
                    MaHopDongNavigationMaHopDong = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDongNguoiThues", x => x.MaHopDong);
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
                name: "IX_LichSuBaoTri_MaPhong",
                table: "LichSuBaoTri",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuBaoTri_MaPhong_ThietBi",
                table: "LichSuBaoTri",
                column: "MaPhong_ThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietSuCo_MaPhong_ThietBi",
                table: "ChiTietSuCo",
                column: "MaPhong_ThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_BaoCaoSuCo_MaNT",
                table: "BaoCaoSuCo",
                column: "MaNT");

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
                name: "IX_NguoiThueTros_MaNtNavigationMaNguoiDung",
                table: "NguoiThueTros",
                column: "MaNtNavigationMaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_ThietBi_MaPhong",
                table: "Phong_ThietBi",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_ThietBi_MaThBi",
                table: "Phong_ThietBi",
                column: "MaThBi");

            migrationBuilder.CreateIndex(
                name: "IX_Phongs_MaDayNtNavigationMaDayNt",
                table: "Phongs",
                column: "MaDayNtNavigationMaDayNt");

            migrationBuilder.CreateIndex(
                name: "UQ_ThietBi_Ten",
                table: "ThietBi",
                column: "TenThBi",
                unique: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HopDongNguoiThues");

            migrationBuilder.DropTable(
                name: "Phong_ThietBi");

            migrationBuilder.DropTable(
                name: "ThongBaos");

            migrationBuilder.DropTable(
                name: "HopDongThues");

            migrationBuilder.DropTable(
                name: "NguoiThueTros");

            migrationBuilder.DropTable(
                name: "ThietBi");

            migrationBuilder.DropTable(
                name: "Phongs");

            migrationBuilder.DropTable(
                name: "NguoiDungs");

            migrationBuilder.DropTable(
                name: "DayNhaTros");

            migrationBuilder.DropIndex(
                name: "IX_LichSuBaoTri_MaPhong",
                table: "LichSuBaoTri");

            migrationBuilder.DropIndex(
                name: "IX_LichSuBaoTri_MaPhong_ThietBi",
                table: "LichSuBaoTri");

            migrationBuilder.DropIndex(
                name: "IX_ChiTietSuCo_MaPhong_ThietBi",
                table: "ChiTietSuCo");

            migrationBuilder.DropIndex(
                name: "IX_BaoCaoSuCo_MaNT",
                table: "BaoCaoSuCo");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayKT",
                table: "LichSuBaoTri",
                type: "timestamp",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayBD",
                table: "LichSuBaoTri",
                type: "timestamp",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ThoiGian",
                table: "BaoCaoSuCo",
                type: "timestamp",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    MaNCC = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DanhGiaTB = table.Column<double>(type: "double precision", nullable: true),
                    KhuVucPV = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    KinhDo = table.Column<decimal>(type: "numeric(18,10)", nullable: true),
                    MoTaDV = table.Column<string>(type: "text", nullable: true),
                    SanSang = table.Column<bool>(type: "boolean", nullable: true),
                    ViDo = table.Column<decimal>(type: "numeric(18,10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCap", x => x.MaNCC);
                });
        }
    }
}
