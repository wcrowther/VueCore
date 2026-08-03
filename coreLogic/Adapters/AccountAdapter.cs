using coreData.Models;
using coreLibrary.Helpers;
using coreLogic.Models;

namespace coreLogic.Adapters;

public static partial class Adapter
{
	public static AccountVm ToAccountVm(this Account account)
	{
		return account == null ? null :
			new AccountVm
			{
				AccountId      = account.AccountId,
				AccountName    = account.AccountName,
				AccountEmail   = account.AccountEmail,
				AccountPhone   = account.AccountPhone,
				StreetAddress  = account.StreetAddress,
				City           = account.City,
				StateProvince  = account.StateProvince,
				PostalCode     = account.PostalCode,
				IsInvoice      = account.IsInvoice,
				IsAutoPay      = account.IsAutoPay,
				IsActive       = account.IsActive,
				DateCreated    = account.DateCreated,
				DateModified   = account.DateModified,
				CreatorId      = account.CreatorId,
				ModifierId     = account.ModifierId,
				CreatorName    = account.CreatorName,
				ModifierName   = account.ModifierName,
				Notes          = account.Notes
			};
	}

	public static List<AccountVm> ToAccountVmList(this IEnumerable<Account> accounts) => accounts.ToList(a => a.ToAccountVm());

	public static Account ToAccount(this AccountVm vm)
	{
		return vm == null ? null :
			new Account
			{
				AccountId      = vm.AccountId,
				AccountName    = vm.AccountName,
				AccountEmail   = vm.AccountEmail,
				AccountPhone   = vm.AccountPhone,
				StreetAddress  = vm.StreetAddress,
				City           = vm.City,
				StateProvince  = vm.StateProvince,
				PostalCode     = vm.PostalCode,
				IsInvoice      = vm.IsInvoice,
				IsAutoPay      = vm.IsAutoPay,
				IsActive       = vm.IsActive,
				DateCreated    = vm.DateCreated,
				DateModified   = vm.DateModified,
				CreatorId      = vm.CreatorId,
				ModifierId     = vm.ModifierId,
				Notes          = vm.Notes
			};
	}

	public static List<Account> ToAccountList(this IEnumerable<AccountVm> vms) => vms.ToList(a => a.ToAccount());

}
