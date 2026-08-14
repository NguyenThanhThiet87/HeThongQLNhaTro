using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PropertyService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChuNhaTro",
                columns: table => new
                {
                    MaChuNT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SoTK = table.Column<string>(type: "character varying(50)", unicode: false, maxLength: 50, nullable: true),
                    TenNH = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SoGPKD = table.Column<string>(type: "character varying(50)", unicode: false, maxLength: 50, nullable: true),
                    DaDKKD = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChuNhaTro", x => x.MaChuNT);
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
                name: "TinhTrangPhong",
                columns: table => new
                {
                    MaTTrPhong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTTrPhong = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinhTrangPhong", x => x.MaTTrPhong);
                });

            migrationBuilder.CreateTable(
                name: "TrangThaiPhong",
                columns: table => new
                {
                    MaTTPhong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTTPhong = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiPhong", x => x.MaTTPhong);
                });

            migrationBuilder.CreateTable(
                name: "DayNhaTro",
                columns: table => new
                {
                    MaDayNT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenDayNT = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DiaChi = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    SLPhong = table.Column<int>(type: "integer", nullable: true),
                    TrangThaiNT = table.Column<bool>(type: "boolean", nullable: true),
                    MaChuNT = table.Column<int>(type: "integer", nullable: true),
                    UrlAnh = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    KinhDo = table.Column<decimal>(type: "numeric(18,10)", nullable: true),
                    ViDo = table.Column<decimal>(type: "numeric(18,10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayNhaTro", x => x.MaDayNT);
                    table.ForeignKey(
                        name: "FK_DayNhaTro_ChuNhaTro_MaChuNT",
                        column: x => x.MaChuNT,
                        principalTable: "ChuNhaTro",
                        principalColumn: "MaChuNT");
                });

            migrationBuilder.CreateTable(
                name: "LoaiPhong",
                columns: table => new
                {
                    MaLoaiP = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenLoaiP = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    GiaChuan = table.Column<decimal>(type: "numeric(18,0)", nullable: true),
                    SNguoiToiDa = table.Column<int>(type: "integer", nullable: true),
                    MaChuNT = table.Column<int>(type: "integer", nullable: true),
                    MoTa = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    UrlAnh = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoaiPhong", x => x.MaLoaiP);
                    table.ForeignKey(
                        name: "FK_LoaiPhong_ChuNhaTro_MaChuNT",
                        column: x => x.MaChuNT,
                        principalTable: "ChuNhaTro",
                        principalColumn: "MaChuNT");
                });

            migrationBuilder.CreateTable(
                name: "Phong",
                columns: table => new
                {
                    MaPhong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaDayNT = table.Column<int>(type: "integer", nullable: false),
                    MaLoaiP = table.Column<int>(type: "integer", nullable: false),
                    SoPhong = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    GiaThucTe = table.Column<decimal>(type: "numeric(18,0)", nullable: false),
                    MaTTPhong = table.Column<int>(type: "integer", nullable: true),
                    MaTTrPhong = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phong", x => x.MaPhong);
                    table.ForeignKey(
                        name: "FK_Phong_DayNhaTro_MaDayNT",
                        column: x => x.MaDayNT,
                        principalTable: "DayNhaTro",
                        principalColumn: "MaDayNT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Phong_LoaiPhong_MaLoaiP",
                        column: x => x.MaLoaiP,
                        principalTable: "LoaiPhong",
                        principalColumn: "MaLoaiP",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Phong_TinhTrangPhong_MaTTrPhong",
                        column: x => x.MaTTrPhong,
                        principalTable: "TinhTrangPhong",
                        principalColumn: "MaTTrPhong");
                    table.ForeignKey(
                        name: "FK_Phong_TrangThaiPhong_MaTTPhong",
                        column: x => x.MaTTPhong,
                        principalTable: "TrangThaiPhong",
                        principalColumn: "MaTTPhong");
                });

            migrationBuilder.CreateTable(
                name: "AnhPhong",
                columns: table => new
                {
                    MaAnh = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaPhong = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    MoTa = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ThuTu = table.Column<int>(type: "integer", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnhPhong", x => x.MaAnh);
                    table.ForeignKey(
                        name: "FK_AnhPhong_Phong_MaPhong",
                        column: x => x.MaPhong,
                        principalTable: "Phong",
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
                        name: "FK_Phong_ThietBi_Phong_MaPhong",
                        column: x => x.MaPhong,
                        principalTable: "Phong",
                        principalColumn: "MaPhong",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Phong_ThietBi_ThietBi_MaThBi",
                        column: x => x.MaThBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThBi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnhPhong_MaPhong",
                table: "AnhPhong",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_DayNhaTro_MaChuNT",
                table: "DayNhaTro",
                column: "MaChuNT");

            migrationBuilder.CreateIndex(
                name: "IX_LoaiPhong_MaChuNT",
                table: "LoaiPhong",
                column: "MaChuNT");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_MaLoaiP",
                table: "Phong",
                column: "MaLoaiP");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_MaTTPhong",
                table: "Phong",
                column: "MaTTPhong");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_MaTTrPhong",
                table: "Phong",
                column: "MaTTrPhong");

            migrationBuilder.CreateIndex(
                name: "UQ_Phong_Day_SoPhong",
                table: "Phong",
                columns: new[] { "MaDayNT", "SoPhong" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Phong_ThietBi_MaPhong",
                table: "Phong_ThietBi",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_ThietBi_MaThBi",
                table: "Phong_ThietBi",
                column: "MaThBi");

            migrationBuilder.CreateIndex(
                name: "UQ_ThietBi_Ten",
                table: "ThietBi",
                column: "TenThBi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_TinhTrangPhong_Ten",
                table: "TinhTrangPhong",
                column: "TenTTrPhong",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_TrangThaiPhong_Ten",
                table: "TrangThaiPhong",
                column: "TenTTPhong",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnhPhong");

            migrationBuilder.DropTable(
                name: "Phong_ThietBi");

            migrationBuilder.DropTable(
                name: "Phong");

            migrationBuilder.DropTable(
                name: "ThietBi");

            migrationBuilder.DropTable(
                name: "DayNhaTro");

            migrationBuilder.DropTable(
                name: "LoaiPhong");

            migrationBuilder.DropTable(
                name: "TinhTrangPhong");

            migrationBuilder.DropTable(
                name: "TrangThaiPhong");

            migrationBuilder.DropTable(
                name: "ChuNhaTro");
        }
    }
}
