using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskScope.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedDeleteParametrsOnTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskEntityTags_Tags_TagId",
                table: "TaskEntityTags");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskEntityTags_Tags_TagId",
                table: "TaskEntityTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskEntityTags_Tags_TagId",
                table: "TaskEntityTags");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskEntityTags_Tags_TagId",
                table: "TaskEntityTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
