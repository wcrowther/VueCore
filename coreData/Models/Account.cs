using coreData.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace coreData.Models;

public class Account : IAuditable
{
	[Required]
	public int AccountId { get; set; }

	[Required, MaxLength(50)]
	public string AccountName { get; set; } = "";

	[Required, EmailAddress]
	public string AccountEmail { get; set; } = "";

	[Required, Phone]
	public string AccountPhone { get; set; } = "";

	[Required, MaxLength(50)]
	public string StreetAddress { get; set; } = "";

	[Required, MaxLength(50)]
	public string City { get; set; } = "";

	[Required, MaxLength(2)]
	public string StateProvince { get; set; } = "";

	[Required, MaxLength(10)]
	public string PostalCode { get; set; } = "";

	public bool IsInvoice { get; set; }

	public bool IsAutoPay { get; set; }

	public bool IsActive { get; set; } = true;

	public DateTime DateCreated { get; set; }

	public DateTime DateModified { get; set; }

	public int CreatorId { get; set; }

	public int ModifierId { get; set; }

	[NotMapped]
	public string? CreatorName { get; set; }

	[NotMapped]
	public string? ModifierName { get; set; }

	[MaxLength(1000)]
	public string? Notes { get; set; }

	public override string ToString() => $"{AccountName} AccountId: {AccountId}";
}
