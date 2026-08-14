using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CommunicationService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ThongBao",
                columns: table => new
                {
                    MaTB = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    TieuDe = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    NoiDung = table.Column<string>(type: "text", nullable: true),
                    DaDoc = table.Column<bool>(type: "boolean", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "timestamp", nullable: true),
                    LoaiTB = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    MaThucThe = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBao", x => x.MaTB);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThongBao");
        }
    }
}
