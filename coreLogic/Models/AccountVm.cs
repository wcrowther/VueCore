namespace coreLogic.Models;

public class AccountVm
{
	public int AccountId { get; set; }
	public string AccountName { get; set; } = "";
	public string AccountEmail { get; set; } = "";
	public string AccountPhone { get; set; } = "";
	public string StreetAddress { get; set; } = "";
	public string City { get; set; } = "";
	public string StateProvince { get; set; } = "";
	public string PostalCode { get; set; } = "";
	public bool IsInvoice { get; set; }
	public bool IsAutoPay { get; set; }
	public bool IsActive { get; set; } = true;
	public DateTime DateCreated { get; set; }
	public DateTime DateModified { get; set; }
	public int CreatorId { get; set; }
	public int ModifierId { get; set; }
	public string CreatorName { get; set; }
	public string ModifierName { get; set; }
	public string Notes { get; set; }

	public override string ToString() => $"{AccountName} AccountId: {AccountId}";
}
