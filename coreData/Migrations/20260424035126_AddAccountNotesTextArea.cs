using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace coreData.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountNotesTextArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Accounts",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Accounts");
        }
    }
}
