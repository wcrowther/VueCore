using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace coreData.Migrations
{
    /// <inheritdoc />
    public partial class AddingAddressColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.AddColumn<int>(
				name: "StreetAddress",
				table: "Accounts",
				type: "TEXT",
				nullable: true);

			migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Accounts",
                type: "TEXT",
                nullable: true);

			migrationBuilder.AddColumn<string>(
				name: "StateProvinceFilter",
				table: "Accounts",
				type: "TEXT",
				nullable: true);

			migrationBuilder.AddColumn<string>(
                name: "PostalCodeFilter",
                table: "Accounts",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "PostalCodeFilter",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "StateProvinceFilter",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "StreetAddress",
                table: "Accounts");
        }
    }
}
