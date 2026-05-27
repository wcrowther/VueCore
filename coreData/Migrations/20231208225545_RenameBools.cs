using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace coreData.Migrations
{
    /// <inheritdoc />
    public partial class RenameBools : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvoiceAccount",
                table: "Accounts",
                newName: "IsInvoice");

            migrationBuilder.RenameColumn(
                name: "AutoPay",
                table: "Accounts",
                newName: "IsAutoPay");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsInvoice",
                table: "Accounts",
                newName: "InvoiceAccount");

            migrationBuilder.RenameColumn(
                name: "IsAutoPay",
                table: "Accounts",
                newName: "AutoPay");
        }
    }
}
